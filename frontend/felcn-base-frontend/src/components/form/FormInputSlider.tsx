import React, { useCallback } from 'react'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import { InputLabel, Slider, Typography } from '@mui/material'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { Variant } from '@mui/material/styles/createTypography'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'

type FormInputSliderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  setValue: UseFormSetValue<TFieldValues>
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  labelVariant?: Variant
  min?: number
  max?: number
  step?: number
}

export const FormInputSlider = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  setValue,
  label,
  size = 'small',
  rules,
  labelVariant = 'subtitle2',
  min = 0,
  max = 100,
  step = 1,
}: FormInputSliderProps<TFieldValues, TName>) => {
  const handleChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setValue(name, newValue as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
      })
    },
    [setValue, name]
  )

  return (
    <div>
      <InputLabel htmlFor={id}>
        <Typography
          variant={labelVariant}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          {label}
        </Typography>
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Slider
            {...field}
            id={id}
            size={size}
            sx={{ width: '100%' }}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
          />
        )}
      />
    </div>
  )
}
