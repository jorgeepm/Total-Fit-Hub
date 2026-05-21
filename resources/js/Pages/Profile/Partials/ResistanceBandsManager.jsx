import React from 'react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Trash2 } from 'lucide-react';

export default function ResistanceBandsManager({ bands = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        color_nombre: '',
        peso_equivalente: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('resistance-bands.store'), {
            onSuccess: () => reset(),
        });
    };

    const deleteBand = (id) => {
        if (confirm('¿Eliminar esta banda elástica?')) {
            router.delete(route('resistance-bands.destroy', id));
        }
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Mis Bandas Elásticas</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Añade tus bandas elásticas y asígnales un peso equivalente (resistencia máxima). Esto te permitirá seleccionarlas fácilmente durante tus entrenamientos y calcular el volumen estimado de forma precisa.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6 flex gap-4 items-start">
                <div className="flex-1">
                    <InputLabel htmlFor="color_nombre" value="Color o Identificador" />
                    <TextInput
                        id="color_nombre"
                        className="mt-1 block w-full"
                        value={data.color_nombre}
                        onChange={(e) => setData('color_nombre', e.target.value)}
                        required
                        placeholder="Ej: Banda Roja"
                    />
                    <InputError className="mt-2" message={errors.color_nombre} />
                </div>

                <div className="flex-1">
                    <InputLabel htmlFor="peso_equivalente" value="Resistencia / Peso Equivalente (kg)" />
                    <TextInput
                        id="peso_equivalente"
                        type="number"
                        step="0.5"
                        min="0"
                        className="mt-1 block w-full"
                        value={data.peso_equivalente}
                        onChange={(e) => setData('peso_equivalente', e.target.value)}
                        required
                        placeholder="Ej: 15"
                    />
                    <InputError className="mt-2" message={errors.peso_equivalente} />
                </div>

                <div className="pt-7">
                    <PrimaryButton disabled={processing}>Añadir Banda</PrimaryButton>
                </div>
            </form>

            {bands.length > 0 ? (
                <div className="mt-8 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <ul className="divide-y divide-slate-100">
                        {bands.map((band) => (
                            <li key={band.id} className="flex justify-between items-center p-4 hover:bg-white transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: band.color_nombre.toLowerCase().includes('roj') ? '#ef4444' : band.color_nombre.toLowerCase().includes('azul') ? '#3b82f6' : band.color_nombre.toLowerCase().includes('negr') ? '#1f2937' : band.color_nombre.toLowerCase().includes('verd') ? '#22c55e' : band.color_nombre.toLowerCase().includes('amarill') ? '#eab308' : '#e2e8f0' }}></div>
                                    <span className="font-bold text-slate-700">{band.color_nombre}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-md">{band.peso_equivalente} kg equiv.</span>
                                    <button
                                        onClick={() => deleteBand(band.id)}
                                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                        title="Eliminar banda"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="mt-8 text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">Aún no has registrado ninguna banda elástica.</p>
                </div>
            )}
        </section>
    );
}
