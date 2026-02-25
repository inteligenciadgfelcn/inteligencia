import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    noPadding?: boolean;
}

export const Card = ({ children, className = '', title, noPadding = false }: CardProps) => {
    return (
        <div className={`panel w-full ${className}`}>
            {title && (
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">{title}</h5>
                </div>
            )}
            <div className={noPadding ? '' : 'mb-5'}>
                {children}
            </div>
        </div>
    );
};
