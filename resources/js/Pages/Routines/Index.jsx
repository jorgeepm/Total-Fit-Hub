import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Play, Clock, ChevronRight, Activity } from 'lucide-react';

export default function RoutinesIndex({ routines = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mis Rutinas</h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            {routines.length} rutinas guardadas
                        </p>
                    </div>
                    <Link
                        href={route('routines.create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Rutina
                    </Link>
                </div>
            }
        >
            <Head title="Mis Rutinas" />

            <div className="py-8 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {routines.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 rounded-[30px] bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                                <Activity className="w-10 h-10 text-primary opacity-20" />
                            </div>
                            <h3 className="text-xl font-black text-slate-700 mb-2">
                                ¿Listo para entrenar?
                            </h3>
                            <p className="text-slate-400 max-w-xs mb-8">
                                Crea tu primera rutina personalizada para llevar un seguimiento de tus progresos.
                            </p>
                            <Link
                                href={route('routines.create')}
                                className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Crear mi primera rutina
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {routines.map((routine) => (
                                <div
                                    key={routine.id}
                                    className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col"
                                >
                                    {/* Decoración superior */}
                                    <div className="h-2 bg-linear-to-r from-primary to-primary-dark" />
                                    
                                    <div className="p-7 space-y-5 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                                    {routine.nombre}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                                        <Activity className="w-3 h-3" />
                                                        {routine.exercises_count ?? 0} ejercicios
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        ~45 min
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                routine.estado === 'activa'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-slate-50 text-slate-400'
                                            }`}>
                                                {routine.estado}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <Link 
                                                href={route('routines.start', routine.id)}
                                                className="flex items-center gap-2 text-sm font-black text-primary hover:text-primary-dark transition-colors"
                                            >
                                                <Play className="w-4 h-4 fill-current" />
                                                Iniciar Entrenamiento
                                            </Link>
                                            <Link 
                                                href={route('routines.show', routine.id)} 
                                                className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-primary hover:text-white transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Card para añadir nueva */}
                            <Link
                                href={route('routines.create')}
                                className="bg-slate-50/50 rounded-[35px] border-2 border-dashed border-slate-200 p-7 flex flex-col items-center justify-center gap-4 group hover:border-primary/50 hover:bg-white transition-all duration-300 min-h-[180px]"
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-black text-slate-400 group-hover:text-slate-600">Nueva Rutina</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
