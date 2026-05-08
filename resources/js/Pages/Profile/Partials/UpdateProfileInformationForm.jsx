import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            nombre_usuario: user.nombre_usuario,
            email: user.email,
            peso: user.peso || '',
            altura: user.altura || '',
            peso_objetivo: user.peso_objetivo || '',
            calorias_diarias: user.calorias_diarias || '',
            target_proteins: user.target_proteins || '',
            target_carbs: user.target_carbs || '',
            target_fats: user.target_fats || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Información del Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualiza la información de tu perfil, objetivos físicos y metas nutricionales.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-8">
                {/* Datos Básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="nombre_usuario" value="Nombre de Usuario" />
                        <TextInput
                            id="nombre_usuario"
                            className="mt-1 block w-full"
                            value={data.nombre_usuario}
                            onChange={(e) => setData('nombre_usuario', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.nombre_usuario} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Datos Físicos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <InputLabel htmlFor="peso" value="Peso (kg)" />
                            <TextInput
                                id="peso"
                                type="number"
                                step="0.1"
                                className="mt-1 block w-full"
                                value={data.peso}
                                onChange={(e) => setData('peso', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.peso} />
                        </div>

                        <div>
                            <InputLabel htmlFor="altura" value="Altura (cm)" />
                            <TextInput
                                id="altura"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.altura}
                                onChange={(e) => setData('altura', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.altura} />
                        </div>

                        <div>
                            <InputLabel htmlFor="peso_objetivo" value="Peso Objetivo (kg)" />
                            <TextInput
                                id="peso_objetivo"
                                type="number"
                                step="0.1"
                                className="mt-1 block w-full"
                                value={data.peso_objetivo}
                                onChange={(e) => setData('peso_objetivo', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.peso_objetivo} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Objetivos Nutricionales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <InputLabel htmlFor="calorias_diarias" value="Calorías Diarias (kcal)" />
                            <TextInput
                                id="calorias_diarias"
                                type="number"
                                className="mt-1 block w-full font-bold text-indigo-600"
                                value={data.calorias_diarias}
                                onChange={(e) => setData('calorias_diarias', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.calorias_diarias} />
                        </div>

                        <div>
                            <InputLabel htmlFor="target_proteins" value="Proteínas (g)" />
                            <TextInput
                                id="target_proteins"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.target_proteins}
                                onChange={(e) => setData('target_proteins', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.target_proteins} />
                        </div>

                        <div>
                            <InputLabel htmlFor="target_carbs" value="Carbohidratos (g)" />
                            <TextInput
                                id="target_carbs"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.target_carbs}
                                onChange={(e) => setData('target_carbs', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.target_carbs} />
                        </div>

                        <div>
                            <InputLabel htmlFor="target_fats" value="Grasas (g)" />
                            <TextInput
                                id="target_fats"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.target_fats}
                                onChange={(e) => setData('target_fats', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.target_fats} />
                        </div>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Tu dirección de correo electrónico no está verificada.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Haz clic aquí para volver a enviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                    <PrimaryButton disabled={processing}>Guardar Cambios</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Guardado correctamente.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
