'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import IconTrash from '@/components/Icon/IconTrash'
import IconDownload from '@/components/Icon/IconDownload'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { DropzoneFoto } from './DropzoneFoto'
import type { ArchivoS2i, CreateArchivoPayload, LookupSimple, RespuestaApi } from '@/services/analisis'

interface ArchivosPanelService {
  subirArchivo(idEntidad: string, payload: CreateArchivoPayload, archivo: File): Promise<RespuestaApi<ArchivoS2i>>
  listarArchivos(idEntidad: string): Promise<RespuestaApi<ArchivoS2i[]>>
  descargarArchivo(idArchivo: string): Promise<Blob>
  eliminarArchivo(idArchivo: string): Promise<RespuestaApi<unknown>>
}

interface ArchivosPanelProps {
  idEntidad: string
  service: ArchivosPanelService
  idField: keyof ArchivoS2i
  opcionesContenido: LookupSimple[]
}

export function ArchivosPanel({ idEntidad, service, idField, opcionesContenido }: ArchivosPanelProps) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const descargandoRef = useRef(false)

  const [cargando, setCargando] = useState(false)
  const [archivos, setArchivos] = useState<ArchivoS2i[]>([])

  const [idContenidoCaso, setIdContenidoCaso] = useState('')
  const [tipo, setTipo] = useState('')
  const [nombre, setNombre] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const cargar = useCallback(async () => {
    if (!idEntidad) return
    setCargando(true)
    try {
      const res = await service.listarArchivos(idEntidad)
      if (res?.finalizado) setArchivos(res.datos ?? [])
    } finally {
      setCargando(false)
    }
  }, [idEntidad, service])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!idContenidoCaso || !tipo.trim() || !nombre.trim() || !archivo) return
    setCargando(true)
    try {
      const res = await service.subirArchivo(
        idEntidad,
        { idContenidoCaso: Number(idContenidoCaso), tipo: tipo.trim().toUpperCase(), nombre: nombre.trim().toUpperCase() },
        archivo,
      )
      if (res?.finalizado) {
        setIdContenidoCaso('')
        setTipo('')
        setNombre('')
        setArchivo(null)
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Archivo registrado', variant: 'success' })
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const descargar = async (a: ArchivoS2i) => {
    if (descargandoRef.current) return
    descargandoRef.current = true
    try {
      const id = String(a[idField] ?? '')
      const blob = await service.descargarArchivo(id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = a.nombreArchivo || a.nombre || 'archivo'
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      descargandoRef.current = false
    }
  }

  const eliminar = (a: ArchivoS2i) => {
    const id = String(a[idField] ?? '')
    confirm({
      texto: '¿Eliminar este archivo?',
      onConfirm: async () => {
        setCargando(true)
        try {
          await service.eliminarArchivo(id)
          void cargar()
        } finally {
          setCargando(false)
        }
      },
    })
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />

      {/* ── Formulario ── */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Contenido <span className="text-danger">*</span></label>
          <Select
            value={idContenidoCaso}
            onChange={(e) => setIdContenidoCaso(e.target.value)}
            className={`w-full ${!idContenidoCaso && submitted ? 'border-danger' : ''}`}
            options={opcionesContenido.map((o) => ({ value: String(o.id), label: o.descripcion }))}
            placeholder="Seleccione..."
          />
          {!idContenidoCaso && submitted && (
            <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value.toUpperCase())}
            className={`w-full ${!tipo.trim() && submitted ? 'border-danger' : ''}`}
          />
          {!tipo.trim() && submitted && (
            <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value.toUpperCase())}
            className={`w-full ${!nombre.trim() && submitted ? 'border-danger' : ''}`}
          />
          {!nombre.trim() && submitted && (
            <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>
          )}
        </div>
        <div>
          <DropzoneFoto
            label="Archivo *"
            archivo={archivo}
            onChange={setArchivo}
            accept="*/*"
            error={!archivo && submitted}
            descripcionTipo="PDF, DOC, JPG, PNG, etc."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="success" size="sm" type="button" onClick={() => void guardar()} disabled={cargando}>
          Guardar
        </Button>
      </div>

      {/* ── Lista ── */}
      {archivos.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-6 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin archivos registrados</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {archivos.map((a, idx) => {
            const id = String(a[idField] ?? idx)
            return (
              <div
                key={id}
                className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1.5 dark:border-gray-700/50">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs truncate" title={a.nombre}>
                      {a.nombre}
                    </span>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="info"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        type="button"
                        onClick={() => void descargar(a)}
                        title="Descargar archivo"
                      >
                        <IconDownload className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        type="button"
                        onClick={() => eliminar(a)}
                        title="Eliminar archivo"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-500">Tipo:</span> {a.tipo}</p>
                    {a.descripcionContenido && (
                      <p className="mt-1"><span className="font-medium text-gray-500">Contenido:</span> {a.descripcionContenido}</p>
                    )}
                    {a.nombreArchivo && (
                      <p className="mt-1 font-mono text-[10px] text-gray-400 truncate"><span className="font-medium text-gray-500">Archivo:</span> {a.nombreArchivo}</p>
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
