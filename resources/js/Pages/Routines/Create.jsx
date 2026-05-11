import { useState, useMemo, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

// ─── Icono de papelera inline ───────────────────────────────────────────────
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

// ─── Badge del grupo muscular ────────────────────────────────────────────────
const MuscleTag = ({ muscle, isCustom }) => {
    const colorMap = {
        // Inglés (API externa)
        pectorals:      'bg-red-100 text-red-700',
        back:           'bg-blue-100 text-blue-700',
        shoulders:      'bg-purple-100 text-purple-700',
        biceps:         'bg-green-100 text-green-700',
        triceps:        'bg-orange-100 text-orange-700',
        'upper legs':   'bg-yellow-100 text-yellow-700',
        'lower legs':   'bg-teal-100 text-teal-700',
        glutes:         'bg-pink-100 text-pink-700',
        abs:            'bg-indigo-100 text-indigo-700',
        cardiovascular: 'bg-rose-100 text-rose-700',
        // Español (ejercicios del usuario)
        pecho:          'bg-red-100 text-red-700',
        espalda:        'bg-blue-100 text-blue-700',
        hombros:        'bg-purple-100 text-purple-700',
        'bíceps':       'bg-green-100 text-green-700',
        'tríceps':      'bg-orange-100 text-orange-700',
        piernas:        'bg-yellow-100 text-yellow-700',
        'glúteos':      'bg-pink-100 text-pink-700',
        abdominales:    'bg-indigo-100 text-indigo-700',
    };
    const label = muscle?.toLowerCase() ?? '';
    const colorClass = colorMap[label] ?? 'bg-gray-100 text-gray-600';
    return (
        <div className="flex items-center gap-1 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colorClass}`}>
                {muscle ?? '—'}
            </span>
            {isCustom && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                    ✦ Mío
                </span>
            )}
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// MODAL de búsqueda de ejercicios
// ────────────────────────────────────────────────────────────────────────────
function ExercisePickerModal({ exercises, selectedIds, onSelect, onClose }) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return exercises;
        return exercises.filter(
            (ex) =>
                ex.nombre?.toLowerCase().includes(q) ||
                ex.grupo_muscular?.toLowerCase().includes(q) ||
                ex.equipamiento_necesario?.toLowerCase().includes(q)
        );
    }, [query, exercises]);

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
            onClick={onClose}
        >
            {/* Panel */}
            <div
                className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera modal */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Añadir ejercicio</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Buscador */}
                <div className="px-5 py-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                        </svg>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar por nombre, músculo o equipo..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">
                        {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
                    </p>
                </div>

                {/* Lista scrollable */}
                <div className="overflow-y-auto flex-1 px-3 pb-5 space-y-1">
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-sm">No se encontraron ejercicios</p>
                    ) : (
                        filtered.map((ex) => {
                            const alreadyAdded = selectedIds.has(ex.id);
                            return (
                                <button
                                    key={ex.id}
                                    onClick={() => !alreadyAdded && onSelect(ex)}
                                    disabled={alreadyAdded}
                                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        alreadyAdded
                                            ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                            : 'hover:bg-blue-50 active:bg-blue-100 cursor-pointer'
                                    }`}
                                >
                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                        {ex.nombre?.[0]?.toUpperCase() ?? '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{ex.nombre}</p>
                                        <p className="text-xs text-gray-500 truncate capitalize">
                                            {ex.equipamiento_necesario ?? 'Sin equipo'}
                                        </p>
                                    </div>
                                    <MuscleTag muscle={ex.grupo_muscular} isCustom={ex.id_usuario !== null} />
                                    {alreadyAdded && (
                                        <span className="text-xs text-green-600 font-semibold">✓</span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL: Crear Rutina
// ────────────────────────────────────────────────────────────────────────────
export default function CreateRoutine({ exercises = [] }) {
    console.log('Props recibidas desde Laravel:', { exercises });
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Lista de ejercicios seleccionados, cada uno con su propio array de series
    const [selectedExercises, setSelectedExercises] = useState([]);

    // useForm de Inertia para enviar al backend
    const { data, setData, post, processing, errors, reset } = useForm({
        routineName: '',
        exercises: [],
    });

    // Set de IDs ya añadidos (para deshabilitar en el modal)
    const selectedIds = useMemo(
        () => new Set(selectedExercises.map((e) => e.id)),
        [selectedExercises]
    );

    // ── Añadir ejercicio desde el modal ─────────────────────────────────────
    const handleSelectExercise = useCallback((exercise) => {
        setSelectedExercises((prev) => [
            ...prev,
            {
                id: exercise.id,
                nombre: exercise.nombre,
                grupo_muscular: exercise.grupo_muscular,
                equipamiento_necesario: exercise.equipamiento_necesario,
                sets: [{ target_reps: 12 }], // 1 serie por defecto
            },
        ]);
        setIsModalOpen(false);
    }, []);

    // ── Eliminar ejercicio ───────────────────────────────────────────────────
    const handleRemoveExercise = useCallback((exerciseId) => {
        setSelectedExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    }, []);

    // ── Añadir una serie a un ejercicio ─────────────────────────────────────
    const handleAddSet = useCallback((exerciseId) => {
        setSelectedExercises((prev) =>
            prev.map((ex) =>
                ex.id === exerciseId
                    ? { ...ex, sets: [...ex.sets, { target_reps: 12 }] }
                    : ex
            )
        );
    }, []);

    // ── Eliminar una serie ───────────────────────────────────────────────────
    const handleRemoveSet = useCallback((exerciseId, setIndex) => {
        setSelectedExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId || ex.sets.length <= 1) return ex;
                const newSets = ex.sets.filter((_, i) => i !== setIndex);
                return { ...ex, sets: newSets };
            })
        );
    }, []);

    // ── Cambiar reps en una serie ────────────────────────────────────────────
    const handleRepsChange = useCallback((exerciseId, setIndex, value) => {
        setSelectedExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                const newSets = ex.sets.map((s, i) =>
                    i === setIndex ? { ...s, target_reps: parseInt(value, 10) || 1 } : s
                );
                return { ...ex, sets: newSets };
            })
        );
    }, []);

    // ── Submit al backend ────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();

        // Sincronizamos el estado local a useForm justo antes de enviar
        post(route('routines.store'), {
            data: {
                routineName: data.routineName,
                exercises: selectedExercises.map((ex) => ({
                    id: ex.id,
                    sets: ex.sets,
                })),
            },
            onSuccess: () => reset(),
        });
    };

    // ── Envío con los datos actuales usando router directamente ──────────────
    const handleSave = (e) => {
        e.preventDefault();
        if (!data.routineName.trim()) {
            document.getElementById('routine-name-input').focus();
            return;
        }
        if (selectedExercises.length === 0) return;

        router.post(
            route('routines.store'),
            {
                routineName: data.routineName,
                exercises: selectedExercises.map((ex) => ({
                    id: ex.id,
                    sets: ex.sets,
                })),
            },
            { preserveScroll: true }
        );
    };

    const canSave = data.routineName.trim().length > 0 && selectedExercises.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Nueva Rutina</h2>
                </div>
            }
        >
            <Head title="Crear Rutina" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">

                {/* ── Nombre de la Rutina ─────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                    <label htmlFor="routine-name-input" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Nombre de la rutina
                    </label>
                    <input
                        id="routine-name-input"
                        type="text"
                        placeholder="Ej: Día de Empuje, Full Body Lunes..."
                        value={data.routineName}
                        onChange={(e) => setData('routineName', e.target.value)}
                        className="w-full text-xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent p-0"
                        autoFocus
                    />
                    {errors.routineName && (
                        <p className="text-red-500 text-xs mt-2">{errors.routineName}</p>
                    )}
                </div>

                {/* ── Lista de ejercicios ─────────────────────────────────── */}
                <div className="space-y-4">
                    {selectedExercises.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <svg className="mx-auto w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <p className="font-medium text-sm">Aún no has añadido ejercicios</p>
                            <p className="text-xs mt-1">Pulsa el botón de abajo para empezar</p>
                        </div>
                    )}

                    {selectedExercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                        >
                            {/* Cabecera del ejercicio */}
                            <div className="flex items-start justify-between mb-4 gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base bg-gradient-to-br ${exercise.id_usuario ? 'from-teal-500 to-indigo-600' : 'from-blue-500 to-indigo-600'}`}>
                                        {exercise.nombre?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate leading-tight">{exercise.nombre}</h3>
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            <MuscleTag muscle={exercise.grupo_muscular} isCustom={exercise.id_usuario !== null} />
                                            {exercise.equipamiento_necesario && (
                                                <span className="text-xs text-gray-400 capitalize">{exercise.equipamiento_necesario}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveExercise(exercise.id)}
                                    className="flex-shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                    title="Eliminar ejercicio"
                                >
                                    <TrashIcon />
                                </button>
                            </div>

                            {/* Cabecera de columnas */}
                            <div className="grid grid-cols-[2rem_1fr_2.5rem] gap-2 items-center px-1 mb-1.5">
                                <span className="text-center text-xs font-semibold text-gray-400">Set</span>
                                <span className="text-center text-xs font-semibold text-gray-400">Reps objetivo</span>
                                <span></span>
                            </div>

                            {/* Filas de series */}
                            <div className="space-y-2">
                                {exercise.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="grid grid-cols-[2rem_1fr_2.5rem] gap-2 items-center">
                                        {/* Número de serie */}
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm mx-auto">
                                            {setIndex + 1}
                                        </div>

                                        {/* Input de reps */}
                                        <input
                                            type="number"
                                            min={1}
                                            max={999}
                                            value={set.target_reps}
                                            onChange={(e) => handleRepsChange(exercise.id, setIndex, e.target.value)}
                                            className="w-full text-center bg-gray-50 border border-gray-200 rounded-xl py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
                                        />

                                        {/* Eliminar serie */}
                                        <button
                                            onClick={() => handleRemoveSet(exercise.id, setIndex)}
                                            disabled={exercise.sets.length <= 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all mx-auto"
                                            title="Eliminar serie"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Botón añadir serie */}
                            <button
                                onClick={() => handleAddSet(exercise.id)}
                                className="mt-3 w-full py-2.5 flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Añadir serie
                            </button>
                        </div>
                    ))}
                </div>

                {/* ── Botón Añadir Ejercicio ──────────────────────────────── */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-5 w-full py-4 border-2 border-dashed border-blue-200 text-blue-500 font-semibold rounded-2xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir ejercicio
                </button>

                {/* ── Botón Guardar ───────────────────────────────────────── */}
                <button
                    onClick={handleSave}
                    disabled={!canSave || processing}
                    className="mt-4 w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all text-base"
                >
                    {processing ? 'Guardando...' : 'Guardar Rutina'}
                </button>

                {/* Mensajes de error globales */}
                {(errors.exercises || errors.routineName) && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        {errors.routineName && <p>{errors.routineName}</p>}
                        {errors.exercises && <p>{errors.exercises}</p>}
                    </div>
                )}
            </div>

            {/* ── Modal buscador ─────────────────────────────────────────── */}
            {isModalOpen && (
                <ExercisePickerModal
                    exercises={exercises}
                    selectedIds={selectedIds}
                    onSelect={handleSelectExercise}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}