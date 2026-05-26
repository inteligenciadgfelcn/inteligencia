'use client'

import { useRef, useState, useMemo } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'
import IconPrinter from '@/components/Icon/IconPrinter'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesS2iService } from '@/services/analisis'
import type { CasoReporteS2i } from '@/services/analisis'

interface ReporteCasosListadoProps {
  casos: CasoReporteS2i[]
  cargando: boolean
}

const formatFecha = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function ReporteCasosListado({ casos, cargando }: ReporteCasosListadoProps) {
  const { Alerta } = useAlerts()
  const descargandoRef = useRef<string | null>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return casos
    const q = search.toLowerCase()
    return casos.filter(
      (f) =>
        f.nombreCaso?.toLowerCase().includes(q) ||
        f.nroCasoCer?.toLowerCase().includes(q) ||
        f.lugar?.toLowerCase().includes(q) ||
        f.pais?.toLowerCase().includes(q) ||
        f.estadoCaso?.toLowerCase().includes(q) ||
        f.antecedentes?.toLowerCase().includes(q),
    )
  }, [casos, search])

  const total = filasFiltradas.length
  const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

  const descargar = async (idCaso: string, tipo: 'detalle' | 'gis') => {
    const key = `${idCaso}-${tipo}`
    if (descargandoRef.current === key) return
    descargandoRef.current = key
    try {
      const blob =
        tipo === 'detalle'
          ? await ReportesS2iService.descargarPdf(idCaso)
          : await ReportesS2iService.descargarGisPdf(idCaso)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = tipo === 'detalle' ? `reporte-caso-${idCaso}.pdf` : `reporte-gis-caso-${idCaso}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      descargandoRef.current = null
    }
  }

  const columns: Column<CasoReporteS2i>[] = useMemo(
    () => [
      {
        accessor: 'nroCasoCer',
        title: 'Nro. Caso',
        sortable: true,
        render: (row) => (
          <span className="badge badge-outline-primary text-xs font-semibold">
            {row.nroCasoCer || '-'}
          </span>
        ),
      },
      {
        accessor: 'pais',
        title: 'País',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-medium text-dark dark:text-white">{row.pais || '-'}</span>
        ),
      },
      {
        accessor: 'lugar',
        title: 'Lugar',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">{row.lugar || '-'}</span>
        ),
      },
      {
        accessor: 'nombreCaso',
        title: 'Nombre del Caso',
        sortable: true,
        render: (row) => (
          <span className="font-semibold text-dark dark:text-white">{row.nombreCaso}</span>
        ),
      },
      {
        accessor: 'estadoCaso',
        title: 'Estado',
        sortable: true,
        render: (row) => (
          <span className="badge badge-outline-secondary text-xs">{row.estadoCaso || '-'}</span>
        ),
      },
      {
        accessor: 'etapaInvestigacion',
        title: 'Etapa',
        sortable: true,
        render: (row) => (
          <span className="text-xs text-gray-400">{row.etapaInvestigacion || '-'}</span>
        ),
      },
      {
        accessor: 'fechaInicio',
        title: 'Fecha Inicio',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {formatFecha(row.fechaInicio)}
          </span>
        ),
      },
      {
        accessor: 'acciones',
        title: 'Reportes',
        className:
          'sticky right-0 bg-white dark:bg-[#0e1726] z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] border-l border-white-light dark:border-[#191e3a]',
        render: (row) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              type="button"
              title="Descargar Reporte Detallado (RPT-MN-01)"
              onClick={() => void descargar(row.idCaso, 'detalle')}
            >
              <IconDownload className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline text-xs">Detalle</span>
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              type="button"
              title="Descargar Reporte GIS (RPT-MN-02)"
              onClick={() => void descargar(row.idCaso, 'gis')}
            >
              <IconPrinter className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline text-xs">GIS</span>
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="panel p-0">
      <VristoDataTable<CasoReporteS2i>
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
      />
    </div>
  )
}
