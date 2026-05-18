import React, { useState, useRef, useEffect } from 'react';
import { BodyHighlighter } from 'react-body-highlighter';

export default function ActiveWorkout() {
  // ==================== ESTADO DEL CRONÓMETRO ====================
  const [elapsedTime, setElapsedTime] = useState(0); // en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [workoutStart, setWorkoutStart] = useState(new Date());
  const [showEditStart, setShowEditStart] = useState(false);
  const [editHour, setEditHour] = useState('00');
  const [editMinute, setEditMinute] = useState('00');
  const [editSecond, setEditSecond] = useState('00');
  const intervalRef = useRef(null);

  // ==================== ESTADO DE LA RUTINA ====================
  // Estructura: { id, nombre, series: [{ id, peso, repeticiones, completado }] }
  const [routine, setRoutine] = useState([
    {
      id: 1,
      nombre: 'Press de Banca',
      series: [
        { id: 1, peso: 0, repeticiones: 0, completado: false },
        { id: 2, peso: 0, repeticiones: 0, completado: false },
        { id: 3, peso: 0, repeticiones: 0, completado: false },
      ],
    },
    {
      id: 2,
      nombre: 'Sentadillas',
      series: [
        { id: 1, peso: 0, repeticiones: 0, completado: false },
        { id: 2, peso: 0, repeticiones: 0, completado: false },
        { id: 3, peso: 0, repeticiones: 0, completado: false },
      ],
    },
    {
      id: 3,
      nombre: 'Flexiones en Barra',
      series: [
        { id: 1, peso: 0, repeticiones: 0, completado: false },
        { id: 2, peso: 0, repeticiones: 0, completado: false },
        { id: 3, peso: 0, repeticiones: 0, completado: false },
      ],
    },
  ]);

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

  // Formato MM:SS o HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ==================== MANEJO DEL MODAL DE EDITAR INICIO ====================
  const handleEditStart = () => {
    const now = new Date();
    setEditHour(String(now.getHours()).padStart(2, '0'));
    setEditMinute(String(now.getMinutes()).padStart(2, '0'));
    setEditSecond(String(now.getSeconds()).padStart(2, '0'));
    setShowEditStart(true);
  };

  const handleSaveStartTime = () => {
    const newStart = new Date();
    newStart.setHours(parseInt(editHour));
    newStart.setMinutes(parseInt(editMinute));
    newStart.setSeconds(parseInt(editSecond));
    setWorkoutStart(newStart);

    // Recalcular tiempo transcurrido
    const now = new Date();
    const diff = Math.floor((now - newStart) / 1000);
    setElapsedTime(Math.max(0, diff));

    setShowEditStart(false);
  };

  // ==================== CÁLCULOS DINÁMICOS ====================
  // Calcular series completadas
  const seriesCompletadas = routine.reduce((acc, exercise) => {
    return acc + exercise.series.filter((s) => s.completado).length;
  }, 0);

  // Calcular volumen total (peso × repeticiones)
  const volumenTotal = routine.reduce((acc, exercise) => {
    return (
      acc +
      exercise.series.reduce((seriesAcc, serie) => {
        if (serie.completado) {
          return seriesAcc + serie.peso * serie.repeticiones;
        }
        return seriesAcc;
      }, 0)
    );
  }, 0);

  // Array de músculos activos basado en ejercicios completados
  const getActiveMuscles = () => {
    const muscleMap = {
      'Press de Banca': ['chest', 'triceps'],
      'Sentadillas': ['quadriceps', 'glutes', 'hamstrings'],
      'Flexiones en Barra': ['back', 'biceps', 'lats'],
    };

    const activeMuscles = new Set();
    routine.forEach((exercise) => {
      const hasCompleted = exercise.series.some((s) => s.completado);
      if (hasCompleted) {
        const muscles = muscleMap[exercise.nombre] || [];
        muscles.forEach((m) => activeMuscles.add(m));
      }
    });

    return Array.from(activeMuscles);
  };

  // ==================== MANEJO DE CAMBIOS EN LA RUTINA ====================
  const handleUpdateSerie = (exerciseId, serieId, field, value) => {
    setRoutine((prevRoutine) =>
      prevRoutine.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            series: exercise.series.map((serie) => {
              if (serie.id === serieId) {
                return { ...serie, [field]: value };
              }
              return serie;
            }),
          };
        }
        return exercise;
      })
    );
  };

  const handleToggleComplete = (exerciseId, serieId) => {
    handleUpdateSerie(exerciseId, serieId, 'completado', (prev) => !prev);
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Contenedor principal */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ==================== TARJETA DEL CRONÓMETRO ====================  */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Tiempo transcurrido */}
            <div className="flex-1 text-center">
              <p className="text-white text-sm font-semibold opacity-90 mb-2">
                Tiempo Transcurrido
              </p>
              <p className="text-6xl font-bold text-white font-mono tracking-wider">
                {formatTime(elapsedTime)}
              </p>
            </div>

            {/* Botones de control */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Pausar/Reanudar */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  isRunning
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-slate-900'
                    : 'bg-green-400 hover:bg-green-500 text-slate-900'
                }`}
              >
                {isRunning ? 'Pausar' : 'Reanudar'}
              </button>

              {/* Finalizar */}
              <button
                onClick={() => {
                  setIsRunning(false);
                  alert('Entrenamiento finalizado. Volumen Total: ' + volumenTotal + ' kg');
                }}
                className="px-6 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Finalizar
              </button>

              {/* Editar Inicio */}
              <button
                onClick={handleEditStart}
                className="px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Editar Inicio
              </button>
            </div>
          </div>

          {/* Modal inline para editar hora de inicio */}
          {showEditStart && (
            <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
              <p className="text-white font-semibold mb-4">Ajustar Hora de Inicio</p>
              <div className="flex gap-3 items-center justify-center mb-4">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={editHour}
                  onChange={(e) => setEditHour(String(e.target.value).padStart(2, '0'))}
                  className="w-16 px-2 py-2 text-center rounded bg-white text-slate-900 font-bold"
                  placeholder="HH"
                />
                <span className="text-white text-xl font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={editMinute}
                  onChange={(e) => setEditMinute(String(e.target.value).padStart(2, '0'))}
                  className="w-16 px-2 py-2 text-center rounded bg-white text-slate-900 font-bold"
                  placeholder="MM"
                />
                <span className="text-white text-xl font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={editSecond}
                  onChange={(e) => setEditSecond(String(e.target.value).padStart(2, '0'))}
                  className="w-16 px-2 py-2 text-center rounded bg-white text-slate-900 font-bold"
                  placeholder="SS"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleSaveStartTime}
                  className="px-4 py-2 rounded bg-green-400 hover:bg-green-500 text-slate-900 font-semibold transition-all"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowEditStart(false)}
                  className="px-4 py-2 rounded bg-slate-400 hover:bg-slate-500 text-white font-semibold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==================== TARJETA DE ESTADÍSTICAS Y MANIQUÍ ====================  */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Estadísticas */}
          <div className="bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📊 Estadísticas en Tiempo Real
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Series Completadas */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-center">
                <p className="text-blue-100 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Series Completadas
                </p>
                <p className="text-5xl font-bold text-white">{seriesCompletadas}</p>
              </div>

              {/* Volumen Total */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-center">
                <p className="text-purple-100 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Volumen Total
                </p>
                <p className="text-4xl font-bold text-white">{volumenTotal}</p>
                <p className="text-purple-200 text-xs mt-1">kg</p>
              </div>
            </div>
          </div>

          {/* Maniquí Muscular */}
          <div className="bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              💪 Músculos Activados
            </h2>
            <div className="flex justify-around items-center h-full">
              {/* Vista Frontal */}
              <div className="flex flex-col items-center">
                <p className="text-slate-400 text-sm font-semibold mb-3">Frontal</p>
                <div className="w-32 h-48 bg-slate-700 rounded-lg overflow-hidden">
                  <BodyHighlighter
                    bodyPart="front"
                    highlightedColors={['#3b82f6']}
                    highlights={getActiveMuscles()}
                    scale={0.8}
                  />
                </div>
              </div>

              {/* Vista Trasera */}
              <div className="flex flex-col items-center">
                <p className="text-slate-400 text-sm font-semibold mb-3">Trasera</p>
                <div className="w-32 h-48 bg-slate-700 rounded-lg overflow-hidden">
                  <BodyHighlighter
                    bodyPart="back"
                    highlightedColors={['#3b82f6']}
                    highlights={getActiveMuscles()}
                    scale={0.8}
                  />
                </div>
              </div>
            </div>

            {/* Leyenda de músculos */}
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-xs font-semibold mb-2">Músculos Activos:</p>
              <p className="text-slate-300 text-sm">
                {getActiveMuscles().length > 0
                  ? getActiveMuscles().join(', ')
                  : 'Completa series para activar músculos'}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== LISTA DE EJERCICIOS ====================  */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6">
            🏋️ Mi Rutina de Hoy
          </h2>

          {/* Contenedor de ejercicios */}
          <div className="space-y-6">
            {routine.map((exercise) => (
              <div key={exercise.id} className="bg-slate-700 rounded-xl p-6 border border-slate-600">
                {/* Nombre del Ejercicio */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                  {exercise.nombre}
                </h3>

                {/* Series */}
                <div className="space-y-3">
                  {exercise.series.map((serie, index) => (
                    <div
                      key={serie.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        serie.completado
                          ? 'bg-green-500 bg-opacity-20 border border-green-500'
                          : 'bg-slate-600 border border-slate-500'
                      }`}
                    >
                      {/* Número de Serie */}
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">S{index + 1}</span>
                      </div>

                      {/* Input Peso */}
                      <div className="flex-1">
                        <label className="text-slate-300 text-xs font-semibold mb-1 block">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          value={serie.peso}
                          onChange={(e) =>
                            handleUpdateSerie(
                              exercise.id,
                              serie.id,
                              'peso',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full pl-3 pr-2 py-2 rounded bg-slate-700 text-white border border-slate-500 focus:border-indigo-500 focus:outline-none transition-colors font-mono text-center"
                          placeholder="0"
                        />
                      </div>

                      {/* Input Repeticiones */}
                      <div className="flex-1">
                        <label className="text-slate-300 text-xs font-semibold mb-1 block">
                          Reps
                        </label>
                        <input
                          type="number"
                          value={serie.repeticiones}
                          onChange={(e) =>
                            handleUpdateSerie(
                              exercise.id,
                              serie.id,
                              'repeticiones',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full pl-3 pr-2 py-2 rounded bg-slate-700 text-white border border-slate-500 focus:border-indigo-500 focus:outline-none transition-colors font-mono text-center"
                          placeholder="0"
                        />
                      </div>

                      {/* Checkbox Completado */}
                      <button
                        onClick={() => handleToggleComplete(exercise.id, serie.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 font-bold text-lg ${
                          serie.completado
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-slate-500 text-slate-400 hover:bg-slate-400 hover:text-white'
                        }`}
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>

                {/* Resumen del Ejercicio */}
                <div className="mt-4 pt-4 border-t border-slate-500">
                  <p className="text-slate-300 text-sm">
                    <span className="font-semibold">
                      {exercise.series.filter((s) => s.completado).length}/{exercise.series.length}
                    </span>{' '}
                    series completadas
                    {exercise.series.filter((s) => s.completado).length > 0 && (
                      <>
                        {' '}
                        • Volumen:{' '}
                        <span className="font-semibold text-indigo-300">
                          {exercise.series
                            .filter((s) => s.completado)
                            .reduce((acc, s) => acc + s.peso * s.repeticiones, 0)}{' '}
                          kg
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-400 text-sm p-4">
          <p>Enrenamiento iniciado: {workoutStart.toLocaleTimeString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}
