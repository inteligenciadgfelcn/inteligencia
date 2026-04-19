'use client'

import { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { Icono } from '../Icono'
import { imprimir } from '@/utils/imprimir'

type AsyncSearchSelectProps<T> = {
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

export function AsyncSearchSelect<T>({
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
}: AsyncSearchSelectProps<T>) {
  const showLeftBox = Boolean(prefix || iconName)

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '28px',
      height: '28px',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '28px',
      padding: '0 8px',
      minWidth: 0,
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '28px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      minWidth: 0,
    }),
  }

  const options = originalData.map(mapOption)

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex">
          {showLeftBox && (
            <div
              className={`bg-[#eee] flex items-center gap-2
                ltr:rounded-l-md rtl:rounded-r-md 
                px-1.5 font-semibold border 
                ltr:border-r-0 rtl:border-l-0 
                border-white-light 
                dark:border-[#17263c] 
                dark:bg-[#1b2e4b]
                ${prefixClassName}
                ${error ? 'border-danger' : ''}`}
            >
              {iconName && <Icono fontSize="large">{iconName}</Icono>}
              {prefix && <span className="text-xs">{prefix}</span>}
            </div>
          )}

          <div className="flex-1 h-7 min-w-0">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? null}
                  isClearable
                  placeholder=""
                  noOptionsMessage={() => 'No hay resultados'}
                  options={options}
                  classNamePrefix="react-select"
                  className={`${error ? 'react-select-error' : ''} h-7 w-full`}
                  styles={customStyles}
                  isDisabled={isDisable}
                  onChange={(option) => {
                    field.onChange(option ?? null)
                    onValueChange?.(option)
                  }}
                />
              )}
            />
          </div>
        </div>

        {error && <span className="text-danger text-sm mt-1">{error}</span>}
      </div>
    </div>
  )
}
