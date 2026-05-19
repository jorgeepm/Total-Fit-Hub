import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Estilos reutilizables
    const inputBase = 'block w-full border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-sm transition-colors duration-200';
    const labelBase = 'block text-sm font-semibold text-slate-700 mb-1';

    return (
        <AuthLayout image="/images/login_bg.png">
            <Head title="Registrarse" />

            <div className="text-center mb-6">
                <img src="/images/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Total Fit Hub</h2>
                <h1 className="text-3xl font-extrabold mt-2 text-slate-900">Crear una cuenta</h1>
            </div>

            <form onSubmit={submit} className="space-y-5 bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className={labelBase}>Nombre Completo</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <TextInput
                                id="name" name="name" value={data.name}
                                className={`pl-10 ${inputBase}`}
                                autoComplete="name" isFocused placeholder="Tu nombre completo"
                                onChange={(e) => setData('name', e.target.value)} required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <label className={labelBase}>Correo Electrónico</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <TextInput
                                id="email" type="email" name="email" value={data.email}
                                className={`pl-10 ${inputBase}`}
                                autoComplete="username" placeholder="usuario@ejemplo.es"
                                onChange={(e) => setData('email', e.target.value)} required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelBase}>Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <TextInput
                                    id="password" type={showPassword ? 'text' : 'password'} name="password"
                                    value={data.password} className={`pl-10 pr-10 ${inputBase}`}
                                    autoComplete="new-password" placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)} required
                                />
                                <button type="button" onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                        <div>
                            <label className={labelBase}>Confirmar Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <TextInput
                                    id="password_confirmation" type="password" name="password_confirmation"
                                    value={data.password_confirmation} className={`pl-10 ${inputBase}`}
                                    autoComplete="new-password" placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)} required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-indigo-500/30"
                        disabled={processing}
                    >
                        Registrarse
                    </PrimaryButton>
                </div>
                
                <div className="text-center mt-6 pt-4 border-t border-slate-100">
                    <p className="text-slate-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link href={route('login')} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
