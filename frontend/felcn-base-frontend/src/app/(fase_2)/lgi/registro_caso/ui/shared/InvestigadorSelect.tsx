'use client'

import { useController } from 'react-hook-form'
import Select from 'react-select'

import { mapInvestigadorToOption } from '../../mappers/registro-caso.mappers'
import type { CatalogOption } from '../../types/registro-caso.types'
import type { InvestigadorGeneralRow } from '../../types/investigadores.types'

type Props = {
  id: string
  name: string
  control: any
  label: string
  investigadores: InvestigadorGeneralRow[]
  error?: string
  isDisable?: boolean
  onSelect?: (inv: InvestigadorGeneralRow | null) => void
}

export function InvestigadorSelect({
  id,
  name,
  control,
  label,
  investigadores,
  error,
  isDisable = false,
  onSelect,
}: Props) {
  const { field } = useController({ name, control })

  const options: Array<CatalogOption<InvestigadorGeneralRow | null>> =
    investigadores.map(mapInvestigadorToOption)

  const valorSeleccionado = field.value
    ? (options.find((option) => option.value === field.value) ?? {
      value: field.value,
      label: field.value,
      original: null,
    })
    : null

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
        {label}
      </label>

      <Select<CatalogOption<InvestigadorGeneralRow | null>>
        instanceId={name}
        inputId={id}
        value={valorSeleccionado}
        options={options}
        isClearable
        isDisabled={isDisable}
        placeholder="Busque por nombre"
        noOptionsMessage={() => 'No hay resultados'}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        classNamePrefix="react-select"
        className={`${error ? 'react-select-error' : ''} w-full !max-w-none`}
        onChange={(option) => {
          field.onChange(option?.value ?? '')
          onSelect?.(option?.original ?? null)
        }}
      />

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}