'use client'

import React, { InputHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Icono } from '@/components/Icono'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  register?: any
  error?: string
  icon?: string
  fullWidth?: boolean
}

const FormInput = ({
  label,
  name,
  register,
  error,
  icon,
  className,
  disabled,
  fullWidth = true,
  ...props
}: FormInputProps) => {
  return (
    <div className={clsx(fullWidth && 'w-full', error && 'has-error')}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}

      <div className="flex">
        {/* Icono izquierdo */}
        {icon && (
          <div
            className={clsx(
              'bg-[#eee] flex justify-center items-center px-3 font-semibold border',
              'ltr:rounded-l-md rtl:rounded-r-md ltr:border-r-0 rtl:border-l-0',
              'border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]',
              disabled && 'opacity-60'
            )}
          >
            <Icono>{icon}</Icono>
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          {...(register && register(name))}
          {...props}
          disabled={disabled}
          className={clsx(
            'form-input w-full',
            icon ? 'ltr:rounded-l-none rtl:rounded-r-none' : 'rounded-md',
            className
          )}
        />
      </div>

      {error && <p className="form-help">{error}</p>}
    </div>
  )
}

export default FormInput
