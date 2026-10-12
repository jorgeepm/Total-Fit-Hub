import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Droplet, Plus, Minus } from 'lucide-react';

export default function WaterTracker({ water = 0, selectedDate }) {
    const maxGlasses = 16; // 4L
    const [glasses, setGlasses] = useState(water);

    // Sincroniza el estado si las props cambian (ej. al cambiar de fecha)
    useEffect(() => {
        setGlasses(water);
    }, [water, selectedDate]);

    const updateWater = (newAmount) => {
        if (newAmount < 0) return;
        
        // Actualización optimista
        setGlasses(newAmount);

        router.post(route('nutrition.water.update'), {
            date: selectedDate,
            glasses: newAmount
        }, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                // Revertir en caso de error
                setGlasses(water);
            }
        });
    };

    const handleAdd = () => updateWater(glasses + 1);
    const handleSubtract = () => updateWater(glasses - 0.25 === -0.25 ? 0 : glasses - 1);

    const progressPercentage = Math.min((glasses / maxGlasses) * 100, 100);

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Registro de Agua</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mantente hidratado hoy</p>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400 rounded-full">
                    <Droplet size={24} />
                </div>
            </div>

            <div className="flex flex-col justify-center space-y-6">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={handleSubtract}
                        disabled={glasses <= 0}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors border border-gray-200 dark:border-slate-700"
                    >
                        <Minus size={20} />
                    </button>

                    <div className="text-center">
                        <span className="text-3xl font-black text-teal-600 dark:text-teal-400">{glasses}</span>
                        <span className="text-xl font-bold text-gray-400 dark:text-gray-500"> / {maxGlasses}</span>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">vasos ({glasses * 0.25}L)</p>
                    </div>

                    <button 
                        onClick={handleAdd}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 disabled:opacity-50 transition-colors border border-teal-200 dark:border-teal-800"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="relative pt-2">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block text-teal-600 dark:text-teal-400">
                                {progressPercentage.toFixed(0)}% Completado
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-500 dark:text-gray-400">
                                Objetivo: 4L
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-teal-50 dark:bg-slate-800">
                        <div 
                            style={{ width: `${progressPercentage}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500 ease-out"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
