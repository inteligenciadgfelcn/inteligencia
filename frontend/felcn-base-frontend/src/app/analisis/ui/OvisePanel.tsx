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
import { BlancosService } from '@/services/analisis'
import type { BlancoS2i, Ovise } from '@/services/analisis'

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

interface Props {
  blanco: BlancoS2i
}

export function OvisePanel({ blanco }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const mapRef = useRef<any>(null)

  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<Ovise[]>([])

  const [lugar, setLugar] = useState('')
  const [latitud, setLatitud] = useState<string>('-16.500000')
  const [longitud, setLongitud] = useState<string>('-68.150000')
  const [reporte, setReporte] = useState('')
  const [accion, setAccion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const r = await BlancosService.listarOvise(blanco.idBlanco)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [blanco.idBlanco])

  useEffect(() => { void cargar() }, [cargar])

  const errorLugar = !lugar.trim() && submitted
  const errorReporte = !reporte.trim() && submitted
  const errorAccion = !accion.trim() && submitted

  const handleLatLonBlur = (campo: 'latitud' | 'longitud') => () => {
    const v = campo === 'latitud' ? latitud : longitud
    const num = parseFloat(v)
    if (isNaN(num)) return
    if (campo === 'latitud') setLatitud(num.toFixed(6))
    else setLongitud(num.toFixed(6))
  }

  const guardar = async () => {
    setSubmitted(true)
    if (!lugar.trim() || !latitud || !longitud || !reporte.trim() || !accion.trim()) return
    setCargando(true)
    try {
      const r = await BlancosService.crearOvise(blanco.idBlanco, {
        lugar: lugar.trim().toUpperCase(),
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        reporte: reporte.trim(),
        accion: accion.trim().toUpperCase(),
      })
      if (r?.finalizado) {
        setLugar(''); setReporte(''); setAccion(''); setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Reporte OVISE registrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (idOvise: string) => {
    confirm({
      texto: '¿Eliminar este reporte OVISE?',
      onConfirm: async () => {
        setCargando(true)
        try { await BlancosService.eliminarOvise(idOvise); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const handleMapClick = (center: [number, number]) => {
    setLatitud(center[0].toFixed(6))
    setLongitud(center[1].toFixed(6))
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Lugar <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value.toUpperCase())}
            className={`w-full ${errorLugar ? 'border-danger' : ''}`}
          />
          {errorLugar && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Latitud <span className="text-danger">*</span></label>
          <Input
            type="text"
            placeholder="-16.500000"
            value={latitud}
            onChange={(e) => setLatitud(formatLatLon(e.target.value))}
            onBlur={handleLatLonBlur('latitud')}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Longitud <span className="text-danger">*</span></label>
          <Input
            type="text"
            placeholder="-68.150000"
            value={longitud}
            onChange={(e) => setLongitud(formatLatLon(e.target.value))}
            onBlur={handleLatLonBlur('longitud')}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Acción <span className="text-danger">*</span></label>
          <Input
            type="text"
            maxLength={20}
            value={accion}
            onChange={(e) => setAccion(e.target.value.toUpperCase())}
            className={`w-full ${errorAccion ? 'border-danger' : ''}`}
          />
          {errorAccion && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div className="lg:col-span-3">
          <label className="mb-1 block text-sm font-medium">Reporte <span className="text-danger">*</span></label>
          <Textarea rows={2} value={reporte} onChange={(e) => setReporte(e.target.value)} uppercase error={errorReporte} className="w-full" />
          {errorReporte && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
      </div>

      <MapaConMarcador
        id={`mapa-ovise-${blanco.idBlanco}`}
        mapRef={mapRef}
        centro={[parseFloat(latitud) || -16.5, parseFloat(longitud) || -68.15]}
        zoom={13}
        height={300}
        onClick={handleMapClick}
        coordenadas={latitud && longitud ? [parseFloat(latitud), parseFloat(longitud)] : null}
      />

      <div className="flex justify-end">
        <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar</Button>
      </div>

      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-6 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin reportes OVISE registrados</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lista.map((o) => (
            <div
              key={o.idOvise}
              className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5 dark:border-gray-700/50">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                    {o.lugar}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => eliminar(o.idOvise)}
                    title="Eliminar reporte OVISE"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium text-gray-500">Acción:</span> {o.accion}</p>
                  <p className="mt-0.5 flex items-center gap-1">
                    <span className="font-medium text-gray-500">Coordenadas:</span> 
                    <span className="font-mono bg-gray-50 dark:bg-gray-900/50 px-1 py-0.5 rounded text-[10px]">
                      {o.latitud.toFixed(6)}, {o.longitud.toFixed(6)}
                    </span>
                  </p>
                  {o.reporte && (
                    <p className="mt-1.5 border-t border-gray-50 pt-1.5 dark:border-gray-700/30 text-gray-500 italic">
                      {o.reporte}
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
