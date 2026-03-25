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

export function SustanciasLiquidas({
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
  const [tipoSustancia, setTipoSustancia] = useState('')
  const [litros, setLitros] = useState('')
  const [mililitros, setMililitros] = useState('')
  const [costo, setCosto] = useState('')
  const [opciones, setOpciones] = useState<
    { id: string; label: string; value: string }[]
  >([])

  useEffect(() => {
    let activo = true
    const cargarOpciones = async () => {
      try {
        const res = await SiiiLookupsService.obtenerSustanciasLiquidasDesc()
        if (!activo || !res?.finalizado) return

        const items = (res.datos ?? []).map((item: any) => ({
          id: String(item.id),
          value: String(item.id),
          label: String(item.descripcion),
        }))
        setOpciones(items)
      } catch {
        // Mantener fallback o fallar silenciosamente
      }
    }
    void cargarOpciones()
    return () => {
      activo = false
    }
  }, [])

  const agregarSustancia = async () => {
    if (!tipoSustancia || (!litros && !mililitros)) {
      return
    }

    const totalLitros =
      parseFloat(litros || '0') + parseFloat(mililitros || '0') / 1000

    const nuevaSustancia = {
      idSustanciaLiquidaDescripcion: parseInt(tipoSustancia),
      cantidad: totalLitros,
      costo: parseFloat(costo || '0'),
    }

    await onGuardar(nuevaSustancia)

    setTipoSustancia('')
    setLitros('')
    setMililitros('')
    setCosto('')
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
      {/* SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS */}
      <div className="rounded-md border border-[#e0e6ed] p-4">
        <h4 className="mb-4 text-sm font-semibold">
          SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="sustanciaQuimicaLiquidaTipo"
              className="mb-1 block text-sm font-medium"
            >
              Tipo de Sustancia
            </label>
            <Select
              id="sustanciaQuimicaLiquidaTipo"
              className="w-full"
              options={opciones}
              placeholder="Seleccione un Dato"
              value={tipoSustancia}
              onChange={(e) => setTipoSustancia(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaLiquidaCosto"
              className="mb-1 block text-sm font-medium"
            >
              Costo
            </label>
            <Input
              id="sustanciaLiquidaCosto"
              type="number"
              className="w-full"
              value={costo}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                  setCosto(val)
                }
              }}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidalitros"
              className="mb-1 block text-sm font-medium"
            >
              Litros (L)
            </label>
            <Input
              id="sustanciaQuimicaSolidalitros"
              type="text"
              className="w-full"
              value={litros}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || /^\d*$/.test(val)) {
                  setLitros(val)
                }
              }}
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidamililitros"
              className="mb-1 block text-sm font-medium"
            >
              Mililitros (mL)
            </label>
            <Input
              id="sustanciaQuimicaSolidamililitros"
              type="text"
              className="w-full"
              value={mililitros}
              onChange={(e) => {
                const val = e.target.value
                if (
                  val === '' ||
                  (parseInt(val) >= 0 && parseInt(val) <= 999)
                ) {
                  setMililitros(val)
                }
              }}
              placeholder="0"
            />
          </div>

          <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={agregarSustancia}
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
                {
                  accessor: 'descripcionSustancia',
                  title: 'Tipo de Sustancia',
                  footer: (
                    <span className="font-bold text-sm">Total Costo (Bs):</span>
                  ),
                },
                {
                  accessor: 'cantidad',
                  title: 'Cantidad en litros',
                  textAlign: 'right',
                  render: (row: any) => Number(row.cantidad ?? 0).toFixed(3),
                },
                {
                  accessor: 'costo',
                  title: 'Costo (Bs)',
                  textAlign: 'right',
                  render: (row: any) => Number(row.costo ?? 0).toFixed(2),
                  footer: (
                    <span className="font-bold text-sm">
                      {datos
                        .reduce((sum, item) => sum + Number(item.costo ?? 0), 0)
                        .toFixed(2)}
                    </span>
                  ),
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
                      icon={<IconTrash className="w-5 h-5" />}
                    >
                      {''}
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
