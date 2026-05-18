import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function RoutinesIndex({ rutinas = [], ejerciciosDisponibles = [] }) {
  // ==================== ESTADO GENERAL ====================
  const [showCreator, setShowCreator] = useState(false);

  // ==================== ESTADO DEL FORMULARIO ====================
  const [nombreRutina, setNombreRutina] = useState('');
  const [descripcionRutina, setDescripcionRutina] = useState('');
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState('');

  // Hook de Inertia para manejo de formularios y envío
  const { post, processing, errors } = useForm();

  // ==================== MANEJO DE EJERCICIOS ====================
  // Agregar un ejercicio a la rutina
  const agregarEjercicio = () => {
    if (!ejercicioSeleccionado) return;

    const ejercicio = ejerciciosDisponibles.find(
      (e) => e.id === parseInt(ejercicioSeleccionado)
    );

    if (!ejercicio) return;

    // Verificar que no esté ya agregado
    if (ejerciciosSeleccionados.some((e) => e.id === ejercicio.id)) {
      alert('Este ejercicio ya está en la rutina');
      return;
    }

    // Agregar con valores por defecto de series y reps
    setEjerciciosSeleccionados([
      ...ejerciciosSeleccionados,
      {
        id: ejercicio.id,
        nombre: ejercicio.nombre,
        seriesObjetivo: 3,
        repsObjetivo: 10,
      },
    ]);

    setEjercicioSeleccionado('');
  };

  // Actualizar series u reps de un ejercicio
  const actualizarEjercicio = (ejercicioId, field, value) => {
    setEjerciciosSeleccionados((prev) =>
      prev.map((ej) => {
        if (ej.id === ejercicioId) {
          return { ...ej, [field]: parseInt(value) || 0 };
        }
        return ej;
      })
    );
  };

  // Eliminar un ejercicio de la rutina
  const eliminarEjercicio = (ejercicioId) => {
    setEjerciciosSeleccionados((prev) =>
      prev.filter((ej) => ej.id !== ejercicioId)
    );
  };

  // ==================== MANEJO DE GUARDADO ====================
  const handleGuardarRutina = (e) => {
    e.preventDefault();

    if (!nombreRutina.trim()) {
      alert('Por favor ingresa un nombre para la rutina');
      return;
    }

    if (ejerciciosSeleccionados.length === 0) {
      alert('Por favor agrega al menos un ejercicio');
      return;
    }

    // Empaquetar datos para enviar al backend
    const data = {
      nombre: nombreRutina,
      descripcion: descripcionRutina,
      ejercicios: ejerciciosSeleccionados.map((ej) => ({
        ejercicio_id: ej.id,
        series_objetivo: ej.seriesObjetivo,
        reps_objetivo: ej.repsObjetivo,
      })),
    };

    // Enviar al backend
    post('/rutinas', {
      onSuccess: () => {
        // Resetear formulario y cerrar creador
        setNombreRutina('');
        setDescripcionRutina('');
        setEjerciciosSeleccionados([]);
        setShowCreator(false);
      },
      onError: (errors) => {
        console.error('Error al guardar rutina:', errors);
        alert('Hubo un error al guardar la rutina');
      },
    });
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ==================== ENCABEZADO ====================  */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              🏋️ Mis Rutinas
            </h1>
            <p className="text-slate-400">
              Gestiona tus rutinas de entrenamiento y comienza tu sesión
            </p>
          </div>

          {/* Botón Crear Nueva Rutina */}
          <button
            onClick={() => setShowCreator(!showCreator)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              showCreator
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {showCreator ? '✕ Cancelar' : '+ Crear Nueva Rutina'}
          </button>
        </div>

        {/* ==================== CREADOR DE RUTINAS (Condicional) ====================  */}
        {showCreator && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              ✨ Crear Nueva Rutina
            </h2>

            <form onSubmit={handleGuardarRutina}>
              {/* Nombre de la Rutina */}
              <div className="mb-6">
                <label className="block text-slate-200 font-semibold mb-2">
                  Nombre de la Rutina
                </label>
                <input
                  type="text"
                  value={nombreRutina}
                  onChange={(e) => setNombreRutina(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors placeholder-slate-500"
                  placeholder="Ej: Rutina de Pecho y Tríceps"
                />
              </div>

              {/* Descripción de la Rutina */}
              <div className="mb-6">
                <label className="block text-slate-200 font-semibold mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={descripcionRutina}
                  onChange={(e) => setDescripcionRutina(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors placeholder-slate-500 resize-none"
                  rows="3"
                  placeholder="Describe el propósito o características de esta rutina..."
                />
              </div>

              {/* Selector de Ejercicios */}
              <div className="mb-8">
                <label className="block text-slate-200 font-semibold mb-3">
                  Agregar Ejercicios
                </label>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <select
                    value={ejercicioSeleccionado}
                    onChange={(e) => setEjercicioSeleccionado(e.target.value)}
                    className="flex-1 pl-4 pr-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    <option value="">Selecciona un ejercicio...</option>
                    {ejerciciosDisponibles.map((ejercicio) => (
                      <option key={ejercicio.id} value={ejercicio.id}>
                        {ejercicio.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={agregarEjercicio}
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-105 active:scale-95"
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Lista de Ejercicios Agregados */}
              {ejerciciosSeleccionados.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Ejercicios en la Rutina ({ejerciciosSeleccionados.length})
                  </h3>
                  <div className="space-y-3">
                    {ejerciciosSeleccionados.map((ejercicio) => (
                      <div
                        key={ejercicio.id}
                        className="bg-slate-700 rounded-lg p-4 border border-slate-600 flex flex-col sm:flex-row sm:items-center gap-4"
                      >
                        {/* Nombre del Ejercicio */}
                        <div className="flex-1">
                          <p className="text-white font-semibold text-lg">
                            {ejercicio.nombre}
                          </p>
                        </div>

                        {/* Series Objetivo */}
                        <div className="flex-1 sm:max-w-xs">
                          <label className="text-slate-300 text-xs font-semibold mb-1 block">
                            Series Objetivo
                          </label>
                          <input
                            type="number"
                            value={ejercicio.seriesObjetivo}
                            onChange={(e) =>
                              actualizarEjercicio(ejercicio.id, 'seriesObjetivo', e.target.value)
                            }
                            min="1"
                            className="w-full pl-3 pr-3 py-2 rounded bg-slate-600 text-white border border-slate-500 focus:border-indigo-500 focus:outline-none transition-colors text-center font-mono"
                          />
                        </div>

                        {/* Reps Objetivo */}
                        <div className="flex-1 sm:max-w-xs">
                          <label className="text-slate-300 text-xs font-semibold mb-1 block">
                            Reps Objetivo
                          </label>
                          <input
                            type="number"
                            value={ejercicio.repsObjetivo}
                            onChange={(e) =>
                              actualizarEjercicio(ejercicio.id, 'repsObjetivo', e.target.value)
                            }
                            min="1"
                            className="w-full pl-3 pr-3 py-2 rounded bg-slate-600 text-white border border-slate-500 focus:border-indigo-500 focus:outline-none transition-colors text-center font-mono"
                          />
                        </div>

                        {/* Botón Eliminar */}
                        <button
                          type="button"
                          onClick={() => eliminarEjercicio(ejercicio.id)}
                          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-all transform hover:scale-105 active:scale-95 sm:self-end"
                        >
                          ✕ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={processing || ejerciciosSeleccionados.length === 0}
                  className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-semibold transition-all transform hover:scale-105 active:scale-95"
                >
                  {processing ? 'Guardando...' : '✓ Guardar Rutina'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreator(false);
                    setNombreRutina('');
                    setDescripcionRutina('');
                    setEjerciciosSeleccionados([]);
                  }}
                  className="flex-1 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== LISTA DE MIS RUTINAS ====================  */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            📋 Tus Rutinas
          </h2>

          {rutinas.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl shadow-xl p-12 border border-slate-700 text-center">
              <p className="text-slate-400 text-lg mb-4">
                No tienes rutinas creadas aún
              </p>
              <button
                onClick={() => setShowCreator(true)}
                className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all transform hover:scale-105 active:scale-95"
              >
                + Crear tu Primera Rutina
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rutinas.map((rutina) => (
                <div
                  key={rutina.id}
                  className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 flex flex-col"
                >
                  {/* Encabezado de la Tarjeta */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {rutina.nombre}
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      {rutina.descripcion || 'Sin descripción'}
                    </p>
                  </div>

                  {/* Contenido de la Tarjeta */}
                  <div className="p-6 flex-1">
                    {/* Información de Ejercicios */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl">💪</span>
                        <span className="text-slate-300">
                          <span className="font-bold text-white">
                            {rutina.ejercicios?.length || 0}
                          </span>{' '}
                          ejercicio
                          {rutina.ejercicios?.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Lista de Ejercicios (si existen) */}
                      {rutina.ejercicios && rutina.ejercicios.length > 0 && (
                        <div className="bg-slate-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                          <ul className="space-y-2">
                            {rutina.ejercicios.map((ejercicio, idx) => (
                              <li key={idx} className="text-slate-300 text-sm flex items-start">
                                <span className="text-indigo-400 mr-2">•</span>
                                <span>
                                  {ejercicio.nombre}
                                  {ejercicio.series_objetivo && (
                                    <span className="text-slate-400 ml-1">
                                      ({ejercicio.series_objetivo}x{ejercicio.reps_objetivo})
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/entrenamiento/activo/${rutina.id}`}
                      className="block w-full px-6 py-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-center text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      ▶ Iniciar Entrenamiento
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
