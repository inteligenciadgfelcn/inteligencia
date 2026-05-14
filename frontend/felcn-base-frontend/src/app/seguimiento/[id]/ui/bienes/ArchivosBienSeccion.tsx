'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { DataTable } from 'mantine-datatable'
import { BienesServiceInstance } from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

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

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
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

  const onSubmit = async (payload: any) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#5D7B9D] text-white">
                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                  PASO 1: Seleccionar Documento
                </th>
                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                  Paso 2: Nombre de Documento
                </th>
                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">Paso 3: Tipo</th>
                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                  Paso 4: Seleccionar Documento
                </th>
                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                  Paso 5: Finalizar Guardando los archivos
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50 dark:bg-gray-800/40">
                <td className="px-3 py-3">
                  <Select
                    {...register('idContenidoBien', { required: true })}
                    options={contenidoBien.map((c) => ({ value: String(c.id), label: c.descripcion }))}
                    placeholder="Seleccione..."
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    {...register('nombre', { required: true })}
                    size="sm"
                    placeholder="Nombre del documento"
                  />
                </td>
                <td className="px-3 py-3">
                  <Select {...register('tipo', { required: true })} options={TIPOS_DOC} />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-warning file:text-white hover:file:bg-warning/80 cursor-pointer border rounded-md p-1 bg-white dark:bg-gray-900"
                  />
                </td>
                <td className="px-3 py-3">
                  <Button type="submit" variant="warning" size="sm" loading={isSubmitting}>
                    Finalizar Ingreso
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>

      <div className="datatables">
        <DataTable
          noRecordsText="No hay archivos adjuntos"
          highlightOnHover
          fetching={cargando}
          className="whitespace-nowrap table-hover"
          records={registros}
          columns={[
            {
              accessor: 'contenidoBien',
              title: 'Documento',
              render: ({ contenidoBien }) => contenidoBien?.descripcion || '-',
            },
            { accessor: 'tipo', title: 'Tipo' },
            { accessor: 'nombre', title: 'Nombre del Documento' },
            { accessor: 'nombreArchivo', title: 'Nombre de Archivo' },
            {
              accessor: 'acciones',
              title: '',
              textAlign: 'center',
              render: (row) => (
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDescargar(row.id, row.nombreArchivo)}
                    className="text-info underline text-xs hover:text-info/80"
                    title="Descargar"
                  >
                    Descargar
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
    </div>
  )
}
