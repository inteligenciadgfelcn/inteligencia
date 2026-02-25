import React, { ReactNode, CSSProperties } from 'react';

interface VristoBoxProps {
  children: ReactNode;
  className?: string;
  display?: 'block' | 'flex' | 'inline' | 'inline-block' | 'grid' | 'hidden';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  px?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  py?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  m?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  height?: string | number;
  width?: string | number;
  style?: CSSProperties;
  onClick?: () => void;
}

const spacingMap = {
  xs: '1',
  sm: '2', 
  md: '4',
  lg: '6',
  xl: '8'
};

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4', 
  lg: 'gap-6',
  xl: 'gap-8'
};

export const VristoBox: React.FC<VristoBoxProps> = ({
  children,
  className = '',
  display = 'block',
  alignItems,
  justifyContent,
  gap,
  p,
  px,
  py,
  m,
  height,
  width,
  style,
  onClick,
}) => {
  const getDisplayClass = () => {
    switch (display) {
      case 'flex': return 'flex';
      case 'inline': return 'inline';
      case 'inline-block': return 'inline-block';
      case 'grid': return 'grid';
      case 'hidden': return 'hidden';
      default: return 'block';
    }
  };

  const getAlignClass = () => {
    if (!alignItems) return '';
    switch (alignItems) {
      case 'start': return 'items-start';
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      case 'stretch': return 'items-stretch';
      default: return '';
    }
  };

  const getJustifyClass = () => {
    if (!justifyContent) return '';
    switch (justifyContent) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
      case 'between': return 'justify-between';
      case 'around': return 'justify-around';
      case 'evenly': return 'justify-evenly';
      default: return '';
    }
  };

  const getPaddingClass = () => {
    if (p) return `p-${typeof p === 'number' ? p : spacingMap[p]}`;
    let classes = '';
    if (px) classes += ` px-${typeof px === 'number' ? px : spacingMap[px]}`;
    if (py) classes += ` py-${typeof py === 'number' ? py : spacingMap[py]}`;
    return classes;
  };

  const getMarginClass = () => {
    if (!m) return '';
    return `m-${typeof m === 'number' ? m : spacingMap[m]}`;
  };

  const getGapClass = () => {
    if (!gap) return '';
    return typeof gap === 'number' ? `gap-${gap}` : gapMap[gap];
  };

  const classes = [
    getDisplayClass(),
    getAlignClass(),
    getJustifyClass(),
    getGapClass(),
    getPaddingClass(),
    getMarginClass(),
    className
  ].filter(Boolean).join(' ');

  const dynamicStyle: CSSProperties = {
    ...style,
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
  };

  return (
    <div className={classes} style={dynamicStyle} onClick={onClick}>
      {children}
    </div>
  );
};