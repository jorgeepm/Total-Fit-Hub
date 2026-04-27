import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard'; // Asegúrate de que la ruta es correcta

const ExerciseLibrary = () => {
    // 1. Datos simulados (Mock data) que luego vendrán de Laravel/MySQL
    const dummyExercises = [
        { id: 1, title: 'Press de Banca', difficulty: 'Intermedio', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400' },
        { id: 2, title: 'Dominadas', difficulty: 'Avanzado', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab354c622fc?auto=format&fit=crop&q=80&w=400' },
        { id: 3, title: 'Sentadilla Búlgara', difficulty: 'Intermedio', imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=400' },
        { id: 4, title: 'Flexiones', difficulty: 'Principiante', imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f4ff?auto=format&fit=crop&q=80&w=400' },
        { id: 5, title: 'Peso Muerto', difficulty: 'Avanzado', imageUrl: null }, // Sin imagen para probar el placeholder
        { id: 6, title: 'Remo con Mancuerna', difficulty: 'Principiante', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400' },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR (Mockup) */}
            <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-8 flex justify-between items-center z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        TH
                    </div>
                    <span className="text-xl font-bold text-gray-800">Total Fit Hub</span>
                </div>
                <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-500">
                    <a href="#" className="hover:text-teal-600 transition-colors">Panel de Control</a>
                    <a href="#" className="text-teal-600 border-b-2 border-teal-600 pb-1">Entrenamientos</a>
                    <a href="#" className="hover:text-teal-600 transition-colors">Nutrición</a>
                    <a href="#" className="hover:text-teal-600 transition-colors">Perfil</a>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div> {/* Avatar placeholder */}
            </nav>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8">
                
                {/* BARRA LATERAL (Filtros) */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Filtros</h2>
                        
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Grupos Musculares</h3>
                            <div className="space-y-2">
                                {['Pecho', 'Espalda', 'Piernas', 'Brazos', 'Core'].map(grupo => (
                                    <label key={grupo} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-teal-600">
                                        <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm">{grupo}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Equipamiento</h3>
                            <div className="space-y-2">
                                {['Mancuernas', 'Máquinas', 'Peso Corporal', 'Bandas'].map(equipo => (
                                    <label key={equipo} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-teal-600">
                                        <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm">{equipo}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ÁREA CENTRAL (Buscador y Cuadrícula) */}
                <main className="flex-1 flex flex-col">
                    
                    {/* Buscador */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Buscar ejercicio..." 
                            className="w-full border-none focus:ring-0 text-gray-700 ml-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Cuadrícula de Tarjetas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {dummyExercises.map((exercise) => (
                            <ExerciseCard 
                                key={exercise.id}
                                title={exercise.title}
                                difficulty={exercise.difficulty}
                                imageUrl={exercise.imageUrl}
                            />
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ExerciseLibrary;