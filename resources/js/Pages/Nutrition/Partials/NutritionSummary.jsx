export default function NutritionSummary({ summary, goals }) {
    const calPercentage = Math.min((summary.calories / goals.calories) * 100, 100);
    const proteinPercentage = Math.min((summary.proteins / goals.proteins) * 100, 100);
    const carbPercentage = Math.min((summary.carbs / goals.carbs) * 100, 100);
    const fatPercentage = Math.min((summary.fats / goals.fats) * 100, 100);

    return (
        <div className="space-y-6">
            {/* Calories Radial Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-800 mb-6 self-start">Mi Progreso Diario</h3>
                
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="url(#calorieGradient)"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 80}
                            strokeDashoffset={2 * Math.PI * 80 * (1 - calPercentage / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0d9488" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900">{Math.round(summary.calories)}</span>
                        <span className="text-slate-500 font-medium">{Math.round(goals.calories)} Calorías</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full mt-8 border-t border-slate-50 pt-6">
                    <div className="text-center">
                        <div className="text-xl font-bold text-slate-900">{Math.round(summary.proteins)}g</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proteínas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-slate-900">{Math.round(summary.carbs)}g</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Carbos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-slate-900">{Math.round(summary.fats)}g</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grasas</div>
                    </div>
                </div>
            </div>

            {/* Macros Detailed Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Resumen Nutricional</h3>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-700">Proteínas</span>
                            <span className="text-sm font-black text-slate-900">{Math.round(proteinPercentage)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-linear-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-700" 
                                style={{ width: `${proteinPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-700">Carbos</span>
                            <span className="text-sm font-black text-slate-900">{Math.round(carbPercentage)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-linear-to-r from-orange-300 to-orange-500 rounded-full transition-all duration-700" 
                                style={{ width: `${carbPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-700">Grasas</span>
                            <span className="text-sm font-black text-slate-900">{Math.round(fatPercentage)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-linear-to-r from-yellow-300 to-yellow-500 rounded-full transition-all duration-700" 
                                style={{ width: `${fatPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
