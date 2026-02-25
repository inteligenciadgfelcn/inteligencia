import React, { ReactNode, CSSProperties } from 'react';

interface VristoGridProps {
  children: ReactNode;
  container?: boolean;
  item?: boolean;
  className?: string;
  size?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
  direction?: 'row' | 'column';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'nowrap';
  style?: CSSProperties;
}

const spacingMap: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
};

const getSizeClasses = (size?: VristoGridProps['size']) => {
  if (!size) return '';
  
  const classes: string[] = [];
  
  if (size.xs) classes.push(`col-span-${size.xs}`);
  if (size.sm) classes.push(`sm:col-span-${size.sm}`);
  if (size.md) classes.push(`md:col-span-${size.md}`);
  if (size.lg) classes.push(`lg:col-span-${size.lg}`);
  if (size.xl) classes.push(`xl:col-span-${size.xl}`);
  
  return classes.join(' ');
};

export const VristoGrid: React.FC<VristoGridProps> = ({
  children,
  container = false,
  item = false,
  className = '',
  size,
  spacing = 2,
  direction = 'row',
  alignItems,
  justifyContent,
  wrap = 'wrap',
  style,
}) => {
  const getContainerClasses = () => {
    if (!container) return '';
    
    const classes = ['grid'];
    
    // Grid columns based on 12-column system
    if (spacing) classes.push(spacingMap[spacing] || 'gap-2');
    
    // Grid template based on children count or default to 12
    classes.push('grid-cols-12');
    
    if (direction === 'column') classes.push('grid-flow-col');
    
    return classes.join(' ');
  };

  const getItemClasses = () => {
    if (!item) return '';
    return getSizeClasses(size);
  };

  const getFlexClasses = () => {
    if (container && !item) return '';
    
    const classes = [];
    
    if (!container) {
      classes.push('flex');
      
      if (direction === 'column') classes.push('flex-col');
      else classes.push('flex-row');
      
      if (wrap === 'nowrap') classes.push('flex-nowrap');
      else classes.push('flex-wrap');
      
      if (spacing) classes.push(spacingMap[spacing] || 'gap-2');
    }
    
    if (alignItems) {
      switch (alignItems) {
        case 'start': classes.push('items-start'); break;
        case 'center': classes.push('items-center'); break;
        case 'end': classes.push('items-end'); break;
        case 'stretch': classes.push('items-stretch'); break;
      }
    }
    
    if (justifyContent) {
      switch (justifyContent) {
        case 'start': classes.push('justify-start'); break;
        case 'center': classes.push('justify-center'); break;
        case 'end': classes.push('justify-end'); break;
        case 'between': classes.push('justify-between'); break;
        case 'around': classes.push('justify-around'); break;
        case 'evenly': classes.push('justify-evenly'); break;
      }
    }
    
    return classes.join(' ');
  };

  const classes = [
    container ? getContainerClasses() : getFlexClasses(),
    item ? getItemClasses() : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};