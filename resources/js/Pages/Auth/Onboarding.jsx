import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Target, Scale, Zap, Activity, Flame, User as UserIcon } from 'lucide-react';

function calcularTDEE(genero, peso, altura, edad, factor) {
    if (!genero || !peso || !altura || !edad) return null;
    const base = 10 * Number(peso) + 6.25 * Number(altura) - 5 * Number(edad);
    const tmb = genero === 'masculino' ? base + 5 : base - 161;
    return Math.round(tmb * parseFloat(factor));
}

const NIVELES_ACTIVIDAD = [
    { value: '1.2',   label: 'Sedentario',   desc: 'Sin ejercicio' },
    { value: '1.375', label: 'Ligero',        desc: '1-3 días/sem' },
    { value: '1.55',  label: 'Moderado',      desc: '3-5 días/sem' },
    { value: '1.725', label: 'Activo',        desc: '6-7 días/sem' },
    { value: '1.9',   label: 'Muy Activo',    desc: 'Atleta/físico' },
];

export default function Onboarding({ user }) {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        genero: '',
        edad: '',
        peso: '',
        altura: '',
        peso_objetivo: '',
        nivel_actividad: '1.55',
        calorias_diarias: '',
        target_proteins: 150,
        target_carbs: 250,
        target_fats: 70,
    });

    const tdee = useMemo(() => {
        return calcularTDEE(data.genero, data.peso, data.altura, data.edad, data.nivel_actividad);
    }, [data.genero, data.peso, data.altura, data.edad, data.nivel_actividad]);

    useEffect(() => {
        if (tdee && tdee !== data.calorias_diarias) {
            setData('calorias_diarias', tdee);
        }
    }, [tdee]);

    const submit = (e) => {
        e.preventDefault();
        post(route('onboarding.store'));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const inputBase = 'block w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-teal-500 rounded-xl text-sm transition-colors duration-200';
    const labelBase = 'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1';
    const unitSpan  = 'absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none';

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>
            <Head title="Cuestionario Inicial" />

            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-transparent dark:border-slate-800 transition-colors">
                <div className="h-2 bg-slate-100 dark:bg-slate-800 flex">
                    <div 
                        className="bg-teal-600 transition-all duration-500" 
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <header className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">¡Hola, {user.nombre_usuario}!</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Vamos a configurar tu perfil para empezar.</p>
                    </header>

                    <form onSubmit={submit}>
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg text-teal-600 dark:text-teal-400">
                                        <UserIcon size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Sobre ti</h2>
                                </div>

                                <div>
                                    <label className={labelBase}>Género Biológico</label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {[
                                            { val: 'masculino', icon: '♂', label: 'Hombre' },
                                            { val: 'femenino',  icon: '♀', label: 'Mujer'  },
                                        ].map(({ val, icon, label }) => (
                                            <button key={val} type="button"
                                                onClick={() => setData('genero', val)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                                                    data.genero === val
                                                        ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-600 dark:text-teal-400'
                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                <span className="text-4xl mb-2">{icon}</span>
                                                <span className="font-bold">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.genero} className="mt-1" />
                                </div>

                                <div>
                                    <label className={labelBase} htmlFor="edad">Edad</label>
                                    <div className="relative">
                                        <TextInput id="edad" type="number" min="1" max="120" placeholder="Ej. 25"
                                            className={`${inputBase} text-lg p-3`} value={data.edad}
                                            onChange={(e) => setData('edad', e.target.value)} required />
                                        <span className={`${unitSpan} text-base`}>años</span>
                                    </div>
                                    <InputError message={errors.edad} className="mt-1" />
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all mt-8"
                                >
                                    Siguiente <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg text-teal-600 dark:text-teal-400">
                                        <Scale size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Tus medidas</h2>
                                </div>

                                <div>
                                    <label className={labelBase} htmlFor="peso">Tu peso actual</label>
                                    <div className="relative">
                                        <TextInput id="peso" type="number" step="0.1" placeholder="Ej. 75.5"
                                            className={`${inputBase} text-lg p-3`} value={data.peso}
                                            onChange={(e) => setData('peso', e.target.value)} required />
                                        <span className={`${unitSpan} text-base`}>kg</span>
                                    </div>
                                    <InputError message={errors.peso} className="mt-1" />
                                </div>

                                <div>
                                    <label className={labelBase} htmlFor="altura">Tu altura</label>
                                    <div className="relative">
                                        <TextInput id="altura" type="number" placeholder="Ej. 175"
                                            className={`${inputBase} text-lg p-3`} value={data.altura}
                                            onChange={(e) => setData('altura', e.target.value)} required />
                                        <span className={`${unitSpan} text-base`}>cm</span>
                                    </div>
                                    <InputError message={errors.altura} className="mt-1" />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold transition-all"
                                    >
                                        <ChevronLeft size={20} /> Atrás
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-[2] flex items-center justify-center gap-2 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all"
                                    >
                                        Siguiente <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <Target size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Tus objetivos</h2>
                                </div>

                                <div>
                                    <label className={labelBase} htmlFor="peso_objetivo">Peso objetivo</label>
                                    <div className="relative">
                                        <TextInput id="peso_objetivo" type="number" step="0.1" placeholder="Ej. 70.0"
                                            className={`${inputBase} text-lg p-3`} value={data.peso_objetivo}
                                            onChange={(e) => setData('peso_objetivo', e.target.value)} required />
                                        <span className={`${unitSpan} text-base`}>kg</span>
                                    </div>
                                    <InputError message={errors.peso_objetivo} className="mt-1" />
                                </div>

                                <div>
                                    <label className={labelBase}>Nivel de Actividad Física</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {NIVELES_ACTIVIDAD.map((n, idx) => (
                                            <button
                                                key={n.value}
                                                type="button"
                                                onClick={() => setData('nivel_actividad', n.value)}
                                                className={`flex items-center justify-between py-2.5 px-3 rounded-xl border-2 transition-all duration-200 text-left ${
                                                    data.nivel_actividad === n.value
                                                        ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-400'
                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                                } ${idx === 4 ? 'col-span-2' : ''}`}
                                            >
                                                <div>
                                                    <span className={`block font-bold text-xs sm:text-sm ${data.nivel_actividad === n.value ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>{n.label}</span>
                                                    <span className={`block text-[10px] sm:text-xs ${data.nivel_actividad === n.value ? 'text-teal-500 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>{n.desc}</span>
                                                </div>
                                                <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 flex-shrink-0 ${data.nivel_actividad === n.value ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.nivel_actividad} className="mt-1" />
                                </div>
                                
                                <InputError message={errors.calorias_diarias} className="mt-1" />

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold transition-all"
                                    >
                                        <ChevronLeft size={20} /> Atrás
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-[2] flex items-center justify-center gap-2 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all"
                                    >
                                        Siguiente <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                                        <Zap size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Tus macronutrientes</h2>
                                </div>

                                {tdee && (
                                    <div className="mb-4 text-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                        <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Calorías Objetivo</p>
                                        <p className="text-3xl font-black text-slate-800 dark:text-white">{tdee.toLocaleString()} <span className="text-base text-slate-500 dark:text-slate-400 font-medium">kcal</span></p>
                                    </div>
                                )}

                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">Puedes ajustar estos valores para cuadrar con tus calorías calculadas.</p>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-100 dark:border-teal-900/60">
                                        <label className="text-sm font-bold text-teal-800 dark:text-teal-300">Proteínas (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_proteins} 
                                            onChange={e => setData('target_proteins', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-teal-900 dark:text-teal-200 border-none focus:ring-0 pl-4"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-emerald-950/40 rounded-xl border border-green-100 dark:border-emerald-900/60">
                                        <label className="text-sm font-bold text-green-800 dark:text-emerald-300">Carbos (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_carbs} 
                                            onChange={e => setData('target_carbs', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-green-900 dark:text-emerald-200 border-none focus:ring-0 pl-4"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-amber-950/40 rounded-xl border border-yellow-100 dark:border-amber-900/60">
                                        <label className="text-sm font-bold text-yellow-800 dark:text-amber-300">Grasas (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_fats} 
                                            onChange={e => setData('target_fats', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-yellow-900 dark:text-amber-200 border-none focus:ring-0 pl-4"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold transition-all"
                                    >
                                        <ChevronLeft size={20} /> Atrás
                                    </button>
                                    <PrimaryButton
                                        className="flex-[2] justify-center py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-lg font-bold transition-all transform hover:scale-[1.02]"
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

            <p className="mt-8 text-slate-400 dark:text-slate-500 text-sm">Paso {step} de 4</p>
        </div>
    );
}
