import React from 'react'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteRenderOptionState,
  Box,
  CircularProgress,
  FilterOptionsState,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import { OutlinedInputProps } from '@mui/material/OutlinedInput'
import { Icono } from '@/components/Icono'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'

export interface BaseOptionType {
  id: string
  value: string
  label: string
}

type FormInputDropdownAutocompleteProps<
  K extends BaseOptionType,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  multiple?: boolean
  freeSolo?: boolean
  forcePopupIcon?: boolean
  searchIcon?: boolean
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
  onChange?: (keys: unknown) => void
  InputProps?: Partial<OutlinedInputProps>
  filterOptions?: (options: K[], state: FilterOptionsState<K>) => K[]
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void
  isOptionEqualToValue?: (option: K | string, value: K | string) => boolean
  getOptionLabel: (option: K | string) => string
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: K | string,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode
  newValues?: boolean
  clearable?: boolean
  bgcolor?: string
  loading?: boolean
  selectOnFocus?: boolean
  options: K[]
  labelVariant?: Variant
}

export const FormInputAutocomplete = <
  K extends BaseOptionType,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  multiple,
  freeSolo,
  forcePopupIcon,
  searchIcon,
  size = 'small',
  rules,
  disabled,
  onChange,
  InputProps,
  filterOptions,
  onInputChange,
  isOptionEqualToValue,
  getOptionLabel,
  renderOption,
  newValues,
  options,
  bgcolor,
  loading,
  selectOnFocus,
  labelVariant = 'subtitle2',
}: FormInputDropdownAutocompleteProps<K, TFieldValues, TName>) => {
  return (
    <>
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
        defaultValue={null as PathValue<TFieldValues, TName>}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Autocomplete
              id={id}
              multiple={multiple}
              freeSolo={freeSolo}
              forcePopupIcon={forcePopupIcon}
              size={size}
              disabled={disabled}
              value={field.value || ''}
              options={options}
              selectOnFocus={selectOnFocus}
              filterSelectedOptions={true}
              filterOptions={filterOptions}
              onInputChange={(event, newInputValue, reason) => {
                if (onInputChange) {
                  onInputChange(event, newInputValue, reason)
                }
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof option === 'string' || typeof value === 'string') {
                  return option === value
                }
                return isOptionEqualToValue
                  ? isOptionEqualToValue(option, value)
                  : option.id === value.id
              }}
              onChange={(_event, newValue) => {
                if (onChange) {
                  onChange(newValue)
                }
                field.onChange(newValue)
              }}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option
                return getOptionLabel(option)
              }}
              renderOption={renderOption}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!error}
                  inputRef={field.ref}
                  sx={{
                    width: '100%',
                    bgcolor: bgcolor,
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      startAdornment: (
                        <>
                          {searchIcon && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                pl: 1,
                              }}
                            >
                              <Icono color="secondary" fontSize="small">
                                search
                              </Icono>
                            </Box>
                          )}
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    },
                  }}
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (InputProps?.onKeyDown) {
                      InputProps.onKeyDown(event)
                    }
                    if (!newValues) {
                      event.stopPropagation()
                      return
                    }
                    if (event.key === 'Enter' || event.key === ',') {
                      event.preventDefault()
                      const inputElement = event.currentTarget
                      if (
                        inputElement &&
                        typeof inputElement.value === 'string'
                      ) {
                        const inputValue = inputElement.value.trim()
                        if (inputValue) {
                          const newOption = {
                            id: inputValue,
                            value: inputValue,
                            label: inputValue,
                          } as K
                          if (!multiple) {
                            field.onChange(newOption)
                          } else {
                            const currentOptions = Array.isArray(field.value)
                              ? field.value
                              : []
                            if (
                              !currentOptions.some(
                                (opt: K) => opt.id === newOption.id
                              )
                            ) {
                              field.onChange([...currentOptions, newOption])
                            }
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            />
            {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
          </>
        )}
      />
    </>
  )
}
