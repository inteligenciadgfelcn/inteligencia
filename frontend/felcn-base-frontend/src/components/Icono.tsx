'use client'

import { CSSProperties, FC, PropsWithChildren } from 'react'

import { menuIconMap } from '@/components/sidebar/menuIconMap'

interface Props {
  className?: string; // Add className for Tailwind support
  color?: string; // Simplistic string type instead of MUI union
  fontSize?: 'inherit' | 'large' | 'medium' | 'small' | string; // Loose type
  sx?: any; // Deprecated but kept for transition if needed, though we should ignore it
  style?: CSSProperties
}

/**
 * Icono centralizado con mapeo a iconos Vristo
 */
export const Icono: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  style,
}) => {
  const IconComponent =
    menuIconMap[String(children)] || menuIconMap.default

  // Map MUI-like colors/sizes to Tailwind/CSS classes if needed, 
  // but mostly Vristo icons are SVGs that inherit color or use className.

  return (
    <IconComponent
      className={className}
      // Pass other props if the underlying icon supports them.
      // Note: Vristo icons might just be SVGs. 
      // If they expect specific props, we should check one.
      // Typically they take className.
      style={style}
    />
  )
}
