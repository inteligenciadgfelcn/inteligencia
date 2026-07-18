'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { BienesServiceInstance } from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { trimPayload } from '@/utils/trimPayload'

function FotoArchivoThumb({
  idArchivo,
  onClick,
}: {
  idArchivo: string
  onClick: (src: string) => void
}) {
  const [src, setSrc] = useState<string | null>(null)
  const [cargandoFoto, setCargandoFoto] = useState(true)

  useEffect(() => {
    let objectUrl: string
    BienesServiceInstance.obtenerArchivoBlob(idArchivo)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => setSrc(null))
      .finally(() => setCargandoFoto(false))
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [idArchivo])

  if (cargandoFoto) {
    return <div className="h-16 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
  }
  if (!src) {
    return (
      <div className="flex h-16 w-24 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-[10px] text-gray-400">Sin foto</span>
      </div>
    )
  }
  return (
    <div className="flex h-16 w-24 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Miniatura"
        className="h-full max-w-full cursor-zoom-in object-contain"
        onClick={() => onClick(src)}
      />
    </div>
  )
}

interface Props {
  idCaso: string
}

const TIPOS_DOC = [
  { value: 'DOCUMENTO', label: 'DOCUMENTO' },
  { value: 'IMAGEN', label: 'IMAGEN' },
]

export function ArchivosBienSeccion({ idCaso }: Props) {
  const { Alerta } = useAlerts()
  const { contenidoBien, cargarContenidoBien } = useParametricas()
  const [file, setFile] = useState<File | null>(null)
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { nombre: '', tipo: 'DOCUMENTO', idContenidoBien: '' },
  })

  useEffect(() => { void cargarContenidoBien() }, [cargarContenidoBien])

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarArchivos(idCaso)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idCaso])

  const onSubmit = async (datos: any) => {
    const payload = trimPayload(datos)
    if (!file) {
      Alerta({ mensaje: 'Debe seleccionar un archivo', variant: 'warning' })
      return
    }
    try {
      await BienesServiceInstance.subirArchivo(
        idCaso,
        file,
        payload.idContenidoBien,
        payload.tipo,
        payload.nombre
      )
      Alerta({ mensaje: 'Archivo subido correctamente', variant: 'success' })
      reset()
      setFile(null)
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  const handleDescargar = (id: string, nombre: string) => {
    void BienesServiceInstance.descargarArchivo(id, nombre)
  }

  const handleEliminar = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este archivo?')) {
      try {
        await BienesServiceInstance.eliminarArchivo(id)
        Alerta({ mensaje: 'Archivo eliminado', variant: 'success' })
        void cargarRegistros()
      } catch (error) {
        Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <Select
              {...register('idContenidoBien', { required: true })}
              options={contenidoBien.map((c) => ({ value: String(c.id), label: c.descripcion }))}
              placeholder="Seleccione..."
              error={!!errors.idContenidoBien}
            />
            {errors.idContenidoBien && <div className="mt-1 text-xs text-danger">Campo requerido</div>}
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input
              {...register('nombre', { required: true })}
              placeholder="Ej: Resolución 123/2024"
              uppercase
              error={!!errors.nombre}
            />
            {errors.nombre && <div className="mt-1 text-xs text-danger">Campo requerido</div>}
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <Select {...register('tipo', { required: true })} options={TIPOS_DOC} error={!!errors.tipo} />
            {errors.tipo && <div className="mt-1 text-xs text-danger">Campo requerido</div>}
          </div>
          <div className="lg:col-span-1">
            <Button type="submit" variant="warning" className="w-full" loading={isSubmitting}>
              Guardar
            </Button>
          </div>

          <div className="lg:col-span-4 mt-2">
            <label className="block text-sm font-medium mb-2">Documento o Imagen</label>
            <Dropzone
              file={file}
              onChange={setFile}
              placeholder="Arrastre el archivo aquí o haga clic para seleccionar"
            />
          </div>
        </div>
      </form>

      <div className="datatables">
        <VristoDataTable
          loading={cargando}
          rows={registros}
          total={registros.length}
          page={1}
          limit={registros.length || 10}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={[
            {
              accessor: 'contenidoBien',
              title: 'Documento',
              render: (row: any) => row.contenidoBien?.descripcion || '-',
            },
            { accessor: 'tipo', title: 'Tipo' },
            { accessor: 'nombre', title: 'Nombre del Documento' },
            { accessor: 'nombreArchivo', title: 'Nombre de Archivo' },
            {
              accessor: 'miniatura',
              title: 'Vista Previa',
              render: (row: any) =>
                row.tipo === 'IMAGEN' ? (
                  <FotoArchivoThumb idArchivo={row.id} onClick={setImagenAmpliada} />
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                ),
            },
            {
              accessor: 'acciones',
              title: '',
              className: 'text-center',
              render: (row: any) => (
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDescargar(row.id, row.nombreArchivo)}
                    className="btn btn-outline-info btn-sm p-1"
                    title="Descargar"
                  >
                    <Icono className="w-4 h-4">download</Icono>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(row.id)}
                    className="btn btn-outline-danger btn-sm p-1"
                    title="Eliminar"
                  >
                    <Icono className="w-4 h-4">delete</Icono>
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setImagenAmpliada(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenAmpliada}
              alt="Vista ampliada"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            <Button
              type="button"
              variant="dark"
              size="sm"
              className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
              onClick={() => setImagenAmpliada(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Dropzone({
  file,
  onChange,
  placeholder,
}: {
  file: File | null
  onChange: (file: File | null) => void
  placeholder: string
}) {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) onChange(droppedFile)
  }

  return (
    <div
      className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all ${drag
        ? 'border-success bg-success/10 scale-[0.99]'
        : 'border-[#e0e6ed] dark:border-[#1b2e4b] hover:border-success dark:hover:border-success/50 bg-gray-50/50 dark:bg-gray-800/20'
        }`}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragEnter={() => setDrag(true)}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      {file ? (
        <div className="flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
          <div className="p-3 bg-success/20 rounded-full">
            <Icono className="w-8 h-8 text-success">description</Icono>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[300px]">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            className="ml-4 p-2 hover:bg-danger/10 text-danger rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            <Icono className="w-5 h-5">close</Icono>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 mb-2 flex items-center justify-center rounded-full bg-success/10 text-success">
            <Icono className="w-6 h-6">cloud_upload</Icono>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {placeholder}
          </p>
          <p className="text-xs text-gray-400">PDF, DOC, PNG, JPG (Máx. 10MB)</p>
        </div>
      )}
    </div>
  )
}
