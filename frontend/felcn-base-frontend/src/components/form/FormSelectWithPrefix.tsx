'use client'

import React, { ReactNode } from 'react'
import { Icono } from '../Icono'
import { Controller } from 'react-hook-form'
import AsyncSelect from 'react-select/async'

import { Control } from 'react-hook-form'

/** How to use this component
 * const { control } = useForm();
 *
 * const loadOptions = async (inputValue: string) => {
 *    const response = await fetch(
 *      `https://api.example.com/users?search=${inputValue}`
 *    );
 *    const data = await response.json();
 *
 *    return data.map(user => ({
 *      value: user.id,
 *      label: user.name
 *    }));
 * };
 *
 * <SelectWithPrefix
 *    name="usuario"
 *    control={control}
 *    prefix="USR"
 *    loadOptions={loadOptions}
 *    error={errors.usuario?.message}
 * />
 */

interface SelectWithPrefixProps {
  prefix?: ReactNode
  icon?: string

  containerClassName?: string
  prefixClassName?: string
  inputClassName?: string

  name: string
  control: Control<any>
  error?: string
  disabled?: boolean

  loadOptions?: (
    inputValue: string
  ) => Promise<{ value: string; label: string }[]>
  optionsCache?: { [key: string]: string }
}

const SelectWithPrefix: React.FC<SelectWithPrefixProps> = ({
  prefix,
  icon,
  containerClassName = '',
  prefixClassName = '',
  inputClassName = '',
  name,
  control,
  error,
  disabled = false,
  loadOptions,
  optionsCache = {},
  ...inputProps
}) => {
  const showLeftBox = Boolean(prefix || icon)

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
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '28px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
    }),
  }

  return (
    <div className={` ${containerClassName}`}>
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
              {icon && <Icono fontSize="large">{icon}</Icono>}

              {prefix && <span className="text-xs">{prefix}</span>}
            </div>
          )}

          <div className="flex-1 h-7">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  cacheOptions={false}
                  defaultOptions={true}
                  loadOptions={loadOptions}
                  placeholder=""
                  value={
                    field.value
                      ? {
                          value: field.value,
                          label: optionsCache[field.value].toUpperCase() || field.value.toUpperCase(),
                        }
                      : null
                  }
                  isDisabled={disabled}
                  onChange={(selected) =>
                    field.onChange(selected ? selected.value : '')
                  }
                  onBlur={field.onBlur}
                  inputId={name}
                  classNamePrefix="react-select"
                  className={`${error ? 'react-select-error' : ''} h-7`}
                  styles={customStyles}
                />
              )}
            />
          </div>
        </div>

        {/* ERROR */}
        {error && <span className="text-danger text-sm mt-1">{error}</span>}
      </div>
    </div>
  )
}

export default SelectWithPrefix
