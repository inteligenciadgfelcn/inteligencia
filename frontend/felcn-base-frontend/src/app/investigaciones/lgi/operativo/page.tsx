'use client'

import { useState } from 'react'
import { FiltrosMisCasos } from '../ui/FiltrosMisCasos'
import { TablaMisCasosOperativos } from '../ui/TablaMisCasosOperativos'
import type {
  BuscarMisCasosLgiParams,
  AsignacionLgiItem,
  OperativoLgiItem,
} from '@/services/lgi/LgiService'

export default function LgiOperativosPage() {
  const [queryParams, setQueryParams] = useState<BuscarMisCasosLgiParams | null>(null)
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])

  const handleSelectOperativo = (asignacion: AsignacionLgiItem, operativo: OperativoLgiItem) => {
    console.log('Operativo seleccionado (sin URI aún):', { asignacion, operativo })
    // TODO: Implementar navegación cuando la URI esté lista
  }

  return (
    <div className="space-y-4">
      <div className="panel flex items-center px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Operativos por Caso — LGI
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Seleccione un caso para ver sus operativos vinculados.
          </p>
        </div>
      </div>

      <div className="panel p-6">
        <FiltrosMisCasos onSearch={setQueryParams} />
      </div>

      {queryParams !== null && (
        <div className="panel p-6">
          <TablaMisCasosOperativos
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
