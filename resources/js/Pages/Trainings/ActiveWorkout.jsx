import React, { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function ActiveWorkout({ rutina }) {
  // ==================== ESTADO DEL CRONÓMETRO ====================
  const [elapsedTime, setElapsedTime] = useState(0); // en segundos
  const [isRunning, setIsRunning] = useState(true);
  const [workoutStart] = useState(new Date().toISOString());
  const intervalRef = useRef(null);

  // ==================== ESTADO DEL ENTRENAMIENTO ====================
  // Usamos un estado local para mayor fluidez y solo enviamos al finalizar
  const [ejercicios, setEjercicios] = useState(() => {
    return rutina?.exercises?.map((ex) => ({
      dbId: ex.id,
      nombre: ex.nombre,
      grupo_muscular: ex.grupo_muscular,
      series: Array.from({ length: ex.pivot?.objetivo_series || 1 }, (_, i) => ({
        id: i + 1,
        peso: '', // Empezamos vacío para que el placeholder sea visible
        repeticiones: ex.pivot?.objetivo_repeticiones || '',
        completado: false,
      })),
    })) || [];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== LÓGICA DEL CRONÓMETRO ====================
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ==================== CÁLCULOS DINÁMICOS ====================
  const seriesCompletadas = ejercicios.reduce((acc, exercise) => {
    return acc + exercise.series.filter((s) => s.completado).length;
  }, 0);

  const volumenTotal = ejercicios.reduce((acc, exercise) => {
    return (
      acc +
      exercise.series.reduce((seriesAcc, serie) => {
        if (serie.completado) {
          const p = parseFloat(serie.peso) || 0;
          const r = parseInt(serie.repeticiones) || 0;
          return seriesAcc + (p * r);
        }
        return seriesAcc;
      }, 0)
    );
  }, 0);

  const handleUpdateSerie = (exerciseDbId, serieId, field, value) => {
    setEjercicios((prev) =>
      prev.map((ex) => {
        if (ex.dbId === exerciseDbId) {
          return {
            ...ex,
            series: ex.series.map((s) => {
              if (s.id === serieId) {
                return { ...s, [field]: value };
              }
              return s;
            }),
          };
        }
        return ex;
      })
    );
  };

  const handleToggleComplete = (exerciseDbId, serieId) => {
    setEjercicios((prev) =>
      prev.map((ex) => {
        if (ex.dbId === exerciseDbId) {
          return {
            ...ex,
            series: ex.series.map((s) => {
              if (s.id === serieId) {
                return { ...s, completado: !s.completado };
              }
              return s;
            }),
          };
        }
        return ex;
      })
    );
  };

  const handleFinishWorkout = () => {
    if (seriesCompletadas === 0) {
      alert('Debes completar al menos una serie para finalizar el entrenamiento.');
      return;
    }

    // Usamos router.post directamente para evitar problemas de sincronización de useForm
    setIsSubmitting(true);
    router.post('/trainings', {
      id_rutina: rutina.id,
      hora_inicio: workoutStart,
      hora_fin: new Date().toISOString(),
      ejercicios: ejercicios
    }, {
      onFinish: () => setIsSubmitting(false),
      onError: (err) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al guardar el entrenamiento.');
      }
    });
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-bold text-gray-800">Entrenamiento: {rutina?.nombre}</h2>}
    >
      <Head title={`Entrenando: ${rutina?.nombre}`} />
      
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Cronómetro */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-blue-100 text-sm font-semibold opacity-90 mb-1 uppercase tracking-wider">Tiempo Transcurrido</p>
                <p className="text-6xl font-black font-mono tracking-tighter">{formatTime(elapsedTime)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-8 py-3 rounded-xl font-black transition-all ${isRunning ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-green-400 hover:bg-green-500 text-slate-900'}`}
                >
                  {isRunning ? 'Pausar' : 'Reanudar'}
                </button>
                <button
                  onClick={handleFinishWorkout}
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-xl font-black bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Guardando...' : 'Finalizar'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full" />
                Estadísticas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Series</p>
                  <p className="text-4xl font-black text-slate-800">{seriesCompletadas}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Volumen (kg)</p>
                  <p className="text-4xl font-black text-slate-800">{Math.round(volumenTotal)}</p>
                </div>
              </div>
            </div>

            {/* Info de la rutina */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-500 rounded-full" />
                Información
              </h3>
              <div className="space-y-2">
                <p className="text-slate-600"><strong>Nombre:</strong> {rutina?.nombre}</p>
                <p className="text-slate-600 text-sm"><strong>Descripción:</strong> {rutina?.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
          </div>

          {/* Lista de ejercicios */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-black text-slate-800 mb-8">Ejercicios de la rutina</h3>
            <div className="space-y-8">
              {ejercicios.map((exercise) => (
                <div key={exercise.dbId} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">
                      {exercise.nombre?.[0] || '?'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg leading-tight">{exercise.nombre}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{exercise.grupo_muscular}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {exercise.series.map((serie, index) => (
                      <div
                        key={serie.id}
                        className={`grid grid-cols-[3rem_1fr_1fr_3rem] gap-3 items-center p-2 rounded-xl transition-all ${serie.completado ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                      >
                        <div className="text-center font-black text-slate-400 text-sm">S{index + 1}</div>
                        <div className="relative group">
                          <input
                            type="number"
                            value={serie.peso}
                            onChange={(e) => handleUpdateSerie(exercise.dbId, serie.id, 'peso', e.target.value)}
                            className="w-full bg-white border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500 pr-7 transition-shadow"
                            placeholder="0"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 group-focus-within:text-blue-400">kg</span>
                        </div>
                        <div className="relative group">
                          <input
                            type="number"
                            value={serie.repeticiones}
                            onChange={(e) => handleUpdateSerie(exercise.dbId, serie.id, 'repeticiones', e.target.value)}
                            className="w-full bg-white border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500 pr-7 transition-shadow"
                            placeholder="0"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 group-focus-within:text-blue-400">reps</span>
                        </div>
                        <button
                          onClick={() => handleToggleComplete(exercise.dbId, serie.id)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-black transition-all shadow-sm ${serie.completado ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-white border border-slate-200 text-slate-300 hover:text-slate-500 hover:border-slate-300'}`}
                        >
                          {serie.completado ? '✓' : '—'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
