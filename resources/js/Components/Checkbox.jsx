export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 shadow-sm focus:ring-teal-500 ' +
                className
            }
        />
    );
}
