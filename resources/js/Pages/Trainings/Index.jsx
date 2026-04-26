import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Search, Plus, Filter, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const mockExercises = [
    { id: 1, name: 'Press de Banca', difficulty: 'Intermedio', group: 'Pecho', image: '/images/exercises/bench_press.png' },
    { id: 2, name: 'Dominadas', difficulty: 'Avanzado', group: 'Espalda', image: '/images/exercises/pull_ups.png' },
    { id: 3, name: 'Sentadilla Búlgara', difficulty: 'Intermedio', group: 'Piernas', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 4, name: 'Peso Muerto', difficulty: 'Avanzado', group: 'Espalda', image: 'https://images.unsplash.com/photo-1594737626072-882698167dc4?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 5, name: 'Zancadas', difficulty: 'Principiante', group: 'Piernas', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 6, name: 'Remo con Mancuerna', difficulty: 'Intermedio', group: 'Espalda', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&h=200&auto=format&fit=crop' },
];

export default function Trainings() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black text-slate-800">Entrenamientos</h2>}
        >
            <Head title="Entrenamientos" />

            <div className="py-12 bg-background">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Filters Sidebar */}
                        <aside className="w-full lg:w-64 space-y-8">
                            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 h-fit">
                                <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center space-x-3">
                                    <span>Filtros</span>
                                </h3>
                                
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Grupos Musculares</p>
                                        <div className="space-y-3">
                                            {['Pecho', 'Espalda', 'Piernas'].map((group) => (
                                                <label key={group} className="flex items-center space-x-3 group cursor-pointer">
                                                    <input type="checkbox" className="rounded-lg border-slate-200 text-primary focus:ring-primary h-5 w-5 transition-all" />
                                                    <span className="text-slate-600 font-bold group-hover:text-primary transition-colors">{group}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Equipamiento</p>
                                        <div className="space-y-3">
                                            {['Mancuernas', 'Máquinas'].map((item) => (
                                                <label key={item} className="flex items-center space-x-3 group cursor-pointer">
                                                    <input type="checkbox" className="rounded-lg border-slate-200 text-primary focus:ring-primary h-5 w-5 transition-all" />
                                                    <span className="text-slate-600 font-bold group-hover:text-primary transition-colors">{item}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-6 rounded-[30px] font-black text-lg flex items-center justify-center space-x-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                                <Plus className="h-6 w-6" />
                                <span>Añadir Entrenamiento</span>
                            </button>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 space-y-8">
                            {/* Search bar */}
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar ejercicio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[30px] shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium text-slate-700"
                                />
                            </div>

                            {/* Exercises Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {mockExercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 group hover:border-primary/50 transition-all hover:-translate-y-2">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img 
                                                src={exercise.image} 
                                                alt={exercise.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xl font-black text-slate-900 leading-tight">{exercise.name}</h4>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    exercise.difficulty === 'Avanzado' ? 'bg-orange-50 text-orange-600' : 
                                                    exercise.difficulty === 'Intermedio' ? 'bg-teal-50 text-teal-600' : 
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {exercise.difficulty}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <span className="text-sm font-bold text-slate-400">{exercise.group}</span>
                                                <button className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-primary hover:text-white transition-all">
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
