import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout image="/images/login_bg.png">
            <Head title="Iniciar Sesión" />

            <div className="text-center mb-8">
                <img src="/images/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Total Fit Hub</h2>
                <h1 className="text-3xl font-extrabold mt-6 text-slate-900">Bienvenido de nuevo</h1>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-10 block w-full border-slate-200 focus:border-primary focus:ring-primary rounded-xl"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="usuario@ejemplo.es"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="pl-10 pr-10 block w-full border-slate-200 focus:border-primary focus:ring-primary rounded-xl"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-300 text-primary shadow-sm focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-slate-600">Recuérdame</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-semibold text-primary hover:text-primary-dark"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                <PrimaryButton
                    className="w-full justify-center py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-lg font-bold transition-all transform hover:scale-[1.01]"
                    disabled={processing}
                >
                    Iniciar Sesión
                </PrimaryButton>

                <div className="text-center mt-6">
                    <p className="text-slate-600">
                        ¿No tienes cuenta?{' '}
                        <Link href={route('register')} className="text-primary font-bold hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
