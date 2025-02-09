// resources/js/src/components/Common/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded focus:outline-none focus:ring';
    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
        warning: 'bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-300',
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
        <button type={type} onClick={onClick} className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
