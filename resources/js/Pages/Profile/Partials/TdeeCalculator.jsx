import { useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

// ─── Fórmula Mifflin-St Jeor ──────────────────────────────────────────────────
function calcularTMB(genero, peso, altura, edad) {
    if (!peso || !altura || !edad || !genero) return null;
    const base = 10 * Number(peso) + 6.25 * Number(altura) - 5 * Number(edad);
    return genero === 'masculino' ? base + 5 : base - 161;
}

const FACTORES_ACTIVIDAD = [
    { value: '1.2',   label: 'Sedentario',        desc: 'Poco o nada de ejercicio' },
    { value: '1.375', label: 'Ligero',             desc: '1-3 días/semana' },
    { value: '1.55',  label: 'Moderado',           desc: '3-5 días/semana' },
    { value: '1.725', label: 'Activo',             desc: '6-7 días/semana' },
    { value: '1.9',   label: 'Muy Activo',         desc: 'Atleta / trabajo físico' },
];

// ─── Macros sugeridos (40/30/30 por defecto) ──────────────────────────────────
function calcularMacros(tdee) {
    if (!tdee) return null;
    return {
        proteinas: Math.round((tdee * 0.30) / 4),
        carbos:    Math.round((tdee * 0.40) / 4),
        grasas:    Math.round((tdee * 0.30) / 9),
    };
}

// ─── Gauge circular SVG ───────────────────────────────────────────────────────
function CalorieGauge({ calories }) {
    const max = 4000;
    const pct = Math.min((calories || 0) / max, 1);
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = circumference * pct;

    const color =
        calories < 1500 ? '#f87171' :
        calories < 2000 ? '#fb923c' :
        calories < 2800 ? '#34d399' : '#60a5fa';

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width="144" height="144" className="-rotate-90">
                <circle cx="72" cy="72" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle
                    cx="72" cy="72" r={radius} fill="none"
                    stroke={color} strokeWidth="12"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center rotate-0">
                <span className="text-2xl font-black text-white leading-none" style={{ color }}>
                    {calories ? Math.round(calories).toLocaleString() : '—'}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">kcal/día</span>
            </div>
        </div>
    );
}

// ─── MacroPill ────────────────────────────────────────────────────────────────
function MacroPill({ label, value, unit, color }) {
    return (
        <div className={`flex flex-col items-center px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50`}>
            <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color }}>{label}</span>
            <span className="text-xl font-black text-white">{value ?? '—'}</span>
            <span className="text-[10px] text-slate-500">{unit}</span>
        </div>
    );
}

