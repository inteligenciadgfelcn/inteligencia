'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import IconUser from '@/components/Icon/IconUser'
import IconSearch from '@/components/Icon/IconSearch'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ConductorS2iService, FlujoTransporteS2iService, S2iLookupsService } from '@/services/analisis'
import type { ColorS2i, ConductorS2i, CreateConductorPayload } from '@/services/analisis'
import { BadgeColorSugerido } from './BadgeColorSugerido'

const FORM_INICIAL = {
  nombres: '',
  paterno: '',
  materno: '',
  esposo: '',
  sexo: '',
  ocupacion: '',
  dir1: '',
  dir2: '',
  nomdep: '',
  nomprov: '',
  nommun: '',
  fechanac: '',
}

interface Props {
  onResuelto?: (conductor: ConductorS2i | null) => void
}

export function PanelConductor({ onResuelto }: Props) {
  const { Alerta } = useAlerts()

  const [documento, setDocumento] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<ConductorS2i | null>(null)
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

  // Sugerencia visual de parametricas.regla_color para el documento resuelto.
  // Solo informa — la selección final del color queda a criterio del usuario.
  useEffect(() => {
    if (!resultado?.numeroDocumento) {
      setColoresSugeridos([])
      return
    }
    FlujoTransporteS2iService.colorSugerido(resultado.numeroDocumento)
      .then((r) => setColoresSugeridos(r?.finalizado ? (r.datos?.colores.map((c) => c.idColor) ?? []) : []))
      .catch(() => setColoresSugeridos([]))
  }, [resultado?.numeroDocumento])

  const setCampo = (campo: keyof typeof FORM_INICIAL) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const reiniciar = () => {
    setDocumento('')
    setResultado(null)
    setMostrarFormulario(false)
    setSubmitted(false)
    setForm(FORM_INICIAL)
  }

  const buscar = async () => {
    const doc = documento.trim().toUpperCase()
    if (!doc) return
    setDocumento(doc)
    setResultado(null)
    setMostrarFormulario(false)
    setSubmitted(false)
    setForm(FORM_INICIAL)
    setCargando(true)
    try {
      const r = await ConductorS2iService.buscarOResolver(doc)
      if (r?.finalizado) setResultado(r.datos)
    } catch (e: any) {
      if (e?.codigo === 404) {
        setMostrarFormulario(true)
        Alerta({
          variant: 'warning',
          mensaje: `No se encontró el documento ${doc} en felcn_personas. Complete los datos para registrarlo.`,
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
      'nombres', 'paterno', 'materno', 'sexo', 'ocupacion', 'dir1',
      'nomdep', 'nomprov', 'nommun', 'fechanac',
    ]
    if (requeridos.some((c) => !form[c].trim())) return

    const payload: CreateConductorPayload = {
      documento: documento.trim().toUpperCase(),
      nombres: form.nombres.trim(),
      paterno: form.paterno.trim(),
      materno: form.materno.trim(),
      esposo: form.esposo.trim(),
      sexo: form.sexo.trim(),
      ocupacion: form.ocupacion.trim(),
      dir1: form.dir1.trim(),
      dir2: form.dir2.trim(),
      nomdep: form.nomdep.trim(),
      nomprov: form.nomprov.trim(),
      nommun: form.nommun.trim(),
      fechanac: form.fechanac,
    }

    setCargando(true)
    try {
      const r = await ConductorS2iService.crear(payload)
      if (r?.finalizado) {
        setResultado(r.datos)
        setMostrarFormulario(false)
        Alerta({ mensaje: 'Conductor registrado', variant: 'success' })
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
        <IconUser className="h-4 w-4" /> Personas → Conductor
      </h4>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Documento de identidad</label>
          <Input
            type="text"
            value={documento}
            placeholder="Ej. 1234567"
            onChange={(e) => setDocumento(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void buscar() }}
            className="w-full"
            uppercase
            trimOnBlur
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => void buscar()} disabled={cargando || !documento.trim()} icon={<IconSearch className="h-4 w-4" />}>
          Buscar
        </Button>
      </div>

      {resultado && (
        <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Conductor</span>
              <BadgeColorSugerido idColores={coloresSugeridos} colores={colores} />
            </div>
            <button type="button" className="text-xs text-primary hover:underline" onClick={reiniciar}>Buscar otro</button>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><dt className="text-xs text-gray-500">Documento</dt><dd className="font-medium">{resultado.numeroDocumento}</dd></div>
            <div><dt className="text-xs text-gray-500">Nombres</dt><dd className="font-medium">{resultado.nombres}</dd></div>
            <div><dt className="text-xs text-gray-500">Paterno</dt><dd className="font-medium">{resultado.paterno}</dd></div>
            <div><dt className="text-xs text-gray-500">Materno</dt><dd className="font-medium">{resultado.materno}</dd></div>
            <div><dt className="text-xs text-gray-500">Esposo(a)</dt><dd className="font-medium">{resultado.esposo || '-'}</dd></div>
            <div><dt className="text-xs text-gray-500">Sexo</dt><dd className="font-medium">{resultado.sexo}</dd></div>
            <div><dt className="text-xs text-gray-500">Ocupación</dt><dd className="font-medium">{resultado.ocupacion}</dd></div>
            <div><dt className="text-xs text-gray-500">Dirección</dt><dd className="font-medium">{resultado.direccion}</dd></div>
          </dl>
        </div>
      )}

      {mostrarFormulario && (
        <div className="mt-4 border-t border-[#e0e6ed] pt-4 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-warning">Registrar nueva persona</span>
            <button type="button" className="text-xs text-primary hover:underline" onClick={reiniciar}>Cancelar</button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Nombres <span className="text-danger">*</span></label>
              <Input type="text" value={form.nombres} onChange={setCampo('nombres')} className={`w-full ${req(form.nombres) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Apellido paterno <span className="text-danger">*</span></label>
              <Input type="text" value={form.paterno} onChange={setCampo('paterno')} className={`w-full ${req(form.paterno) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Apellido materno <span className="text-danger">*</span></label>
              <Input type="text" value={form.materno} onChange={setCampo('materno')} className={`w-full ${req(form.materno) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Apellido de esposo(a)</label>
              <Input type="text" value={form.esposo} onChange={setCampo('esposo')} className="w-full" uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sexo <span className="text-danger">*</span></label>
              <Select
                value={form.sexo}
                onChange={setCampo('sexo')}
                options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]}
                placeholder="Seleccione"
                className={`w-full ${req(form.sexo) ? 'border-danger' : ''}`}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ocupación <span className="text-danger">*</span></label>
              <Input type="text" value={form.ocupacion} onChange={setCampo('ocupacion')} className={`w-full ${req(form.ocupacion) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Fecha de nacimiento <span className="text-danger">*</span></label>
              <Input type="date" value={form.fechanac} onChange={setCampo('fechanac')} className={`w-full ${req(form.fechanac) ? 'border-danger' : ''}`} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Dirección de domicilio <span className="text-danger">*</span></label>
              <Input type="text" value={form.dir1} onChange={setCampo('dir1')} className={`w-full ${req(form.dir1) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Dirección secundaria / referencia</label>
              <Input type="text" value={form.dir2} onChange={setCampo('dir2')} className="w-full" uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Departamento <span className="text-danger">*</span></label>
              <Input type="text" value={form.nomdep} onChange={setCampo('nomdep')} className={`w-full ${req(form.nomdep) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Provincia <span className="text-danger">*</span></label>
              <Input type="text" value={form.nomprov} onChange={setCampo('nomprov')} className={`w-full ${req(form.nomprov) ? 'border-danger' : ''}`} uppercase trimOnBlur />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Municipio <span className="text-danger">*</span></label>
              <Input type="text" value={form.nommun} onChange={setCampo('nommun')} className={`w-full ${req(form.nommun) ? 'border-danger' : ''}`} uppercase trimOnBlur />
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
