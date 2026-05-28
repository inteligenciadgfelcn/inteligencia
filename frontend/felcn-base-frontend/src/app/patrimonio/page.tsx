'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BusquedaOperativos } from './ui/BusquedaOperativos'
import { TablaAsignacionPatrimonio } from './ui/TablaAsignacionPatrimonio'
import type { BuscarAsignacionParams, AsignacionItem, OperativoItem } from '@/services/investigacion/InvestigacionService'

export default function PatrimonioPage() {
  const router = useRouter()
  const [queryParams, setQueryParams] = useState<BuscarAsignacionParams | null>(null)
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])

  const handleSelectOperativo = (_asignacion: AsignacionItem, operativo: OperativoItem) => {
    router.push(`/operativos/bienes/patrimonio?caso=${operativo.id}`)
  }

  return (
    <div className="space-y-4">
      <div className="panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-primary">Cálculo de Patrimonio</h2>
        </div>
      </div>

      <div className="panel p-6">
        <BusquedaOperativos onSearch={setQueryParams} />
      </div>

      {queryParams !== null && (
        <div className="panel p-6">
          <TablaAsignacionPatrimonio
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
