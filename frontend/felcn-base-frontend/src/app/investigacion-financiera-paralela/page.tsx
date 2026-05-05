'use client'

import { useState } from 'react'
import { GestionOperativoListado } from '../operaciones/operativo/gestion-operativo/ui/GestionOperativoListado'
import { FormInvestigacionParalela } from './ui/FormInvestigacionParalela'
import type { GestionOperativoItem } from '../operaciones/operativo/gestion-operativo/types'
import IconCircleCheck from '@/components/Icon/IconCircleCheck'

export default function InvestigacionFinancieraParalelaPage() {
  const [casoSeleccionado, setCasoSeleccionado] =
    useState<GestionOperativoItem | null>(null)

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
          Investigación Financiera Paralela
        </h2>
      </div>

      <div className="panel p-0">
        <GestionOperativoListado
          tipo="mi-unidad"
          renderAcciones={(row) => (
            <button
              type="button"
              className="text-success hover:text-success/70 transition-colors"
              onClick={() => setCasoSeleccionado(row)}
              title="Seleccionar para Investigación Paralela"
            >
              <IconCircleCheck className="h-5 w-5" />
            </button>
          )}
        />
      </div>
    </div>
  )
}
