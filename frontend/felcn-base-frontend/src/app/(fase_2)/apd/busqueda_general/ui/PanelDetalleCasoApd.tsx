'use client'

import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { VristoSimpleDataTable } from '@/components/datatable/VristoSimpleDataTable'
import type { Column } from '@/components/datatable/VristoSimpleDataTable'

import { BusquedaGeneralApdApi } from '../api/busqueda-general-apd.api'
import type {
  ActuacionDetalleApd,
  BienDetalleApd,
  DetalleCasoApd,
  EmpresaDetalleApd,
  FilaCasoApd,
  PersonaDetalleApd,
} from '../types/busqueda-general-apd.types'
import { formatFechaBolivia, textoOguion } from '../utils/formatoBolivia'

/* ─── Columnas de las tablas anidadas ─────────────────────────────────────── */

const columnasPersonas: Column<PersonaDetalleApd>[] = [
  {
    accessor: 'nombreCompleto',
    title: 'Nombre completo',
    render: (p) => (
      <span className="font-medium text-dark dark:text-white-light">
        {textoOguion(p.nombreCompleto)}
      </span>
    ),
  },
  {
    accessor: 'numeroDocumento',
    title: 'N° documento',
    render: (p) => textoOguion(p.numeroDocumento),
  },
  { accessor: 'pais', title: 'País', render: (p) => textoOguion(p.pais) },
  { accessor: 'sexo', title: 'Sexo', render: (p) => textoOguion(p.sexo) },
  {
    accessor: 'estadoCivil',
    title: 'Estado civil',
    render: (p) => textoOguion(p.estadoCivil),
  },
  {
    accessor: 'profesion',
    title: 'Profesión',
    render: (p) => textoOguion(p.profesion),
  },
  {
    accessor: 'situacionJuridicaActual',
    title: 'Situación jurídica',
    render: (p) => textoOguion(p.situacionJuridicaActual),
  },
]

/** `caracteristicas` llega como arreglo: se aplana a "Color: Azul; Talla: M". */
const resumenCaracteristicas = (bien: BienDetalleApd): string => {
  if (!bien.caracteristicas || bien.caracteristicas.length === 0) return '—'
  return bien.caracteristicas
    .map((c) => `${textoOguion(c.caracteristica)}: ${textoOguion(c.valor)}`)
    .join('; ')
}

const columnasBienes: Column<BienDetalleApd>[] = [
  {
    accessor: 'tipo',
    title: 'Categoría',
    render: (b) => (
      <div className="min-w-[120px]">
        <span className="font-medium text-dark dark:text-white-light">
          {textoOguion(b.tipo)}
        </span>
        {b.clase && (
          <span className="block text-[10px] text-gray-500">{b.clase}</span>
        )}
      </div>
    ),
  },
  {
    accessor: 'caracteristicas',
    title: 'Característica',
    render: (b) => {
      const texto = resumenCaracteristicas(b)
      return (
        <span className="block max-w-[240px] truncate" title={texto}>
          {texto}
        </span>
      )
    },
  },
  {
    accessor: 'cantidad',
    title: 'Cantidad',
    render: (b) => String(b.cantidad ?? '—'),
  },
  {
    accessor: 'situacionLegalActual',
    title: 'Situación legal',
    render: (b) => textoOguion(b.situacionLegalActual),
  },
]

const columnasEmpresas: Column<EmpresaDetalleApd>[] = [
  {
    accessor: 'nombre',
    title: 'Nombre empresa',
    render: (e) => (
      <span className="font-medium text-dark dark:text-white-light">
        {textoOguion(e.nombre)}
      </span>
    ),
  },
  { accessor: 'nit', title: 'NIT', render: (e) => textoOguion(e.nit) },
  {
    accessor: 'situacionJuridicaActual',
    title: 'Situación jurídica',
    render: (e) => textoOguion(e.situacionJuridicaActual),
  },
]

/* ─── Piezas de layout ────────────────────────────────────────────────────── */

const TITULO_BLOQUE =
  'text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400'

