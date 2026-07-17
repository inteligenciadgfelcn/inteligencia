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

const formatLatLon = (v: string) => {
  if (v === '' || v === '-' || v === '.') return v
  let cleaned = v.replace(/[^0-9.-]/g, '')
  const isNegative = cleaned.startsWith('-')
  cleaned = cleaned.replace(/-/g, '')
  if (isNegative) cleaned = '-' + cleaned
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  const finalParts = cleaned.split('.')
  if (finalParts[1] !== undefined) {
    return finalParts[0] + '.' + finalParts[1].slice(0, 6)
  }
  return cleaned
}

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
  const [coordX, setCoordX] = useState<string>('-16.500000')
  const [coordY, setCoordY] = useState<string>('-68.150000')
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

  const handleLatLonBlur = (campo: 'coordX' | 'coordY') => () => {
    const v = campo === 'coordX' ? coordX : coordY
    const num = parseFloat(v)
    if (isNaN(num)) return
    if (campo === 'coordX') setCoordX(num.toFixed(6))
    else setCoordY(num.toFixed(6))
  }

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
    setCoordX(center[0].toFixed(6))
    setCoordY(center[1].toFixed(6))
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
            type="text"
            placeholder="-16.500000"
            value={coordX}
            onChange={(e) => setCoordX(formatLatLon(e.target.value))}
            onBlur={handleLatLonBlur('coordX')}
            className={`w-full ${!coordX && submitted ? 'border-danger' : ''}`}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Longitud (Y) <span className="text-danger">*</span></label>
          <Input
            type="text"
            placeholder="-68.150000"
            value={coordY}
            onChange={(e) => setCoordY(formatLatLon(e.target.value))}
            onBlur={handleLatLonBlur('coordY')}
            className={`w-full ${!coordY && submitted ? 'border-danger' : ''}`}
          />
        </div>
        <div className="lg:col-span-4">
          <label className="mb-1 block text-sm font-medium">Contenido / Descripción del punto <span className="text-danger">*</span></label>
          <Textarea
            rows={2}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            uppercase
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lugares.map((l, idx) => {
            const id = String(l[idField] ?? idx)
            return (
              <div
                key={id}
                className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5 dark:border-gray-700/50">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                      {l.descripcion}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => eliminar(id)}
                      title="Eliminar lugar"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-1">
                      <span className="font-medium text-gray-500">Coordenadas:</span> 
                      <span className="font-mono bg-gray-50 dark:bg-gray-900/50 px-1 py-0.5 rounded text-[10px]">
                        {l.coordenadasX.toFixed(6)}, {l.coordenadasY.toFixed(6)}
                      </span>
                    </p>
                    {l.contenido && (
                      <p className="mt-1.5 border-t border-gray-50 pt-1.5 dark:border-gray-700/30 text-gray-500 italic">
                        {l.contenido}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
