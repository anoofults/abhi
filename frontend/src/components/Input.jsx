import React from 'react';
import { cn } from '../utils/cn';

const Input = ({ label, className, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                className={cn('input-field', className)}
                {...props}
            />
        </div>
    );
};

export default Input;
