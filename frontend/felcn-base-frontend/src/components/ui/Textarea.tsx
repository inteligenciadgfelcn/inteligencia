import React, { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = 'md', className = '', error = false, ...props }, ref) => {
    const baseClasses = 'form-textarea'

    const sizeClasses = {
      sm: 'form-textarea-sm',
      md: '',
      lg: 'form-textarea-lg',
    }

    const errorClasses = error
      ? '!border-danger text-danger focus:!border-danger'
      : ''

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
