export default function ApplicationLogo({ className, ...props }) {
    return (
        <img
            src="/images/logo.png"
            alt="Total Fit Hub Logo"
            className={className}
            {...props}
        />
    );
}
