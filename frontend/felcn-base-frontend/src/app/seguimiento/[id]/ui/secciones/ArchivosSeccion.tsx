'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { SeguimientoServiceInstance } from '@/services/seguimiento/SeguimientoService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { DataTable } from 'mantine-datatable'
import { useEffect } from 'react'

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

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
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
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-bold mb-4 text-primary uppercase">BASE DE DATOS DOCUMENTAL DEL CASO (CUADERNO DE INVESTIGACION DIGITAL)</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold mb-1 uppercase text-gray-500">PASO 1: Seleccionar Documento</label>
            <Select
              {...register('idContenidoCaso', { required: true })}
              options={contenidoCaso.map(c => ({ value: String(c.id), label: c.descripcion }))}
              placeholder="Seleccione categoría..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-1 uppercase text-gray-500">Paso 2: Nombre de Documento</label>
            <Input {...register('nombre', { required: true })} size="sm" placeholder="Ej: Acta de Incautación" />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-1 uppercase text-gray-500">Paso 3: Tipo</label>
            <Select
              {...register('tipo', { required: true })}
              options={TIPOS_DOC}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-1 uppercase text-gray-500">Paso 4: Seleccionar Archivo</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-warning file:text-white hover:file:bg-warning/80 cursor-pointer border rounded-md p-1 bg-white dark:bg-gray-900"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting} className="w-full">
              <Icono className="w-4 h-4 mr-2">upload</Icono>
              Paso 5: Subir Archivo
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-4 text-secondary">Documentos del Caso</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay archivos adjuntos"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={datos || []}
            columns={[
              {
                accessor: 'contenidoCaso',
                title: 'Categoría',
                render: ({ contenidoCaso }) => contenidoCaso?.descripcion || '-'
              },
              { accessor: 'nombre', title: 'Nombre Documento' },
              { accessor: 'tipo', title: 'Tipo' },
              { accessor: 'nombreArchivo', title: 'Archivo' },
              {
                accessor: 'acciones',
                title: 'Acciones',
                textAlign: 'right',
                render: (row) => (
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
