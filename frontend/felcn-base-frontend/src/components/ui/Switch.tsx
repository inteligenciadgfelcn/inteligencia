import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ className = '', label, color = 'primary', ...props }, ref) => {

        // Map color to tailwind colors if needed, but Vristo largely uses 'text-primary' or 'peer-checked:bg-primary'
        // For simplicity we'll assume the primary color, but allow custom classes.
        // To support dynamic colors like 'bg-success', we need to safelist them or use style.

        const colorClasses: Record<string, string> = {
            primary: 'peer-checked:bg-primary',
            secondary: 'peer-checked:bg-secondary',
            success: 'peer-checked:bg-success',
            danger: 'peer-checked:bg-danger',
            warning: 'peer-checked:bg-warning',
            info: 'peer-checked:bg-info',
            dark: 'peer-checked:bg-dark',
        };

        return (
            <label className={`flex items-center cursor-pointer ${className}`}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="peer sr-only"
                        {...props}
                    />
                    <div className={`
            block h-6 w-11 rounded-full bg-[#ebedf2] dark:bg-dark
            before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300
            peer-checked:before:left-6 peer-checked:before:bg-white
            ${colorClasses[color] || 'peer-checked:bg-primary'}
          `}></div>
                </div>
                {label && <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>}
            </label>
        );
    }
);

Switch.displayName = 'Switch';
