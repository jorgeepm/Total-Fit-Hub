import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import NutritionSummary from './Partials/NutritionSummary';
import MealDiary from './Partials/MealDiary';
import FoodSearch from './Partials/FoodSearch';
import DateNavigator from './Partials/DateNavigator';

export default function Index({ auth, logs, summary, goals, selectedDate }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMealType, setActiveMealType] = useState('Desayuno');

    const handleAddFood = (mealType) => {
        setActiveMealType(mealType);
        setIsSearchOpen(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-2xl font-black text-slate-800 tracking-tight">Registro Nutricional</h2>}
        >
            <Head title="Nutrición" />

            <div className="py-12 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <DateNavigator selectedDate={selectedDate} />
                            <NutritionSummary summary={summary} goals={goals} />
                            
                            <button 
                                onClick={() => handleAddFood('Comida')}
                                className="w-full bg-primary text-white py-6 rounded-[30px] font-black text-lg flex items-center justify-center space-x-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                            >
                                <Plus className="h-6 w-6" />
                                <span>Añadir Comida</span>
                            </button>
                        </div>

                        {/* Diary Column */}
                        <div className="lg:col-span-2">
                            <MealDiary 
                                logs={logs} 
                                onAddFood={handleAddFood} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isSearchOpen && (
                <FoodSearch 
                    onClose={() => setIsSearchOpen(false)} 
                    mealType={activeMealType}
                    selectedDate={selectedDate}
                />
            )}
        </AuthenticatedLayout>
    );
}
