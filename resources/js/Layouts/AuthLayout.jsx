import { Link } from '@inertiajs/react';

export default function AuthLayout({ children, image }) {
    return (
        <div className="flex min-h-screen">
            {/* Left side: Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img 
                    src={image} 
                    alt="Fitness Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
                <div className="absolute bottom-12 left-12 text-white z-10 max-w-md">
                    <h1 className="text-5xl font-bold mb-4 leading-tight">Alcanza tu mejor versión con Total Fit Hub</h1>
                    <p className="text-xl opacity-90">Tu compañero definitivo para entrenamientos, nutrición y seguimiento de progreso.</p>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-background px-6 py-12 sm:px-12">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
