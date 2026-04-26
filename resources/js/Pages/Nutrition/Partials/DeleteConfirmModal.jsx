import { X, Trash2, AlertCircle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onConfirm, onClose, foodName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="p-8 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <AlertCircle className="h-10 w-10" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">¿Eliminar alimento?</h3>
                        <p className="text-slate-500 font-medium px-4">
                            Estás a punto de eliminar <span className="font-bold text-slate-700">"{foodName}"</span> de tu diario. Esta acción no se puede deshacer.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-3 pt-4">
                        <button 
                            onClick={onConfirm}
                            className="w-full bg-red-500 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-red-100 hover:bg-red-600 transition-all transform active:scale-95 flex items-center justify-center space-x-3"
                        >
                            <Trash2 className="h-6 w-6" />
                            <span>Sí, eliminar ahora</span>
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full bg-slate-50 text-slate-400 py-5 rounded-3xl font-black text-lg hover:bg-slate-100 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
