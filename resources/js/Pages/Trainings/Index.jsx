import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Search, Plus, Trash2, X, Dumbbell, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

// ─── Opciones de filtros ─────────────────────────────────────────────────────
const MUSCLE_GROUPS = ['Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps',
                       'Piernas', 'Glúteos', 'Abdominales', 'Cardiovascular', 'Otro'];
const EQUIPMENT_OPTIONS = ['Sin equipo', 'Mancuernas', 'Barra', 'Máquinas',
                           'Bandas elásticas', 'Kettlebell', 'TRX', 'Otro'];
const DIFFICULTY_OPTIONS = ['Principiante', 'Intermedio', 'Avanzado'];

// ─── Colores por grupo muscular ──────────────────────────────────────────────
const MUSCLE_COLORS = {
    pecho:         'bg-red-50 text-red-600 border-red-100',
    espalda:       'bg-blue-50 text-blue-600 border-blue-100',
    hombros:       'bg-purple-50 text-purple-600 border-purple-100',
    bíceps:        'bg-green-50 text-green-600 border-green-100',
    tríceps:       'bg-orange-50 text-orange-600 border-orange-100',
    piernas:       'bg-yellow-50 text-yellow-700 border-yellow-100',
    glúteos:       'bg-pink-50 text-pink-600 border-pink-100',
    abdominales:   'bg-indigo-50 text-indigo-600 border-indigo-100',
    cardiovascular:'bg-rose-50 text-rose-600 border-rose-100',
};

const getMuscleColor = (group) => MUSCLE_COLORS[group?.toLowerCase()] ?? 'bg-slate-50 text-slate-600 border-slate-100';

const DIFF_COLORS = {
    'Principiante': 'bg-emerald-50 text-emerald-600',
    'Intermedio':   'bg-amber-50 text-amber-600',
    'Avanzado':     'bg-rose-50 text-rose-600',
};

