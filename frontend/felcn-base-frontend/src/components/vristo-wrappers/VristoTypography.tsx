import React, { ReactNode, CSSProperties } from 'react';

interface VristoTypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2';
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'light' | 'text.primary' | 'text.secondary';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  gutterBottom?: boolean;
  style?: CSSProperties;
}

const variantMap = {
  h1: { tag: 'h1', classes: 'text-4xl font-bold' },
  h2: { tag: 'h2', classes: 'text-3xl font-semibold' },
  h3: { tag: 'h3', classes: 'text-2xl font-semibold' },
  h4: { tag: 'h4', classes: 'text-xl font-medium' },
  h5: { tag: 'h5', classes: 'text-lg font-medium' },
  h6: { tag: 'h6', classes: 'text-base font-medium' },
  subtitle1: { tag: 'h6', classes: 'text-base font-medium' },
  subtitle2: { tag: 'h6', classes: 'text-sm font-medium' },
  body1: { tag: 'p', classes: 'text-sm' },
  body2: { tag: 'p', classes: 'text-xs' },
  caption: { tag: 'span', classes: 'text-xs text-gray-500 dark:text-gray-400' },
};

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary', 
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  dark: 'text-dark dark:text-white',
  light: 'text-white dark:text-gray-300',
  'text.primary': 'text-dark dark:text-white',
  'text.secondary': 'text-gray-600 dark:text-gray-300',
};

const fontWeightMap = {
  normal: 'font-normal',
  medium: 'font-medium', 
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignMap = {
  left: 'text-left',
  center: 'text-center', 
  right: 'text-right',
};

export const VristoTypography: React.FC<VristoTypographyProps> = ({
  children,
  variant = 'body1',
  className = '',
  color,
  fontWeight,
  align,
  gutterBottom = false,
  style,
}) => {
  const variantConfig = variantMap[variant];
  const Tag = variantConfig.tag as keyof JSX.IntrinsicElements;

  const classes = [
    variantConfig.classes,
    color && colorMap[color],
    fontWeight && fontWeightMap[fontWeight],
    align && alignMap[align],
    gutterBottom && 'mb-4',
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} style={style}>
      {children}
    </Tag>
  );
};