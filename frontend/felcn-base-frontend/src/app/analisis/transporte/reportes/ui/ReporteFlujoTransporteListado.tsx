'use client'

import { useMemo, useState } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesFlujoTransporteService } from '@/services/analisis'
import type {
  FiltroFlujoTransporteReporte,
  FlujoTransporteReporteFila,
} from '@/services/analisis'

interface Props {
  filas: FlujoTransporteReporteFila[]
  filtro: FiltroFlujoTransporteReporte
  cargando: boolean
}

/** Agrega alfa (~25%) al hexadecimal del color para pintar la fila sin tapar el texto. */
const fondoFila = (hex: string | null) => (hex ? `${hex}40` : undefined)

const formatFechaHora = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
}

export function ReporteFlujoTransporteListado({ filas, filtro, cargando }: Props) {
  const { Alerta } = useAlerts()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [descargando, setDescargando] = useState(false)

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return filas
    const q = search.toLowerCase()
    return filas.filter(
      (f) =>
        f.numeroDocumento?.toLowerCase().includes(q) ||
        f.codigoTransporte?.toLowerCase().includes(q) ||
        f.conductorNombreCompleto?.toLowerCase().includes(q) ||
        f.lugarDescripcion?.toLowerCase().includes(q) ||
        f.colorNombre?.toLowerCase().includes(q),
    )
  }, [filas, search])

  const total = filasFiltradas.length
  const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

  const descargarPdf = async () => {
    if (descargando) return
    setDescargando(true)
    try {
      const blob = await ReportesFlujoTransporteService.descargarPdf(filtro)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'reporte-flujo-transporte.pdf'
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setDescargando(false)
    }
  }

  const columns: Column<FlujoTransporteReporteFila>[] = useMemo(
    () => [
      {
        accessor: 'fechaHora',
        title: 'Fecha y hora',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {formatFechaHora(row.fechaHora)}
          </span>
        ),
      },
      {
        accessor: 'numeroDocumento',
        title: 'Conductor',
        sortable: true,
        render: (row) => (
          <div>
            <div className="font-semibold text-dark dark:text-white">{row.numeroDocumento}</div>
            <div className="text-xs text-gray-500">{row.conductorNombreCompleto || '-'}</div>
          </div>
        ),
      },
      {
        accessor: 'codigoTransporte',
        title: 'Transporte',
        sortable: true,
        render: (row) => (
          <div>
            <div className="font-semibold text-dark dark:text-white">{row.codigoTransporte}</div>
            <div className="text-xs text-gray-500">
              {[row.transporteMarca, row.transporteModelo].filter(Boolean).join(' ') || '-'}
            </div>
          </div>
        ),
      },
      {
        accessor: 'lugarDescripcion',
        title: 'Lugar',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.lugarDescripcion || '-'}
          </span>
        ),
      },
      {
        accessor: 'origen',
        title: 'Origen',
        sortable: true,
        render: (row) => <span className="text-sm">{row.origen}</span>,
      },
      {
        accessor: 'destino',
        title: 'Destino',
        sortable: true,
        render: (row) => <span className="text-sm">{row.destino}</span>,
      },
      {
        accessor: 'carga',
        title: 'Carga',
        sortable: true,
        render: (row) => <span className="text-sm">{row.carga}</span>,
      },
    ],
    [],
  )

  return (
    <div className="panel p-0">
      <div className="flex items-center justify-end gap-2 border-b border-white-light p-3 dark:border-[#191e3a]">
        <Button
          variant="outline-primary"
          size="sm"
          type="button"
          onClick={() => void descargarPdf()}
          loading={descargando}
          disabled={descargando}
        >
          <IconDownload className="h-4 w-4" />
          <span className="ml-1">Descargar PDF</span>
        </Button>
      </div>
      <VristoDataTable<FlujoTransporteReporteFila>
        rows={filasPagina}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        columns={columns}
        loading={cargando}
        rowStyle={(row) => ({ backgroundColor: fondoFila(row.colorHex) })}
      />
    </div>
  )
}
