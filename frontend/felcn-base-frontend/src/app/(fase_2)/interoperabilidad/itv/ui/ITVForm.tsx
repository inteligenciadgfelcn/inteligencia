'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { VristoSimpleDataTable } from '@/components/datatable/VristoSimpleDataTable'
import { Card } from '@/components/ui/Card'
import {
  getITVInteroperabilidadFake,
  ITVResponse,
  ITVSearchType,
} from '../services/itv.service'

interface TipoBusquedaOption {
  value: ITVSearchType
  label: string
}

interface ITVFormValues {
  datoBusqueda: string
  tipoBusqueda: TipoBusquedaOption | null
}

interface FilaVehiculo {
  gestion: string
  placa: string
  color: string
  marca: string
  clase: string
  chasis: string
  motor: string
  modelo: number | string
}

const TIPO_BUSQUEDA_OPTIONS: TipoBusquedaOption[] = [
  { value: 'PL', label: 'Placa' },
  { value: 'CI', label: 'Nro de Carnet' },
  { value: 'CH', label: 'Nro de Chasis' },
]

export const ITVForm = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITVFormValues>({
    defaultValues: {
      datoBusqueda: '',
      tipoBusqueda: null,
    },
  })

  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<ITVResponse | null>(null)

  const filasVehiculos = useMemo<FilaVehiculo[]>(() => {
    if (!resultado) {
      return []
    }

    return resultado.datos.flatMap((item) =>
      item.vehiculos.map((vehiculo) => ({
        gestion: item.gestion,
        placa: vehiculo.placa,
        color: vehiculo.color,
        marca: vehiculo.marca,
        clase: vehiculo.clase,
        chasis: vehiculo.chasis,
        motor: vehiculo.motor,
        modelo: vehiculo.modelo,
      }))
    )
  }, [resultado])

  const columnasVehiculos = [
    { accessor: 'gestion', title: 'Gestion' },
    { accessor: 'placa', title: 'Placa' },
    { accessor: 'color', title: 'Color' },
    { accessor: 'marca', title: 'Marca' },
    { accessor: 'clase', title: 'Clase' },
    { accessor: 'chasis', title: 'Chasis' },
    { accessor: 'motor', title: 'Motor' },
    { accessor: 'modelo', title: 'Modelo' },
  ]

  const onBuscar = async (values: ITVFormValues) => {
    if (!values.tipoBusqueda || !values.datoBusqueda.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await getITVInteroperabilidadFake({
        tipoBusqueda: values.tipoBusqueda.value,
        datoBusqueda: values.datoBusqueda,
      })
      setResultado(response)
    } finally {
      setLoading(false)
    }
  }

  const onLimpiar = () => {
    reset({
      datoBusqueda: '',
      tipoBusqueda: null,
    })
    setResultado(null)
  }

  return (
    <div className="mb-5">
      <Card title="Busqueda ITV" className="mb-4">
        <form onSubmit={handleSubmit(onBuscar)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <InputWithPrefix
                name="datoBusqueda"
                prefix="Dato a buscar"
                placeholder="Dato a buscar..."
                register={register}
                error={errors.datoBusqueda?.message}
              />
            </div>
            <div className="md:col-span-4">
              <AsyncSearchSelect<TipoBusquedaOption>
                name="tipoBusqueda"
                control={control}
                prefix="Tipo"
                originalData={TIPO_BUSQUEDA_OPTIONS}
                mapOption={(item) => ({
                  label: item.label,
                  value: item.value,
                  original: item,
                })}
                error={errors.tipoBusqueda?.message as string | undefined}
              />
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onLimpiar}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </Card>

      {resultado && (
        <>
          <Card title="Datos de Persona" className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-semibold">Nombre:</span>{' '}
                {resultado.persona.Nombre}
              </div>
              <div>
                <span className="font-semibold">Apellido paterno:</span>{' '}
                {resultado.persona.apellido_paterno}
              </div>
              <div>
                <span className="font-semibold">Apellido materno:</span>{' '}
                {resultado.persona.apellido_materno}
              </div>
              <div>
                <span className="font-semibold">Nro documento:</span>{' '}
                {resultado.persona.nro_documento}
              </div>
              <div>
                <span className="font-semibold">Expedido:</span>{' '}
                {resultado.persona.expedido}
              </div>
              <div>
                <span className="font-semibold">Domicilio:</span>{' '}
                {resultado.persona.domicilio}
              </div>
              <div>
                <span className="font-semibold">Fecha nacimiento:</span>{' '}
                {resultado.persona.fecha_nacimiento}
              </div>
              <div>
                <span className="font-semibold">Sexo:</span>{' '}
                {resultado.persona.sexo}
              </div>
              <div>
                <span className="font-semibold">Celular:</span>{' '}
                {resultado.persona.celular}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{' '}
                {resultado.persona.email}
              </div>
              <div>
                <span className="font-semibold">Documento complemento:</span>{' '}
                {resultado.persona.documento_complemento ?? '-'}
              </div>
              <div>
                <span className="font-semibold">Licencia:</span>{' '}
                {resultado.persona.licencia}
              </div>
              <div>
                <span className="font-semibold">Pais procedencia:</span>{' '}
                {resultado.persona.paisProcedencia}
              </div>
            </div>
          </Card>

          <Card title="Vehiculos por Gestion">
            <VristoSimpleDataTable<FilaVehiculo>
              rows={filasVehiculos}
              columns={columnasVehiculos}
              loading={loading}
            />
          </Card>
        </>
      )}
    </div>
  )
}