function BloqueActuacion({
  actuacion,
  indice,
}: {
  actuacion: ActuacionDetalleApd
  indice: number
}) {
  const bienes = actuacion.bienes ?? []
  const empresas = actuacion.empresas ?? []

  return (
    <div className="space-y-3 border-t border-[#e0e6ed] pt-4 dark:border-[#1b2e4b]">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-sm font-semibold text-dark dark:text-white-light">
          Actuación {indice + 1}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {[
            textoOguion(actuacion.numeroActuacion),
            formatFechaBolivia(actuacion.fechaInforme, 'DD/MM/YYYY'),
            textoOguion(actuacion.tipoInforme),
            textoOguion(actuacion.lugar),
          ]
            .filter((v) => v !== '—')
            .join(' · ')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="space-y-2">
          <p className={TITULO_BLOQUE}>Bienes ({bienes.length})</p>
          <VristoSimpleDataTable<BienDetalleApd>
            rows={bienes}
            columns={columnasBienes}
          />
        </div>

        <div className="space-y-2">
          <p className={TITULO_BLOQUE}>Empresas ({empresas.length})</p>
          <VristoSimpleDataTable<EmpresaDetalleApd>
            rows={empresas}
            columns={columnasEmpresas}
          />
        </div>
      </div>
    </div>
  )
}

function SinDatos({ mensaje }: { mensaje: string }) {
  return (
    <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      {mensaje}
    </p>
  )
}

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface PanelDetalleCasoApdProps {
  caso: FilaCasoApd | null
  onClose: () => void
}

/* ─── Panel ───────────────────────────────────────────────────────────────── */

export function PanelDetalleCasoApd({
  caso,
  onClose,
}: PanelDetalleCasoApdProps) {
  const { data, isLoading, isError, refetch } = useQuery<DetalleCasoApd>({
    queryKey: ['apd-busqueda-general', 'caso-detalle', caso?.casosId],
    enabled: Boolean(caso?.casosId),
    queryFn: () => BusquedaGeneralApdApi.obtenerDetalle(caso!.casosId),
  })

  if (!caso) return null

  const personas = data?.personasInvestigadas ?? []
  const actuaciones = data?.actuaciones ?? []

  // El encabezado usa la fila del listado para no esperar a la query.
  const ubicacion = [
    data?.distrital ?? caso.distrital,
    data?.grupo ?? caso.grupo,
  ]
    .filter(Boolean)
    .join(' / ')

  const encabezado = [
    data?.cud ?? caso.cud,
    data?.unidad ?? caso.unidad,
    ubicacion,
    formatFechaBolivia(data?.fechaInicio ?? caso.fechaInicio, 'DD/MM/YYYY'),
    data?.etapaInvestigacion ?? caso.etapaInvestigacion,
    data?.estadoProcesal ?? caso.estadoProcesal,
  ]
    .map((v) => textoOguion(v))
    .filter((v) => v !== '—')
    .join(' · ')

  return (
    <div className="panel space-y-4">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e0e6ed] pb-3 dark:border-[#1b2e4b]">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-dark dark:text-white-light">
            {textoOguion(data?.numeroCasoGiaef ?? caso.numeroCasoGiaef)}
            {(data?.nombreCaso ?? caso.nombreCaso) ? (
              <span className="font-normal text-gray-500 dark:text-gray-400">
                {' '}
                — {data?.nombreCaso ?? caso.nombreCaso}
              </span>
            ) : null}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {encabezado}
          </p>
        </div>
        <Button
          type="button"
          variant="outline-dark"
          size="sm"
          onClick={onClose}
        >
          <Icono className="w-4 h-4 mr-1">close</Icono>
          Cerrar
        </Button>
      </div>

      {isLoading && (
        <p className="py-6 text-center text-sm text-gray-500">
          Cargando detalle del caso...
        </p>
      )}

      {isError && (
        <div className="rounded-md border border-danger/50 bg-danger/10 p-4">
          <p className="text-sm text-danger">
            No se pudo obtener el detalle del caso.
          </p>
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {data && !isLoading && (
        <>
          {/* Personas investigadas */}
          <div className="space-y-2">
            <p className={TITULO_BLOQUE}>
              Personas investigadas ({personas.length})
            </p>
            {personas.length === 0 ? (
              <SinDatos mensaje="El caso no tiene personas investigadas registradas." />
            ) : (
              <VristoSimpleDataTable<PersonaDetalleApd>
                rows={personas}
                columns={columnasPersonas}
              />
            )}
          </div>

          {/* Actuaciones */}
          {actuaciones.length === 0 ? (
            <SinDatos mensaje="El caso no tiene actuaciones registradas." />
          ) : (
            actuaciones.map((a, i) => (
              <BloqueActuacion key={a.opId} actuacion={a} indice={i} />
            ))
          )}
        </>
      )}
    </div>
  )
}
