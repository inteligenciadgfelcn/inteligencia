'use client'

import { useState, useMemo } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'
import IconEye from '@/components/Icon/IconEye'
import IconMapPin from '@/components/Icon/IconMapPin'
import IconPrinter from '@/components/Icon/IconPrinter'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesS2iService } from '@/services/analisis'
import type {
  CasoReporteS2i,
  DetalleCasoPreview,
  GisCasoPreview,
} from '@/services/analisis'
import { VistaPreviaDetalle } from './VistaPreviaDetalle'
import { VistaPreviaGis } from './VistaPreviaGis'

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

  // ── Paginación y búsqueda ──────────────────────────────────────────────────
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

  // ── Estado modales ─────────────────────────────────────────────────────────
  const [modalDetalle, setModalDetalle] = useState(false)
  const [modalGis, setModalGis] = useState(false)
  const [dataDetalle, setDataDetalle] = useState<DetalleCasoPreview | null>(null)
  const [dataGis, setDataGis] = useState<GisCasoPreview | null>(null)
  const [idActivo, setIdActivo] = useState<string | null>(null)

  // ── Estado descargas ───────────────────────────────────────────────────────
  const [descargando, setDescargando] = useState<string | null>(null)

  // ── Acciones ──────────────────────────────────────────────────────────────
  const abrirDetalle = async (idCaso: string) => {
    setIdActivo(idCaso)
    setDataDetalle(null)
    setModalDetalle(true)
    try {
      const res = await ReportesS2iService.verDetalle(idCaso)
      if (res?.finalizado) setDataDetalle(res.datos)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      setModalDetalle(false)
    }
  }

  const abrirGis = async (idCaso: string) => {
    setIdActivo(idCaso)
    setDataGis(null)
    setModalGis(true)
    try {
      const res = await ReportesS2iService.verGis(idCaso)
      if (res?.finalizado) setDataGis(res.datos)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      setModalGis(false)
    }
  }

  const descargar = async (idCaso: string, tipo: 'detalle' | 'gis') => {
    const key = `${idCaso}-${tipo}`
    if (descargando === key) return
    setDescargando(key)
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
      setDescargando(null)
    }
  }

  // ── Columnas ───────────────────────────────────────────────────────────────
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
            {/* Vista previa detalle (RPT-MN-01) */}
            <Button
              variant="outline-info"
              size="sm"
              type="button"
              title="Vista Previa — Reporte Detallado (RPT-MN-01)"
              disabled={descargando !== null}
              onClick={() => void abrirDetalle(row.idCaso)}
            >
              <IconEye className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline text-xs">Detalle</span>
            </Button>

            {/* Descarga PDF directo detalle */}
            <Button
              variant="outline-primary"
              size="sm"
              type="button"
              title="Descargar PDF Detallado (RPT-MN-01)"
              loading={descargando === `${row.idCaso}-detalle`}
              disabled={descargando !== null}
              onClick={() => void descargar(row.idCaso, 'detalle')}
            >
              <IconDownload className="h-4 w-4" />
            </Button>

            {/* Vista previa GIS (RPT-MN-02) */}
            <Button
              variant="outline-warning"
              size="sm"
              type="button"
              title="Vista Previa — Reporte GIS (RPT-MN-02)"
              disabled={descargando !== null}
              onClick={() => void abrirGis(row.idCaso)}
            >
              <IconMapPin className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline text-xs">GIS</span>
            </Button>

            {/* Descarga PDF directo GIS */}
            <Button
              variant="outline-success"
              size="sm"
              type="button"
              title="Descargar PDF SIG (RPT-MN-02)"
              loading={descargando === `${row.idCaso}-gis`}
              disabled={descargando !== null}
              onClick={() => void descargar(row.idCaso, 'gis')}
            >
              <IconPrinter className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [descargando],
  )

  return (
    <>
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

      {/* Modal vista previa RPT-MN-01 */}
      <VistaPreviaDetalle
        open={modalDetalle}
        onClose={() => setModalDetalle(false)}
        data={dataDetalle}
        descargando={descargando === `${idActivo}-detalle`}
        onDescargarPdf={() => {
          if (idActivo) void descargar(idActivo, 'detalle')
        }}
      />

      {/* Modal vista previa RPT-MN-02 */}
      <VistaPreviaGis
        open={modalGis}
        onClose={() => setModalGis(false)}
        data={dataGis}
        descargando={descargando === `${idActivo}-gis`}
        onDescargarPdf={() => {
          if (idActivo) void descargar(idActivo, 'gis')
        }}
      />
    </>
  )
}
