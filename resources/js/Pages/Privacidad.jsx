import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export default function Privacidad({ auth }) {
    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
            <Head title="Política de Privacidad – Total Fit Hub" />

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
            <section className="pt-32 pb-16 bg-gradient-to-br from-teal-50 via-white to-slate-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-3xl mb-8">
                        <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                        Política de <span className="text-primary">Privacidad</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Tu privacidad es nuestra prioridad. Aquí te explicamos de forma clara y transparente cómo gestionamos tu información.
                    </p>
                    <p className="mt-6 text-sm text-slate-400 font-medium">Última actualización: 18 de mayo de 2026</p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-20">
                <div className="max-w-4xl mx-auto px-6 space-y-16">

                    {/* Sección 1 */}
                    <section className="group">
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                                <Eye className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">1. ¿Quiénes somos?</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Total Fit Hub es una plataforma integral de salud y bienestar personal. El responsable del tratamiento de tus datos es <strong>Total Fit Hub S.L.</strong>, con domicilio en España. Si tienes cualquier pregunta sobre esta política, puedes contactarnos en <a href="mailto:privacidad@totalfithub.com" className="text-primary font-semibold hover:underline">privacidad@totalfithub.com</a>.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 2 */}
                    <section className="group">
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Database className="h-7 w-7 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">2. ¿Qué datos recopilamos?</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                                    Recogemos únicamente los datos necesarios para prestarte el servicio con la máxima calidad:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Datos de registro', desc: 'Nombre, correo electrónico y contraseña cifrada para crear tu cuenta.' },
                                        { title: 'Datos de perfil', desc: 'Información de salud voluntaria: peso, altura, objetivos y preferencias de entrenamiento.' },
                                        { title: 'Datos de actividad', desc: 'Registros de entrenamientos, rutinas, nutrición y progreso físico que tú mismo introduces.' },
                                        { title: 'Datos técnicos', desc: 'Dirección IP, tipo de navegador y datos de sesión para garantizar la seguridad de tu cuenta.' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 3 */}
                    <section className="group">
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <UserCheck className="h-7 w-7 text-purple-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">3. ¿Para qué usamos tus datos?</h2>
                                <ul className="space-y-3 text-slate-600 text-lg">
                                    {[
                                        'Gestionar y personalizar tu cuenta de usuario.',
                                        'Ofrecer seguimiento de tu progreso físico y nutricional.',
                                        'Enviarte comunicaciones sobre el servicio (solo si has dado tu consentimiento).',
                                        'Mejorar continuamente la plataforma analizando patrones de uso de forma anónima.',
                                        'Garantizar la seguridad y el correcto funcionamiento del servicio.',
                                        'Cumplir con nuestras obligaciones legales.',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-primary rounded-full flex items-center justify-center text-xs font-black mt-0.5">{i + 1}</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 4 */}
                    <section className="group">
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <Lock className="h-7 w-7 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">4. Seguridad de tus datos</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                    Aplicamos las medidas técnicas y organizativas más estrictas para proteger tu información:
                                </p>
                                <div className="bg-slate-950 text-white p-8 rounded-3xl space-y-4">
                                    {[
                                        { emoji: '🔒', label: 'Cifrado SSL/TLS en todas las comunicaciones' },
                                        { emoji: '🛡️', label: 'Contraseñas almacenadas con hash bcrypt' },
                                        { emoji: '🔑', label: 'Acceso restringido a datos personales' },
                                        { emoji: '📋', label: 'Auditorías de seguridad periódicas' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <span className="text-2xl">{item.emoji}</span>
                                            <span className="text-slate-300 font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Sección 5 */}
                    <section>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                                <Mail className="h-7 w-7 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">5. Tus derechos</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                                    De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes derecho a:
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Acceso', desc: 'Obtener una copia de todos tus datos personales.' },
                                        { title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
                                        { title: 'Supresión', desc: 'Solicitar la eliminación de tus datos ("derecho al olvido").' },
                                        { title: 'Portabilidad', desc: 'Recibir tus datos en un formato estructurado y legible.' },
                                        { title: 'Oposición', desc: 'Oponerte al tratamiento de tus datos con fines específicos.' },
                                        { title: 'Limitación', desc: 'Solicitar que restrinjamos el tratamiento de tus datos.' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all">
                                            <h3 className="font-black text-slate-900 mb-2 text-primary">{item.title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 text-slate-600 text-lg">
                                    Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:privacidad@totalfithub.com" className="text-primary font-semibold hover:underline">privacidad@totalfithub.com</a>.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[40px] p-12 text-center text-white">
                        <h2 className="text-3xl font-black mb-4">¿Tienes alguna pregunta?</h2>
                        <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">Nuestro equipo está disponible para resolver cualquier duda sobre el tratamiento de tus datos personales.</p>
                        <a
                            href="mailto:privacidad@totalfithub.com"
                            className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-teal-50 transition-all transform hover:scale-105"
                        >
                            <Mail className="h-5 w-5" />
                            <span>Contactar con Privacidad</span>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
