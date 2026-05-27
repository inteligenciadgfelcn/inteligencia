'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import IconTrash from '@/components/Icon/IconTrash'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import type { CreateLugarSigPayload, LugarSig, RespuestaApi } from '@/services/analisis'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  {
    ssr: false,
    loading: () => <div className="h-[300px] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />,
  }
)

interface SigPanelService {
  crearLugar(idEntidad: string, payload: CreateLugarSigPayload): Promise<RespuestaApi<LugarSig>>
  listarLugares(idEntidad: string): Promise<RespuestaApi<LugarSig[]>>
  eliminarLugar(idLugar: string): Promise<RespuestaApi<unknown>>
}

interface SigPanelProps {
  idEntidad: string
  service: SigPanelService
  idField: keyof LugarSig
}

export function SIGPanel({ idEntidad, service, idField }: SigPanelProps) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const mapRef = useRef<any>(null)

  const [cargando, setCargando] = useState(false)
  const [lugares, setLugares] = useState<LugarSig[]>([])

  const [descripcion, setDescripcion] = useState('')
  const [coordX, setCoordX] = useState<string>('-16.5')
  const [coordY, setCoordY] = useState<string>('-68.15')
  const [contenido, setContenido] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const cargar = useCallback(async () => {
    if (!idEntidad) return
    setCargando(true)
    try {
      const res = await service.listarLugares(idEntidad)
      if (res?.finalizado) setLugares(res.datos ?? [])
    } finally {
      setCargando(false)
    }
  }, [idEntidad, service])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!descripcion.trim() || !coordX || !coordY || !contenido.trim()) return
    setCargando(true)
    try {
      const res = await service.crearLugar(idEntidad, {
        descripcion: descripcion.trim(),
        coordenadasX: parseFloat(coordX),
        coordenadasY: parseFloat(coordY),
        contenido: contenido.trim(),
      })
      if (res?.finalizado) {
        setDescripcion('')
        setContenido('')
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Lugar registrado', variant: 'success' })
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const eliminar = (idLugar: string) => {
    confirm({
      texto: '¿Eliminar este lugar?',
      onConfirm: async () => {
        setCargando(true)
        try {
          await service.eliminarLugar(idLugar)
          void cargar()
        } finally {
          setCargando(false)
        }
      },
    })
  }

  const handleMapClick = (center: [number, number]) => {
    setCoordX(String(center[0]))
    setCoordY(String(center[1]))
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />

      {/* ── Formulario ── */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Descripción <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
            className={`w-full ${!descripcion.trim() && submitted ? 'border-danger' : ''}`}
          />
          {!descripcion.trim() && submitted && (
            <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Latitud (X) <span className="text-danger">*</span></label>
          <Input
            type="number"
            step="any"
            value={coordX}
            onChange={(e) => setCoordX(e.target.value)}
            className={`w-full ${!coordX && submitted ? 'border-danger' : ''}`}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Longitud (Y) <span className="text-danger">*</span></label>
          <Input
            type="number"
            step="any"
            value={coordY}
            onChange={(e) => setCoordY(e.target.value)}
            className={`w-full ${!coordY && submitted ? 'border-danger' : ''}`}
          />
        </div>
        <div className="lg:col-span-4">
          <label className="mb-1 block text-sm font-medium">Contenido / Descripción del punto <span className="text-danger">*</span></label>
          <Textarea
            rows={2}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            error={!contenido.trim() && submitted}
            className="w-full"
          />
          {!contenido.trim() && submitted && (
            <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>
          )}
        </div>
      </div>

      {/* ── Mapa ── */}
      <MapaConMarcador
        id={`mapa-gis-${idEntidad}`}
        mapRef={mapRef}
        centro={[parseFloat(coordX) || -16.5, parseFloat(coordY) || -68.15]}
        zoom={13}
        height={300}
        onClick={handleMapClick}
        coordenadas={coordX && coordY ? [parseFloat(coordX), parseFloat(coordY)] : null}
      />

      <div className="flex justify-end">
        <Button variant="success" size="sm" type="button" onClick={() => void guardar()} disabled={cargando}>
          Guardar
        </Button>
      </div>

      {/* ── Lista ── */}
      {lugares.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-6 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin lugares SIG registrados</span>
        </div>
      ) : (
        <ul className="divide-y divide-[#e0e6ed] dark:divide-gray-700">
          {lugares.map((l, idx) => {
            const id = String(l[idField] ?? idx)
            return (
              <li key={id} className="flex items-start justify-between gap-2 py-2">
                <div className="text-sm">
                  <span className="font-medium">{l.descripcion}</span>
                  <span className="ml-2 text-xs text-gray-500">({l.coordenadasX}, {l.coordenadasY})</span>
                  {l.contenido && <p className="text-xs text-gray-400 mt-0.5">{l.contenido}</p>}
                </div>
                <Button variant="danger" size="sm" className="shrink-0" onClick={() => eliminar(id)}>
                  <IconTrash className="h-4 w-4" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
