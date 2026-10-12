import { Sun, Moon } from 'lucide-react';
import useTheme from '@/Hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={toggleTheme}
            className={`group relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center rounded-full border border-slate-200/80 dark:border-slate-700/80 p-0.5 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                isDark ? 'bg-slate-800' : 'bg-amber-100/70'
            } ${className}`}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            <span className="sr-only">Alternar modo claro y oscuro</span>
            {/* Iconos fijos de la pista */}
            <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none">
                <Sun className={`h-3.5 w-3.5 text-amber-500 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-100'}`} />
                <Moon className={`h-3.5 w-3.5 text-indigo-400 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-30'}`} />
            </span>
            {/* Pomo deslizante con icono activo */}
            <span
                className={`pointer-events-none relative inline-flex h-6.5 w-6.5 transform items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-md ring-0 transition duration-300 ease-in-out ${
                    isDark ? 'translate-x-7 text-indigo-400' : 'translate-x-0.5 text-amber-500'
                }`}
            >
                {isDark ? (
                    <Moon className="h-3.5 w-3.5 fill-indigo-400/20" />
                ) : (
                    <Sun className="h-3.5 w-3.5 fill-amber-500/20" />
                )}
            </span>
        </button>
    );
}

