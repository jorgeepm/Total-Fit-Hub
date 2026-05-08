import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { useMemo, useState } from 'react';
import { Plus, Scale } from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

// ¡Aquí "atrapamos" la mochila de datos que envía Laravel!
export default function Dashboard({ auth, nutritionSummary, macroTargets, entrenamientos, weightHistory }) {
    const [showingWeightModal, setShowingWeightModal] = useState(false);
    const [hoveredWeight, setHoveredWeight] = useState(null);

    // Formulario para nuevo peso
    const { data, setData, post, processing, reset, errors } = useForm({
        weight: auth.user.peso || '',
        log_date: new Date().toISOString().slice(0, 16), // Formato para datetime-local
    });

    const submitWeight = (e) => {
        e.preventDefault();
        post(route('weight-logs.store'), {
            onSuccess: () => {
                setShowingWeightModal(false);
                reset();
            },
        });
    };

    // Componente interno para manejar la sincronización del estado sin desfases
    const CustomTooltip = ({ active, payload }) => {
        useMemo(() => {
            if (active && payload && payload.length) {
                // Usamos un pequeño delay o simplemente evitamos el bucle de renderizado
                // pero como es useMemo durante el render, hay que tener cuidado.
                // Mejor aún, actualizamos el estado en un evento o usamos una técnica más limpia.
            }
        }, [active, payload]);

        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-xl shadow-2xl border border-indigo-50 ring-4 ring-indigo-50/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                            {data.full_date}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-900">{data.peso}</span>
                            <span className="text-xs font-bold text-slate-400">kg</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleChartHover = (state) => {
        if (state && state.activePayload && state.activePayload.length > 0) {
            setHoveredWeight(state.activePayload[0].payload);
        } else {
            setHoveredWeight(null);
        }
    };

    // 🛡️ VALIDACIONES: Verificar que los datos llegan correctamente
    if (!nutritionSummary || typeof nutritionSummary !== 'object') {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 font-semibold">⚠️ Error al cargar datos de nutrición</p>
                            <p className="text-red-500 text-sm">Recarga la página o intenta más tarde.</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // 1. Cálculos matemáticos seguros para tu Donut usando DATOS REALES
    const caloriasConsumidas = nutritionSummary?.consumidas || 0;
    const caloriasObjetivo = nutritionSummary?.objetivo || 2500;
    const caloriasRestantes = Math.max(caloriasObjetivo - caloriasConsumidas, 0);

    // 📊 Datos de gráfico memoizados (se recalculan solo si nutritionSummary cambia)
    const chartData = useMemo(
        () => [
            { name: 'Consumidas', value: caloriasConsumidas },
            { name: 'Restantes', value: caloriasRestantes }
        ],
        [caloriasConsumidas, caloriasRestantes]
    );

    // 🎨 Tus colores premium
    const COLORS = ['url(#colorUv)', '#E5E7EB'];

    // 🎯 Objetivos de macronutrientes (desacoplados, dinámicos)
    const proteinTarget = macroTargets?.proteins || 150;
    const carbsTarget = macroTargets?.carbs || 250;
    const fatsTarget = macroTargets?.fats || 70;

    // 📈 Cálculos de porcentajes SEGUROS (sin división por cero)
    const proteinPercent = useMemo(
        () => Math.min(((nutritionSummary?.proteins || 0) / proteinTarget) * 100, 100),
        [nutritionSummary?.proteins, proteinTarget]
    );

    const carbsPercent = useMemo(
        () => Math.min(((nutritionSummary?.carbs || 0) / carbsTarget) * 100, 100),
        [nutritionSummary?.carbs, carbsTarget]
    );

    const fatsPercent = useMemo(
        () => Math.min(((nutritionSummary?.fats || 0) / fatsTarget) * 100, 100),
        [nutritionSummary?.fats, fatsTarget]
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Fila 1: Resumen rápido */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* TARJETA 1: CALORÍAS 🍩 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 self-start">Mi Progreso Diario</h2>
                            
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#4FD1C5" />
                                                <stop offset="100%" stopColor="#ff7e1c" />
                                            </linearGradient>
                                        </defs>
                                        
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={90}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                            <Label
                                                value={`${Math.round(caloriasConsumidas)} / ${Math.round(caloriasObjetivo)}`}
                                                position="center"
                                                className="text-2xl font-bold fill-gray-800"
                                            />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Calorías consumidas</p>
                        </div>

                        {/* TARJETA 2: ENTRENAMIENTOS REALES */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Entrenamiento de Hoy</h2>
                            
                            {Array.isArray(entrenamientos) && entrenamientos.length > 0 ? (
                                entrenamientos.map((entreno) => (
                                    <div 
                                        key={entreno?.id || Math.random()} 
                                        className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                                    >
                                        <p className="font-medium text-gray-800">
                                            {entreno?.routine?.nombre || 'Sesión completada'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Volumen: {entreno?.total_calorias_quemadas || '0'} kcal
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center pb-8">
                                    <p className="text-gray-400 text-sm text-center">
                                        Aún no has registrado <br/>ningún entrenamiento hoy.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* TARJETA 3: MACROS REALES */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Resumen Nutricional</h2>
                            
                            <div className="flex flex-col space-y-5 w-full mt-2">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Proteínas</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {Math.round(nutritionSummary?.proteins || 0)}g / {proteinTarget}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Carbohidratos</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {Math.round(nutritionSummary?.carbs || 0)}g / {carbsTarget}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${carbsPercent}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Grasas</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {Math.round(nutritionSummary?.fats || 0)}g / {fatsTarget}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${fatsPercent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Fila 2: Evolución del Peso */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Evolución del Peso</h2>
                                <p className="text-sm text-gray-500">Historial de tus registros</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setShowingWeightModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                                >
                                    <Plus size={18} /> Registrar Peso
                                </button>
                                <div className="text-right border-l pl-4 border-gray-100 min-w-[140px]">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-indigo-600 leading-none">
                                            {hoveredWeight ? `${hoveredWeight.peso} kg` : `${auth.user.peso} kg`}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                                            {hoveredWeight ? hoveredWeight.full_date : 'Peso actual'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                    data={weightHistory}
                                    onMouseMove={(v) => {
                                        if (v && v.activeTooltipIndex !== undefined) {
                                            setHoveredWeight(weightHistory[v.activeTooltipIndex]);
                                        }
                                    }}
                                    onMouseLeave={() => setHoveredWeight(null)}
                                >
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="timestamp" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tickFormatter={(val) => {
                                            const date = new Date(val);
                                            return `${date.getDate()}/${date.getMonth() + 1}`;
                                        }}
                                        tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        hide 
                                        domain={['dataMin - 1', 'dataMax + 1']} 
                                    />
                                    <Tooltip 
                                        shared={false}
                                        cursor={{ stroke: '#4F46E5', strokeWidth: 2, strokeDasharray: '6 6' }}
                                        content={<CustomTooltip />}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="peso" 
                                        stroke="#4F46E5" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorWeight)" 
                                        animationDuration={1000}
                                        dot={{ 
                                            r: 5, 
                                            fill: '#fff', 
                                            stroke: '#4F46E5', 
                                            strokeWidth: 3,
                                            fillOpacity: 1
                                        }}
                                        activeDot={{ 
                                            r: 8, 
                                            fill: '#4F46E5', 
                                            stroke: '#fff', 
                                            strokeWidth: 4,
                                            fillOpacity: 1
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Modal para registrar peso */}
                <Modal show={showingWeightModal} onClose={() => setShowingWeightModal(false)}>
                    <form onSubmit={submitWeight} className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Scale size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Registrar Nuevo Peso</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="weight" value="Peso (kg)" />
                                <TextInput
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    className="mt-1 block w-full"
                                    value={data.weight}
                                    onChange={(e) => setData('weight', e.target.value)}
                                    required
                                />
                                <InputError message={errors.weight} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="log_date" value="Fecha y Hora" />
                                <TextInput
                                    id="log_date"
                                    type="datetime-local"
                                    className="mt-1 block w-full"
                                    value={data.log_date}
                                    onChange={(e) => setData('log_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.log_date} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <SecondaryButton onClick={() => setShowingWeightModal(false)}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                Guardar Registro
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
