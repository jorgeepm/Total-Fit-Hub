import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';

// ¡Aquí "atrapamos" la mochila de datos que envía Laravel!
export default function Dashboard({ auth, nutritionSummary, entrenamientos }) {
    
    // 1. Cálculos matemáticos para tu Donut usando DATOS REALES
    const caloriasConsumidas = nutritionSummary?.consumidas || 0;
    const caloriasObjetivo = nutritionSummary?.objetivo || 2500;
    const caloriasRestantes = Math.max(caloriasObjetivo - caloriasConsumidas, 0);

    // 2. Estructura de datos que pide recharts
    const data = [
        { name: 'Consumidas', value: caloriasConsumidas },
        { name: 'Restantes', value: caloriasRestantes }
    ];

    // 3. Tus colores premium (El primero usará el gradiente, el segundo es la pista gris)
    const COLORS = ['url(#colorUv)', '#E5E7EB'];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tu Grid Maquetado: 1 columna en móvil, 3 en escritorio */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* ========================================== */}
                        {/* TARJETA 1: TU COMPONENTE DONUT RESUCITADO 🍩 */}
                        {/* ========================================== */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 self-start">Mi Progreso Diario</h2>
                            
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        {/* Definición de tu gradiente vectorial */}
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#4FD1C5" />
                                                <stop offset="100%" stopColor="#ff7e1c" />
                                            </linearGradient>
                                        </defs>
                                        
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={90}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.map((entry, index) => (
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

                        {/* ========================================== */}
                        {/* TARJETA 2: ENTRENAMIENTOS REALES             */}
                        {/* ========================================== */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Entrenamiento de Hoy</h2>
                            
                            {entrenamientos && entrenamientos.length > 0 ? (
                                entrenamientos.map((entreno) => (
                                    <div key={entreno.id} className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="font-medium text-gray-800">{entreno.routine?.nombre || 'Sesión completada'}</p>
                                        <p className="text-xs text-gray-500 mt-1">Volumen: {entreno.total_volume} kg</p>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center pb-8">
                                    <p className="text-gray-400 text-sm text-center">Aún no has registrado <br/>ningún entrenamiento hoy.</p>
                                </div>
                            )}
                        </div>

                        {/* ========================================== */}
                        {/* TARJETA 3: MACROS REALES                     */}
                        {/* ========================================== */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Resumen Nutricional</h2>
                            
                            <div className="flex flex-col space-y-5 w-full mt-2">
                                {/* Barra de Proteínas */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Proteínas</span>
                                        <span className="text-sm font-bold text-gray-900">{Math.round(nutritionSummary?.proteins || 0)}g</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${Math.min(((nutritionSummary?.proteins || 0) / 150) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Barra de Carbohidratos */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Carbohidratos</span>
                                        <span className="text-sm font-bold text-gray-900">{Math.round(nutritionSummary?.carbs || 0)}g</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div 
                                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${Math.min(((nutritionSummary?.carbs || 0) / 250) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Barra de Grasas */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Grasas</span>
                                        <span className="text-sm font-bold text-gray-900">{Math.round(nutritionSummary?.fats || 0)}g</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div 
                                            className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${Math.min(((nutritionSummary?.fats || 0) / 70) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
