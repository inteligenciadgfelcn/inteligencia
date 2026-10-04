'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

import { PersonasInvestigadas } from '../../../caso_detalle/ui/PersonasInvestigadas'

type Props = {
  casoId?: number | null
  isLectura?: boolean
  onIrDatosGenerales: () => void
  onSiguiente: () => void
}

export function PersonasTab({
  casoId,
  isLectura = false,
  onIrDatosGenerales,
  onSiguiente,
}: Props) {
  if (!casoId) {
    return (
      <Card title="Personas investigadas">
        <p className="text-sm text-gray-500">
          Primero registre los datos generales del caso para poder agregar
          personas investigadas.
        </p>
        <div className="mt-4">
          <Button type="button" variant="primary" onClick={onIrDatosGenerales}>
            Ir a datos generales
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <PersonasInvestigadas casoId={casoId} isLectura={isLectura} />

      {!isLectura && (
        <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onIrDatosGenerales}
          >
            Volver
          </Button>
          <Button type="button" variant="primary" onClick={onSiguiente}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}