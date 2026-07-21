'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import IconTag from '@/components/Icon/IconTag'
import IconSearch from '@/components/Icon/IconSearch'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { TransporteS2iService, FlujoTransporteS2iService, S2iLookupsService } from '@/services/analisis'
import type { ColorS2i, CreateTransportePayload, TransporteS2i } from '@/services/analisis'
import { BadgeColorSugerido } from './BadgeColorSugerido'

const FORM_INICIAL = {
  tipoVehiculo: '',
  marca: '',
  modelo: '',
  clase: '',
  color: '',
  motor: '',
  chasis: '',
}

interface Props {
  onResuelto?: (transporte: TransporteS2i | null) => void
}

export function PanelTransporte({ onResuelto }: Props) {
  const { Alerta } = useAlerts()

  const [placa, setPlaca] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<TransporteS2i | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(FORM_INICIAL)
  const [colores, setColores] = useState<ColorS2i[]>([])
  const [coloresSugeridos, setColoresSugeridos] = useState<number[]>([])

  useEffect(() => {
    onResuelto?.(resultado)
  }, [resultado]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    S2iLookupsService.listarColores()
      .then((r) => { if (r?.finalizado) setColores(r.datos ?? []) })
      .catch(() => { })
  }, [])

  // Sugerencia visual de parametricas.regla_color para la placa resuelta.
  // Solo informa — la selección final del color queda a criterio del usuario.
  useEffect(() => {
    if (!resultado?.codigoTransporte) {
      setColoresSugeridos([])
      return
    }
    FlujoTransporteS2iService.colorSugerido(undefined, resultado.codigoTransporte)
      .then((r) => setColoresSugeridos(r?.finalizado ? (r.datos?.colores.map((c) => c.idColor) ?? []) : []))
      .catch(() => setColoresSugeridos([]))
  }, [resultado?.codigoTransporte])

  const setCampo = (campo: keyof typeof FORM_INICIAL) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const reiniciar = () => {
    setPlaca('')
    setResultado(null)
    setMostrarFormulario(false)
    setSubmitted(false)
    setForm(FORM_INICIAL)
  }

  const buscar = async () => {
    const p = placa.trim().toUpperCase()
    if (!p) return
    setPlaca(p)
    setResultado(null)
    setMostrarFormulario(false)
    setSubmitted(false)
    setForm(FORM_INICIAL)
    setCargando(true)
    try {
      const r = await TransporteS2iService.buscarOResolver(p)
      if (r?.finalizado) setResultado(r.datos)
    } catch (e: any) {
      if (e?.codigo === 404) {
        setMostrarFormulario(true)
        Alerta({
          variant: 'warning',
          mensaje: `No se encontró la placa ${p} en felcn_vls. Complete los datos para registrarla.`,
        })
      } else {
        Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      }
    } finally {
      setCargando(false)
    }
  }

  const registrar = async () => {
    setSubmitted(true)
    const requeridos: (keyof typeof FORM_INICIAL)[] = [
      'tipoVehiculo', 'marca', 'modelo', 'clase', 'color', 'motor', 'chasis',
    ]
    if (requeridos.some((c) => !form[c].trim())) return

    const payload: CreateTransportePayload = {
      placa: placa.trim().toUpperCase(),
      tipoVehiculo: form.tipoVehiculo.trim(),
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      clase: form.clase.trim(),
      color: form.color.trim(),
      motor: form.motor.trim(),
      chasis: form.chasis.trim(),
    }

    setCargando(true)
    try {
      const r = await TransporteS2iService.crear(payload)
      if (r?.finalizado) {
        setResultado(r.datos)
        setMostrarFormulario(false)
        Alerta({ mensaje: 'Transporte registrado', variant: 'success' })
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const req = (v: string) => !v.trim() && submitted

  return (
    <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
      <LoadingDialog show={cargando} />
      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <IconTag className="h-4 w-4" /> Vehículos → Transporte
      </h4>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Placa o código Charly Papa</label>
          <Input
            type="text"
            value={placa}
            placeholder="Ej. 1234ABC"
            onChange={(e) => setPlaca(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void buscar() }}
            className="w-full"
            uppercase
            trimOnBlur
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => void buscar()} disabled={cargando || !placa.trim()} icon={<IconSearch className="h-4 w-4" />}>
          Buscar
        </Button>
      </div>

      {resultado && (
        <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Transporte</span>
              <BadgeColorSugerido idColores={coloresSugeridos} colores={colores} />
            </div>
            <button type="button" className="text-xs text-primary hover:underline" onClick={reiniciar}>Buscar otro</button>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><dt className="text-xs text-gray-500">Código</dt><dd className="font-medium">{resultado.codigoTransporte}</dd></div>
            <div><dt className="text-xs text-gray-500">Tipo</dt><dd className="font-medium">{resultado.tipo}</dd></div>
            <div><dt className="text-xs text-gray-500">Marca</dt><dd className="font-medium">{resultado.marca}</dd></div>
            <div><dt className="text-xs text-gray-500">Modelo</dt><dd className="font-medium">{resultado.modelo}</dd></div>
            <div><dt className="text-xs text-gray-500">Clase</dt><dd className="font-medium">{resultado.clase}</dd></div>
            <div><dt className="text-xs text-gray-500">Color</dt><dd className="font-medium">{resultado.color}</dd></div>
            <div><dt className="text-xs text-gray-500">Chasis</dt><dd className="font-medium">{resultado.chasis}</dd></div>
            <div><dt className="text-xs text-gray-500">Motor</dt><dd className="font-medium">{resultado.motor}</dd></div>
          </dl>
        </div>
      )}

      {mostrarFormulario && (
        <div className="mt-4 border-t border-[#e0e6ed] pt-4 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-warning">Registrar nuevo transporte</span>
            <button type="button" className="text-xs text-primary hover:underline" onClick={reiniciar}>Cancelar</button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo de vehículo <span className="text-danger">*</span></label>
              <Input type="text" maxLength={10} value={form.tipoVehiculo} onChange={setCampo('tipoVehiculo')} className={`w-full ${req(form.tipoVehiculo) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Marca <span className="text-danger">*</span></label>
              <Input type="text" maxLength={50} value={form.marca} onChange={setCampo('marca')} className={`w-full ${req(form.marca) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Modelo <span className="text-danger">*</span></label>
              <Input type="text" maxLength={4} value={form.modelo} onChange={setCampo('modelo')} className={`w-full ${req(form.modelo) ? 'border-danger' : ''}`} placeholder="Ej. 2020" uppercase trimOnBlur />
              <span className="mt-1 block text-xs text-gray-400">Máx. 4 caracteres</span>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Clase <span className="text-danger">*</span></label>
              <Input type="text" maxLength={15} value={form.clase} onChange={setCampo('clase')} className={`w-full ${req(form.clase) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Color <span className="text-danger">*</span></label>
              <Input type="text" maxLength={20} value={form.color} onChange={setCampo('color')} className={`w-full ${req(form.color) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Número de motor <span className="text-danger">*</span></label>
              <Input type="text" maxLength={30} value={form.motor} onChange={setCampo('motor')} className={`w-full ${req(form.motor) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Número de chasis <span className="text-danger">*</span></label>
              <Input type="text" maxLength={30} value={form.chasis} onChange={setCampo('chasis')} className={`w-full ${req(form.chasis) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="success" size="sm" onClick={() => void registrar()} disabled={cargando}>
              Registrar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
