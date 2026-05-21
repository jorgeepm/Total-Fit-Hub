import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Droplet, Plus, Minus } from 'lucide-react';

export default function WaterTracker({ water = 0, selectedDate }) {
    const maxGlasses = 16; // 4L
    const [glasses, setGlasses] = useState(water);

    // Sync state if props change (e.g. changing date)
    useEffect(() => {
        setGlasses(water);
    }, [water, selectedDate]);

    const updateWater = (newAmount) => {
        if (newAmount < 0) return;
        
        // Optimistic update
        setGlasses(newAmount);

        router.post(route('nutrition.water.update'), {
            date: selectedDate,
            glasses: newAmount
        }, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                // Revert on error
                setGlasses(water);
            }
        });
    };

    const handleAdd = () => updateWater(glasses + 1);
    const handleSubtract = () => updateWater(glasses - 0.25 === -0.25 ? 0 : glasses - 1);

    const progressPercentage = Math.min((glasses / maxGlasses) * 100, 100);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Registro de Agua</h2>
                    <p className="text-sm text-gray-500">Mantente hidratado hoy</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
                    <Droplet size={24} />
                </div>
            </div>

            <div className="flex flex-col justify-center space-y-6">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={handleSubtract}
                        disabled={glasses <= 0}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors border border-gray-200"
                    >
                        <Minus size={20} />
                    </button>

                    <div className="text-center">
                        <span className="text-3xl font-black text-blue-600">{glasses}</span>
                        <span className="text-xl font-bold text-gray-400"> / {maxGlasses}</span>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">vasos ({glasses * 0.25}L)</p>
                    </div>

                    <button 
                        onClick={handleAdd}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors border border-blue-200"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="relative pt-2">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                                {progressPercentage.toFixed(0)}% Completado
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-500">
                                Objetivo: 4L
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-blue-50">
                        <div 
                            style={{ width: `${progressPercentage}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
