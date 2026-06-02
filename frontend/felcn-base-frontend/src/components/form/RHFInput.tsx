import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
  RegisterOptions,
} from 'react-hook-form'
import React, { InputHTMLAttributes, useState } from 'react'
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
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onEnter?: () => void
  clearable?: boolean
  variant?: 'standard' | 'outlined' | 'filled'
}

export const RHFInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  size = 'medium',
  type = 'text',
  rules,
  disabled,
  onChange,
  onEnter,
}: FormInputTextProps<TFieldValues, TName>) => {
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
              <Input
                id={id}
                type={type}
                size={size === 'small' ? 'sm' : 'md'}
                className="w-full !max-w-none"
                error={!!error}
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  if (onChange) onChange(e)
                  field.onChange(e)
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && onEnter) {
                    onEnter()
                  }
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
        defaultValue={'' as PathValue<TFieldValues, TName>}
        rules={rules}
      />
    </div>
  )
}
