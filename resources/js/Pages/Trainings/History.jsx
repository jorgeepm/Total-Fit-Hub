import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function History({ entrenamientos }) {
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este entrenamiento? Esta acción no se puede deshacer.')) {
            router.delete(route('trainings.destroy', selectedWorkout.id), {
                onSuccess: () => setSelectedWorkout(null)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white leading-tight">Historial de Entrenamientos</h2>}
        >
            <Head title="Historial de Entrenamientos" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-100 dark:border-slate-800">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Todos tus entrenamientos</h3>
                            <Link href={route('dashboard')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm">
                                &larr; Volver
                            </Link>
                        </div>

                        {Array.isArray(entrenamientos) && entrenamientos.length > 0 ? (
                            <div className="grid gap-4">
                                {entrenamientos.map((entreno) => {
                                    const gruposMusculares = entreno?.ejercicios 
                                        ? [...new Set(entreno.ejercicios.map(e => e.grupo_muscular).filter(Boolean))].join(', ')
                                        : '';

                                    // Formatear fecha
                                    const fecha = new Date(entreno.hora_inicio).toLocaleDateString('es-ES', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    });

                                    return (
                                        <div 
                                            key={entreno?.id || Math.random()} 
                                            onClick={() => setSelectedWorkout(entreno)}
                                            className="p-5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-gray-800 dark:text-white text-lg">
                                                        {entreno?.routine?.nombre || 'Sesión completada'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{fecha}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                                                    🏋️ Volumen: {entreno?.volumen_total || '0'} kg
                                                </span>
                                                {gruposMusculares && (
                                                    <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                                                        💪 {gruposMusculares}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 dark:text-gray-500 text-lg">Aún no has registrado ningún entrenamiento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para detalles del entrenamiento */}
            <Modal show={!!selectedWorkout} onClose={() => setSelectedWorkout(null)} maxWidth="2xl">
                {selectedWorkout && (
                    <div className="p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                                    {selectedWorkout.routine?.nombre || 'Detalles del Entrenamiento'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Volumen total: <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedWorkout.volumen_total} kg</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-sm font-bold flex items-center gap-1.5 border border-transparent hover:border-red-100 dark:hover:border-red-900"
                                    title="Eliminar entrenamiento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Eliminar
                                </button>
                                <button 
                                    onClick={() => setSelectedWorkout(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {Object.values(
                                (selectedWorkout.ejercicios || []).reduce((acc, ex) => {
                                    if (!acc[ex.id]) {
                                        acc[ex.id] = { ...ex, series_hechas: [] };
                                    }
                                    if (ex.pivot) {
                                        acc[ex.id].series_hechas.push({
                                            numero: ex.pivot.numero_series,
                                            reps: ex.pivot.repeticiones_hechas,
                                            peso: ex.pivot.peso_usado,
                                        });
                                    }
                                    return acc;
                                }, {})
                            ).map((ejercicio, idx) => (
                                <div key={ejercicio.id || idx} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-black text-gray-400 dark:text-gray-300 text-lg">
                                            {ejercicio.nombre?.[0] || '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{ejercicio.nombre}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{ejercicio.grupo_muscular}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {ejercicio.series_hechas
                                            .sort((a, b) => a.numero - b.numero)
                                            .map((serie, sIdx) => (
                                            <div key={sIdx} className="grid grid-cols-3 gap-4 items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                                <div className="text-center">
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Serie</span>
                                                    <p className="font-black text-gray-700 dark:text-gray-300">{serie.numero}</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Peso</span>
                                                    <p className="font-black text-indigo-600 dark:text-indigo-400">{serie.peso} kg</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Reps</span>
                                                    <p className="font-black text-gray-700 dark:text-gray-300">{serie.reps}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!ejercicio.series_hechas || ejercicio.series_hechas.length === 0) && (
                                            <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-2">Sin series registradas</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
