'use client'

import Select from 'react-select'

export interface OptionType {
  value: string
  label: string
}

interface MultiSelectProps {
  label?: string
  options: OptionType[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  isDisabled?: boolean
  error?: string
}

export const MultiSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccione...',
  isDisabled = false,
  error,
}: MultiSelectProps) => {
  return (
    <div>
      {label && <label className="form-label mb-1 block">{label}</label>}

      <Select
        isMulti
        isSearchable
        instanceId={label}
        isDisabled={isDisabled}
        placeholder={placeholder}
        options={options}
        value={options.filter((o) => value.includes(o.value))}
        onChange={(selected) => onChange(selected.map((item) => item.value))}
        classNamePrefix="react-select"
      />

      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  )
}
