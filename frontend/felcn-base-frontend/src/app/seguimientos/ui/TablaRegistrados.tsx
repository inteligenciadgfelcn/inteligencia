'use client'

import { useRouter } from 'next/navigation'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import type { AsignacionIngresoItem } from '@/services/seguimiento/AsignacionesIngresoService'
import { ReportesSeguimientoService } from '@/services/reportes/ReportesSeguimientoService'
import { sesionPeticion } from '@/utils/peticion'
import { InterpreteMensajes } from '@/utils'
import { useAlerts } from '@/hooks/useAlerts'
import IconPrinter from '@/components/Icon/IconPrinter'

interface TablaRegistradosProps {
  rows: AsignacionIngresoItem[]
  total: number
  loading: boolean
  page: number
  limit: number
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
}

export function TablaRegistrados({
  rows,
  total,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: TablaRegistradosProps) {
  const router = useRouter()
  const { Alerta } = useAlerts()

  const descargarPdfSeguimiento = async (idCaso: string) => {
    try {
      const url = ReportesSeguimientoService.urlPdf(idCaso)
      const blob = await sesionPeticion<Blob>({ url, responseType: 'blob' })
      const objectUrl = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = objectUrl
      enlace.download = `seguimiento-caso-${idCaso}.pdf`
      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    }
  }

  return (
    <VristoDataTable<AsignacionIngresoItem>
      rows={rows}
      total={total}
      loading={loading}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      columns={[
        { accessor: 'unidad', title: 'Unidad' },
        { accessor: 'distrital', title: 'Distrital' },
        { accessor: 'grupo', title: 'Grupo' },
        { accessor: 'numeroCaso', title: 'Nro. Caso' },
        { accessor: 'numeroCasoPerDom', title: 'Pérdida de Dominio' },
        { accessor: 'nroOperativo', title: 'Nro. Operativo' },
        { accessor: 'nombreCaso', title: 'Nombre Operativo' },
        { accessor: 'asignadoCaso', title: 'Asignado al Caso' },
        { accessor: 'fiscalAsignadoCaso', title: 'Fiscal Asignado' },
        {
          accessor: 'idCaso',
          title: 'Acciones',
          render: (row) => (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="text-primary hover:text-primary/70 transition-colors"
                onClick={() => router.push(`/seguimientos/${row.idCaso}`)}
                title="Ingresar al Seguimiento"
              >
                <Icono className="w-5 h-5">edit</Icono>
              </button>
              <button
                type="button"
                className="text-success hover:text-success/70 transition-colors"
                onClick={() => void descargarPdfSeguimiento(row.idCaso)}
                title="Descargar PDF de Seguimiento"
              >
                <IconPrinter className="h-5 w-5" />
              </button>
            </div>
          ),
        },
      ]}
    />
  )
}
