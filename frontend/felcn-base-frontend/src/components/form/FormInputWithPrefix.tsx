'use client'

import React, { InputHTMLAttributes, ReactNode } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Icono } from '../Icono'

interface InputWithPrefixProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: ReactNode
  icon?: string

  containerClassName?: string
  prefixClassName?: string
  inputClassName?: string

  register?: UseFormRegister<any>
  error?: string
}

const InputWithPrefix: React.FC<InputWithPrefixProps> = ({
  prefix,
  icon,
  containerClassName = '',
  prefixClassName = '',
  inputClassName = '',
  register,
  error,
  name,
  ...inputProps
}) => {
  const showLeftBox = Boolean(prefix || icon)

  return (
    <div className={` ${containerClassName}`}>
      <div className="flex flex-col">
        <div className="flex">
          {/* LEFT BOX */}
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

          {/* INPUT */}
          <input
            {...(register && name
              ? register(name, {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase()
                  },
                })
              : {})}
            {...inputProps}
            name={name}
            className={`form-input flex-1 h-7 font-normal
              ${showLeftBox ? 'ltr:rounded-l-none rtl:rounded-r-none' : ''}
              ${inputClassName}
              ${error ? 'border-danger focus:border-danger' : ''}`}
          />
        </div>

        {/* ERROR */}
        {error && <span className="text-danger text-sm mt-1">{error}</span>}
      </div>
    </div>
  )
}

export default InputWithPrefix
