'use client'

import React, { useEffect, useState } from 'react'
import { SiiiLookupsService } from '@/services/parametricas'
import IconTrash from '@/components/Icon/IconTrash'
import { DataTable } from 'mantine-datatable'
import { useConfirmDialog } from '@/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface SeccionFormProps {
  titulo: string
  onGuardar: (payload: any) => Promise<unknown>
  onEliminar: (id: number) => Promise<unknown>
  onRecuperar: () => Promise<unknown>
  datos: any[]
  totalRegistros?: number
  pagina?: number
  limite?: number
  onCambioPagina?: (page: number) => void
  onCambioLimite?: (limit: number) => void
  cargando?: boolean
}

export function Laboratorio({
  titulo,
  onGuardar,
  onEliminar,
  onRecuperar,
  datos = [],
  totalRegistros,
  pagina = 1,
  limite = 10,
  onCambioPagina,
  onCambioLimite,
  cargando = false,
}: SeccionFormProps) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const [tipoFabrica, setTipoFabrica] = useState('')
  const [modeloFabrica, setModeloFabrica] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [opcionesTipos, setOpcionesTipos] = useState<
    { id: string; label: string; value: string }[]
  >([])
  const [opcionesModelos, setOpcionesModelos] = useState<
    { id: string; label: string; value: string }[]
  >([])

  useEffect(() => {
    let activo = true
    const cargarTiposFabrica = async () => {
      try {
        const res = await SiiiLookupsService.obtenerTiposFabrica()
        if (!activo || !res?.finalizado) return

        const items = (res.datos ?? []).map((item: any) => ({
          id: String(item.id),
          value: String(item.id),
          label: String(item.descripcion),
        }))
        setOpcionesTipos(items)
      } catch {
        // Silencioso
      }
    }
    void cargarTiposFabrica()
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    let activo = true
    setModeloFabrica('')
    setOpcionesModelos([])

    const cargarModelos = async () => {
      if (!tipoFabrica) return
      try {
        const res = await SiiiLookupsService.obtenerModelosFabrica(
          parseInt(tipoFabrica)
        )
        if (!activo || !res?.finalizado) return

        const items = (res.datos ?? []).map((item: any) => ({
          id: String(item.id),
          value: String(item.id),
          label: String(item.descripcion),
        }))
        setOpcionesModelos(items)
      } catch {
        // Silencioso
      }
    }
    void cargarModelos()
    return () => {
      activo = false
    }
  }, [tipoFabrica])

  const agregarFabrica = async () => {
    if (!tipoFabrica || !modeloFabrica || !cantidad) {
      return
    }

    // const modeloOpcion = opcionesModelos.find(o => o.value === modeloFabrica)
    const nuevaFabrica = {
      //idTipoFabrica: parseInt(tipoFabrica),
      // tipoFabrica: opcionesTipos.find(o => o.value === tipoFabrica)?.label || tipoFabrica,
      idFabricaModelo: parseInt(modeloFabrica),
      // fabricaModelo: modeloOpcion?.label || modeloFabrica,
      cantidad: parseInt(cantidad),
    }

    await onGuardar(nuevaFabrica)

    setTipoFabrica('')
    setModeloFabrica('')
    setCantidad('')
  }

  const handleEliminar = async (id: number) => {
    confirm({
      texto: '¿Está seguro de eliminar este registro?',
      onConfirm: async () => {
        await onEliminar(id)
      },
    })
  }

  return (
    <div>
      <ConfirmDialog />
      {/* LABORATORIOS Y FABRICAS */}
      <div className="rounded-md border border-[#e0e6ed] p-4 mt-5">
        <h4 className="mb-4 text-sm font-semibold">
          {titulo || 'LABORATORIOS Y FABRICAS'}
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="laboratorioTipoFabrica"
              className="mb-1 block text-sm font-medium"
            >
              Tipo de Fábrica/Laboratorio
            </label>
            <Select
              id="laboratorioTipoFabrica"
              className="w-full"
              options={opcionesTipos.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              placeholder="Seleccione un Dato"
              value={tipoFabrica}
              onChange={(e) => setTipoFabrica(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="laboratorioModeloFabrica"
              className="mb-1 block text-sm font-medium"
            >
              Modelo de Fábrica
            </label>
            <Select
              id="laboratorioModeloFabrica"
              className="w-full"
              options={opcionesModelos.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              placeholder="Seleccione un Dato"
              value={modeloFabrica}
              onChange={(e) => setModeloFabrica(e.target.value)}
              disabled={!tipoFabrica || opcionesModelos.length === 0}
            />
          </div>

          <div>
            <label
              htmlFor="laboratorioCantidad"
              className="mb-1 block text-sm font-medium"
            >
              Cantidad
            </label>
            <Input
              id="laboratorioCantidad"
              type="number"
              className="w-full"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={agregarFabrica}
              disabled={cargando}
            >
              Guardar
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <div className="datatables">
            <DataTable
              fetching={cargando}
              withTableBorder={false}
              className="whitespace-nowrap table-hover"
              records={datos}
              totalRecords={
                totalRegistros !== undefined ? totalRegistros : datos.length
              }
              recordsPerPage={limite}
              page={pagina}
              onPageChange={onCambioPagina ?? (() => {})}
              recordsPerPageOptions={[10, 20, 50]}
              onRecordsPerPageChange={onCambioLimite ?? (() => {})}
              columns={[
                { accessor: 'descripcionTipoFabrica', title: 'Tipo Fabrica' },
                {
                  accessor: 'descripcionFabricaModelo',
                  title: 'Modelo Fabrica',
                },
                {
                  accessor: 'cantidad',
                  title: 'Cantidad',
                  textAlign: 'right',
                  render: (row: any) => row.cantidad,
                },
                {
                  accessor: 'actions',
                  title: 'Acciones',
                  textAlign: 'center',
                  render: (row: any) => (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="flex justify-center w-full"
                      onClick={() => handleEliminar(row.id as number)}
                      disabled={cargando}
                    >
                      <IconTrash className="w-5 h-5" />
                    </Button>
                  ),
                },
              ]}
              highlightOnHover
            />
          </div>
        </div>
      </div>
    </div>
  )
}