// ─── Modal de creación de ejercicio ─────────────────────────────────────────
function CreateExerciseModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre:                  '',
        grupo_muscular:          'Pecho',
        equipamiento_necesario:  'Sin equipo',
        dificultad:              'Intermedio',
        calorias_minuto:         '',
        descripcion:             '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('exercises.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                 onClick={e => e.stopPropagation()}>

                {/* Cabecera */}
                <div className="bg-gradient-to-r from-teal-500 to-indigo-600 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-white">Nuevo Ejercicio</h2>
                    </div>
                    <button onClick={onClose}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Nombre del ejercicio *
                        </label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={e => setData('nombre', e.target.value)}
                            placeholder="Ej: Press de banca con mancuernas"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium placeholder-slate-300 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition"
                            autoFocus
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    {/* Grupo muscular + Equipamiento */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Grupo muscular *
                            </label>
                            <div className="relative">
                                <select
                                    value={data.grupo_muscular}
                                    onChange={e => setData('grupo_muscular', e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none bg-white pr-8 transition"
                                >
                                    {MUSCLE_GROUPS.map(g => <option key={g}>{g}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            {errors.grupo_muscular && <p className="text-red-500 text-xs mt-1">{errors.grupo_muscular}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Equipamiento *
                            </label>
                            <div className="relative">
                                <select
                                    value={data.equipamiento_necesario}
                                    onChange={e => setData('equipamiento_necesario', e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none bg-white pr-8 transition"
                                >
                                    {EQUIPMENT_OPTIONS.map(eq => <option key={eq}>{eq}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            {errors.equipamiento_necesario && <p className="text-red-500 text-xs mt-1">{errors.equipamiento_necesario}</p>}
                        </div>
                    </div>

                    {/* Dificultad + Calorías */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Dificultad *
                            </label>
                            <div className="relative">
                                <select
                                    value={data.dificultad}
                                    onChange={e => setData('dificultad', e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none bg-white pr-8 transition"
                                >
                                    {DIFFICULTY_OPTIONS.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Cal/minuto *
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={data.calorias_minuto}
                                onChange={e => setData('calorias_minuto', e.target.value)}
                                placeholder="Ej: 8.5"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium placeholder-slate-300 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition"
                            />
                            {errors.calorias_minuto && <p className="text-red-500 text-xs mt-1">{errors.calorias_minuto}</p>}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Descripción <span className="font-normal text-slate-400">(opcional)</span>
                        </label>
                        <textarea
                            value={data.descripcion}
                            onChange={e => setData('descripcion', e.target.value)}
                            placeholder="Describe el ejercicio, técnica, variantes..."
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none resize-none transition"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing}
                                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {processing ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {processing ? 'Guardando...' : 'Crear Ejercicio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Tarjeta de ejercicio ────────────────────────────────────────────────────
function ExerciseCard({ exercise, canDelete }) {
    const isCustom = exercise.id_usuario !== null;
    const muscleColor = getMuscleColor(exercise.grupo_muscular);
    const diffColor = DIFF_COLORS[exercise.dificultad] ?? 'bg-slate-50 text-slate-600';

    const handleDelete = () => {
        if (confirm(`¿Eliminar el ejercicio "${exercise.nombre}"?`)) {
            router.delete(route('exercises.destroy', exercise.id));
        }
    };

    return (
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden group hover:border-teal-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
            {/* Header colorido */}
            <div className={`h-3 ${isCustom ? 'bg-gradient-to-r from-teal-400 to-indigo-500' : 'bg-gradient-to-r from-slate-200 to-slate-300'}`} />

            <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Título + acciones */}
                <div className="flex items-start justify-between gap-2">
                    <h4 className="font-black text-slate-900 text-base leading-snug flex-1">{exercise.nombre}</h4>
                    {isCustom && canDelete && (
                        <button onClick={handleDelete}
                                className="flex-shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Eliminar ejercicio">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${muscleColor}`}>
                        {exercise.grupo_muscular}
                    </span>
                    {exercise.dificultad && (
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${diffColor}`}>
                            {exercise.dificultad}
                        </span>
                    )}
                    {isCustom && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600">
                            ✦ Personalizado
                        </span>
                    )}
                </div>

                {/* Detalles */}
                <div className="text-xs text-slate-400 space-y-0.5 mt-auto pt-2 border-t border-slate-50">
                    <p><span className="font-semibold text-slate-500">Equipo:</span> {exercise.equipamiento_necesario}</p>
                    {exercise.calorias_minuto > 0 && (
                        <p><span className="font-semibold text-slate-500">Cal/min:</span> {exercise.calorias_minuto}</p>
                    )}
                    {exercise.descripcion && (
                        <p className="truncate mt-1 text-slate-400 italic">"{exercise.descripcion}"</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function Trainings({ exercises = [] }) {
    const [searchTerm, setSearchTerm]         = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const toggleGroup = (group) => {
        setSelectedGroups(prev =>
            prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
        );
    };

    const filtered = useMemo(() => {
        return exercises.filter(ex => {
            const matchesSearch = ex.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
                || ex.grupo_muscular?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGroup = selectedGroups.length === 0
                || selectedGroups.some(g => ex.grupo_muscular?.toLowerCase() === g.toLowerCase());
            return matchesSearch && matchesGroup;
        });
    }, [exercises, searchTerm, selectedGroups]);

    // Grupos únicos que existen en los datos
    const existingGroups = useMemo(() => {
        const set = new Set(exercises.map(e => e.grupo_muscular).filter(Boolean));
        return [...set].sort();
    }, [exercises]);

    const customCount = exercises.filter(e => e.id_usuario !== null).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Biblioteca de Ejercicios</h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            {exercises.length} ejercicios · {customCount} personalizados
                        </p>
                    </div>
                    <button
                        id="btn-create-exercise"
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Ejercicio
                    </button>
                </div>
            }
        >
            <Head title="Entrenamientos" />

            <div className="py-8 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar de filtros */}
                        <aside className="w-full lg:w-56 flex-shrink-0 space-y-4">
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                    Grupos Musculares
                                </h3>
                                <div className="space-y-2">
                                    {existingGroups.map(group => (
                                        <label key={group} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedGroups.includes(group)}
                                                onChange={() => toggleGroup(group)}
                                                className="rounded border-slate-200 text-teal-500 focus:ring-teal-400 h-4 w-4"
                                            />
                                            <span className="text-sm text-slate-600 font-semibold group-hover:text-teal-600 transition-colors">
                                                {group}
                                            </span>
                                        </label>
                                    ))}
                                    {existingGroups.length === 0 && (
                                        <p className="text-xs text-slate-400">Crea ejercicios para ver filtros</p>
                                    )}
                                </div>

                                {selectedGroups.length > 0 && (
                                    <button onClick={() => setSelectedGroups([])}
                                            className="mt-4 text-xs font-bold text-teal-500 hover:text-teal-700 transition-colors">
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        </aside>

                        {/* Contenido principal */}
                        <div className="flex-1 space-y-6">
                            {/* Barra de búsqueda */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <input
                                    type="text"
                                    id="exercise-search"
                                    placeholder="Buscar por nombre o grupo muscular..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-400/30 focus:border-teal-300 transition-all text-slate-700 font-medium placeholder-slate-300 outline-none"
                                />
                            </div>

                            {/* Grid de ejercicios */}
                            {filtered.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {filtered.map(exercise => (
                                        <ExerciseCard
                                            key={exercise.id}
                                            exercise={exercise}
                                            canDelete={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="w-20 h-20 rounded-[30px] bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                                        <Dumbbell className="w-10 h-10 text-primary opacity-20" />
                                    </div>
                                    {exercises.length === 0 ? (
                                        <>
                                            <h3 className="text-xl font-black text-slate-700 mb-2">
                                                No hay ejercicios todavía
                                            </h3>
                                            <p className="text-slate-400 max-w-xs mb-8">
                                                Crea tu primer ejercicio personalizado para empezar a construir tus rutinas.
                                            </p>
                                            <button
                                                onClick={() => setShowCreateModal(true)}
                                                className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Crear mi primer ejercicio
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-black text-slate-700 mb-1">Sin resultados</h3>
                                            <p className="text-slate-400">Prueba con otros filtros o términos de búsqueda.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <CreateExerciseModal onClose={() => setShowCreateModal(false)} />
            )}
        </AuthenticatedLayout>
    );
}
