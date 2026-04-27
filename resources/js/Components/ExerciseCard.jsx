import React from 'react';

const ExerciseCard = ({ title, difficulty, imageUrl }) => {
    const getDifficultyColor = {
        Principiante: 'bg-green-100 text-green-700',
        Intermedio: 'bg-orange-100 text-orange-700',
        Avanzado: 'bg-red-100 text-red-700',
    };

    const badgeColor = difficultyColors[difficulty] || 'bg-gray-100 text-gray-700';

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer">
            {/* Contenedor de la imagen */}
            <div className="h-40 bg-gray-200 relative">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`Imagen de ${title}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // Placeholder por si el ejercicio aún no tiene imagen en la BD
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <span>Imagen no disponible</span>
                    </div>
                )}

                {/* Etiqueta de Dificultad superpuesta */}
                <span className={`absolute bottom-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm ${badgeColor}`}>
                    {difficulty}
                </span>
            </div>

            {/* Contenido de la Tarjeta */}
            <div className="p-4 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>

                <div className="mt-4 flex justify-end items-center">
                    {/* Botón de acción con el color teal de Total Fit Hub */}
                    <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center transition-colors">
                        <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseCard;