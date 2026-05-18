import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { Cookie, Settings, BarChart2, Shield, ToggleLeft, Mail } from 'lucide-react';

export default function Cookies({ auth }) {
    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
            <Head title="Política de Cookies – Total Fit Hub" />

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
            <section className="pt-32 pb-16 bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-3xl mb-8">
                        <Cookie className="h-10 w-10 text-orange-500" />
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                        Política de <span className="text-orange-500">Cookies</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Usamos cookies para ofrecerte la mejor experiencia posible. Aquí te explicamos qué son, para qué las usamos y cómo puedes controlarlas.
                    </p>
                    <p className="mt-6 text-sm text-slate-400 font-medium">Última actualización: 18 de mayo de 2026</p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-20">
                <div className="max-w-4xl mx-auto px-6 space-y-16">

                    {/* Qué son las cookies */}
                    <section>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                                <Cookie className="h-7 w-7 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">¿Qué son las cookies?</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Permiten que la web recuerde tus preferencias, mantenga tu sesión activa y mejore la experiencia de navegación en visitas posteriores. Son completamente seguras y no pueden ejecutar código ni transmitir virus.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Tipos de cookies */}
                    <section>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Settings className="h-7 w-7 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-slate-900 mb-8">Tipos de cookies que utilizamos</h2>
                                <div className="space-y-6">
                                    {[
                                        {
                                            name: '🔒 Cookies esenciales',
                                            badge: 'Siempre activas',
                                            badgeColor: 'bg-green-100 text-green-700',
                                            desc: 'Son imprescindibles para el funcionamiento básico de la plataforma. Permiten funciones como la autenticación de usuarios, el mantenimiento de la sesión y la seguridad. Sin estas cookies, la plataforma no puede funcionar correctamente.',
                                            examples: ['Sesión de usuario (XSRF-Token)', 'Token de autenticación', 'Preferencias de idioma'],
                                            duration: 'Duración: Sesión o hasta 1 año',
                                        },
                                        {
                                            name: '📊 Cookies analíticas',
                                            badge: 'Opcionales',
                                            badgeColor: 'bg-blue-100 text-blue-700',
                                            desc: 'Nos ayudan a entender cómo interactúan los usuarios con la plataforma. Recopilamos información de forma anónima sobre páginas visitadas, tiempo de uso y posibles errores, lo que nos permite mejorar continuamente el servicio.',
                                            examples: ['Páginas más visitadas', 'Tiempo de sesión', 'Flujos de navegación'],
                                            duration: 'Duración: Hasta 2 años',
                                        },
                                        {
                                            name: '⚙️ Cookies de preferencias',
                                            badge: 'Opcionales',
                                            badgeColor: 'bg-purple-100 text-purple-700',
                                            desc: 'Almacenan las personalizaciones que realizas en la plataforma para que no tengas que configurarlas cada vez que entres. Incluyen ajustes de visualización, unidades de medida preferidas y configuración del panel de control.',
                                            examples: ['Tema de interfaz', 'Unidades (kg/lb, km/mi)', 'Configuración del dashboard'],
                                            duration: 'Duración: Hasta 1 año',
                                        },
                                    ].map((cookie, i) => (
                                        <div key={i} className="border border-slate-200 rounded-3xl overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                                            <div className="p-6 bg-slate-50 flex items-center justify-between">
                                                <h3 className="font-black text-slate-900 text-lg">{cookie.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${cookie.badgeColor}`}>{cookie.badge}</span>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <p className="text-slate-600 leading-relaxed">{cookie.desc}</p>
                                                <div>
                                                    <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">Ejemplos</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {cookie.examples.map((ex, j) => (
                                                            <span key={j} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">{ex}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-400 font-medium">{cookie.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Cookies de terceros */}
                    <section>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                                <BarChart2 className="h-7 w-7 text-purple-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">Cookies de terceros</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                                    Algunas funcionalidades de Total Fit Hub utilizan servicios de terceros que pueden establecer sus propias cookies:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        {
                                            provider: 'OpenFoodFacts API',
                                            purpose: 'Base de datos nutricional para la búsqueda y registro de alimentos.',
                                            privacy: 'openfoodfacts.org/terms-of-use',
                                        },
                                        {
                                            provider: 'Strava (integración)',
                                            purpose: 'Sincronización de actividades y datos de entrenamiento (si conectas tu cuenta).',
                                            privacy: 'strava.com/legal/privacy',
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 border border-slate-200 rounded-2xl">
                                            <h3 className="font-black text-slate-900 mb-2">{item.provider}</h3>
                                            <p className="text-slate-500 text-sm mb-3 leading-relaxed">{item.purpose}</p>
                                            <a href={`https://${item.privacy}`} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 font-bold hover:underline">
                                                Ver política de privacidad →
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* Control de cookies */}
                    <section>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                                <ToggleLeft className="h-7 w-7 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">¿Cómo controlar las cookies?</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                                    Tienes el control total sobre las cookies. Puedes gestionarlas de dos formas:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h3 className="font-black text-slate-900 mb-3">Desde tu navegador</h3>
                                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">La mayoría de los navegadores te permiten ver, eliminar y bloquear cookies desde su configuración:</p>
                                        <ul className="space-y-2">
                                            {[
                                                { name: 'Chrome', url: 'support.google.com/chrome/answer/95647' },
                                                { name: 'Firefox', url: 'support.mozilla.org/kb/cookies' },
                                                { name: 'Safari', url: 'support.apple.com/guide/safari' },
                                                { name: 'Edge', url: 'support.microsoft.com/microsoft-edge' },
                                            ].map((browser, i) => (
                                                <li key={i}>
                                                    <a href={`https://${browser.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 font-bold hover:underline">
                                                        → Instrucciones para {browser.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h3 className="font-black text-slate-900 mb-3">Desde la plataforma</h3>
                                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                                            Puedes gestionar tus preferencias de cookies directamente desde tu panel de usuario. Las cookies esenciales no se pueden desactivar ya que son necesarias para el funcionamiento del servicio.
                                        </p>
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <p className="text-amber-800 text-sm font-medium">
                                                ⚠️ Desactivar cookies no esenciales puede afectar a algunas funcionalidades de la plataforma.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-slate-100"></div>

                    {/* RGPD */}
                    <section>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
                                <Shield className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">Cumplimiento con el RGPD</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Total Fit Hub cumple con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley Orgánica de Protección de Datos (LOPDGDD) de España. Solo utilizamos cookies con tu consentimiento expreso, excepto las cookies estrictamente necesarias para el funcionamiento del servicio.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[40px] p-12 text-center text-white">
                        <Cookie className="h-12 w-12 text-white/80 mx-auto mb-6" />
                        <h2 className="text-3xl font-black mb-4">¿Tienes preguntas sobre las cookies?</h2>
                        <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">Si necesitas más información sobre cómo usamos las cookies o deseas ejercer tus derechos, contáctanos.</p>
                        <a
                            href="mailto:privacidad@totalfithub.com"
                            className="inline-flex items-center space-x-2 bg-white text-orange-500 px-8 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-all transform hover:scale-105"
                        >
                            <Mail className="h-5 w-5" />
                            <span>Contactar sobre Cookies</span>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
