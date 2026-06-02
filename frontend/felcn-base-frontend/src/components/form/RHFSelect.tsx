'use client'

import { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { Icono } from '../Icono'

type Props<T> = {
  id: string
  label: string
  prefix?: ReactNode
  iconName?: string
  error?: string
  prefixClassName?: string
  isDisable?: boolean

  name: string
  control: any
  originalData: T[]
  mapOption: (item: T) => { label: string; value: any; original: T }

  onValueChange?: (option: { label: string; value: any; original: T }) => void
}

export function RHFSelect<T>({
  id,
  label,
  prefix,
  iconName,
  error,
  prefixClassName,
  isDisable = false,
  name,
  control,
  originalData,
  mapOption,
  onValueChange,
}: Props<T>) {
  const options = originalData.map(mapOption)

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-white-dark">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <div className="flex">
              <Select
                {...field}
                instanceId={name}
                value={field.value ?? null}
                isClearable
                placeholder=""
                noOptionsMessage={() => 'No hay resultados'}
                options={options}
                classNamePrefix="react-select"
                className={`${error ? 'react-select-error' : ''} w-full !max-w-none`}
                isDisabled={isDisable}
                onChange={(option) => {
                  field.onChange(option ?? null)
                  onValueChange?.(option)
                }}
              />
            </div>
            {!!error && (
              <span className="text-xs text-danger mt-1 block">
                {error?.message}
              </span>
            )}
          </div>
        )}
      />
    </div>
  )
}
