'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import IconTrash from '@/components/Icon/IconTrash'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { DropzoneFoto } from '@/app/analisis/ui/DropzoneFoto'
import { SIGPanel } from '@/app/analisis/ui/SigPanel'
import { ArchivosPanel } from '@/app/analisis/ui/ArchivosPanel'
import { FlujoTelefonicoPanel } from '@/app/analisis/ui/FlujoTelefonicoPanel'
import { BlancosService, S2iLookupsService } from '@/services/analisis'
import type {
  AntecedenteBlanco,
  BlancoS2i,
  LookupSimple,
  RedSocial,
} from '@/services/analisis'

type Opcion = { value: string; label: string }

const toOpciones = (list: LookupSimple[]): Opcion[] =>
  list.map((o) => ({ value: String(o.id), label: o.descripcion }))

interface Props {
  idCaso: string
}

// ── Sub-panel Foto ────────────────────────────────────────────────────────────
function PanelFoto({ blanco }: { blanco: BlancoS2i }) {
  const { Alerta } = useAlerts()
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [imagenAmpliada, setImagenAmpliada] = useState(false)

  useEffect(() => {
    BlancosService.obtenerFoto(blanco.idBlanco)
      .then((blob) => setFotoUrl(URL.createObjectURL(blob)))
      .catch(() => setFotoUrl(null))
  }, [blanco.idBlanco])

  useEffect(() => () => { if (fotoUrl) URL.revokeObjectURL(fotoUrl) }, [fotoUrl])

  const subir = async () => {
    if (!foto) return
    setCargando(true)
    try {
      await BlancosService.actualizarFoto(blanco.idBlanco, foto)
      const blob = await BlancosService.obtenerFoto(blanco.idBlanco)
      if (fotoUrl) URL.revokeObjectURL(fotoUrl)
      setFotoUrl(URL.createObjectURL(blob))
      setFoto(null)
      Alerta({ mensaje: 'Foto actualizada', variant: 'success' })
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-3">
      <LoadingDialog show={cargando} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DropzoneFoto label="Nueva Foto" archivo={foto} onChange={setFoto} />
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Foto Actual</p>
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoUrl}
              alt="Foto del blanco"
              className="h-40 w-full cursor-zoom-in rounded object-cover shadow-sm hover:opacity-90"
              onClick={() => setImagenAmpliada(true)}
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
              <span className="text-xs text-gray-400">Sin foto</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="success" size="sm" onClick={() => void subir()} disabled={!foto || cargando}>
          Guardar
        </Button>
      </div>
      {imagenAmpliada && fotoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setImagenAmpliada(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoUrl} alt="Vista ampliada" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </div>
  )
}

// ── Sub-panel Antecedentes ────────────────────────────────────────────────────
function PanelAntecedentes({ blanco, opcionesPaises, opcionesDelito }: { blanco: BlancoS2i; opcionesPaises: Opcion[]; opcionesDelito: Opcion[] }) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<AntecedenteBlanco[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [idTipoDelito, setIdTipoDelito] = useState('')
  const [idPais, setIdPais] = useState('')
  const [lugarHecho, setLugarHecho] = useState('')
  const [nroCaso, setNroCaso] = useState('')
  const [fechaHecho, setFechaHecho] = useState('')
  const [hecho, setHecho] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const r = await BlancosService.listarAntecedentes(blanco.idBlanco)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [blanco.idBlanco])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!idTipoDelito || !idPais || !lugarHecho.trim() || !nroCaso.trim() || !fechaHecho || !hecho.trim()) return
    setCargando(true)
    try {
      const r = await BlancosService.crearAntecedente(blanco.idBlanco, {
        idTipoDelito: Number(idTipoDelito),
        idPais: Number(idPais),
        lugarHecho: lugarHecho.trim().toUpperCase(),
        nroCaso: nroCaso.trim().toUpperCase(),
        fechaHecho,
        hecho: hecho.trim().toUpperCase(),
      })
      if (r?.finalizado) {
        setIdTipoDelito(''); setIdPais(''); setLugarHecho(''); setNroCaso(''); setFechaHecho(''); setHecho('')
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Antecedente reSIGtrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (id: string) => {
    confirm({
      texto: '¿Eliminar este antecedente?',
      onConfirm: async () => {
        setCargando(true)
        try { await BlancosService.eliminarAntecedente(id); void cargar() }
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
          <label className="mb-1 block text-sm font-medium">Tipo de Delito <span className="text-danger">*</span></label>
          <Select value={idTipoDelito} onChange={(e) => setIdTipoDelito(e.target.value)} options={opcionesDelito} placeholder="Seleccione..." className={`w-full ${req(idTipoDelito) ? 'border-danger' : ''}`} />
          {req(idTipoDelito) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">País <span className="text-danger">*</span></label>
          <Select value={idPais} onChange={(e) => setIdPais(e.target.value)} options={opcionesPaises} placeholder="Seleccione..." className={`w-full ${req(idPais) ? 'border-danger' : ''}`} />
          {req(idPais) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Lugar del Hecho <span className="text-danger">*</span></label>
          <Input type="text" value={lugarHecho} onChange={(e) => setLugarHecho(e.target.value.toUpperCase())} className={`w-full ${req(lugarHecho.trim()) ? 'border-danger' : ''}`} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nro. Caso <span className="text-danger">*</span></label>
          <Input type="text" value={nroCaso} onChange={(e) => setNroCaso(e.target.value.toUpperCase())} className={`w-full ${req(nroCaso.trim()) ? 'border-danger' : ''}`} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Fecha del Hecho <span className="text-danger">*</span></label>
          <Input type="date" value={fechaHecho} onChange={(e) => setFechaHecho(e.target.value)} className={`w-full ${req(fechaHecho) ? 'border-danger' : ''}`} />
        </div>
        <div className="lg:col-span-3">
          <label className="mb-1 block text-sm font-medium">Descripción del Hecho <span className="text-danger">*</span></label>
          <Textarea rows={2} value={hecho} onChange={(e) => setHecho(e.target.value)} error={req(hecho.trim())} className="w-full" />
        </div>
        <div className="lg:col-span-4 flex justify-end">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar</Button>
        </div>
      </div>
      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-4 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin antecedentes registrados</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lista.map((a) => (
            <div
              key={a.idAntecedente}
              className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1.5 dark:border-gray-700/50">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                    {a.descripcionTipoDelito}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => eliminar(a.idAntecedente)}
                    title="Eliminar antecedente"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium text-gray-500">País:</span> {a.descripcionPais}</p>
                  <p className="mt-0.5"><span className="font-medium text-gray-500">Nro. Caso:</span> {a.nroCaso}</p>
                  {a.hecho && (
                    <p className="mt-1.5 border-t border-gray-50 pt-1.5 dark:border-gray-700/30 text-gray-500 italic">
                      {a.hecho}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sub-panel Redes Sociales ──────────────────────────────────────────────────
function PanelRedesSociales({ blanco }: { blanco: BlancoS2i }) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<RedSocial[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [tipoRed, setTipoRed] = useState('')
  const [direccion, setDireccion] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const r = await BlancosService.listarRedesSociales(blanco.idBlanco)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [blanco.idBlanco])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!tipoRed.trim() || !direccion.trim()) return
    setCargando(true)
    try {
      const r = await BlancosService.crearRedSocial(blanco.idBlanco, {
        tipoRed: tipoRed.trim().toUpperCase(),
        direccion: direccion.trim(),
      })
      if (r?.finalizado) {
        setTipoRed(''); setDireccion(''); setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Red social reSIGtrada', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (id: string) => {
    confirm({
      texto: '¿Eliminar esta red social?',
      onConfirm: async () => {
        setCargando(true)
        try { await BlancosService.eliminarRedSocial(id); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  return (
    <div className="space-y-3">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Red <span className="text-danger">*</span></label>
          <Select
            value={tipoRed}
            onChange={(e) => setTipoRed(e.target.value)}
            options={[
              { value: 'FACEBOOK', label: 'Facebook' },
              { value: 'INSTAGRAM', label: 'Instagram' },
              { value: 'TWITTER', label: 'Twitter / X' },
              { value: 'TIKTOK', label: 'TikTok' },
              { value: 'WHATSAPP', label: 'WhatsApp' },
              { value: 'TELEGRAM', label: 'Telegram' },
              { value: 'YOUTUBE', label: 'YouTube' },
              { value: 'OTRO', label: 'Otro' },
            ]}
            placeholder="Seleccione..."
            className={`w-full ${!tipoRed && submitted ? 'border-danger' : ''}`}
          />
          {!tipoRed && submitted && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Dirección / Usuario <span className="text-danger">*</span></label>
          <Input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={`w-full ${!direccion.trim() && submitted ? 'border-danger' : ''}`} />
          {!direccion.trim() && submitted && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="flex items-end">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando} className="w-full">
            Guardar
          </Button>
        </div>
      </div>
      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-4 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin redes sociales registradas</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lista.map((r) => (
            <div
              key={r.idRedSocial}
              className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5 dark:border-gray-700/50">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                    {r.tipoRed}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => eliminar(r.idRedSocial)}
                    title="Eliminar red social"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                  <p className="truncate"><span className="font-medium text-gray-500">Dirección/Usuario:</span> {r.direccion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Expansion row ─────────────────────────────────────────────────────────────
const TABS_BLANCO = ['Foto', 'Antecedentes', 'Redes Sociales', 'SIG', 'Archivos', 'Flujo Telefónico'] as const
type TabBlanco = typeof TABS_BLANCO[number]

function BlancoExpansion({
  blanco,
  opcionesPaises,
  opcionesDelito,
  opcionesContenido,
}: {
  blanco: BlancoS2i
  opcionesPaises: Opcion[]
  opcionesDelito: Opcion[]
  opcionesContenido: LookupSimple[]
}) {
  const [tab, setTab] = useState<TabBlanco>('Foto')

  const SIGService = {
    crearLugar: (id: string, p: Parameters<typeof BlancosService.crearLugar>[1]) => BlancosService.crearLugar(id, p),
    listarLugares: (id: string) => BlancosService.listarLugares(id),
    eliminarLugar: (id: string) => BlancosService.eliminarLugar(id),
  }

  const archivosService = {
    subirArchivo: (id: string, p: Parameters<typeof BlancosService.subirArchivo>[1], f: File) => BlancosService.subirArchivo(id, p, f),
    listarArchivos: (id: string) => BlancosService.listarArchivos(id),
    descargarArchivo: (id: string) => BlancosService.descargarArchivo(id),
    eliminarArchivo: (id: string) => BlancosService.eliminarArchivo(id),
  }

  return (
    <div className="border-t border-[#e0e6ed] p-4 dark:border-gray-700">
      <div className="mb-4 flex gap-2 border-b border-[#e0e6ed] dark:border-gray-700">
        {TABS_BLANCO.map((t) => {
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
      {tab === 'Foto' && <PanelFoto blanco={blanco} />}
      {tab === 'Antecedentes' && <PanelAntecedentes blanco={blanco} opcionesPaises={opcionesPaises} opcionesDelito={opcionesDelito} />}
      {tab === 'Redes Sociales' && <PanelRedesSociales blanco={blanco} />}
      {tab === 'SIG' && <SIGPanel idEntidad={blanco.idBlanco} service={SIGService} idField="idLugarBlanco" />}
      {tab === 'Archivos' && <ArchivosPanel idEntidad={blanco.idBlanco} service={archivosService} idField="idArchivo" opcionesContenido={opcionesContenido} />}
      {tab === 'Flujo Telefónico' && <FlujoTelefonicoPanel blanco={blanco} />}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
const ITEMS_POR_PAGINA = 10

export function SeccionBlancos({ idCaso }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [blancos, setBlancos] = useState<BlancoS2i[]>([])
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])
  const [submitted, setSubmitted] = useState(false)

  const [opcionesPaises, setOpcionesPaises] = useState<Opcion[]>([])
  const [opcionesDelito, setOpcionesDelito] = useState<Opcion[]>([])
  const [opcionesContenido, setOpcionesContenido] = useState<LookupSimple[]>([])

  const [deNombres, setDeNombres] = useState('')
  const [dePaterno, setDePaterno] = useState('')
  const [deMaterno, setDeMaterno] = useState('')
  const [deEsposo, setDeEsposo] = useState('')
  const [alias, setAlias] = useState('')
  const [idPais, setIdPais] = useState('')

  useEffect(() => {
    Promise.all([
      S2iLookupsService.listarPaises(),
      S2iLookupsService.listarTiposDelito(),
      S2iLookupsService.listarContenidoCaso(),
    ]).then(([rP, rD, rC]) => {
      if (rP?.finalizado) setOpcionesPaises(toOpciones(rP.datos ?? []))
      if (rD?.finalizado) setOpcionesDelito(toOpciones(rD.datos ?? []))
      if (rC?.finalizado) setOpcionesContenido(rC.datos ?? [])
    }).catch(() => { })
  }, [])

  const cargar = useCallback(async () => {
    if (!idCaso) return
    setCargando(true)
    try {
      const r = await BlancosService.listar(idCaso)
      if (r?.finalizado) setBlancos(r.datos ?? [])
    } finally { setCargando(false) }
  }, [idCaso])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!deNombres.trim() || !dePaterno.trim() || !idPais) return
    setCargando(true)
    try {
      const r = await BlancosService.crear(idCaso, {
        deNombres: deNombres.trim().toUpperCase(),
        dePaterno: dePaterno.trim().toUpperCase(),
        deMaterno: deMaterno.trim().toUpperCase() || undefined,
        deEsposo: deEsposo.trim().toUpperCase() || undefined,
        alias: alias.trim().toUpperCase() || undefined,
        idPais: Number(idPais),
      })
      if (r?.finalizado) {
        setDeNombres(''); setDePaterno(''); setDeMaterno(''); setDeEsposo(''); setAlias(''); setIdPais('')
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Blanco reSIGtrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (b: BlancoS2i) => {
    confirm({
      texto: `¿Eliminar a ${b.deNombres} ${b.dePaterno}?`,
      onConfirm: async () => {
        setCargando(true)
        try { await BlancosService.eliminar(b.idBlanco); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const req = (v: string) => !v && submitted

  const columns: Column<BlancoS2i>[] = [
    { accessor: 'deNombres', title: 'Nombres' },
    { accessor: 'dePaterno', title: 'Paterno' },
    { accessor: 'deMaterno', title: 'Materno' },
    { accessor: 'alias', title: 'Alias' },
    { accessor: 'descripcionPais', title: 'País' },
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
      <h4 className="mb-4 text-sm font-semibold">Blancos / Sujetos</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre(s) <span className="text-danger">*</span></label>
          <Input type="text" value={deNombres} onChange={(e) => setDeNombres(e.target.value.toUpperCase())} className={`w-full ${req(deNombres.trim()) ? 'border-danger' : ''}`} />
          {req(deNombres.trim()) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Paterno <span className="text-danger">*</span></label>
          <Input type="text" value={dePaterno} onChange={(e) => setDePaterno(e.target.value.toUpperCase())} className={`w-full ${req(dePaterno.trim()) ? 'border-danger' : ''}`} />
          {req(dePaterno.trim()) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Materno</label>
          <Input type="text" value={deMaterno} onChange={(e) => setDeMaterno(e.target.value.toUpperCase())} className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ap. Esposo(a)</label>
          <Input type="text" value={deEsposo} onChange={(e) => setDeEsposo(e.target.value.toUpperCase())} className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Alias</label>
          <Input type="text" value={alias} onChange={(e) => setAlias(e.target.value.toUpperCase())} className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">País <span className="text-danger">*</span></label>
          <Select value={idPais} onChange={(e) => setIdPais(e.target.value)} options={opcionesPaises} placeholder="Seleccione..." className={`w-full ${req(idPais) ? 'border-danger' : ''}`} />
          {req(idPais) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="lg:col-span-4 flex justify-end mt-2">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar</Button>
        </div>
      </div>

      <div className="mt-5 datatables">
        <VristoDataTable<BlancoS2i>
          loading={cargando}
          rows={blancos}
          total={blancos.length}
          limit={ITEMS_POR_PAGINA}
          page={1}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={columns}
          rowExpansion={{
            idField: 'idBlanco',
            expandedIds,
            onExpandChange: setExpandedIds,
            renderContent: (b) => (
              <BlancoExpansion
                blanco={b}
                opcionesPaises={opcionesPaises}
                opcionesDelito={opcionesDelito}
                opcionesContenido={opcionesContenido}
              />
            ),
          }}
        />
      </div>
    </div>
  )
}
