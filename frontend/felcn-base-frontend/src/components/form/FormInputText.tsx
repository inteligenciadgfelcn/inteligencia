import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import React, { InputHTMLAttributes, useState } from 'react'
import { Icono } from '@/components/Icono'
import { Input } from '@/components/ui/Input'

type FormInputTextProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  size?: 'small' | 'medium'
  type?: InputHTMLAttributes<unknown>['type']
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEnter?: () => void
  clearable?: boolean
  variant?: 'standard' | 'outlined' | 'filled'
  rows?: number
  multiline?: boolean
  bgcolor?: string
  // labelVariant Ignored in Vristo
}

export const FormInputText = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  size = 'small',
  type,
  rules,
  disabled,
  onChange,
  onEnter,
  clearable,
  rows = 1,
  multiline = false,
}: FormInputTextProps<TFieldValues, TName>) => {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return (
    <div className={`w-full ${multiline ? '' : 'custom-file-container'}`}>
      <label
        htmlFor={id}
        className="mb-0 block text-sm font-semibold !text-gray-900 dark:!text-gray-200"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            {multiline ? (
              <textarea
                id={id}
                rows={rows}
                className={`form-textarea w-full !max-w-none ${error ? '!border-danger' : ''}`}
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  if (onChange) onChange(e);
                  field.onChange(e);
                }}
              />
            ) : (
              <div className="flex">
                <Input
                  id={id}
                  type={showPassword ? 'text' : type}
                  size={size === 'small' ? 'sm' : 'md'}
                  className="w-full !max-w-none"
                  error={!!error}
                  disabled={disabled}
                  {...field}
                  onChange={(e) => {
                    if (onChange) onChange(e);
                    field.onChange(e);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && onEnter) {
                      onEnter();
                    }
                  }}
                />
                {/* Icons / Adornments */}
                {type === 'password' && (
                  <button
                    type="button"
                    onClick={handleClickShowPassword}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    {showPassword ? (
                      <Icono>visibility</Icono>
                    ) : (
                      <Icono>visibility_off</Icono>
                    )}
                  </button>
                )}
                {field.value && clearable && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    onClick={() => field.onChange('')}
                  >
                    <Icono>clear</Icono>
                  </button>
                )}
              </div>
            )}

            {!!error && (
              <span className="text-xs text-danger mt-1 block">{error?.message}</span>
            )}
          </div>
        )}
        defaultValue={'' as PathValue<TFieldValues, TName>}
        rules={rules}
      />
    </div>
  )
}
