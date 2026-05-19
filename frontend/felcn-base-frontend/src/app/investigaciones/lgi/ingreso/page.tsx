'use client'

import { useState } from 'react'
import { FiltrosMisCasos } from '../ui/FiltrosMisCasos'
import { TablaMisCasosIngreso } from '../ui/TablaMisCasosIngreso'
import type { BuscarMisCasosLgiParams } from '@/services/lgi/LgiService'

export default function LgiIngresoPage() {
  const [queryParams, setQueryParams] = useState<BuscarMisCasosLgiParams | null>(null)

  return (
    <div className="space-y-4">
      <div className="panel flex items-center px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Ingreso de Información del Caso — LGI
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Seleccione un caso para ingresar o editar su información.
          </p>
        </div>
      </div>

      <div className="panel p-6">
        <FiltrosMisCasos onSearch={setQueryParams} />
      </div>

      {queryParams !== null && (
        <div className="panel p-6">
          <TablaMisCasosIngreso queryParams={queryParams} />
        </div>
      )}
    </div>
  )
}
