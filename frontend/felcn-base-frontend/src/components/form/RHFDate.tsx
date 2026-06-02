import 'dayjs/locale/es-mx'

import dayjs, { Dayjs } from 'dayjs'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
  RegisterOptions,
} from 'react-hook-form'

import { validarFechaFormato } from '@/utils/fechas'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  size?: 'small' | 'medium'
  format?: string
  disabled?: boolean
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  bgcolor?: string
  minDate?: Dayjs
  maxDate?: Dayjs
  desktopModeMediaQuery?: string
  clearable?: boolean
}

export const RHFDate = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  size = 'small',
  format = 'DD/MM/YYYY',
  disabled,
  rules,
  bgcolor,
  minDate,
  maxDate,
  desktopModeMediaQuery = '',
  clearable,
}: Props<TFieldValues, TName>) => {
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
            <div className="flex-col">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={'es-mx'}
              >
                <DatePicker
                  onChange={(value) => {
                    field.onChange(
                      value ? dayjs(value).format('YYYY-MM-DD') : ''
                    )
                  }}
                  value={field.value ? dayjs(field.value) : null}
                  ref={field.ref}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabled={disabled}
                  desktopModeMediaQuery={desktopModeMediaQuery}
                  className="w-full !max-w-none !mt-0"
                  slotProps={{
                    textField: {
                      id,
                      size,
                      name,
                      error: !!error,
                    },
                    field: {
                      clearable: clearable,
                      onClear: () => field.onChange(''),
                      sx: { width: '100%', bgcolor: bgcolor },
                    },
                  }}
                />
              </LocalizationProvider>
              {!!error && (
                <span className="text-xs text-danger mt-1 block">
                  {error?.message}
                </span>
              )}
            </div>
          </div>
        )}
        rules={{
          ...{
            validate: (val?: string) => {
              if (val && !validarFechaFormato(val, format)) {
                return 'La fecha no es válida'
              }
            },
          },
          ...rules,
        }}
        defaultValue={'' as PathValue<TFieldValues, TName>}
      />
    </div>
  )
}
