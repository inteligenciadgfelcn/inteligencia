'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'

import { CasoDetalleApi } from '../api/caso-detalle.api'
import { DatosCasoPanel } from './DatosCasoPanel'
import { MenuVertical } from './MenuVertical'
import type { MenuOption } from './MenuVertical'
import { PersonasInvestigadas } from './PersonasInvestigadas'
import { ActuacionesRealizadas } from './ActuacionesRealizadas'
import { BienesIdentificados } from './BienesIdentificados'
import { PersonasJuridicas } from './PersonasJuridicas'
import { ConclusionCaso } from './ConclusionCaso'

type Props = {
  casoId: string
}

const bodyMap: Record<
  MenuOption,
  React.ComponentType<{ casoId: number; onSelect?: (option: MenuOption) => void }>
> = {
  'personas-investigadas': PersonasInvestigadas,
  'actuaciones-realizadas': ActuacionesRealizadas,
  'bienes-identificados': BienesIdentificados,
  'personas-juridicas': PersonasJuridicas,
  'conclusion-caso': ConclusionCaso,
}

export function CasoDetallePage({ casoId }: Props) {
  const [activeOption, setActiveOption] =
    useState<MenuOption>('personas-investigadas')

  const {
    data: caso,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['lgi-caso-detalle', casoId],
    queryFn: () => CasoDetalleApi.obtenerCasoDetalle(casoId),
  })

  const BodyComponent = bodyMap[activeOption]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Cargando datos del caso...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-red-500">
          Error al cargar el caso: {error?.message ?? 'Error desconocido'}
        </p>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => history.back()}
        >
          Volver
        </Button>
      </div>
    )
  }

  if (!caso) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-gray-500">No se encontró el caso.</p>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => history.back()}
        >
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Detalle del Caso
            </p>
            <h2 className="mt-1 text-xl font-bold text-dark dark:text-white-light">
              {caso.nombreCaso}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              ID {caso.casosId} &middot; {caso.estado}
            </p>
          </div>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => history.back()}
          >
            Volver
          </Button>
        </div>
      </div>

      <DatosCasoPanel caso={caso} />

      <div className="flex flex-col gap-4 lg:flex-row">
        <MenuVertical
          activeOption={activeOption}
          onSelect={setActiveOption}
        />
        <div className="min-w-0 flex-1">
          <BodyComponent
            casoId={Number(casoId)}
            onSelect={setActiveOption}
          />
        </div>
      </div>
    </div>
  )
}
