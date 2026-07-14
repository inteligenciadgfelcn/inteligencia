'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { SeguimientoServiceInstance } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'

interface ArchivosSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

const TIPOS_DOC = [
  { value: 'DOCUMENTO', label: 'DOCUMENTO' },
  { value: 'IMAGEN', label: 'IMAGEN' },
  { value: 'VIDEO', label: 'VIDEO' },
  { value: 'AUDIO', label: 'AUDIO' },
]

export function ArchivosSeccion({ idCaso, datos, onGuardar }: ArchivosSeccionProps) {
  const { Alerta } = useAlerts()
  const { contenidoCaso, cargarContenidoCaso } = useParametricas()
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      nombre: '',
      tipo: 'DOCUMENTO',
      idContenidoCaso: ''
    }
  })

  useEffect(() => {
    void cargarContenidoCaso()
  }, [cargarContenidoCaso])

  const onSubmit = async (payload: any) => {
    if (!file) {
      Alerta({ mensaje: 'Debe seleccionar un archivo', variant: 'warning' })
      return
    }
    try {
      await SeguimientoServiceInstance.subirArchivo(
        idCaso,
        file,
        payload.idContenidoCaso,
        payload.tipo,
        payload.nombre
      )
      Alerta({ mensaje: 'Archivo subido correctamente', variant: 'success' })
      reset()
      setFile(null)
      onGuardar()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  const handleDescargar = (id: string, nombre: string) => {
    void SeguimientoServiceInstance.descargarArchivo(id, nombre)
  }

  const handleEliminar = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este archivo?')) {
      try {
        await SeguimientoServiceInstance.eliminarArchivo(id)
        Alerta({ mensaje: 'Archivo eliminado', variant: 'success' })
        onGuardar()
      } catch (error) {
        Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Seleccionar Documento</label>
              <Select
                {...register('idContenidoCaso', { required: true })}
                options={contenidoCaso.map(c => ({ value: String(c.id), label: c.descripcion }))}
                placeholder="Seleccione categoría..."
                error={!!errors.idContenidoCaso}
              />
              {errors.idContenidoCaso && <div className="mt-1 text-xs text-danger">Campo requerido</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de Documento</label>
              <Input uppercase {...register('nombre', { required: true })} placeholder="Ej: Acta de Incautación" error={!!errors.nombre} />
              {errors.nombre && <div className="mt-1 text-xs text-danger">Campo requerido</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Select
                {...register('tipo', { required: true })}
                options={TIPOS_DOC}
                error={!!errors.tipo}
              />
              {errors.tipo && <div className="mt-1 text-xs text-danger">Campo requerido</div>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="success" size="sm" loading={isSubmitting} className="w-full">
                <Icono className="w-4 h-4 mr-2">upload</Icono>
                Subir Archivo
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Seleccionar Archivo</label>
            <Dropzone
              file={file}
              onChange={setFile}
              placeholder="Arrastre el archivo aquí o haga clic para seleccionar"
            />
          </div>
        </form>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold">Documentos del Caso</h4>
        <div className="datatables">
          <VristoDataTable
            loading={false}
            rows={datos || []}
            total={(datos || []).length}
            page={1}
            limit={(datos || []).length || 10}
            onPageChange={() => { }}
            onLimitChange={() => { }}
            columns={[
              {
                accessor: 'contenidoCaso',
                title: 'Categoría',
                render: (row: any) => row.contenidoCaso?.descripcion || '-'
              },
              { accessor: 'nombre', title: 'Nombre Documento' },
              { accessor: 'tipo', title: 'Tipo' },
              { accessor: 'nombreArchivo', title: 'Archivo' },
              {
                accessor: 'acciones',
                title: 'Acciones',
                className: 'text-right',
                render: (row: any) => (
                  <div className="flex justify-end gap-2">
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
                )
              }
            ]}
          />
        </div>
      </div>
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
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
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