export default function TdeeCalculator() {
    const user = usePage().props.auth.user;

    // Estado local de la calculadora (no vinculado al form principal)
    const [calc, setCalc] = useState({
        genero:          user.genero || '',
        edad:            user.edad   || '',
        peso:            user.peso   || '',
        altura:          user.altura || '',
        nivelActividad:  '1.55',
    });

    const setField = (field) => (e) =>
        setCalc((prev) => ({ ...prev, [field]: e.target.value }));

    // ─── Cálculo en tiempo real ───────────────────────────────────────────
    const tmb = useMemo(
        () => calcularTMB(calc.genero, calc.peso, calc.altura, calc.edad),
        [calc.genero, calc.peso, calc.altura, calc.edad]
    );

    const tdee = useMemo(
        () => (tmb ? Math.round(tmb * parseFloat(calc.nivelActividad)) : null),
        [tmb, calc.nivelActividad]
    );

    const macros = useMemo(() => calcularMacros(tdee), [tdee]);

    // ─── Formulario Inertia (sólo guarda las calorías + datos TDEE) ───────
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        genero:           calc.genero,
        edad:             calc.edad,
        calorias_diarias: tdee || '',
    });

    // Sincronizamos el form con el cálculo antes de guardar
    const handleSave = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            data: {
                genero:           calc.genero,
                edad:             Number(calc.edad),
                calorias_diarias: tdee,
            },
        });
    };

    const inputClass =
        'w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm ' +
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition placeholder-slate-500';

    const labelClass = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5';

    return (
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-bold text-white">Calculadora de Calorías (TDEE)</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Fórmula científica de Mifflin-St Jeor · Actualización en tiempo real</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* ─── Formulario ─── */}
                <div className="lg:col-span-3 space-y-5">

                    {/* Género */}
                    <div>
                        <label className={labelClass}>Género biológico</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { val: 'masculino', icon: '♂', label: 'Masculino' },
                                { val: 'femenino',  icon: '♀', label: 'Femenino'  },
                            ].map(({ val, icon, label }) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setCalc((p) => ({ ...p, genero: val }))}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                                        calc.genero === val
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                >
                                    <span className="text-lg">{icon}</span> {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Edad / Peso / Altura */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass} htmlFor="tdee-edad">Edad</label>
                            <div className="relative">
                                <input id="tdee-edad" type="number" min="1" max="120" placeholder="25"
                                    className={inputClass} value={calc.edad} onChange={setField('edad')} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">años</span>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="tdee-peso">Peso</label>
                            <div className="relative">
                                <input id="tdee-peso" type="number" min="30" max="300" step="0.1" placeholder="70"
                                    className={inputClass} value={calc.peso} onChange={setField('peso')} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">kg</span>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="tdee-altura">Altura</label>
                            <div className="relative">
                                <input id="tdee-altura" type="number" min="100" max="250" placeholder="175"
                                    className={inputClass} value={calc.altura} onChange={setField('altura')} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">cm</span>
                            </div>
                        </div>
                    </div>

                    {/* Nivel de actividad */}
                    <div>
                        <label className={labelClass}>Nivel de Actividad Física</label>
                        <div className="space-y-2">
                            {FACTORES_ACTIVIDAD.map(({ value, label, desc }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setCalc((p) => ({ ...p, nivelActividad: value }))}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 ${
                                        calc.nivelActividad === value
                                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/5'
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                                    }`}
                                >
                                    <span className="font-semibold">{label}</span>
                                    <span className="text-xs opacity-70">{desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TMB info */}
                    {tmb && (
                        <div className="text-xs text-slate-500 bg-slate-800/40 rounded-lg px-4 py-2.5 border border-slate-700/40">
                            <span className="text-slate-400 font-semibold">TMB (Basal):</span>
                            &nbsp;{Math.round(tmb).toLocaleString()} kcal &nbsp;·&nbsp;
                            <span className="text-slate-400 font-semibold">Factor:</span>
                            &nbsp;×{calc.nivelActividad}
                        </div>
                    )}
                </div>

                {/* ─── Resultado ─── */}
                <div className="lg:col-span-2 flex flex-col items-center justify-between gap-6">
                    <div className="flex flex-col items-center gap-4 w-full">
                        <CalorieGauge calories={tdee} />

                        {tdee && (
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-medium">Calorías de mantenimiento diarias</p>
                                <div className="flex gap-3 mt-3 justify-center">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 mb-0.5">Déficit (−500)</div>
                                        <div className="text-sm font-bold text-red-400">{(tdee - 500).toLocaleString()} kcal</div>
                                    </div>
                                    <div className="w-px bg-slate-700"/>
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 mb-0.5">Superávit (+300)</div>
                                        <div className="text-sm font-bold text-blue-400">{(tdee + 300).toLocaleString()} kcal</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {macros && (
                            <div className="grid grid-cols-3 gap-2 w-full">
                                <MacroPill label="Prot." value={macros.proteinas} unit="g / día" color="#34d399" />
                                <MacroPill label="Carbs" value={macros.carbos}    unit="g / día" color="#60a5fa" />
                                <MacroPill label="Grasas" value={macros.grasas}   unit="g / día" color="#f59e0b" />
                            </div>
                        )}

                        {!tdee && (
                            <div className="text-center text-slate-500 text-sm px-4">
                                Completa todos los campos para ver tu resultado
                            </div>
                        )}
                    </div>

                    {/* Botón guardar */}
                    <form onSubmit={handleSave} className="w-full">
                        <button
                            type="submit"
                            disabled={!tdee || processing}
                            className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                                tdee
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98]'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {processing ? 'Guardando…' : `Guardar Objetivo${tdee ? ` (${Math.round(tdee).toLocaleString()} kcal)` : ''}`}
                        </button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-out duration-300"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-200"
                            leaveTo="opacity-0"
                        >
                            <p className="mt-2 text-center text-xs text-emerald-400 font-medium">
                                ✓ Objetivo calórico guardado
                            </p>
                        </Transition>
                    </form>
                </div>
            </div>
        </section>
    );
}
