import React, { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  error?: boolean
  uppercase?: boolean
  /** Al perder el foco, recorta espacios al inicio/fin y notifica el valor recortado vía onChange. */
  trimOnBlur?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      className = '',
      error = false,
      uppercase = false,
      trimOnBlur = false,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'form-input'

    const sizeClasses = {
      sm: 'form-input-sm',
      md: '',
      lg: 'form-input-lg',
    }

    const errorClasses = error
      ? '!border-danger text-danger placeholder-danger/70 focus:!border-danger'
      : ''

    const handleChange = uppercase
      ? (e: React.ChangeEvent<HTMLInputElement>) => {
          e.target.value = e.target.value.toUpperCase()
          onChange?.(e)
        }
      : onChange

    const handleBlur = trimOnBlur
      ? (e: React.FocusEvent<HTMLInputElement>) => {
          const trimmed = e.target.value.trim()
          if (trimmed !== e.target.value) {
            e.target.value = trimmed
            onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          onBlur?.(e)
        }
      : onBlur

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
