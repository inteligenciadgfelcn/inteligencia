'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import IconMapPin from '@/components/Icon/IconMapPin'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { BuscadorLugar } from './BuscadorLugar'
import { ColorSwatch } from './ColorSwatch'
import {
  FlujoTransporteS2iService,
  S2iLookupsService,
} from '@/services/analisis'
import type {
  ColorS2i,
  ConductorS2i,
  CreateFlujoTransportePayload,
  FlujoTransporteS2i,
  LugarS2i,
  TransporteS2i,
} from '@/services/analisis'

interface Props {
  conductor: ConductorS2i | null
  transporte: TransporteS2i | null
  onRegistrado: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const fechaHoraActualLocal = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const formatFechaHora = (iso: string) => {
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

const formatLatLon = (v: string) => {
  if (v === '' || v === '-' || v === '.') return v
  let cleaned = v.replace(/[^0-9.-]/g, '')
  const isNegative = cleaned.startsWith('-')
  cleaned = cleaned.replace(/-/g, '')
  if (isNegative) cleaned = '-' + cleaned
  const parts = cleaned.split('.')
  if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('')
  const finalParts = cleaned.split('.')
  if (finalParts[1] !== undefined) return finalParts[0] + '.' + finalParts[1].slice(0, 7)
  return cleaned
}

export function SeccionFlujoTransporte({ conductor, transporte, onRegistrado }: Props) {
  const { Alerta } = useAlerts()

  const [colores, setColores] = useState<ColorS2i[]>([])
  const [lugar, setLugar] = useState<LugarS2i | null>(null)
  const [idColor, setIdColor] = useState('')
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [carga, setCarga] = useState('')
  const [fechaHora, setFechaHora] = useState(fechaHoraActualLocal())
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')
  const [geoEstado, setGeoEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle')

  const [submitted, setSubmitted] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<FlujoTransporteS2i | null>(null)

  useEffect(() => {
    S2iLookupsService.listarColores()
      .then((r) => {
        if (r?.finalizado) {
          const datos = r.datos ?? []
          setColores(datos)
          const blanco = datos.find((c) => c.color?.trim().toUpperCase() === 'BLANCO')
          if (blanco) setIdColor(String(blanco.id))
        }
      })
      .catch(() => { })
  }, [])

  const capturarUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoEstado('error')
      return
    }
    setGeoEstado('cargando')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitud(pos.coords.latitude.toFixed(7))
        setLongitud(pos.coords.longitude.toFixed(7))
        setGeoEstado('ok')
      },
      () => setGeoEstado('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => { capturarUbicacion() }, [])

  const habilitado = !!conductor && !!transporte

  const req = (v: string) => !v.trim() && submitted

  const registrar = async () => {
    setSubmitted(true)
    if (!conductor || !transporte) return
    if (!lugar || !idColor || !origen.trim() || !destino.trim() || !carga.trim() || !fechaHora || !latitud.trim() || !longitud.trim()) return

    const payload: CreateFlujoTransportePayload = {
      codigoTransporte: transporte.codigoTransporte,
      numeroDocumento: conductor.numeroDocumento,
      idLugar: lugar.idLugar,
      idColor: Number(idColor),
      origen: origen.trim(),
      destino: destino.trim(),
      carga: carga.trim(),
      fechaHora: `${fechaHora}:00`,
      latitud: Number(latitud),
      longitud: Number(longitud),
    }

    setCargando(true)
    try {
      const r = await FlujoTransporteS2iService.crear(payload)
      if (r?.finalizado) {
        setResultado(r.datos)
        Alerta({ mensaje: 'Flujo de transporte registrado', variant: 'success' })
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  if (resultado) {
    const colorSel = colores.find((c) => c.id === resultado.idColor)
    return (
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-success">Flujo de transporte registrado</span>
          <button type="button" className="text-xs text-primary hover:underline" onClick={onRegistrado}>Registrar otro</button>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-3">
          <div><dt className="text-xs text-gray-500">Conductor</dt><dd className="font-medium">{conductor?.nombres} {conductor?.paterno}</dd></div>
          <div><dt className="text-xs text-gray-500">Transporte</dt><dd className="font-medium">{resultado.codigoTransporte}</dd></div>
          <div><dt className="text-xs text-gray-500">Lugar</dt><dd className="font-medium">{lugar?.descripcion}</dd></div>
          <div><dt className="text-xs text-gray-500">Color</dt><dd className="font-medium">{colorSel ? <ColorSwatch color={colorSel} /> : resultado.idColor}</dd></div>
          <div><dt className="text-xs text-gray-500">Origen</dt><dd className="font-medium">{resultado.origen}</dd></div>
          <div><dt className="text-xs text-gray-500">Destino</dt><dd className="font-medium">{resultado.destino}</dd></div>
          <div><dt className="text-xs text-gray-500">Carga</dt><dd className="font-medium">{resultado.carga}</dd></div>
          <div><dt className="text-xs text-gray-500">Fecha y hora</dt><dd className="font-medium">{formatFechaHora(resultado.fechaHora)}</dd></div>
          <div><dt className="text-xs text-gray-500">Coordenadas</dt><dd className="font-medium">{resultado.latitud}, {resultado.longitud}</dd></div>
        </dl>
      </div>
    )
  }

  return (
    <div className={`rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b] ${!habilitado ? 'opacity-50' : ''}`}>
      <LoadingDialog show={cargando} />
      <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <IconMapPin className="h-4 w-4" /> Registrar Flujo de Transporte
      </h4>

      {!habilitado ? (
        <p className="text-xs text-gray-500">Busque primero un conductor y un transporte para continuar.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-sm font-medium">Lugar <span className="text-danger">*</span></label>
            <BuscadorLugar valor={lugar} onSeleccionar={setLugar} error={req(lugar ? '1' : '')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Color <span className="text-danger">*</span></label>
            <Select
              value={idColor}
              onChange={(e) => setIdColor(e.target.value)}
              options={colores.map((c) => ({ value: c.id, label: c.color }))}
              placeholder="Seleccione"
              className={`w-full ${req(idColor) ? 'border-danger' : ''}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha y hora <span className="text-danger">*</span></label>
            <Input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} className={`w-full ${req(fechaHora) ? 'border-danger' : ''}`} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Origen <span className="text-danger">*</span></label>
            <Input type="text" value={origen} onChange={(e) => setOrigen(e.target.value)} className={`w-full ${req(origen) ? 'border-danger' : ''}`} uppercase trimOnBlur />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Destino <span className="text-danger">*</span></label>
            <Input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} className={`w-full ${req(destino) ? 'border-danger' : ''}`} uppercase trimOnBlur />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Carga <span className="text-danger">*</span></label>
            <Input type="text" value={carga} onChange={(e) => setCarga(e.target.value)} className={`w-full ${req(carga) ? 'border-danger' : ''}`} uppercase trimOnBlur />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium">Ubicación (latitud / longitud) <span className="text-danger">*</span></label>
              <button type="button" className="flex items-center gap-1 text-xs text-primary hover:underline" onClick={capturarUbicacion}>
                <IconMapPin className="h-3 w-3" /> Usar mi ubicación actual
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="text" value={latitud} placeholder="-16.5000000" onChange={(e) => setLatitud(formatLatLon(e.target.value))} className={`w-full ${req(latitud) ? 'border-danger' : ''}`} />
              <Input type="text" value={longitud} placeholder="-68.1500000" onChange={(e) => setLongitud(formatLatLon(e.target.value))} className={`w-full ${req(longitud) ? 'border-danger' : ''}`} />
            </div>
            {geoEstado === 'cargando' && <span className="mt-1 block text-xs text-gray-400">Obteniendo ubicación actual...</span>}
            {geoEstado === 'error' && <span className="mt-1 block text-xs text-warning">No se pudo obtener la ubicación automáticamente. Ingrésela manualmente.</span>}
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <Button variant="success" size="sm" onClick={() => void registrar()} disabled={cargando}>
              Registrar Flujo de Transporte
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
