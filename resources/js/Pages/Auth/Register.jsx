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
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout image="/images/login_bg.png">
            <Head title="Registrarse" />

            <div className="text-center mb-8">
                <img src="/images/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Total Fit Hub</h2>
                <h1 className="text-3xl font-extrabold mt-6 text-slate-900">Crear una cuenta</h1>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="pl-10 block w-full border-slate-200 focus:border-primary focus:ring-primary rounded-xl"
                            autoComplete="name"
                            isFocused={true}
                            placeholder="Tu nombre completo"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1" />
                </div>

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
                            placeholder="usuario@ejemplo.es"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                className="pl-10 block w-full border-slate-200 focus:border-primary focus:ring-primary rounded-xl"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmar Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="pl-10 block w-full border-slate-200 focus:border-primary focus:ring-primary rounded-xl"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                <PrimaryButton
                    className="w-full justify-center py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-lg font-bold transition-all transform hover:scale-[1.01]"
                    disabled={processing}
                >
                    Registrarse
                </PrimaryButton>

                <div className="text-center mt-6">
                    <p className="text-slate-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link href={route('login')} className="text-primary font-bold hover:underline">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
