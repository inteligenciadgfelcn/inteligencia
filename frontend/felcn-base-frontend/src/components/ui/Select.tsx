import React, { SelectHTMLAttributes, forwardRef } from 'react'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  error?: boolean
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      className = '',
      error = false,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'form-select'

    const sizeClasses = {
      sm: 'form-select-sm',
      md: '',
      lg: 'form-select-lg',
    }

    const errorClasses = error
      ? '!border-danger text-danger focus:!border-danger'
      : ''

    return (
      <select
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'
