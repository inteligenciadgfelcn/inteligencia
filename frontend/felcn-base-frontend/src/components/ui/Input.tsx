import React, { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', className = '', error = false, ...props }, ref) => {
    const baseClasses = 'form-input'

    const sizeClasses = {
      sm: 'form-input-sm',
      md: '',
      lg: 'form-input-lg',
    }

    const errorClasses = error
      ? '!border-danger text-danger placeholder-danger/70 focus:!border-danger'
      : ''

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
