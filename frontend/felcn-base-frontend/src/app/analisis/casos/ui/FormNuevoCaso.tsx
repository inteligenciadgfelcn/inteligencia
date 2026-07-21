'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { CasosS2iService, S2iLookupsService } from '@/services/analisis'
import type { LookupSimple } from '@/services/analisis'

type Opcion = { value: string; label: string }

const toOpciones = (list: LookupSimple[]): Opcion[] =>
  list.map((o) => ({ value: String(o.id), label: o.descripcion }))

export function FormNuevoCaso() {
  const router = useRouter()
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [opcionesPaises, setOpcionesPaises] = useState<Opcion[]>([])
  const [opcionesEstado, setOpcionesEstado] = useState<Opcion[]>([])
  const [opcionesEtapa, setOpcionesEtapa] = useState<Opcion[]>([])

  const [idPais, setIdPais] = useState('')
  const [lugar, setLugar] = useState('')
  const [nombreCaso, setNombreCaso] = useState('')
  const [palabraClave, setPalabraClave] = useState('')
  const [idEstadoCaso, setIdEstadoCaso] = useState('')
  const [idEtapa, setIdEtapa] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [nroCasoCer, setNroCasoCer] = useState('')
  const [antecedentes, setAntecedentes] = useState('')

  const cargarLookups = useCallback(async () => {
    const [rPaises, rEstados, rEtapas] = await Promise.all([
      S2iLookupsService.listarPaises(4),
      S2iLookupsService.listarEstadosCaso(),
      S2iLookupsService.listarEtapasInvestigacion(),
    ])
    if (rPaises?.finalizado) setOpcionesPaises(toOpciones(rPaises.datos ?? []))
    if (rEstados?.finalizado) setOpcionesEstado(toOpciones(rEstados.datos ?? []))
    if (rEtapas?.finalizado) setOpcionesEtapa(toOpciones(rEtapas.datos ?? []))
  }, [])

  useEffect(() => { void cargarLookups() }, [cargarLookups])

  const calcularNumero = async () => {
    if (!idPais) {
      Alerta({ mensaje: 'Seleccione un país primero', variant: 'warning' })
      return
    }
    setCargando(true)
    try {
      const gestion = new Date().getFullYear()
      const res = await CasosS2iService.calcularNumero(Number(idPais), gestion)
      if (res?.finalizado) setNroCasoCer(res.datos?.numeroCaso ?? '')
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const guardar = async () => {
    setSubmitted(true)
    if (!idPais || !lugar.trim() || !nombreCaso.trim() || !idEstadoCaso || !idEtapa || !fechaInicio || !antecedentes.trim()) return
    setCargando(true)
    try {
      const res = await CasosS2iService.crear({
        idPais: Number(idPais),
        lugar: lugar.trim().toUpperCase(),
        nombreCaso: nombreCaso.trim().toUpperCase(),
        palabraClave: palabraClave.trim().toUpperCase() || undefined,
        idEstadoCaso: Number(idEstadoCaso),
        nroCasoCer: nroCasoCer || undefined,
        idEtapaInvestigacion: Number(idEtapa),
        fechaInicio,
        antecedentes: antecedentes.trim().toUpperCase(),
      })
      if (res?.finalizado) {
        Alerta({ mensaje: 'Caso registrado exitosamente', variant: 'success' })
        router.replace('/analisis/casos')
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const required = (val: string) => !val && submitted

  return (
    <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
      <LoadingDialog show={cargando} />
      <h4 className="mb-4 text-sm font-semibold">Datos del Caso</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* País */}
        <div>
          <label className="mb-1 block text-sm font-medium">País <span className="text-danger">*</span></label>
          <Select
            value={idPais}
            onChange={(e) => setIdPais(e.target.value)}
            options={opcionesPaises}
            placeholder="Seleccione un país"
            className={`w-full ${required(idPais) ? 'border-danger' : ''}`}
          />
          {required(idPais) && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>

        {/* Lugar */}
        <div>
          <label className="mb-1 block text-sm font-medium">Lugar <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value.toUpperCase())}
            className={`w-full ${required(lugar.trim()) ? 'border-danger' : ''}`}
          />
          {required(lugar.trim()) && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>

        {/* Nombre Caso */}
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nombre del Caso <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={nombreCaso}
            onChange={(e) => setNombreCaso(e.target.value.toUpperCase())}
            className={`w-full ${required(nombreCaso.trim()) ? 'border-danger' : ''}`}
          />
          {required(nombreCaso.trim()) && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>

        {/* Estado Caso */}
        <div>
          <label className="mb-1 block text-sm font-medium">Estado del Caso <span className="text-danger">*</span></label>
          <Select
            value={idEstadoCaso}
            onChange={(e) => setIdEstadoCaso(e.target.value)}
            options={opcionesEstado}
            placeholder="Seleccione..."
            className={`w-full ${required(idEstadoCaso) ? 'border-danger' : ''}`}
          />
          {required(idEstadoCaso) && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>

        {/* Etapa */}
        <div>
          <label className="mb-1 block text-sm font-medium">Etapa de Investigación <span className="text-danger">*</span></label>
          <Select
            value={idEtapa}
            onChange={(e) => setIdEtapa(e.target.value)}
            options={opcionesEtapa}
            placeholder="Seleccione..."
            className={`w-full ${required(idEtapa) ? 'border-danger' : ''}`}
          />
          {required(idEtapa) && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="mb-1 block text-sm font-medium">Fecha de Inicio <span className="text-danger">*</span></label>
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className={`w-full ${required(fechaInicio) ? 'border-danger' : ''}`}
          />
          {required(fechaInicio) && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>

        {/* Palabra Clave */}
        <div>
          <label className="mb-1 block text-sm font-medium">Palabra Clave</label>
          <Input
            type="text"
            value={palabraClave}
            onChange={(e) => setPalabraClave(e.target.value.toUpperCase())}
            className="w-full"
          />
        </div>

        {/* Número Correlativo */}
        <div className="lg:col-span-3">
          <label className="mb-1 block text-sm font-medium">Número Correlativo (Nro. Caso CER)</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={nroCasoCer}
              onChange={(e) => setNroCasoCer(e.target.value.toUpperCase())}
              placeholder="INV-XX-N/GG"
              className="w-full"
            />
            <Button type="button" variant="info" size="sm" onClick={() => void calcularNumero()} disabled={cargando}>
              CREAR CÓDIGO DE INVESTIGACIÓN
            </Button>
          </div>
        </div>

        {/* Antecedentes */}
        <div className="lg:col-span-4">
          <label className="mb-1 block text-sm font-medium">Antecedentes <span className="text-danger">*</span></label>
          <Textarea
            rows={4}
            value={antecedentes}
            onChange={(e) => setAntecedentes(e.target.value)}
            uppercase
            error={!antecedentes.trim() && submitted}
            className="w-full"
          />
          {!antecedentes.trim() && submitted && (
            <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>
          )}
        </div>

        {/* Acciones */}
        <div className="lg:col-span-4 flex justify-end gap-2">
          <Button type="button" variant="outline-secondary" size="sm" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="button" variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
