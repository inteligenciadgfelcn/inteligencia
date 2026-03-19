import React from 'react'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'

export interface optionType {
  id: string
  value: string
  label: string
}

type FormInputDropdownProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  clearable?: boolean
  bgcolor?: string
  options: optionType[]
  labelVariant?: any // ignored in Vristo tailwind implementation
}

export const FormInputDropdown = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  size = 'small',
  rules,
  disabled,
  onChange,
  options,
  clearable,
  bgcolor,
}: FormInputDropdownProps<TFieldValues, TName>) => {
  return (
    <div className="w-full relative">
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <select
              id={id}
              className={`form-select w-full ${error ? '!border-danger' : ''} ${size === 'small' ? 'py-2 text-sm' : ''}`}
              disabled={disabled}
              value={field.value ?? ''}
              onChange={(event) => {
                if (onChange) {
                  onChange(event)
                }
                field.onChange(event)
              }}
              ref={field.ref}
              style={bgcolor ? { backgroundColor: bgcolor } : undefined}
            >
              <option value="" disabled className="text-gray-400">
                Seleccione un dato
              </option>
              {options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.value && clearable && !disabled && (
              <button
                type="button"
                className="absolute right-8 top-[32px] text-gray-500 hover:text-gray-700 dark:text-gray-400"
                onClick={() => field.onChange('')}
              >
                ✕
              </button>
            )}
            {!!error && (
              <span className="mt-1 block text-xs text-danger">{error?.message}</span>
            )}
          </>
        )}
        defaultValue={'' as PathValue<TFieldValues, TName>}
        rules={rules}
      />
    </div>
  )
}
