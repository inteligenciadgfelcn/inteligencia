'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { Button } from '@/components/ui/Button'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { BienesService } from '@/services/operativos'
import { BienSecuestradoSeccion } from './BienSecuestradoSeccion'
import { BienIncautadoSeccion } from './BienIncautadoSeccion'
import { BienConfiscadoSeccion } from './BienConfiscadoSeccion'
import { PerdidaDominioSeccion } from './PerdidaDominioSeccion'
import { SituacionBienSeccion } from './SituacionBienSeccion'
import { ArchivosBienSeccion } from './ArchivosBienSeccion'
import Input from '@mui/material/Input/Input'

type TabBien = 'secuestrado' | 'incautado' | 'confiscado' | 'perdida-dominio' | 'situacion'
type TabSeccion = 'bienes' | 'archivos'

const TABS_BIEN: { key: TabBien; label: string; icon: string }[] = [
  { key: 'secuestrado', label: 'Bienes Secuestrados', icon: 'lock' },
  { key: 'incautado', label: 'Bienes Incautados', icon: 'gavel' },
  { key: 'confiscado', label: 'Bienes Confiscados', icon: 'balance' },
  { key: 'perdida-dominio', label: 'Pérdida de Dominio', icon: 'domain_disabled' },
  { key: 'situacion', label: 'Entrega o Devolución', icon: 'handshake' },
]

const TABS_SECCION: { key: TabSeccion; label: string; icon: string }[] = [
  { key: 'bienes', label: 'Información del Caso — Bienes', icon: 'inventory_2' },
  { key: 'archivos', label: 'Cuaderno de Investigación Digital', icon: 'folder_zip' },
]

interface Props {
  idCaso: string
  idOperativo: string | null
  cabecera: any
}

