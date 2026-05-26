'use client'
import { useCallback, useEffect, useState } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import IconTrash from '@/components/Icon/IconTrash'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { GisPanel } from '@/app/analisis/ui/GisPanel'
import { ArchivosPanel } from '@/app/analisis/ui/ArchivosPanel'
import { BienesS2iService, S2iLookupsService } from '@/services/analisis'
import type { BienS2i, CaracteristicaBien, LookupSimple } from '@/services/analisis'

type Opcion = { value: string; label: string }

const toOpciones = (list: LookupSimple[]): Opcion[] =>
  list.map((o) => ({ value: String(o.id), label: o.descripcion }))

interface Props {
  idCaso: string
}

// ── Sub-panel Características ─────────────────────────────────────────────────
function PanelCaracteristicas({ bien }: { bien: BienS2i }) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<CaracteristicaBien[]>([])
  const [disponibles, setDisponibles] = useState<Opcion[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [idCaracteristica, setIdCaracteristica] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const cargarDisponibles = useCallback(async () => {
    const r = await BienesS2iService.listarCaracteristicasDisponibles(bien.idItemBienSecundario)
    if (r?.finalizado) setDisponibles(toOpciones(r.datos ?? []))
  }, [bien.idItemBienSecundario])

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const [rL] = await Promise.all([
        BienesS2iService.listarCaracteristicas(bien.idItemBienSecundario),
      ])
      if (rL?.finalizado) setLista(rL.datos ?? [])
      await cargarDisponibles()
    } finally { setCargando(false) }
  }, [bien.idItemBienSecundario, cargarDisponibles])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!idCaracteristica || !descripcion.trim()) return
    setCargando(true)
    try {
      const r = await BienesS2iService.crearCaracteristica(bien.idItemBienSecundario, {
        idCatalogoCaracteristica: Number(idCaracteristica),
        descripcion: descripcion.trim().toUpperCase(),
      })
      if (r?.finalizado) {
        setIdCaracteristica(''); setDescripcion(''); setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Característica registrada', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (id: number) => {
    confirm({
      texto: '¿Eliminar esta característica?',
      onConfirm: async () => {
        setCargando(true)
        try { await BienesS2iService.eliminarCaracteristica(id); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const req = (v: string) => !v && submitted

  return (
    <div className="space-y-3">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Característica <span className="text-danger">*</span></label>
          <Select
            value={idCaracteristica}
            onChange={(e) => setIdCaracteristica(e.target.value)}
            options={disponibles}
            placeholder="Seleccione..."
            className={`w-full ${req(idCaracteristica) ? 'border-danger' : ''}`}
          />
          {req(idCaracteristica) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Descripción / Valor <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
            className={`w-full ${req(descripcion.trim()) ? 'border-danger' : ''}`}
          />
          {req(descripcion.trim()) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="flex items-end">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando} className="w-full">
            Agregar
          </Button>
        </div>
      </div>
      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-4 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin características registradas</span>
        </div>
      ) : (
        <ul className="divide-y divide-[#e0e6ed] dark:divide-gray-700">
          {lista.map((c) => (
            <li key={c.idItemBienCaracteristica} className="flex items-center justify-between gap-2 py-2">
              <div className="text-sm">
                <span className="font-medium">{c.descripcionCaracteristica}</span>
                <span className="ml-2 text-xs text-gray-500">{c.descripcion}</span>
              </div>
              <Button variant="danger" size="sm" className="shrink-0" onClick={() => eliminar(c.idItemBienCaracteristica)}>
                <IconTrash className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Expansion row ─────────────────────────────────────────────────────────────
const TABS_BIEN = ['Características', 'GIS', 'Archivos'] as const
type TabBien = typeof TABS_BIEN[number]

function BienExpansion({ bien, opcionesContenido }: { bien: BienS2i; opcionesContenido: LookupSimple[] }) {
  const [tab, setTab] = useState<TabBien>('Características')

  const gisService = {
    crearLugar: (id: string, p: Parameters<typeof BienesS2iService.crearLugar>[1]) => BienesS2iService.crearLugar(id, p),
    listarLugares: (id: string) => BienesS2iService.listarLugares(id),
    eliminarLugar: (id: string) => BienesS2iService.eliminarLugar(id),
  }

  const archivosService = {
    subirArchivo: (id: string, p: Parameters<typeof BienesS2iService.subirArchivo>[1], f: File) =>
      BienesS2iService.subirArchivo(id, p, f),
    listarArchivos: (id: string) => BienesS2iService.listarArchivos(id),
    descargarArchivo: (id: string) => BienesS2iService.descargarArchivo(id),
    eliminarArchivo: (id: string) => BienesS2iService.eliminarArchivo(id),
  }

  return (
    <div className="border-t border-[#e0e6ed] p-4 dark:border-gray-700">
      <div className="mb-4 flex gap-2 border-b border-[#e0e6ed] dark:border-gray-700">
        {TABS_BIEN.map((t) => {
          const activa = tab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${activa
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'
                }`}
            >
              {t}
            </button>
          )
        })}
      </div>
      {tab === 'Características' && <PanelCaracteristicas bien={bien} />}
      {tab === 'GIS' && <GisPanel idEntidad={bien.idItemBienSecundario} service={gisService} idField="idLugarBien" />}
      {tab === 'Archivos' && (
        <ArchivosPanel
          idEntidad={bien.idItemBienSecundario}
          service={archivosService}
          idField="idArchivoBien"
          opcionesContenido={opcionesContenido}
        />
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
const ITEMS_POR_PAGINA = 10

export function SeccionBienes({ idCaso }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [bienes, setBienes] = useState<BienS2i[]>([])
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])
  const [submitted, setSubmitted] = useState(false)

  const [opcionesBien, setOpcionesBien] = useState<Opcion[]>([])
  const [opcionesClase, setOpcionesClase] = useState<Opcion[]>([])
  const [opcionesTipo, setOpcionesTipo] = useState<Opcion[]>([])
  const [opcionesTipoInv, setOpcionesTipoInv] = useState<Opcion[]>([])
  const [opcionesContenido, setOpcionesContenido] = useState<LookupSimple[]>([])

  const [idBien, setIdBien] = useState('')
  const [idClase, setIdClase] = useState('')
  const [idTipo, setIdTipo] = useState('')
  const [idTipoInvestigacion, setIdTipoInvestigacion] = useState('')

  useEffect(() => {
    Promise.all([
      S2iLookupsService.listarBienes(),
      S2iLookupsService.listarTiposInvestigacionBien(),
      S2iLookupsService.listarContenidoCaso(),
    ]).then(([rB, rT, rC]) => {
      if (rB?.finalizado) setOpcionesBien(toOpciones(rB.datos ?? []))
      if (rT?.finalizado) setOpcionesTipoInv(toOpciones(rT.datos ?? []))
      if (rC?.finalizado) setOpcionesContenido(rC.datos ?? [])
    }).catch(() => { })
  }, [])

  const onBienChange = async (val: string) => {
    setIdBien(val); setIdClase(''); setIdTipo(''); setOpcionesClase([]); setOpcionesTipo([])
    if (!val) return
    const r = await S2iLookupsService.listarClases(Number(val))
    if (r?.finalizado) setOpcionesClase(toOpciones(r.datos ?? []))
  }

  const onClaseChange = async (val: string) => {
    setIdClase(val); setIdTipo(''); setOpcionesTipo([])
    if (!val) return
    const r = await S2iLookupsService.listarTipos(Number(val))
    if (r?.finalizado) setOpcionesTipo(toOpciones(r.datos ?? []))
  }

  const cargar = useCallback(async () => {
    if (!idCaso) return
    setCargando(true)
    try {
      const r = await BienesS2iService.listar(idCaso)
      if (r?.finalizado) setBienes(r.datos ?? [])
    } finally { setCargando(false) }
  }, [idCaso])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!idTipo || !idTipoInvestigacion) return
    setCargando(true)
    try {
      const r = await BienesS2iService.crear(idCaso, {
        idCatalogoTipo: Number(idTipo),
        idTipoInvestigacionBien: Number(idTipoInvestigacion),
      })
      if (r?.finalizado) {
        setIdBien(''); setIdClase(''); setIdTipo(''); setIdTipoInvestigacion('')
        setOpcionesClase([]); setOpcionesTipo([])
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Bien registrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (b: BienS2i) => {
    confirm({
      texto: `¿Eliminar este bien?`,
      onConfirm: async () => {
        setCargando(true)
        try { await BienesS2iService.eliminar(b.idItemBienSecundario); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const req = (v: string) => !v && submitted

  const columns: Column<BienS2i>[] = [
    { accessor: 'descripcionBien', title: 'Bien' },
    { accessor: 'descripcionClase', title: 'Clase' },
    { accessor: 'descripcionTipo', title: 'Tipo' },
    { accessor: 'descripcionTipoInvestigacion', title: 'Tipo Investigación' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (r) => (
        <button type="button" className="text-danger hover:text-danger/80" onClick={(e) => { e.stopPropagation(); eliminar(r) }}>
          <IconTrash className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <h4 className="mb-4 text-sm font-semibold">Bienes Investigados</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Bien */}
        <div>
          <label className="mb-1 block text-sm font-medium">Bien <span className="text-danger">*</span></label>
          <Select
            value={idBien}
            onChange={(e) => void onBienChange(e.target.value)}
            options={opcionesBien}
            placeholder="Seleccione..."
            className={`w-full ${req(idBien) ? 'border-danger' : ''}`}
          />
          {req(idBien) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        {/* Clase */}
        <div>
          <label className="mb-1 block text-sm font-medium">Clase <span className="text-danger">*</span></label>
          <Select
            value={idClase}
            onChange={(e) => void onClaseChange(e.target.value)}
            options={opcionesClase}
            placeholder={idBien ? 'Seleccione...' : 'Seleccione un bien primero'}
            disabled={!idBien}
            className={`w-full ${req(idClase) && idBien ? 'border-danger' : ''}`}
          />
        </div>
        {/* Tipo */}
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo <span className="text-danger">*</span></label>
          <Select
            value={idTipo}
            onChange={(e) => setIdTipo(e.target.value)}
            options={opcionesTipo}
            placeholder={idClase ? 'Seleccione...' : 'Seleccione una clase primero'}
            disabled={!idClase}
            className={`w-full ${req(idTipo) ? 'border-danger' : ''}`}
          />
          {req(idTipo) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        {/* Tipo de Investigación */}
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Investigación <span className="text-danger">*</span></label>
          <Select
            value={idTipoInvestigacion}
            onChange={(e) => setIdTipoInvestigacion(e.target.value)}
            options={opcionesTipoInv}
            placeholder="Seleccione..."
            className={`w-full ${req(idTipoInvestigacion) ? 'border-danger' : ''}`}
          />
          {req(idTipoInvestigacion) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="lg:col-span-4 flex justify-end mt-2">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar</Button>
        </div>
      </div>

      <div className="mt-5 datatables">
        <VristoDataTable<BienS2i>
          loading={cargando}
          rows={bienes}
          total={bienes.length}
          limit={ITEMS_POR_PAGINA}
          page={1}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={columns}
          rowExpansion={{
            idField: 'idItemBienSecundario',
            expandedIds,
            onExpandChange: setExpandedIds,
            renderContent: (b) => <BienExpansion bien={b} opcionesContenido={opcionesContenido} />,
          }}
        />
      </div>
    </div>
  )
}
