import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { Activity, TrendingUp, Dumbbell, Utensils } from 'lucide-react';

const weightData = [
    { name: 'Lun', weight: 82.5 },
    { name: 'Mar', weight: 82.1 },
    { name: 'Mie', weight: 81.8 },
    { name: 'Jue', weight: 81.9 },
    { name: 'Vie', weight: 81.5 },
    { name: 'Sab', weight: 81.4 },
    { name: 'Dom', weight: 81.2 },
];

const activityData = [
    { name: 'Lun', intensity: 70 },
    { name: 'Mar', intensity: 85 },
    { name: 'Mie', intensity: 40 },
    { name: 'Jue', intensity: 90 },
    { name: 'Vie', intensity: 65 },
    { name: 'Sab', intensity: 30 },
    { name: 'Dom', intensity: 95 },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black text-slate-800">Panel de Control</h2>}
        >
            <Head title="Panel de Control" />

            <div className="py-12 bg-background">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Welcome Header */}
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-slate-900">¡Hola de nuevo! ✨</h1>
                            <p className="text-slate-500 font-medium">Estás en el camino correcto. Has completado el 85% de tus objetivos esta semana.</p>
                        </div>
                        <div className="mt-6 md:mt-0 flex space-x-4">
                            <div className="glass p-4 rounded-3xl flex items-center space-x-4">
                                <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Racha</p>
                                    <p className="text-xl font-black text-slate-900">12 Días</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Peso Actual', value: '81.2 kg', color: 'teal', icon: <TrendingUp />, trend: '-0.3kg' },
                            { label: 'Entrenamientos', value: '14', color: 'orange', icon: <Dumbbell />, trend: '+2' },
                            { label: 'Calorías Hoy', value: '1,840', color: 'indigo', icon: <Utensils />, trend: 'Objetivo: 2.2k' },
                            { label: 'Horas Sueño', value: '7.5h', color: 'purple', icon: <Activity />, trend: '+0.5h' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 group hover:border-primary/50 transition-all">
                                <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{stat.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Weight Evolution */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-8">Evolución de Peso</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weightData}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} dy={10} />
                                        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}
                                            labelStyle={{fontWeight: 800, color: '#1e293b'}}
                                        />
                                        <Area type="monotone" dataKey="weight" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Intensity Chart */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-8">Intensidad Semanal</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} dy={10} />
                                        <YAxis hide />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}}
                                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}
                                        />
                                        <Bar dataKey="intensity" fill="#f97316" radius={[10, 10, 10, 10]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
