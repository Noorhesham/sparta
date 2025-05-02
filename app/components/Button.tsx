    import React from "react";

    const Button = () => {
    return (
        <button
        onClick={() => setActiveCategory(category)}
        className={cn(
            "relative px-6 py-3 text-sm transition-all",
            "before:absolute before:inset-0 before:-skew-x-12 before:bg-gray-100",
            "hover:before:bg-gray-200",
            activeCategory === category && "before:bg-cyan-200 hover:before:bg-cyan-300"
        )}
        ></button>
    );
    };

    export default Button;
