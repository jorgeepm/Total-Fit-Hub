import { Plus, Trash2, Edit2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import EditFoodModal from './EditFoodModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function MealDiary({ logs, onAddFood }) {
    const [editingLog, setEditingLog] = useState(null);
    const [deletingLog, setDeletingLog] = useState(null);
    const mealTypes = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena', 'Snack'];

    const getLogsByMeal = (type) => logs.filter(log => log.meal_type === type);

    const handleDelete = () => {
        if (deletingLog) {
            router.delete(route('nutrition.destroy', deletingLog.id), {
                preserveScroll: true,
                onSuccess: () => setDeletingLog(null)
            });
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
                    <h3 className="text-xl font-black text-slate-800 dark:text-gray-200">Diario de Nutrición</h3>
                    <div className="flex space-x-2">
                        <span className="bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Hoy</span>
                    </div>
                </div>

                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {mealTypes.map((type) => {
                        const mealLogs = getLogsByMeal(type);
                        const mealCalories = mealLogs.reduce((sum, log) => sum + parseFloat(log.calories), 0);

                        return (
                            <div key={type} className="p-8 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">{type}</h4>
                                        <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                                            {mealLogs.length} {mealLogs.length === 1 ? 'alimento' : 'alimentos'}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        {mealCalories > 0 && (
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{Math.round(mealCalories)}</div>
                                                <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">kcal</div>
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => onAddFood(type)}
                                            className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-gray-300 hover:bg-teal-600 dark:hover:bg-teal-600 hover:text-white dark:hover:text-white hover:shadow-lg hover:shadow-teal-100 dark:hover:shadow-teal-900/20 transition-all transform hover:scale-110 active:scale-90"
                                        >
                                            <Plus className="h-6 w-6" strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>

                                {mealLogs.length > 0 && (
                                    <div className="space-y-4">
                                        {mealLogs.map((log) => (
                                            <div key={log.id} className="flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-teal-100 dark:hover:border-teal-900 transition-all">
                                                <div className="flex-1">
                                                    <div className="font-black text-slate-800 dark:text-gray-100 text-lg leading-tight">{log.food_name}</div>
                                                    <div className="text-xs font-bold text-slate-400 dark:text-gray-400 mt-1 uppercase tracking-wider">{log.quantity}g • {log.brand || 'Genérico'}</div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-lg font-black text-teal-600 dark:text-teal-400 pr-4 border-r border-slate-50 dark:border-slate-700">{Math.round(log.calories)} <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase">cal</span></div>
                                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => setEditingLog(log)}
                                                            className="p-2 text-slate-300 dark:text-gray-500 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-xl transition-all"
                                                        >
                                                            <Edit2 className="h-5 w-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeletingLog(log)}
                                                            className="p-2 text-slate-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {editingLog && (
                <EditFoodModal 
                    log={editingLog} 
                    onClose={() => setEditingLog(null)} 
                />
            )}

            <DeleteConfirmModal 
                isOpen={!!deletingLog}
                onClose={() => setDeletingLog(null)}
                onConfirm={handleDelete}
                foodName={deletingLog?.food_name}
            />
        </>
    );
}
