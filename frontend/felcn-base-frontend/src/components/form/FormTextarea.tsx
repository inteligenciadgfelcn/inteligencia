'use client'

import React from 'react'
import clsx from 'clsx'

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  name: string
  register?: any
  error?: string
  fullWidth?: boolean
}

const FormTextarea = ({
  label,
  name,
  register,
  error,
  className,
  disabled,
  fullWidth = true,
  ...props
}: FormTextareaProps) => {
  return (
    <div className={clsx(fullWidth && 'w-full', error && 'has-error')}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}

      <textarea
        id={name}
        {...(register && register(name))}
        {...props}
        disabled={disabled}
        className={clsx('form-textarea w-full', className)}
      />

      {error && <p className="form-help">{error}</p>}
    </div>
  )
}

export default FormTextarea
