'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { Column, VristoDataTable } from '@/components/datatable/VristoDataTable'
import { useAlerts } from '@/hooks'
import { dateUtcToString } from '@/utils/fechas'
import { InterpreteMensajes } from '@/utils'

import { getOperativoDetalle } from '../services/buscar-operativo.service'
import {
  BienSecuestradoItem,
  BuscarOperativoFormValues,
  DetenidoItem,
  DrogaItem,
  OperativoDetalleResponse,
  SustanciaLiquidaItem,
  SustanciaSolidaItem,
  VehiculoItem,
} from '../types/buscar-operativo.types'

const defaultValues: BuscarOperativoFormValues = {
  numeroCaso: '',
}

export default function BuscarOperativoPage() {
  const { Alerta } = useAlerts()

  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [detalle, setDetalle] = useState<OperativoDetalleResponse | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuscarOperativoFormValues>({
    defaultValues,
  })

  const onBuscar = async (values: BuscarOperativoFormValues) => {
    const nro = values.numeroCaso?.trim()

    if (!nro) {
      Alerta({
        mensaje: 'Debe ingresar numero de caso para buscar.',
        variant: 'error',
      })
      return
    }

    setLoading(true)
    setHasSearched(true)
    setDetalle(null)

    try {
      const response = await getOperativoDetalle(nro)
      setDetalle(response)
    } catch (error) {
      setDetalle(null)
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const onLimpiar = () => {
    reset(defaultValues)
    setHasSearched(false)
    setDetalle(null)
  }

  const columnasBienes: Column<BienSecuestradoItem>[] = [
    { accessor: 'tipo_bien', title: 'Tipo bien' },
    { accessor: 'cantidad', title: 'Cantidad' },
  ]

  const columnasDetenidos: Column<DetenidoItem>[] = [
    { accessor: 'id_persona_auxiliar', title: 'ID Persona Auxiliar' },
    { accessor: 'nombre_completo', title: 'Nombre completo' },
    { accessor: 'nro_documento', title: 'Nro documento' },
    { accessor: 'estado', title: 'Estado' },
  ]

  const columnasDrogas: Column<DrogaItem>[] = [
    { accessor: 'tipo_droga', title: 'Tipo droga' },
    { accessor: 'tipo_transporte', title: 'Tipo transporte' },
    { accessor: 'cantidad', title: 'Cantidad' },
    { accessor: 'capsulas', title: 'Capsulas' },
  ]

  const columnasLiquidas: Column<SustanciaLiquidaItem>[] = [
    { accessor: 'sustancia_liquida', title: 'Sustancia liquida' },
    { accessor: 'cantidad', title: 'Cantidad' },
  ]

  const columnasSolidas: Column<SustanciaSolidaItem>[] = [
    { accessor: 'sustancia_solida', title: 'Sustancia solida' },
    { accessor: 'cantidad', title: 'Cantidad' },
  ]

  const columnasVehiculo: Column<VehiculoItem>[] = [
    { accessor: 'tipo_vehiculo', title: 'Tipo vehiculo' },
    { accessor: 'placa', title: 'Placa' },
    { accessor: 'color', title: 'Color' },
    { accessor: 'marca', title: 'Marca' },
  ]

  return (
    <div className="mb-5 space-y-4">
      <div className="panel">
        <h5 className="font-semibold text-lg mb-4">Buscar operativo</h5>

        <form onSubmit={handleSubmit(onBuscar)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <InputWithPrefix
                name="numeroCaso"
                prefix="Numero caso"
                icon="search"
                placeholder="Ingrese numero de caso"
                register={register}
                error={errors.numeroCaso?.message}
              />
            </div>

            <div className="md:col-span-8 flex items-end gap-2">
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
      </div>

      {hasSearched && !loading && !detalle && (
        <div className="panel">
          <p className="text-sm text-danger">
            No se encontro informacion del operativo.
          </p>
        </div>
      )}

      {detalle && (
        <>
          <div className="panel">
            <h5 className="font-semibold text-lg mb-4">Informacion general</h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <InfoField label="Nombre caso" value={detalle.nombre_caso} />
              <InfoField label="Numero caso" value={detalle.numero_caso} />
              <InfoField label="Asignado caso" value={detalle.asignado_caso} />
              <InfoField
                label="Fiscal asignado"
                value={detalle.fiscal_asignado_caso}
              />
              <InfoField
                label="Fecha operativo"
                value={
                  detalle.fecha_operativo
                    ? dateUtcToString(detalle.fecha_operativo)
                    : '-'
                }
              />
              <InfoField label="Departamento" value={detalle.departamento} />
              <InfoField label="Provincia" value={detalle.provincia} />
              <InfoField label="Localidad" value={detalle.localidad} />
              <InfoField label="Lugar" value={detalle.lugar} />
              <InfoField
                label="Categoria operativo"
                value={detalle.categoria_operativo}
              />
              <InfoField
                label="Item operativo"
                value={detalle.item_operativo}
              />
              <InfoField label="Mando" value={detalle.mando} />
              <InfoField label="Unidad" value={detalle.unidad} />
            </div>

            <div className="mt-3">
              <p className="text-xs text-gray-500">Descripcion</p>
              <p className="text-sm">{detalle.descripcion || '-'}</p>
            </div>
          </div>

          <VristoDataTable<BienSecuestradoItem>
            title="Bienes secuestrados"
            rows={detalle.bienes_secuestrados ?? []}
            total={(detalle.bienes_secuestrados ?? []).length}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onLimitChange={() => {}}
            columns={columnasBienes}
            loading={loading}
          />

          <VristoDataTable<DetenidoItem>
            title="Detenidos"
            rows={detalle.detenidos ?? []}
            total={(detalle.detenidos ?? []).length}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onLimitChange={() => {}}
            columns={columnasDetenidos}
            loading={loading}
          />

          <VristoDataTable<DrogaItem>
            title="Drogas"
            rows={detalle.drogas ?? []}
            total={(detalle.drogas ?? []).length}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onLimitChange={() => {}}
            columns={columnasDrogas}
            loading={loading}
          />

          <VristoDataTable<SustanciaLiquidaItem>
            title="Sustancia liquida"
            rows={detalle.sustancia_liquida ?? []}
            total={(detalle.sustancia_liquida ?? []).length}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onLimitChange={() => {}}
            columns={columnasLiquidas}
            loading={loading}
          />

          <VristoDataTable<SustanciaSolidaItem>
            title="Sustancia solida"
            rows={detalle.sustancia_solida ?? []}
            total={(detalle.sustancia_solida ?? []).length}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onLimitChange={() => {}}
            columns={columnasSolidas}
            loading={loading}
          />

          <VristoDataTable<VehiculoItem>
            title="Vehiculos"
            rows={detalle.vehiculo ?? []}
            total={(detalle.vehiculo ?? []).length}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onLimitChange={() => {}}
            columns={columnasVehiculo}
            loading={loading}
          />
        </>
      )}
    </div>
  )
}

interface InfoFieldProps {
  label: string
  value?: string | number | null
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="rounded border border-white-light p-2 dark:border-[#17263c]">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value || '-'}</p>
    </div>
  )
}
