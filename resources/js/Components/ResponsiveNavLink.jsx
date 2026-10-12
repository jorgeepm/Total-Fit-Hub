import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 focus:border-teal-700 focus:bg-teal-100 dark:focus:bg-teal-900/40 focus:text-teal-800'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-gray-200 focus:border-gray-300 focus:bg-gray-50 dark:focus:bg-slate-800 focus:text-gray-800 dark:focus:text-gray-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
