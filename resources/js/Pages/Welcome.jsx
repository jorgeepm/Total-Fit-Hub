import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Target, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="bg-background text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
            <Head title="Bienvenido a Total Fit Hub" />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-10" />
                        <span className="text-xl font-black tracking-tight text-slate-900">Total Fit Hub</span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
                        <a href="#features" className="hover:text-primary transition-colors">Características</a>
                        <a href="#nutrition" className="hover:text-primary transition-colors">Nutrición</a>
                        <a href="#workout" className="hover:text-primary transition-colors">Entrenamientos</a>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
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
                                    Log In
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

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10 space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-teal-50 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em]">
                            Potencia tu rendimiento
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1]">
                            Entrena <span className="gradient-text">Inteligente</span>, Vive Mejor.
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                            La plataforma integral que fusiona tecnología y fitness. Controla tu nutrición, planifica tus rutinas y visualiza tu progreso como nunca antes.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                            <Link 
                                href={route('register')} 
                                className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all transform hover:scale-[1.02]"
                            >
                                <span>Unirse ahora</span>
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                            <a 
                                href="#features" 
                                className="flex items-center justify-center space-x-2 bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                            >
                                Leer más
                            </a>
                        </div>
                        <div className="flex items-center space-x-6 pt-8 border-t border-slate-100">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-400">
                                <span className="text-slate-900">+10,000</span> usuarios ya están transformando su vida.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative lg:h-[600px] flex items-center justify-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-100/50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                        <div className="relative w-full max-w-lg">
                            <img 
                                src="/images/hero.png" 
                                alt="Fitness Training" 
                                className="w-full rounded-[40px] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" 
                            />
                            {/* Floating Card */}
                            <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-xl animate-bounce-slow">
                                <Activity className="h-10 w-10 text-primary mb-3" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ritmo Cardíaco</p>
                                    <p className="text-2xl font-black text-slate-900">128 BPM</p>
                                </div>
                            </div>
                            <div className="absolute top-10 -right-10 glass p-6 rounded-3xl shadow-xl animate-float">
                                <Target className="h-10 w-10 text-orange-500 mb-3" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Objetivo Diario</p>
                                    <p className="text-2xl font-black text-slate-900">85%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">Todo lo que necesitas en un <span className="text-primary">mismo lugar</span>.</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Hemos diseñado la herramienta definitiva para que te centres en lo que importa: tus resultados.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: <Zap className="h-8 w-8 text-primary" />,
                            title: "Seguimiento en Tiempo Real",
                            desc: "Sincroniza tus dispositivos y observa tu rendimiento al instante con gráficas interactivas."
                        },
                        {
                            icon: <Activity className="h-8 w-8 text-orange-500" />,
                            title: "Nutrición Inteligente",
                            desc: "Acceso a la base de datos de OpenFoodFacts para registrar cada caloría con precisión quirúrgica."
                        },
                        {
                            icon: <Target className="h-8 w-8 text-indigo-500" />,
                            title: "Planes Personalizados",
                            desc: "Algoritmos avanzados que adaptan tus rutinas según tu nivel de fatiga y objetivos."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-transparent hover:border-slate-100">
                            <div className="mb-8 p-4 inline-block bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center border-b border-white/10 pb-20">
                    <div>
                        <div className="flex items-center space-x-3 mb-8">
                            <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
                            <span className="text-2xl font-black tracking-tight">Total Fit Hub</span>
                        </div>
                        <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                            Elevando los estándares del bienestar personal a través de la innovación y el diseño premium.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Suscríbete a nuestra newsletter</p>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="tu@email.com" 
                                className="flex-1 bg-white/5 border-none px-6 py-4 rounded-l-2xl focus:ring-2 focus:ring-primary text-white"
                            />
                            <button className="bg-primary hover:bg-primary-dark px-8 py-4 rounded-r-2xl font-bold transition-all">
                                Unirse
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:row-span-1 md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-500 text-sm font-bold">
                    <p>&copy; 2026 Total Fit Hub. Todos los derechos reservados.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white">Privacidad</a>
                        <a href="#" className="hover:text-white">Términos</a>
                        <a href="#" className="hover:text-white">Cookies</a>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
            `}} />
        </div>
    );
}
