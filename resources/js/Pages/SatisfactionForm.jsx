import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function SatisfactionForm({ auth }) {
    const { data, setData, post, processing, wasSuccessful } = useForm({
        rating: 0,
        comentarios: '',
    });

    const [hoverRating, setHoverRating] = useState(0);

    const submit = (e) => {
        e.preventDefault();
        post(route('feedback'), {
            onSuccess: () => {
                setData({ rating: 0, comentarios: '' });
                localStorage.setItem('feedback_enviado', 'true');
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Danos tu opinión</h2>}
        >
            <Head title="Satisfacción y Feedback" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-white">
                            {wasSuccessful ? (
                                <div className="text-center py-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 mb-6">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Gracias por tu feedback!</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Tu opinión nos ayuda a mejorar la plataforma cada día.</p>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="max-w-xl mx-auto">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center">
                                        ¿Cómo calificarías tu experiencia en la plataforma?
                                    </h3>
                                    
                                    <div className="flex justify-center mb-8 space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <svg
                                                    className={`w-12 h-12 transition-colors duration-200 ${(hoverRating || data.rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-700'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Comentarios adicionales (opcional)
                                        </label>
                                        <textarea
                                            id="comentarios"
                                            rows="4"
                                            className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm transition-colors"
                                            placeholder="Cuéntanos qué te ha gustado o qué podríamos mejorar..."
                                            value={data.comentarios}
                                            onChange={(e) => setData('comentarios', e.target.value)}
                                            maxLength={1000}
                                        ></textarea>
                                        <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {data.comentarios.length}/1000
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={data.rating === 0 || processing}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Enviando...' : 'Enviar opinión'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
