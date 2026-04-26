import { useState, useEffect } from 'react';
import { Search, X, Loader2, Plus, ShoppingBasket, Trash2, Check, Scale, Flame, PlusCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function FoodSearch({ onClose, mealType }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [isCustomMode, setIsCustomMode] = useState(false);

    // Custom food form state
    const [customFood, setCustomFood] = useState({
        name: '',
        calories_100g: '',
        proteins_100g: '',
        carbs_100g: '',
        fats_100g: '',
        quantity: 100
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query && !isCustomMode) {
                searchFood();
            } else if (!query) {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, isCustomMode]);

    const searchFood = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://es.openfoodfacts.org/api/v2/search`, {
                params: {
                    q: query,
                    fields: 'product_name,brands,nutriments,image_front_small_url,_id,quantity',
                    page_size: 24
                }
            });
            setResults(response.data.products || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelection = (product) => {
        const isSelected = selectedFoods.find(f => f._id === product._id);
        if (isSelected) {
            setSelectedFoods(selectedFoods.filter(f => f._id !== product._id));
        } else {
            const nutriments = product.nutriments || {};
            const calories100g = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
            const proteins100g = nutriments.proteins_100g || nutriments.proteins || 0;
            const carbs100g = nutriments.carbohydrates_100g || nutriments.carbohydrates || 0;
            const fats100g = nutriments.fat_100g || nutriments.fat || 0;

            setSelectedFoods([...selectedFoods, {
                _id: product._id,
                food_name: product.product_name || 'Desconocido',
                brand: product.brands || '',
                calories_100g: calories100g,
                proteins_100g: proteins100g,
                carbs_100g: carbs100g,
                fats_100g: fats100g,
                quantity: 100,
                meal_type: mealType,
                log_date: selectedDate
            }]);
        }
    };

    const addCustomToSelection = () => {
        if (!customFood.name || !customFood.calories_100g) return;

        setSelectedFoods([...selectedFoods, {
            _id: 'custom-' + Date.now(),
            food_name: customFood.name,
            brand: 'Personalizado',
            calories_100g: parseFloat(customFood.calories_100g),
            proteins_100g: parseFloat(customFood.proteins_100g) || 0,
            carbs_100g: parseFloat(customFood.carbs_100g) || 0,
            fats_100g: parseFloat(customFood.fats_100g) || 0,
            quantity: parseFloat(customFood.quantity) || 100,
            meal_type: mealType,
            log_date: selectedDate
        }]);

        setIsCustomMode(false);
        setCustomFood({
            name: '',
            calories_100g: '',
            proteins_100g: '',
            carbs_100g: '',
            fats_100g: '',
            quantity: 100
        });
    };

    const updateQuantity = (id, newQuantity) => {
        setSelectedFoods(selectedFoods.map(food => {
            if (food._id === id) {
                const q = parseFloat(newQuantity) || 0;
                return { ...food, quantity: q };
            }
            return food;
        }));
    };

    const calculateCalories = (food) => {
        return (food.calories_100g / 100) * food.quantity;
    };

    const saveAll = () => {
        const finalFoods = selectedFoods.map(f => ({
            ...f,
            calories: calculateCalories(f),
            proteins: (f.proteins_100g / 100) * f.quantity,
            carbs: (f.carbs_100g / 100) * f.quantity,
            fats: (f.fats_100g / 100) * f.quantity,
        }));

        router.post(route('nutrition.store'), {
            foods: finalFoods
        }, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
                
                {/* Search / Custom Area */}
                <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-100 bg-white">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            {isCustomMode ? 'Crear Alimento' : 'Buscar Alimentos'}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setIsCustomMode(!isCustomMode)}
                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isCustomMode ? 'bg-slate-100 text-slate-600' : 'bg-primary/10 text-primary'}`}
                            >
                                {isCustomMode ? 'Volver al buscador' : '+ Manual'}
                            </button>
                            <button onClick={onClose} className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {!isCustomMode ? (
                        <>
                            <div className="p-8">
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Ej: Spaghetti, Pollo, Avena..."
                                        className="w-full pl-16 pr-6 py-6 bg-slate-50 border-none focus:ring-4 focus:ring-teal-500/10 rounded-[30px] text-xl font-bold text-slate-700 placeholder-slate-300 transition-all"
                                        autoFocus
                                    />
                                    {isLoading && (
                                        <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-teal-500 animate-spin" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4">
                                {results.length > 0 ? (
                                    results.map((product, idx) => {
                                        const isSelected = selectedFoods.find(f => f._id === product._id);
                                        return (
                                            <div key={idx} className={`flex items-center justify-between p-6 rounded-[30px] border transition-all ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100'}`}>
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-sm border border-slate-100 overflow-hidden">
                                                        <img 
                                                            src={product.image_front_small_url || 'https://via.placeholder.com/100?text=Food'} 
                                                            alt="" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-800 text-lg line-clamp-1 leading-tight">{product.product_name}</h4>
                                                        <p className="text-sm font-bold text-slate-400">{product.brands || 'Marca Genérica'}</p>
                                                        <div className="flex items-center space-x-3 mt-2">
                                                            <span className="text-xs font-black text-teal-600 bg-teal-100 px-3 py-1 rounded-full uppercase tracking-widest">
                                                                {Math.round(product.nutriments?.['energy-kcal_100g'] || 0)} kcal / 100g
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggleSelection(product)}
                                                    className={`p-4 rounded-2xl shadow-lg transition-all transform active:scale-95 ${isSelected ? 'bg-teal-600 text-white shadow-teal-200' : 'bg-white text-teal-600 shadow-slate-100 hover:bg-teal-600 hover:text-white'}`}
                                                >
                                                    {isSelected ? <Check className="h-6 w-6" strokeWidth={3} /> : <Plus className="h-6 w-6" strokeWidth={3} />}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : query && !isLoading ? (
                                    <div className="text-center py-20">
                                        <Search className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                                        <p className="text-slate-400 font-black text-xl">Sin resultados. Prueba otra vez o añade uno manualmente.</p>
                                    </div>
                                ) : !query && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20 px-12">
                                        <div className="p-8 bg-teal-50 rounded-full mb-6">
                                            <Search className="h-16 w-16 text-teal-400 opacity-20" />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-200 uppercase tracking-[0.2em]">Buscador Global</h4>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 space-y-8 overflow-y-auto">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Nombre del Alimento</label>
                                <input 
                                    type="text"
                                    value={customFood.name}
                                    onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                                    placeholder="Ej: Arroz con Pollo Casero"
                                    className="w-full p-6 bg-slate-50 border-none rounded-3xl text-xl font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10 placeholder-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Flame className="h-4 w-4 mr-2 text-orange-500" /> Calorías (100g)
                                    </label>
                                    <input 
                                        type="number"
                                        value={customFood.calories_100g}
                                        onChange={(e) => setCustomFood({...customFood, calories_100g: e.target.value})}
                                        className="w-full p-6 bg-slate-50 border-none rounded-3xl text-xl font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Scale className="h-4 w-4 mr-2 text-teal-500" /> Cantidad (g)
                                    </label>
                                    <input 
                                        type="number"
                                        value={customFood.quantity}
                                        onChange={(e) => setCustomFood({...customFood, quantity: e.target.value})}
                                        className="w-full p-6 bg-slate-50 border-none rounded-3xl text-xl font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proteínas</label>
                                    <input 
                                        type="number"
                                        value={customFood.proteins_100g}
                                        onChange={(e) => setCustomFood({...customFood, proteins_100g: e.target.value})}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="0g"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carbohidratos</label>
                                    <input 
                                        type="number"
                                        value={customFood.carbs_100g}
                                        onChange={(e) => setCustomFood({...customFood, carbs_100g: e.target.value})}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="0g"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grasas</label>
                                    <input 
                                        type="number"
                                        value={customFood.fats_100g}
                                        onChange={(e) => setCustomFood({...customFood, fats_100g: e.target.value})}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="0g"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={addCustomToSelection}
                                disabled={!customFood.name || !customFood.calories_100g}
                                className="w-full bg-teal-600 text-white py-6 rounded-[30px] font-black text-xl shadow-xl shadow-teal-100 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Añadir a la selección
                            </button>
                        </div>
                    )}
                </div>

                {/* Basket Area */}
                <div className="w-full md:w-96 bg-slate-50 flex flex-col overflow-hidden border-l border-slate-100">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
                        <div className="flex items-center space-x-3">
                            <ShoppingBasket className="h-7 w-7 text-teal-600" />
                            <h3 className="text-xl font-black text-slate-800">Cesta ({selectedFoods.length})</h3>
                        </div>
                        <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-200 rounded-full text-slate-300 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {selectedFoods.length > 0 ? (
                            selectedFoods.map((food) => (
                                <div key={food._id} className="bg-white p-6 rounded-[30px] shadow-sm flex flex-col space-y-4 border border-slate-100 animate-in slide-in-from-right duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 pr-4">
                                            <h4 className="font-black text-slate-800 text-base line-clamp-2 leading-tight">{food.food_name}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1">{food.brand}</p>
                                        </div>
                                        <button onClick={() => setSelectedFoods(selectedFoods.filter(f => f._id !== food._id))} className="text-slate-200 hover:text-red-500 transition-colors">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                                <Scale className="h-3 w-3 mr-1" /> Cantidad (g)
                                            </label>
                                            <input 
                                                type="number"
                                                value={food.quantity}
                                                onChange={(e) => updateQuantity(food._id, e.target.value)}
                                                className="w-full p-2 bg-slate-50 border-none rounded-xl text-lg font-black text-slate-900 focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                                <Flame className="h-3 w-3 mr-1" /> Calorías
                                            </label>
                                            <div className="p-2 text-lg font-black text-teal-600">
                                                {Math.round(calculateCalories(food))} <span className="text-[10px] text-slate-400">kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-12 pt-12">
                                <div className="p-8 bg-white rounded-[40px] text-slate-100 shadow-sm">
                                    <ShoppingBasket className="h-16 w-16" strokeWidth={1} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Cesta Vacía</p>
                                    <p className="text-xs font-medium text-slate-400">Selecciona alimentos o crea uno manualmente</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedFoods.length > 0 && (
                        <div className="p-8 bg-white border-t border-slate-100 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-black text-slate-400">Total Comida</span>
                                <span className="text-3xl font-black text-slate-900">{Math.round(selectedFoods.reduce((sum, f) => sum + calculateCalories(f), 0))} <span className="text-sm text-slate-400 uppercase">kcal</span></span>
                            </div>
                            <button 
                                onClick={saveAll}
                                className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all transform active:scale-95"
                            >
                                Guardar {selectedFoods.length} {selectedFoods.length === 1 ? 'alimento' : 'alimentos'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
