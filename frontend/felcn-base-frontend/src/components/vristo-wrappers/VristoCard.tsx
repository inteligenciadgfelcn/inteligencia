import React, { ReactNode, CSSProperties } from 'react';

interface VristoCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
  hover?: boolean;
  bordered?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  style?: CSSProperties;
  onClick?: () => void;
}

const roundedMap = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg', 
  xl: 'rounded-xl',
};

const shadowMap = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  none: 'shadow-none',
};

export const VristoCard: React.FC<VristoCardProps> = ({
  children,
  className = '',
  title,
  noPadding = false,
  hover = false,
  bordered = false,
  rounded = 'md',
  shadow = 'md',
  style,
  onClick,
}) => {
  const baseClasses = 'panel bg-white dark:bg-black';
  
  const classes = [
    baseClasses,
    roundedMap[rounded],
    shadowMap[shadow],
    hover && 'hover:-translate-y-1 transition-all duration-200',
    bordered && 'border border-gray-200 dark:border-gray-700',
    !noPadding && 'p-5',
    onClick && 'cursor-pointer',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} onClick={onClick}>
      {title && (
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">{title}</h5>
        </div>
      )}
      <div className={noPadding ? '' : 'space-y-4'}>
        {children}
      </div>
    </div>
  );
};