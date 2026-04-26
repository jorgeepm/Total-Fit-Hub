import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DateNavigator({ selectedDate }) {
    const current = new Date(selectedDate);
    
    // Generate dates for the current week
    const firstDayOfWeek = startOfWeek(current, { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => addDays(firstDayOfWeek, i));

    const navigateToDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        router.get(route('nutrition.index'), { date: dateStr }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const navigateWeek = (direction) => {
        const nextDate = direction === 'next' ? addWeeks(current, 1) : subWeeks(current, 1);
        navigateToDate(nextDate);
    };

    return (
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 capitalize">
                            {format(current, "MMMM yyyy", { locale: es })}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diario de Nutrición</p>
                    </div>
                </div>
                
                <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button 
                        onClick={() => navigateWeek('prev')}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-teal-600 transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-x border-slate-200 mx-2">
                        Semana
                    </div>
                    <button 
                        onClick={() => navigateWeek('next')}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-teal-600 transition-all"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
                {weekDays.map((day, i) => {
                    const isSelected = isSameDay(day, current);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                        <button
                            key={i}
                            onClick={() => navigateToDate(day)}
                            className={`flex flex-col items-center p-4 rounded-[25px] transition-all transform active:scale-90 ${
                                isSelected 
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">
                                {format(day, 'eee', { locale: es })}
                            </span>
                            <span className="text-lg font-black leading-none">
                                {format(day, 'd')}
                            </span>
                            {isToday && !isSelected && (
                                <div className="w-1 h-1 bg-teal-500 rounded-full mt-1"></div>
                            )}
                        </button>
                    );
                })}
            </div>
            
            <button 
                onClick={() => navigateToDate(new Date())}
                className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-teal-600 transition-colors"
            >
                Ir a hoy
            </button>
        </div>
    );
}
