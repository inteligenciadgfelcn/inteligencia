'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import IconTrash from '@/components/Icon/IconTrash'
import IconDownload from '@/components/Icon/IconDownload'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { DropzoneFoto } from './DropzoneFoto'
import { BlancosService, S2iLookupsService } from '@/services/analisis'
import type { ActivoPatrimonial, BlancoS2i, LookupSimple } from '@/services/analisis'

interface Props {
  blanco: BlancoS2i
}

export function ActivoPatrimonialPanel({ blanco }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const descargandoRef = useRef(false)

  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<ActivoPatrimonial[]>([])
  const [opcionesTipoActivo, setOpcionesTipoActivo] = useState<LookupSimple[]>([])

  const [idTipoActivo, setIdTipoActivo] = useState('')
  const [gestion, setGestion] = useState('')
  const [contenido, setContenido] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    S2iLookupsService.listarTiposActivo()
      .then((r) => { if (r?.finalizado) setOpcionesTipoActivo(r.datos ?? []) })
      .catch(() => {})
  }, [])

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const r = await BlancosService.listarActivosPatrimoniales(blanco.idBlanco)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [blanco.idBlanco])

  useEffect(() => { void cargar() }, [cargar])

  const errorTipo = !idTipoActivo && submitted
  const errorGestion = !/^\d{4}$/.test(gestion) && submitted
  const errorContenido = !contenido.trim() && submitted
  const errorArchivo = !archivo && submitted

  const guardar = async () => {
    setSubmitted(true)
    if (!idTipoActivo || !/^\d{4}$/.test(gestion) || !contenido.trim() || !archivo) return
    setCargando(true)
    try {
      const r = await BlancosService.subirActivoPatrimonial(
        blanco.idBlanco,
        { idTipoActivo: Number(idTipoActivo), gestion, contenido: contenido.trim() },
        archivo
      )
      if (r?.finalizado) {
        setIdTipoActivo(''); setGestion(''); setContenido(''); setArchivo(null); setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Activo patrimonial registrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const descargar = async (a: ActivoPatrimonial) => {
    if (descargandoRef.current) return
    descargandoRef.current = true
    try {
      const blob = await BlancosService.descargarActivoPatrimonial(a.idActivoPatrimonial)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `activo-patrimonial-${a.idActivoPatrimonial}`
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      descargandoRef.current = false
    }
  }

  const eliminar = (idActivoPatrimonial: string) => {
    confirm({
      texto: '¿Eliminar este activo patrimonial?',
      onConfirm: async () => {
        setCargando(true)
        try { await BlancosService.eliminarActivoPatrimonial(idActivoPatrimonial); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Activo <span className="text-danger">*</span></label>
          <Select
            value={idTipoActivo}
            onChange={(e) => setIdTipoActivo(e.target.value)}
            options={opcionesTipoActivo.map((o) => ({ value: String(o.id), label: o.descripcion }))}
            placeholder="Seleccione..."
            className={`w-full ${errorTipo ? 'border-danger' : ''}`}
          />
          {errorTipo && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Gestión (año) <span className="text-danger">*</span></label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="2026"
            value={gestion}
            onChange={(e) => setGestion(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className={`w-full ${errorGestion ? 'border-danger' : ''}`}
          />
          {errorGestion && <span className="mt-1 block text-xs italic text-danger">Debe contener 4 dígitos numéricos</span>}
        </div>
        <div className="lg:col-span-2">
          <DropzoneFoto
            label="Archivo *"
            archivo={archivo}
            onChange={setArchivo}
            accept="*/*"
            error={errorArchivo}
            descripcionTipo="PDF, DOC, JPG, PNG, etc."
          />
        </div>
        <div className="lg:col-span-4">
          <label className="mb-1 block text-sm font-medium">Contenido <span className="text-danger">*</span></label>
          <Textarea rows={2} value={contenido} onChange={(e) => setContenido(e.target.value.toUpperCase())} error={errorContenido} className="w-full" />
          {errorContenido && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar</Button>
      </div>

      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-6 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin activos patrimoniales registrados</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lista.map((a) => (
            <div
              key={a.idActivoPatrimonial}
              className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1.5 dark:border-gray-700/50">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                    {a.descripcionTipoActivo}
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="info"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => void descargar(a)}
                      title="Descargar archivo"
                    >
                      <IconDownload className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => eliminar(a.idActivoPatrimonial)}
                      title="Eliminar"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium text-gray-500">Gestión:</span> {a.gestion}</p>
                  {a.contenido && (
                    <p className="mt-1.5 border-t border-gray-50 pt-1.5 dark:border-gray-700/30 text-gray-500 italic">
                      {a.contenido}
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
