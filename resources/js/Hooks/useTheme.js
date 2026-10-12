import { useState, useEffect, useCallback } from 'react';

const THEME_CHANGE_EVENT = 'totalfit-theme-change';

function getInitialTheme() {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDOM(theme) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

/**
 * Hook para gestionar el tema (light | dark).
 * Emite y escucha eventos personalizados para sincronizar el estado reactivo
 * en todos los componentes y gráficos de la aplicación.
 */
export default function useTheme() {
    const [theme, setThemeState] = useState(getInitialTheme);

    const setTheme = useCallback((newTheme) => {
        const nextTheme = newTheme === 'dark' ? 'dark' : 'light';
        setThemeState(nextTheme);
        localStorage.setItem('theme', nextTheme);
        applyThemeToDOM(nextTheme);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: nextTheme }));
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    useEffect(() => {
        applyThemeToDOM(theme);

        const handleThemeChange = (e) => {
            if (e.detail && (e.detail === 'dark' || e.detail === 'light')) {
                setThemeState(e.detail);
            }
        };

        const handleStorage = (e) => {
            if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
                setThemeState(e.newValue);
                applyThemeToDOM(e.newValue);
            }
        };

        window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
            window.removeEventListener('storage', handleStorage);
        };
    }, [theme]);

    const isDark = theme === 'dark';

    return { theme, setTheme, toggleTheme, isDark };
}

