'use client'
import { useRouter } from 'next/navigation'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import IconTrash from '@/components/Icon/IconTrash'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { CasosS2iService } from '@/services/analisis'
import type { CasoS2i } from '@/services/analisis'

const formatFecha = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface TablaCasosProps {
  casos: CasoS2i[]
  cargando: boolean
  onRecargar: () => void
}

const ITEMS_POR_PAGINA = 10

export function TablaCasos({ casos, cargando, onRecargar }: TablaCasosProps) {
  const router = useRouter()
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const eliminar = (c: CasoS2i) => {
    confirm({
      texto: `¿Eliminar el caso "${c.nombreCaso}"?`,
      onConfirm: async () => {
        try {
          // El backend no expone DELETE caso en esta versión — placeholder
          Alerta({ mensaje: 'Operación no disponible', variant: 'warning' })
        } catch (e) {
          Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
        }
      },
    })
  }

  const columns: Column<CasoS2i>[] = [
    { accessor: 'nroCasoCer', title: 'Nro. Caso' },
    { accessor: 'descripcionPais', title: 'País' },
    { accessor: 'lugar', title: 'Lugar' },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del Caso',
      render: (r) => (
        <button
          type="button"
          className="text-left text-primary hover:underline"
          onClick={() => router.push(`/analisis/casos/${r.idCaso}`)}
        >
          {r.nombreCaso}
        </button>
      ),
    },
    { accessor: 'descripcionEstadoCaso', title: 'Estado' },
    { accessor: 'descripcionEtapa', title: 'Etapa' },
    { accessor: 'fechaInicio', title: 'Fecha Inicio', render: (r) => formatFecha(r.fechaInicio) },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (r) => (
        <button
          type="button"
          className="text-danger hover:text-danger/80"
          title="Eliminar"
          onClick={(e) => { e.stopPropagation(); eliminar(r) }}
        >
          <IconTrash className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <>
      <ConfirmDialog />
      <div className="datatables">
        <VristoDataTable<CasoS2i>
          loading={cargando}
          rows={casos}
          total={casos.length}
          limit={ITEMS_POR_PAGINA}
          page={1}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={columns}
        />
      </div>
    </>
  )
}
