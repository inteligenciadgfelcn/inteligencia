'use client'

import clsx from 'clsx'
import { Icono } from '@/components/Icono'

interface SelectOption {
  value: string
  label: string
}

interface SelectWithIconFieldProps {
  label?: string
  name: string
  options: SelectOption[]
  register?: any
  error?: string
  disabled?: boolean
  placeholder?: string
  fullWidth?: boolean
  value?: string
  defaultIcon?: string
  onChange?: (value: string, label: string) => void
}

const SelectWithIconField = ({
  label,
  name,
  options,
  register,
  error,
  disabled,
  placeholder = 'Seleccione una opción',
  fullWidth = true,
  value,
  defaultIcon,
  onChange,
}: SelectWithIconFieldProps) => {
  const iconToShow = value || defaultIcon

  // obtenemos handlers reales de RHF
  const registerField = register ? register(name) : {}

  return (
    <div className={clsx(fullWidth && 'w-full', error && 'has-error')}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}

      <div className="flex">
        {/* Icono */}
        {iconToShow && (
          <div
            className={clsx(
              'bg-[#eee] flex justify-center items-center px-3 font-semibold border',
              'ltr:rounded-l-md rtl:rounded-r-md ltr:border-r-0 rtl:border-l-0',
              'border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]',
              disabled && 'opacity-60'
            )}
          >
            <Icono>{iconToShow}</Icono>
          </div>
        )}

        {/* Select */}
        <select
          id={name}
          value={value || ''}
          {...registerField}
          disabled={disabled}
          className={clsx(
            'form-select w-full',
            iconToShow ? 'ltr:rounded-l-none rtl:rounded-r-none' : 'rounded-md'
          )}
          onChange={(e) => {
            registerField.onChange?.(e)

            const v = e.target.value
            const lbl = options.find((o) => o.value === v)?.label || ''
            onChange?.(v, lbl)
          }}
        >
          <option value="">{placeholder}</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="form-help">{error}</p>}
    </div>
  )
}

export default SelectWithIconField
