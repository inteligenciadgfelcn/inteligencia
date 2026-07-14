'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { InvestigacionService } from '@/services/investigacion/InvestigacionService'
import type { BuscarAsignacionParams } from '@/services/investigacion/InvestigacionService'
import IconSearch from '@/components/Icon/IconSearch'

type TipoFiltro =
  | 'todos'
  | 'nroCaso'
  | 'investigador'
  | 'nombreCaso'
  | 'nroCasoPerdidaDominio'
  | 'nroOperativo'

interface BusquedaOperativosProps {
  onSearch: (params: BuscarAsignacionParams) => void
}

const TIPO_FILTRO_OPTIONS = [
  { value: 'todos', label: 'Mis Casos' },
  { value: 'nroCaso', label: 'Por Nro. Caso' },
  { value: 'investigador', label: 'Por Investigador' },
  { value: 'nombreCaso', label: 'Por Nombre del Caso' },
  { value: 'nroCasoPerdidaDominio', label: 'Por Nro. Caso Pérdida de Dominio' },
  { value: 'nroOperativo', label: 'Por Nro. Operativo' },
]

export function BusquedaOperativos({ onSearch }: BusquedaOperativosProps) {
  const { abreviaturaUnidad } = useAuth()
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('todos')
  const [valorFiltro, setValorFiltro] = useState('')

  const { data: investigadoresData, isLoading: isLoadingInvestigadores } = useQuery({
    queryKey: ['investigadores', abreviaturaUnidad, tipoFiltro],
    queryFn: () => InvestigacionService.listarUsuariosUnidad(abreviaturaUnidad ?? ''),
    enabled: tipoFiltro === 'investigador' && !!abreviaturaUnidad,
  })

  const investigadores = Array.isArray(investigadoresData)
    ? investigadoresData
    : (investigadoresData?.datos ?? [])

  const handleSearch = () => {
    const params: BuscarAsignacionParams = {}

    if (tipoFiltro === 'investigador') {
      params.investigador = valorFiltro
      params.abreviaturaUnidad = abreviaturaUnidad ?? ''
    } else {
      params.abreviaturaUnidad = abreviaturaUnidad ?? ''
      if (tipoFiltro === 'nroCaso') params.nroCaso = valorFiltro
      else if (tipoFiltro === 'nombreCaso') params.nombreCaso = valorFiltro
      else if (tipoFiltro === 'nroCasoPerdidaDominio') params.nroCasoPerdidaDominio = valorFiltro
      else if (tipoFiltro === 'nroOperativo') params.nroOperativo = valorFiltro
    }

    onSearch(params)
  }

  const labelFiltroActual = TIPO_FILTRO_OPTIONS.find((o) => o.value === tipoFiltro)?.label

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-72">
        <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
          Tipo de búsqueda
        </label>
        <Select
          value={tipoFiltro}
          options={TIPO_FILTRO_OPTIONS}
          onChange={(e) => {
            setTipoFiltro(e.target.value as TipoFiltro)
            setValorFiltro('')
          }}
        />
      </div>

      {tipoFiltro === 'investigador' ? (
        <div className="w-72">
          <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
            Investigador
          </label>
          <Select
            value={valorFiltro}
            placeholder={isLoadingInvestigadores ? 'Cargando...' : 'Seleccionar...'}
            options={investigadores.map((inv) => ({
              value: inv.usuario,
              label: inv.nombreCompleto,
            }))}
            onChange={(e) => setValorFiltro(e.target.value)}
          />
        </div>
      ) : tipoFiltro !== 'todos' ? (
        <div className="w-72">
          <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
            {labelFiltroActual}
          </label>
          <Input
            value={valorFiltro}
            onChange={(e) => setValorFiltro(e.target.value)}
            uppercase
            placeholder="Ingrese el valor..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>
      ) : null}

      <Button variant="primary" onClick={handleSearch} className="gap-2">
        <IconSearch className="h-4 w-4" />
        Buscar
      </Button>
    </div>
  )
}
