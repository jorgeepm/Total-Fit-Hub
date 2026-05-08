import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, Scale, Ruler, Zap } from 'lucide-react';

export default function Onboarding({ user }) {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        peso: '',
        altura: '',
        peso_objetivo: '',
        calorias_diarias: '',
        target_proteins: 150,
        target_carbs: 250,
        target_fats: 70,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('onboarding.store'));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title="Cuestionario Inicial" />

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 flex">
                    <div 
                        className="bg-indigo-600 transition-all duration-500" 
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <header className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">¡Hola, {user.nombre_usuario}!</h1>
                        <p className="text-slate-600 mt-2">Vamos a configurar tu perfil para empezar.</p>
                    </header>

                    <form onSubmit={submit}>
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        <Scale size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Tus medidas</h2>
                                </div>

                                <div>
                                    <InputLabel htmlFor="peso" value="Tu peso actual (kg)" />
                                    <TextInput
                                        id="peso"
                                        type="number"
                                        step="0.1"
                                        className="mt-1 block w-full text-lg py-3"
                                        value={data.peso}
                                        onChange={(e) => setData('peso', e.target.value)}
                                        placeholder="ej: 75.5"
                                        required
                                    />
                                    <InputError message={errors.peso} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="altura" value="Tu altura (cm)" />
                                    <TextInput
                                        id="altura"
                                        type="number"
                                        className="mt-1 block w-full text-lg py-3"
                                        value={data.altura}
                                        onChange={(e) => setData('altura', e.target.value)}
                                        placeholder="ej: 175"
                                        required
                                    />
                                    <InputError message={errors.altura} className="mt-1" />
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all mt-8"
                                >
                                    Siguiente <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                        <Target size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Tus objetivos</h2>
                                </div>

                                <div>
                                    <InputLabel htmlFor="peso_objetivo" value="Peso objetivo (kg)" />
                                    <TextInput
                                        id="peso_objetivo"
                                        type="number"
                                        step="0.1"
                                        className="mt-1 block w-full text-lg py-3"
                                        value={data.peso_objetivo}
                                        onChange={(e) => setData('peso_objetivo', e.target.value)}
                                        placeholder="ej: 70.0"
                                        required
                                    />
                                    <InputError message={errors.peso_objetivo} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="calorias_diarias" value="Meta de calorías diarias" />
                                    <TextInput
                                        id="calorias_diarias"
                                        type="number"
                                        className="mt-1 block w-full text-lg py-3 font-bold text-indigo-600"
                                        value={data.calorias_diarias}
                                        onChange={(e) => setData('calorias_diarias', e.target.value)}
                                        placeholder="ej: 2500"
                                        required
                                    />
                                    <InputError message={errors.calorias_diarias} className="mt-1" />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                                    >
                                        <ChevronLeft size={20} /> Atrás
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-[2] flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all"
                                    >
                                        Siguiente <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <Zap size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Tus macronutrientes</h2>
                                </div>

                                <p className="text-sm text-slate-500 mb-4">Puedes dejar estos valores por defecto y cambiarlos más tarde en tu perfil.</p>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <label className="text-sm font-bold text-blue-800">Proteínas (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_proteins} 
                                            onChange={e => setData('target_proteins', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-blue-900 border-none focus:ring-0"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                                        <label className="text-sm font-bold text-green-800">Carbos (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_carbs} 
                                            onChange={e => setData('target_carbs', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-green-900 border-none focus:ring-0"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <label className="text-sm font-bold text-yellow-800">Grasas (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_fats} 
                                            onChange={e => setData('target_fats', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-yellow-900 border-none focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                                    >
                                        <ChevronLeft size={20} /> Atrás
                                    </button>
                                    <PrimaryButton
                                        className="flex-[2] justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-bold transition-all transform hover:scale-[1.02]"
                                        disabled={processing}
                                    >
                                        Finalizar
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-sm">Paso {step} de 3</p>
        </div>
    );
}
