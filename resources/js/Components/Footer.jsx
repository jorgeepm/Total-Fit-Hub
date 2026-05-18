import { Link, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { X, Send, AlertTriangle } from 'lucide-react';

export default function Footer() {
    const { auth } = usePage().props;
    const user = auth?.user;
    
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        subject: '',
        description: '',
    });

    const submitError = (e) => {
        e.preventDefault();
        post(route('error-reports.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
                clearErrors();
            },
        });
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        clearErrors();
    };

    return (
        <footer className="bg-slate-950 text-white py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-white/10 pb-12 mb-10">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
                        <span className="text-2xl font-black tracking-tight">Total Fit Hub</span>
                    </div>
                    <p className="text-slate-400 max-w-sm text-base leading-relaxed">
                        Elevando los estándares del bienestar personal a través de la innovación y el diseño premium.
                    </p>
                </div>
                <div className="flex flex-col md:items-end gap-3 text-slate-400 text-sm font-medium">
                    <div className="flex space-x-6">
                        <Link href={route('privacidad')} className="hover:text-white transition-colors">Privacidad</Link>
                        <Link href={route('terminos')} className="hover:text-white transition-colors">Términos</Link>
                        <Link href={route('cookies')} className="hover:text-white transition-colors">Cookies</Link>
                        {user && (
                            <button 
                                onClick={() => setShowModal(true)}
                                className="hover:text-red-400 text-red-500 transition-colors flex items-center gap-1"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                Reportar Error
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-slate-600 text-sm font-bold">
                <p>&copy; 2026 Total Fit Hub. Todos los derechos reservados.</p>
            </div>

            {/* Modal de Reporte de Error */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <div className="p-6 bg-white rounded-3xl text-slate-900">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="h-6 w-6" />
                            <h2 className="text-lg font-black text-slate-900">Reportar un Error</h2>
                        </div>
                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                        ¿Has encontrado un problema? Descríbelo a continuación para que nuestro equipo lo revise.
                    </p>
                    
                    <form onSubmit={submitError}>
                        <div className="mb-4">
                            <label className="block text-sm font-black text-slate-700 mb-2">Asunto</label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                className="w-full border-slate-200 rounded-xl focus:ring-red-500 focus:border-red-500"
                                placeholder="Ej: No carga la gráfica"
                                required
                            />
                            {errors.subject && <div className="text-red-500 text-xs font-bold mt-1">{errors.subject}</div>}
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-black text-slate-700 mb-2">Descripción detallada</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full border-slate-200 rounded-xl focus:ring-red-500 focus:border-red-500 h-32 resize-none"
                                placeholder="Describe qué estabas haciendo y qué falló..."
                                required
                            />
                            {errors.description && <div className="text-red-500 text-xs font-bold mt-1">{errors.description}</div>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 text-sm font-black text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 text-sm font-black bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {processing ? 'Enviando...' : (
                                    <>
                                        <span>Enviar Reporte</span>
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </footer>
    );
}
