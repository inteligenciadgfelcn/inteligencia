import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { InputLabel, Typography } from '@mui/material'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import 'dayjs/locale/es-mx'
import { validarFechaFormato } from '@/utils/fechas'
import { Variant } from '@mui/material/styles/createTypography'
import dayjs, { Dayjs } from 'dayjs'

type FormDatePickerProps<
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
  labelVariant?: Variant
  desktopModeMediaQuery?: string
  clearable?: boolean
}

export const FormInputDate = <
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
  labelVariant = 'subtitle2',
  desktopModeMediaQuery = '',
  clearable,
}: FormDatePickerProps<TFieldValues, TName>) => {
  return (
    <div>
      <InputLabel htmlFor={id} sx={{ mb: 0 }}>
        <Typography
          variant={labelVariant}
          sx={{ pb:0, color: 'text.primary', fontWeight: '500' }}
        >
          {label}
        </Typography>
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={'es-mx'}
          >
            <DatePicker
              onChange={field.onChange}
              value={field.value ? dayjs(field.value) : dayjs()}
              ref={field.ref}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              desktopModeMediaQuery={desktopModeMediaQuery}
              slotProps={{
                textField: {
                  id,
                  size,
                  name,
                  error: !!error,
                },
                field: {
                  clearable: clearable,
                  onClear: () => field.onChange(true),
                  sx: { width: '100%', bgcolor: bgcolor },
                },
              }}
            />
          </LocalizationProvider>
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
