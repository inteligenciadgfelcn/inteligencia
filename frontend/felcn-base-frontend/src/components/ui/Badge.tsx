import React, { ReactNode } from 'react'

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  outline?: boolean
  rounded?: boolean
  className?: string
}

export const Badge = ({
  children,
  variant = 'primary',
  outline = false,
  rounded = false,
  className = '',
}: BadgeProps) => {
  // Base badge class
  let classes = 'badge'

  // Variant
  if (outline) {
    classes += ` badge-outline-${variant}`
  } else {
    classes += ` badge bg-${variant}`
  }

  // Shape
  if (rounded) {
    classes += ' rounded-full'
  }

  return <span className={`${classes} ${className}`}>{children}</span>
}
