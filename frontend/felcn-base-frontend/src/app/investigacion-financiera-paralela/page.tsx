'use client'

import { useState } from 'react'
import { GestionOperativoListado } from '../operaciones/operativo/gestion-operativo/ui/GestionOperativoListado'
import { FormInvestigacionParalela } from './ui/FormInvestigacionParalela'
import { ListadoInvestigacionParalela } from './ui/ListadoInvestigacionParalela'
import type { GestionOperativoItem } from '../operaciones/operativo/gestion-operativo/types'
import { Button } from '@/components/ui/Button'
import IconCircleCheck from '@/components/Icon/IconCircleCheck'

export default function InvestigacionFinancieraParalelaPage() {
  const [view, setView] = useState<'pendientes' | 'registrados'>('pendientes')
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
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'pendientes' ? 'primary' : 'outline-primary'}
            onClick={() => setView('pendientes')}
          >
            Seleccionar Caso
          </Button>
          <Button
            variant={view === 'registrados' ? 'primary' : 'outline-primary'}
            onClick={() => setView('registrados')}
          >
            Investigaciones Registradas
          </Button>
        </div>
      </div>

      <div className="panel p-6">
        {view === 'pendientes' ? (
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
        ) : (
          <ListadoInvestigacionParalela />
        )}
      </div>
    </div>
  )
}
