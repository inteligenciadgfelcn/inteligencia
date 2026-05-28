import React, { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  icon?: ReactNode
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon,
  loading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'btn shadow-none'

  // Explicit mapping to match tailwind.css/Vristo classes
  const variantClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
    info: 'btn-info',
    dark: 'btn-dark',
    'outline-primary': 'btn-outline-primary',
    'outline-secondary': 'btn-outline-secondary',
    'outline-success': 'btn-outline-success',
    'outline-danger': 'btn-outline-danger',
    'outline-warning': 'btn-outline-warning',
    'outline-info': 'btn-outline-info',
    'outline-dark': 'btn-outline-dark',
  }

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || 'btn-primary'} ${sizeClasses[size]} ${className} ${loading ? 'relative text-transparent pointer-events-none' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center text-white">
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        </span>
      )}
      <div className={`flex items-center justify-center ${loading ? 'invisible' : ''}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  )
}
