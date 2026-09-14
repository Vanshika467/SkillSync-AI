function Button({ children, onClick, type = "button", disabled = false, variant = "primary", className = "" }) {
    const baseStyles = "px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 hover:scale-[1.02]",
        secondary: "bg-gray-700 hover:bg-gray-600 text-white",
        danger: "bg-red-600 hover:bg-red-500 text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;