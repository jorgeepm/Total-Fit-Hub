import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Play, Activity, Clock, Dumbbell, AlignLeft, Layers, Archive, ArchiveRestore } from 'lucide-react';

export default function RoutineShow({ routine }) {
    const handleToggleStatus = () => {
        router.patch(route('routines.toggle-status', routine.id));
    };
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('routines.index')}
                            className="p-2 bg-white rounded-xl text-slate-400 hover:text-primary shadow-sm hover:shadow transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{routine.nombre}</h2>
                            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                                    routine.estado === 'activa'
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'bg-slate-50 text-slate-400'
                                }`}>
                                    {routine.estado}
                                </span>
                                <span>•</span>
                                <span>{routine.exercises?.length || 0} ejercicios</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                        <button
                            onClick={handleToggleStatus}
                            className={`flex items-center justify-center gap-2 px-5 py-3 font-bold rounded-2xl transition-all text-sm w-full sm:w-auto ${
                                routine.estado === 'activa' 
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                        >
                            {routine.estado === 'activa' ? (
                                <>
                                    <Archive className="w-4 h-4" />
                                    <span className="hidden sm:inline">Archivar</span>
                                </>
                            ) : (
                                <>
                                    <ArchiveRestore className="w-4 h-4" />
                                    <span className="hidden sm:inline">Activar</span>
                                </>
                            )}
                        </button>
                        <Link
                            href={route('routines.start', routine.id)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all text-sm w-full sm:w-auto"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span className="hidden sm:inline">Iniciar Entrenamiento</span>
                            <span className="sm:hidden">Iniciar</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Rutina: ${routine.nombre}`} />

            <div className="py-8 bg-background min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Detalles de la Rutina */}
                    <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <AlignLeft className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">Descripción de la Rutina</h3>
                                {routine.descripcion ? (
                                    <p className="text-slate-600 leading-relaxed">
                                        {routine.descripcion}
                                    </p>
                                ) : (
                                    <p className="text-slate-400 italic">
                                        No hay descripción disponible para esta rutina.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lista de Ejercicios */}
                    <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800">Ejercicios</h3>
                            </div>
                            <span className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
                                Total: {routine.exercises?.length || 0}
                            </span>
                        </div>
                        
                        <div className="divide-y divide-slate-50">
                            {routine.exercises && routine.exercises.length > 0 ? (
                                routine.exercises.map((exercise, index) => (
                                    <div key={exercise.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center gap-6">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-black text-sm">
                                            {index + 1}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-slate-800 mb-1">{exercise.nombre}</h4>
                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                {exercise.grupo_muscular && (
                                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold">
                                                        {exercise.grupo_muscular}
                                                    </span>
                                                )}
                                                {exercise.equipamiento_necesario && (
                                                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg font-bold">
                                                        {exercise.equipamiento_necesario}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0 bg-white shadow-sm border border-slate-100 rounded-2xl p-3 px-5">
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-slate-400 mb-0.5 uppercase tracking-wider">Series</div>
                                                <div className="text-lg font-black text-primary">
                                                    {exercise.pivot.objetivo_series}
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100"></div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-slate-400 mb-0.5 uppercase tracking-wider">Reps</div>
                                                <div className="text-lg font-black text-primary">
                                                    {exercise.pivot.objetivo_repeticiones}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <Dumbbell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">Esta rutina no tiene ejercicios asignados aún.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