export function BienesTab({ idCaso, idOperativo, cabecera }: Props) {
  const { Alerta } = useAlerts()
  const [bienes, setBienes] = useState<any[]>([])
  const [cargandoBienes, setCargandoBienes] = useState(false)
  const [bienSeleccionado, setBienSeleccionado] = useState<any | null>(null)
  const [tabActiva, setTabActiva] = useState<TabBien>('secuestrado')
  const [seccionActiva, setSeccionActiva] = useState<TabSeccion>('bienes')

  // Estado para la grilla (basado en operativo)
  const [pagina, setPagina] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [idsExpandidos, setIdsExpandidos] = useState<(string | number)[]>([])
  const ITEMS_POR_PAGINA = 10

  // Gestión de Fotos (Copia lógica de operativo)
  const [fotosCache, setFotosCache] = useState<Record<string, { foto: string | null }>>({})
  const fotosCacheRef = useRef<Record<string, { foto: string | null }>>({})
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  const actualizarCache = useCallback((id: string, fotos: { foto: string | null }) => {
    fotosCacheRef.current[id] = fotos
    setFotosCache((prev) => ({ ...prev, [id]: fotos }))
  }, [])

  const limpiarCache = useCallback(() => {
    Object.values(fotosCacheRef.current).forEach(({ foto }) => {
      if (foto) URL.revokeObjectURL(foto)
    })
    fotosCacheRef.current = {}
    setFotosCache({})
  }, [])

  useEffect(() => () => limpiarCache(), [limpiarCache])

  const cargarBienes = useCallback(
    async (pag: number = 1) => {
      if (!idOperativo) return
      setCargandoBienes(true)
      limpiarCache()
      setIdsExpandidos([])
      try {
        const res = await BienesService.listar(
          Number(idOperativo),
          pag,
          ITEMS_POR_PAGINA
        )
        if (res?.finalizado) {
          setBienes(res.datos?.filas ?? [])
          setTotalRegistros(res.datos?.page?.totalElements ?? 0)
        }
      } catch {
        Alerta({ mensaje: 'Error al cargar bienes del operativo', variant: 'error' })
      } finally {
        setCargandoBienes(false)
      }
    },
    [idOperativo, limpiarCache, Alerta]
  )

  useEffect(() => {
    void cargarBienes(1)
  }, [idOperativo, cargarBienes])

  const handleCambioPagina = (p: number) => {
    setPagina(p)
    void cargarBienes(p)
  }

  return (
    <div className="space-y-6">
      {/* Info del caso */}
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Número de Caso</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.numeroCaso || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Número de Operativo</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.nroOperativo || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">CUD Fiscalía</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.ianus || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Etapa Investigativa</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.etapaInvestigacion || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre del Caso</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.nombreCaso || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Asignado al caso</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.asignadoCaso || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Fiscal Asignado</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.fiscalAsignadoCaso || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Num. Caso Pérdida de Dominio</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.numeroCasoPerDom || '-'} disabled readOnly />
          </div>
        </div>
      </div>

      {/* Tabs Principales de la Sección de Bienes */}
      <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
        {TABS_SECCION.map((tab) => {
          const activa = seccionActiva === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 transition-all ${activa
                ? 'border-primary text-primary bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              onClick={() => setSeccionActiva(tab.key)}
            >
              <Icono className={`w-5 h-5 ${activa ? 'text-primary' : ''}`}>{tab.icon}</Icono>
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {seccionActiva === 'bienes' && (
          <div className="space-y-6">
            {/* Grilla de bienes del operativo — Basado en operativo */}
            <div className="panel">
              <div className="datatables">
                <VristoDataTable
                  loading={cargandoBienes}
                  rows={bienes}
                  total={totalRegistros}
                  limit={ITEMS_POR_PAGINA}
                  page={pagina}
                  onPageChange={handleCambioPagina}
                  onLimitChange={() => { }}
                  rowClassName={(row: any) =>
                    bienSeleccionado?.id === row.id ? '!bg-primary/10 font-bold' : ''
                  }
                  columns={[
                    { accessor: 'descripcionBien', title: 'Bien' },
                    { accessor: 'descripcionCatalogoClase', title: 'Clase' },
                    { accessor: 'descripcionCatalogoTipo', title: 'Tipo' },
                    { accessor: 'cantidadBien', title: 'Cantidad' },
                    {
                      accessor: 'acciones',
                      title: 'Acciones',
                      className: 'text-right',
                      render: (row: any) => (
                        <button
                          type="button"
                          className={`btn btn-sm ${bienSeleccionado?.id === row.id ? 'btn-primary' : 'btn-outline-primary'
                            }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setBienSeleccionado(row)
                            setTabActiva('secuestrado')
                          }}
                        >
                          {bienSeleccionado?.id === row.id ? 'Seleccionado' : 'Habilitar'}
                        </button>
                      ),
                    },
                  ]}
                  rowExpansion={{
                    idField: 'id',
                    expandedIds: idsExpandidos,
                    onExpandChange: setIdsExpandidos,
                    renderContent: (row: any) => (
                      <ExpansionContenidoBienSimple
                        idOperativo={idOperativo}
                        bien={row}
                        cache={fotosCache[row.id]}
                        onCacheLoad={actualizarCache}
                        onZoom={setImagenAmpliada}
                      />
                    ),
                  }}
                />
              </div>
            </div>

            {/* Lightbox (Copia de operativo) */}
            {imagenAmpliada && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
                onClick={() => setImagenAmpliada(null)}
              >
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={imagenAmpliada}
                    alt="Vista ampliada"
                    className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                  />
                  <Button
                    type="button"
                    variant="dark"
                    size="sm"
                    className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
                    onClick={() => setImagenAmpliada(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            {/* Panel de gestión jurídica por bien */}
            {bienSeleccionado ? (
              <div className="border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg overflow-hidden">
                {/* Indicador de bien activo */}
                <div className="px-4 py-2 bg-primary/5 border-b border-[#e0e6ed] dark:border-[#1b2e4b] flex items-center gap-2">
                  <Icono className="w-4 h-4 text-primary">inventory_2</Icono>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Bien seleccionado:{' '}
                    <span className="font-bold text-primary">
                      {bienSeleccionado.descripcionBien} — {bienSeleccionado.descripcionCatalogoTipo}
                    </span>
                  </span>
                </div>

                {/* Tabs de secciones jurídicas */}
                <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50/50 dark:bg-gray-800/20">
                  {TABS_BIEN.map((tab) => {
                    const activa = tabActiva === tab.key
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-all ${activa
                          ? 'border-primary text-primary bg-white dark:bg-gray-900'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        onClick={() => setTabActiva(tab.key)}
                      >
                        <Icono className={`w-5 h-5 ${activa ? 'text-primary' : ''}`}>{tab.icon}</Icono>
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                <div className="p-6 bg-white dark:bg-gray-900 min-h-[400px]">
                  {tabActiva === 'secuestrado' && (
                    <BienSecuestradoSeccion idItemBien={String(bienSeleccionado.id)} />
                  )}
                  {tabActiva === 'incautado' && (
                    <BienIncautadoSeccion idItemBien={String(bienSeleccionado.id)} />
                  )}
                  {tabActiva === 'confiscado' && (
                    <BienConfiscadoSeccion idItemBien={String(bienSeleccionado.id)} />
                  )}
                  {tabActiva === 'perdida-dominio' && (
                    <PerdidaDominioSeccion idItemBien={String(bienSeleccionado.id)} />
                  )}
                  {tabActiva === 'situacion' && (
                    <SituacionBienSeccion idItemBien={String(bienSeleccionado.id)} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Icono className="w-12 h-12 mb-3">inventory_2</Icono>
                <p className="text-sm">Seleccione un bien para habilitar su situación jurídica</p>
              </div>
            )}
          </div>
        )}

        {seccionActiva === 'archivos' && (
          <div className="panel">
            <ArchivosBienSeccion idCaso={idCaso} />
          </div>
        )}
      </div>
    </div>
  )
}

function InfoChip({
  label,
  value,
  className = '',
}: {
  label: string
  value?: string | null
  className?: string
}) {
  return (
    <div
      className={`flex items-stretch rounded border border-[#e0e6ed] dark:border-[#17263c] overflow-hidden ${className}`}
    >
      <div className="bg-[#eee] dark:bg-[#1b2e4b] px-2 py-1 text-xs font-semibold flex items-center whitespace-nowrap shrink-0">
        {label}
      </div>
      <div className="px-2 py-1 text-xs font-bold flex-1 flex items-center">{value || '-'}</div>
    </div>
  )
}

// ─── Componentes Auxiliares (Copia lógica de operativo) ────────────────────────

function FotoSlot({
  src,
  label,
  onZoom,
}: {
  src: string | null
  label: string
  onZoom: (src: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {src ? (
        <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <img
            src={src}
            alt={label}
            className="h-full max-w-full cursor-zoom-in object-contain hover:opacity-90"
            onClick={() => onZoom(src)}
          />
        </div>
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
          <span className="text-xs text-gray-400">Sin foto</span>
        </div>
      )}
    </div>
  )
}

function ExpansionContenidoBienSimple({
  idOperativo,
  bien,
  cache,
  onCacheLoad,
  onZoom,
}: {
  idOperativo: string | null
  bien: any
  cache: { foto: string | null } | undefined
  onCacheLoad: (id: string, fotos: { foto: string | null }) => void
  onZoom: (src: string) => void
}) {
  const { data: resCarac, isLoading: loadingCarac } = useQuery({
    queryKey: ['caracteristicas-bien', bien.id],
    queryFn: () =>
      idOperativo
        ? BienesService.listarCaracteristicas(Number(idOperativo), Number(bien.id))
        : Promise.reject('No idOperativo'),
    enabled: !!idOperativo && !!bien.id,
  })

  const caracteristicas = resCarac?.datos?.filas ?? []

  useEffect(() => {
    if (cache) return
    const fetchFoto = (path: string | null | undefined): Promise<string | null> =>
      path
        ? BienesService.obtenerFoto(path)
          .then((blob) => URL.createObjectURL(blob))
          .catch(() => null)
        : Promise.resolve(null)

    void fetchFoto(bien.urlFotoBien).then((foto) => {
      onCacheLoad(bien.id, { foto })
    })
  }, [bien.id, bien.urlFotoBien, cache, onCacheLoad])

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Columna izquierda: foto */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
            Fotografía del Bien
          </p>
          {!cache ? (
            <div className="h-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ) : (
            <FotoSlot src={cache.foto} label="Foto del Bien" onZoom={onZoom} />
          )}
        </div>

        {/* Columna derecha: características */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
            Características
          </p>
          <div className="rounded border border-[#e0e6ed] p-3 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm min-h-[100px]">
            {loadingCarac ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ) : caracteristicas.length > 0 ? (
              <div className="space-y-2">
                {caracteristicas.map((c: any) => (
                  <div key={c.id} className="flex gap-2 text-sm">
                    <span className="font-bold text-gray-500 dark:text-gray-400">
                      {c.descripcionCaracteristica}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {c.descripcion}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600 italic">
                Sin características registradas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
