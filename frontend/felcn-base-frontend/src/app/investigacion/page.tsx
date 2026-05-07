'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { BusquedaCasos } from './ui/BusquedaCasos'
import { TablaAsignacion } from './ui/TablaAsignacion'
import { FormInvestigacionParalela } from '../investigacion-financiera-paralela/ui/FormInvestigacionParalela'
import type { BuscarAsignacionParams, AsignacionItem, OperativoItem } from '@/services/investigacion/InvestigacionService'
import type { GestionOperativoItem } from '../operaciones/operativo/gestion-operativo/types'

export default function InvestigacionPage() {
  const router = useRouter()
  const [queryParams, setQueryParams] = useState<BuscarAsignacionParams | null>(null)
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])
  const [casoSeleccionado, setCasoSeleccionado] = useState<GestionOperativoItem | null>(null)

  const handleSelectOperativo = (asignacion: AsignacionItem, operativo: OperativoItem) => {
    setCasoSeleccionado({
      idCaso: asignacion.id,
      numeroCaso: asignacion.numeroCaso,
      numeroCasoPerDom: '',
      numeroOperativo: String(operativo.id),
      nombreCaso: asignacion.nombreCaso,
      unidadDescripcion: asignacion.unidad,
      distritaleDescripcion: asignacion.distrital,
      grupoDescripcion: '',
      asignadoCaso: asignacion.asignadoCaso,
      fiscalAsignadoCaso: asignacion.fiscalAsignadoCaso,
      idDepartamentoCaso: asignacion.idDepartamentoCaso,
      abreviaturaUnidad: asignacion.abreviaturaUnidad,
      idDistrital: asignacion.idDistrital,
      idGrupo: asignacion.idGrupo,
      idOperativo: operativo.id,
      numeroInforme: operativo.nroInforme,
      fechaOperativo: operativo.fechaOperativo,
      descripcionOperativo: operativo.relacionHecho,
    })
  }

  if (casoSeleccionado) {
    return (
      <FormInvestigacionParalela
        caso={casoSeleccionado}
        onBack={() => setCasoSeleccionado(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="panel flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Investigación Paralela
        </h2>
        <Button
          variant="outline-primary"
          onClick={() => router.push('/investigacion/listado')}
        >
          Casos Registrados
        </Button>
      </div>

      <div className="panel p-6">
        <BusquedaCasos onSearch={setQueryParams} />
      </div>

      {queryParams !== null && (
        <div className="panel p-6">
          <TablaAsignacion
            queryParams={queryParams}
            expandedIds={expandedIds}
            onExpandChange={setExpandedIds}
            onSelectOperativo={handleSelectOperativo}
          />
        </div>
      )}
    </div>
  )
}
