import type { Column } from '@/components/datatable/VristoDataTable'
import type { FlujoTransporteReporteFila } from '@/services/analisis'

export const formatFechaHora = (iso: string) => {
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

/** Agrega alfa (~25%) al hexadecimal del color para pintar la fila sin tapar el texto. */
export const fondoFilaFlujoTransporte = (hex: string | null) => (hex ? `${hex}40` : undefined)

/**
 * Definición de columnas compartida entre los tabs "Búsqueda", "Recientes" y
 * por color del reporte de Flujo de Transporte, para no duplicar el layout.
 */
export const columnasFlujoTransporte: Column<FlujoTransporteReporteFila>[] = [
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
  {
    accessor: 'latitud',
    title: 'Coordenadas',
    render: (row) =>
      row.latitud != null && row.longitud != null ? (
        <a
          href={`https://www.google.com/maps?q=${row.latitud},${row.longitud}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-primary hover:underline"
          title="Ver en el mapa"
        >
          {row.latitud.toFixed(6)}, {row.longitud.toFixed(6)}
        </a>
      ) : (
        <span className="text-xs text-gray-400">-</span>
      ),
  },
]
