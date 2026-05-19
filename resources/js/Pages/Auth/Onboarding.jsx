import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
        const val = calcularTDEE(data.genero, data.peso, data.altura, data.edad, data.nivel_actividad);
        if (val !== data.calorias_diarias) {
            setTimeout(() => setData('calorias_diarias', val), 0);
        }
        return val;
    }, [data.genero, data.peso, data.altura, data.edad, data.nivel_actividad]);

    const submit = (e) => {
        e.preventDefault();
        post(route('onboarding.store'));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const inputBase = 'block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-sm transition-colors duration-200';
    const labelBase = 'block text-sm font-semibold text-slate-700 mb-1';
    const unitSpan  = 'absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title="Cuestionario Inicial" />

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 flex">
                    <div 
                        className="bg-indigo-600 transition-all duration-500" 
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <header className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">¡Hola, {user.nombre_usuario}!</h1>
                        <p className="text-slate-600 mt-2">Vamos a configurar tu perfil para empezar.</p>
                    </header>

                    <form onSubmit={submit}>
                        
                        {/* PASO 1: GÉNERO Y EDAD */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        <UserIcon size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Sobre ti</h2>
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
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
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
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all mt-8"
                                >
                                    Siguiente <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* PASO 2: PESO Y ALTURA */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        <Scale size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Tus medidas</h2>
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

                        {/* PASO 3: OBJETIVOS Y ACTIVIDAD */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                        <Target size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Tus objetivos</h2>
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
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                } ${idx === 4 ? 'col-span-2' : ''}`}
                                            >
                                                <div>
                                                    <span className={`block font-bold text-xs sm:text-sm ${data.nivel_actividad === n.value ? 'text-indigo-600' : 'text-slate-800'}`}>{n.label}</span>
                                                    <span className={`block text-[10px] sm:text-xs ${data.nivel_actividad === n.value ? 'text-indigo-500' : 'text-slate-500'}`}>{n.desc}</span>
                                                </div>
                                                <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 flex-shrink-0 ${data.nivel_actividad === n.value ? 'text-indigo-500' : 'text-slate-400'}`} />
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

                        {/* PASO 4: MACRONUTRIENTES */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <Zap size={24} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800">Tus macronutrientes</h2>
                                </div>

                                {tdee && (
                                    <div className="mb-4 text-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Calorías Objetivo</p>
                                        <p className="text-3xl font-black text-slate-800">{tdee.toLocaleString()} <span className="text-base text-slate-500 font-medium">kcal</span></p>
                                    </div>
                                )}

                                <p className="text-sm text-slate-500 mb-4 text-center">Puedes ajustar estos valores para cuadrar con tus calorías calculadas.</p>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <label className="text-sm font-bold text-blue-800">Proteínas (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_proteins} 
                                            onChange={e => setData('target_proteins', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-blue-900 border-none focus:ring-0 pl-4"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                                        <label className="text-sm font-bold text-green-800">Carbos (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_carbs} 
                                            onChange={e => setData('target_carbs', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-green-900 border-none focus:ring-0 pl-4"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <label className="text-sm font-bold text-yellow-800">Grasas (g)</label>
                                        <input 
                                            type="number" 
                                            value={data.target_fats} 
                                            onChange={e => setData('target_fats', e.target.value)}
                                            className="w-20 bg-transparent text-right font-bold text-yellow-900 border-none focus:ring-0 pl-4"
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

            <p className="mt-8 text-slate-400 text-sm">Paso {step} de 4</p>
        </div>
    );
}
