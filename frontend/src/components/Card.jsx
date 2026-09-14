function Card({ children, className = "", style }) {
    return (
        <div
            style={style}
            className={`bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-xl transition-all duration-200 hover:border-gray-600/50 ${className}`}
        >
            {children}
        </div>
    );
}

export default Card;