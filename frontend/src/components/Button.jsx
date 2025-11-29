import React from 'react';
import { cn } from '../utils/cn'; // We'll create this utility

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'btn-primary',
        outline: 'btn-outline',
        ghost: 'hover:bg-gray-100 text-gray-700',
    };

    return (
        <button
            className={cn('btn', variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
