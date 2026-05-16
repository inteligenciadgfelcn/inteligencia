'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { BuscarMisCasosLgiParams } from '@/services/lgi/LgiService'
import IconSearch from '@/components/Icon/IconSearch'

type TipoFiltro =
  | 'misCasos'
  | 'nroCaso'
  | 'nroCasoGiaef'
  | 'nroCasoFis'
  | 'nombreCaso'
  | 'nroCasoPerDom'

const OPCIONES_FILTRO = [
  { value: 'misCasos', label: 'Mis Casos' },
  { value: 'nroCaso', label: 'Por Nro. Caso FELCN' },
  { value: 'nroCasoGiaef', label: 'Por Nro. Caso GIAEF' },
  { value: 'nroCasoFis', label: 'Por Nro. Caso Fiscalía' },
  { value: 'nombreCaso', label: 'Por Nombre del Caso' },
  { value: 'nroCasoPerDom', label: 'Por Nro. Pérdida de Dominio' },
]

interface FiltrosMisCasosProps {
  onSearch: (params: BuscarMisCasosLgiParams) => void
}

export function FiltrosMisCasos({ onSearch }: FiltrosMisCasosProps) {
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('misCasos')
  const [valorFiltro, setValorFiltro] = useState('')

  const handleSearch = () => {
    const params: BuscarMisCasosLgiParams = {}
    if (tipoFiltro === 'nroCaso') params.nroCaso = valorFiltro
    else if (tipoFiltro === 'nroCasoGiaef') params.nroCasoGiaef = valorFiltro
    else if (tipoFiltro === 'nroCasoFis') params.nroCasoFis = valorFiltro
    else if (tipoFiltro === 'nombreCaso') params.nombreCaso = valorFiltro
    else if (tipoFiltro === 'nroCasoPerDom') params.nroCasoPerDom = valorFiltro
    onSearch(params)
  }

  const labelActual = OPCIONES_FILTRO.find((o) => o.value === tipoFiltro)?.label

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-72">
        <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
          Tipo de búsqueda
        </label>
        <Select
          value={tipoFiltro}
          options={OPCIONES_FILTRO}
          onChange={(e) => {
            setTipoFiltro(e.target.value as TipoFiltro)
            setValorFiltro('')
          }}
        />
      </div>

      {tipoFiltro !== 'misCasos' && (
        <div className="w-72">
          <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
            {labelActual}
          </label>
          <Input
            value={valorFiltro}
            onChange={(e) => setValorFiltro(e.target.value)}
            placeholder="Ingrese el valor..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>
      )}

      <Button variant="primary" onClick={handleSearch} className="gap-2">
        <IconSearch className="h-4 w-4" />
        Buscar
      </Button>
    </div>
  )
}
