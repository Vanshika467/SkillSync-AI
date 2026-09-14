function Input({ type = "text", name, placeholder, value, onChange, required = false, autoComplete, className = "" }) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            autoComplete={autoComplete}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${className}`}
        />
    );
}

export default Input;