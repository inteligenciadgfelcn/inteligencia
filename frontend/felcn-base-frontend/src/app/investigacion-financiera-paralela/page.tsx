'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GestionOperativoListado } from '../operaciones/operativo/gestion-operativo/ui/GestionOperativoListado'
import { FormInvestigacionParalela } from './ui/FormInvestigacionParalela'
import type { GestionOperativoItem } from '../operaciones/operativo/gestion-operativo/types'
import { Button } from '@/components/ui/Button'
import { ExpansionContenidoAsignacion } from './ui/ExpansionContenidoAsignacion'

export default function InvestigacionFinancieraParalelaPage() {
  const router = useRouter()
  const [casoSeleccionado, setCasoSeleccionado] =
    useState<GestionOperativoItem | null>(null)
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])

  const handleSelectOperativo = (
    asignacion: GestionOperativoItem,
    operativo: any
  ) => {
    // Combinamos los datos de la asignación con los del operativo seleccionado
    setCasoSeleccionado({
      ...asignacion,
      idOperativo: operativo.idOperativo,
      numeroOperativo: operativo.idOperativo, // Para que el formulario use este ID
      numeroInforme: operativo.numeroInforme,
      fechaOperativo: operativo.fechaOperativo,
      descripcionOperativo: operativo.descripcionOperativo,
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
          Investigación Financiera Paralela
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="primary">
            Seleccionar Caso
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => router.push('/investigacion-financiera-paralela/listado')}
          >
            Investigaciones Registradas
          </Button>
        </div>
      </div>

      <div className="panel p-6">
        <GestionOperativoListado
          tipo="mi-unidad"
          hideActions
          rowExpansion={{
            idField: 'idCaso',
            expandedIds,
            onExpandChange: setExpandedIds,
            renderContent: (row) => (
              <ExpansionContenidoAsignacion
                asignacion={row}
                onSelectOperativo={handleSelectOperativo}
              />
            ),
          }}
        />
      </div>
    </div>
  )
}
