import React, { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  error?: boolean
  uppercase?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      className = '',
      error = false,
      uppercase = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'form-textarea'

    const sizeClasses = {
      sm: 'form-textarea-sm',
      md: '',
      lg: 'form-textarea-lg',
    }

    const errorClasses = error
      ? '!border-danger text-danger focus:!border-danger'
      : ''

    const handleChange = uppercase
      ? (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.target.value = e.target.value.toUpperCase()
          onChange?.(e)
        }
      : onChange

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
