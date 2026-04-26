import { useState } from 'react';
import { X, Flame, Scale, Save } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function EditFoodModal({ log, onClose }) {
    const { data, setData, patch, processing, errors } = useForm({
        food_name: log.food_name,
        brand: log.brand || '',
        calories: log.calories,
        proteins: log.proteins,
        carbs: log.carbs,
        fats: log.fats,
        quantity: log.quantity,
        meal_type: log.meal_type,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('nutrition.update', log.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Editar Alimento</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Nombre</label>
                        <input 
                            type="text"
                            value={data.food_name}
                            onChange={(e) => setData('food_name', e.target.value)}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                        />
                        {errors.food_name && <div className="text-red-500 text-xs font-bold">{errors.food_name}</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Flame className="h-4 w-4 mr-2 text-orange-500" /> Calorías
                            </label>
                            <input 
                                type="number"
                                value={data.calories}
                                onChange={(e) => setData('calories', e.target.value)}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Scale className="h-4 w-4 mr-2 text-teal-500" /> Cantidad (g)
                            </label>
                            <input 
                                type="number"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proteínas</label>
                            <input 
                                type="number"
                                value={data.proteins}
                                onChange={(e) => setData('proteins', e.target.value)}
                                className="w-full p-3 bg-slate-50 border-none rounded-xl text-base font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carbohidratos</label>
                            <input 
                                type="number"
                                value={data.carbs}
                                onChange={(e) => setData('carbs', e.target.value)}
                                className="w-full p-3 bg-slate-50 border-none rounded-xl text-base font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grasas</label>
                            <input 
                                type="number"
                                value={data.fats}
                                onChange={(e) => setData('fats', e.target.value)}
                                className="w-full p-3 bg-slate-50 border-none rounded-xl text-base font-bold text-slate-800 focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black text-xl shadow-2xl shadow-slate-200 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3"
                        >
                            <Save className="h-6 w-6" />
                            <span>Actualizar Registro</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
