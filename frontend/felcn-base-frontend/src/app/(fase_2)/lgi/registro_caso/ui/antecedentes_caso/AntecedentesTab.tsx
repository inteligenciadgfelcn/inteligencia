'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { RHFDate } from '@/components/form/RHFDate'

import type { ConsultaSiiiQueryDto } from '../../types/siii.types'
import { ResultadosBusquedaSiii } from './ResultadosBusquedaSiii'
import { CasosRelacionados } from './CasosRelacionados'

interface BusquedaSiiiFiltros {
  fechaInicio: string
  fechaFin: string
  nombreCaso: string
  nombresPersona: string
  apellidoPaterno: string
  apellidoMaterno: string
  nroDocumento: string
}

type Props = {
  casoId?: number | null
  isLectura?: boolean
  onVolver: () => void
  onSiguiente: () => void
}

export function AntecedentesTab({
  casoId,
  isLectura = false,
  onVolver,
  onSiguiente,
}: Props) {
  const [filtroSiii, setFiltroSiii] = useState<ConsultaSiiiQueryDto | null>(
    null
  )

  const filtroSiiiForm = useForm<BusquedaSiiiFiltros>({
    defaultValues: {
      fechaInicio: '',
      fechaFin: '',
      nombreCaso: '',
      nombresPersona: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nroDocumento: '',
    },
  })

  const {
    register: registerFiltroSiii,
    control: controlFiltroSiii,
  } = filtroSiiiForm

  const onBuscarSiii = () => {
    const valores = filtroSiiiForm.getValues()
    setFiltroSiii({
      fechaInicio: valores.fechaInicio || undefined,
      fechaFin: valores.fechaFin || undefined,
      nombreCaso: valores.nombreCaso || undefined,
      nombresPersona: valores.nombresPersona || undefined,
      apellidoPaterno: valores.apellidoPaterno || undefined,
      apellidoMaterno: valores.apellidoMaterno || undefined,
      nroDocumento: valores.nroDocumento || undefined,
    })
  }

  return (
    <div className="space-y-4">
      <Card title="Búsqueda avanzada de SSCC">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <RHFDate
            id="filtroFechaInicio"
            name="fechaInicio"
            control={controlFiltroSiii}
            label="Fecha operativo desde"
            disabled={isLectura}
          />

          <RHFDate
            id="filtroFechaFin"
            name="fechaFin"
            control={controlFiltroSiii}
            label="Fecha operativo hasta"
            disabled={isLectura}
          />

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Nombre del caso
            </label>
            <Input
              {...registerFiltroSiii('nombreCaso')}
              disabled={isLectura}
              className="w-full"
              placeholder="Nombre del caso"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Nombres persona
            </label>
            <Input
              {...registerFiltroSiii('nombresPersona')}
              disabled={isLectura}
              className="w-full"
              placeholder="Nombres de la persona implicada"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Apellido paterno
            </label>
            <Input
              {...registerFiltroSiii('apellidoPaterno')}
              disabled={isLectura}
              className="w-full"
              placeholder="Apellido paterno"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Apellido materno
            </label>
            <Input
              {...registerFiltroSiii('apellidoMaterno')}
              disabled={isLectura}
              className="w-full"
              placeholder="Apellido materno"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Nro documento
            </label>
            <Input
              {...registerFiltroSiii('nroDocumento')}
              disabled={isLectura}
              className="w-full"
              placeholder="Nro de documento"
            />
          </div>
        </div>

        {!isLectura && (
          <div className="mt-4 flex justify-end gap-3">
            {filtroSiii && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setFiltroSiii(null)}
              >
                Limpiar búsqueda
              </Button>
            )}
            <Button type="button" variant="primary" onClick={onBuscarSiii}>
              Buscar
            </Button>
          </div>
        )}
      </Card>

      {filtroSiii ? (
        <ResultadosBusquedaSiii
          filtro={filtroSiii}
          casoId={casoId}
          isLectura={isLectura}
        />
      ) : (
        <CasosRelacionados casoId={casoId} isLectura={isLectura} />
      )}

      {!isLectura && (
        <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
          <Button type="button" variant="outline-secondary" onClick={onVolver}>
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