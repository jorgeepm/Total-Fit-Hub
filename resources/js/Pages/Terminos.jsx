import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Mail } from 'lucide-react';

export default function Terminos({ auth }) {
    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
            <Head title="Términos y Condiciones – Total Fit Hub" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={route('welcome')} className="flex items-center space-x-3">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-10" />
                        <span className="text-xl font-black tracking-tight text-slate-900">Total Fit Hub</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
                            >
                                Panel de Control
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-slate-600 font-bold text-sm hover:text-slate-900 px-4"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
                                >
                                    Empezar Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl mb-8">
                        <Scale className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                        Términos y <span className="text-blue-600">Condiciones</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Estas condiciones regulan el uso de Total Fit Hub. Al registrarte, aceptas estos términos en su totalidad. Por favor, léelos detenidamente.
                    </p>
                    <p className="mt-6 text-sm text-slate-400 font-medium">Última actualización: 18 de mayo de 2026</p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-20">
                <div className="max-w-4xl mx-auto px-6 space-y-16">

                    {/* Índice */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span>Tabla de contenidos</span>
                        </h2>
                        <nav className="grid md:grid-cols-2 gap-3">
                            {[
                                { num: '1', label: 'Aceptación de los términos' },
                                { num: '2', label: 'Descripción del servicio' },
                                { num: '3', label: 'Registro y cuenta de usuario' },
                                { num: '4', label: 'Uso permitido y prohibido' },
                                { num: '5', label: 'Propiedad intelectual' },
                                { num: '6', label: 'Limitación de responsabilidad' },
                                { num: '7', label: 'Suspensión y cancelación' },
                                { num: '8', label: 'Modificaciones' },
                            ].map(item => (
                                <a key={item.num} href={`#termino-${item.num}`} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">{item.num}</span>
                                    <span className="text-slate-600 font-medium group-hover:text-slate-900 text-sm">{item.label}</span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Sección 1 */}
                    <section id="termino-1">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">1</span>
                            <span>Aceptación de los términos</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Al acceder y utilizar Total Fit Hub, confirmas que has leído, entendido y aceptas quedar vinculado por estos Términos y Condiciones, así como por nuestra Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, debes abstenerte de utilizar el servicio.
                        </p>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 2 */}
                    <section id="termino-2">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">2</span>
                            <span>Descripción del servicio</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-6">
                            Total Fit Hub es una plataforma digital de gestión del bienestar personal que ofrece las siguientes funcionalidades:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'Seguimiento de entrenamientos y actividad física',
                                'Planificación y gestión de rutinas personalizadas',
                                'Registro y análisis nutricional detallado',
                                'Visualización del progreso con gráficas interactivas',
                                'Gestión de peso corporal y métricas de salud',
                                'Base de datos de ejercicios y alimentos',
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl">
                                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 3 */}
                    <section id="termino-3">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">3</span>
                            <span>Registro y cuenta de usuario</span>
                        </h2>
                        <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                            <p>Para acceder a las funcionalidades completas de la plataforma, debes registrarte proporcionando información veraz, precisa y actualizada.</p>
                            <p>Eres el único responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas bajo tu cuenta.</p>
                            <p>Debes notificarnos inmediatamente cualquier uso no autorizado de tu cuenta a través de <a href="mailto:soporte@totalfithub.com" className="text-blue-600 font-semibold hover:underline">soporte@totalfithub.com</a>.</p>
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start space-x-4">
                                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-amber-800 font-medium">Debes tener al menos 16 años para registrarte en Total Fit Hub. Al registrarte, confirmas que cumples este requisito de edad.</p>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 4 */}
                    <section id="termino-4">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">4</span>
                            <span>Uso permitido y prohibido</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-black text-green-700 flex items-center space-x-2 mb-4">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Uso permitido</span>
                                </h3>
                                {[
                                    'Uso personal y no comercial de la plataforma',
                                    'Registro de tu propia actividad física y nutricional',
                                    'Compartir tu progreso con otros usuarios',
                                    'Usar la plataforma para mejorar tu bienestar',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-600 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-black text-red-700 flex items-center space-x-2 mb-4">
                                    <XCircle className="h-5 w-5" />
                                    <span>Uso prohibido</span>
                                </h3>
                                {[
                                    'Distribuir, vender o sublicenciar el servicio',
                                    'Intentar hackear o vulnerar la seguridad',
                                    'Crear cuentas falsas o suplantación de identidad',
                                    'Usar la plataforma para actividades ilegales',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-600 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 5 */}
                    <section id="termino-5">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">5</span>
                            <span>Propiedad intelectual</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Todos los contenidos de Total Fit Hub, incluyendo el diseño, logotipos, textos, gráficos y código fuente, son propiedad exclusiva de Total Fit Hub S.L. y están protegidos por las leyes de propiedad intelectual vigentes. Queda estrictamente prohibida su reproducción total o parcial sin autorización expresa por escrito.
                        </p>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 6 */}
                    <section id="termino-6">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">6</span>
                            <span>Limitación de responsabilidad</span>
                        </h2>
                        <div className="bg-slate-950 text-white p-8 rounded-3xl space-y-4">
                            <p className="text-slate-300 leading-relaxed">
                                El contenido de Total Fit Hub es únicamente informativo y de apoyo. <strong className="text-white">No sustituye el consejo médico, nutricional o de entrenamiento profesional.</strong> Antes de comenzar cualquier programa de ejercicio o cambio dietético, consulta con un profesional de la salud.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Total Fit Hub no se hace responsable de lesiones, problemas de salud u otros daños derivados del uso de la información proporcionada en la plataforma.
                            </p>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 7 */}
                    <section id="termino-7">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">7</span>
                            <span>Suspensión y cancelación</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-4">
                            Nos reservamos el derecho de suspender o cancelar tu cuenta si incumples estos términos. Puedes cancelar tu cuenta en cualquier momento desde la configuración de tu perfil. Ante cualquier cancelación, tus datos serán eliminados de acuerdo con nuestra Política de Privacidad.
                        </p>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 8 */}
                    <section id="termino-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center space-x-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-black">8</span>
                            <span>Modificaciones</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Total Fit Hub se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor en el momento de su publicación en la plataforma. Te notificaremos sobre cambios significativos por correo electrónico. El uso continuado del servicio tras la publicación de cambios implica la aceptación de los nuevos términos.
                        </p>
                    </section>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[40px] p-12 text-center text-white">
                        <Scale className="h-12 w-12 text-blue-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-black mb-4">¿Necesitas más información?</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Si tienes dudas sobre nuestros términos o necesitas aclaraciones legales, no dudes en contactarnos.</p>
                        <a
                            href="mailto:legal@totalfithub.com"
                            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all transform hover:scale-105"
                        >
                            <Mail className="h-5 w-5" />
                            <span>Contactar con el equipo Legal</span>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
