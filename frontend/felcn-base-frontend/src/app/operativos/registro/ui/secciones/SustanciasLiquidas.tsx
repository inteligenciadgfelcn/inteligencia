'use client'

import React, { useEffect, useState } from 'react'
import { SiiiLookupsService } from '@/services/parametricas'
import IconTrash from '@/components/Icon/IconTrash'
import {
  VristoDataTable,
  type Column,
} from '@/components/datatable/VristoDataTable'
import { useConfirmDialog } from '@/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAlerts } from '@/hooks/useAlerts'
import { LoadingDialog } from '@/components/modales/LoadingDialog'

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
  onGuardar,
  onEliminar,
  datos = [],
  totalRegistros,
  pagina = 1,
  limite = 10,
  onCambioPagina,
  onCambioLimite,
  cargando = false,
}: SeccionFormProps) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const [tipoSustancia, setTipoSustancia] = useState('')
  const [litros, setLitros] = useState('0')
  const [mililitros, setMililitros] = useState('0')
  const [costo, setCosto] = useState('0')
  const [opciones, setOpciones] = useState<
    { id: string; label: string; value: string }[]
  >([])

  const [submitted, setSubmitted] = useState(false)

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
        // Silencioso
      }
    }
    void cargarOpciones()
    return () => {
      activo = false
    }
  }, [])

  const agregarSustancia = async () => {
    setSubmitted(true)
    if (!tipoSustancia) {
      return
    }
    if (!litros && !mililitros) {
      return
    }

    const totalLitros =
      parseFloat(litros || '0') + parseFloat(mililitros || '0') / 1000

    if (totalLitros < 0.001) {
      return
    }

    if (parseFloat(costo || '0') <= 0) {
      return
    }

    const nuevaSustancia = {
      idSustanciaLiquidaDescripcion: parseInt(tipoSustancia),
      cantidad: totalLitros,
      costo: parseFloat(costo || '0'),
    }

    await onGuardar(nuevaSustancia)

    setTipoSustancia('')
    setLitros('0')
    setMililitros('0')
    setCosto('0')
    setSubmitted(false)
  }

  const handleEliminar = async (id: number) => {
    confirm({
      texto: '¿Está seguro de eliminar este registro?',
      onConfirm: async () => {
        await onEliminar(id)
      },
    })
  }

  const totalCantidad = parseFloat(litros || '0') + parseFloat(mililitros || '0') / 1000

  return (
    <div>
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
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
              Tipo de Sustancia <span className="text-danger">*</span>
            </label>
            <Select
              id="sustanciaQuimicaLiquidaTipo"
              className={`w-full ${!tipoSustancia && submitted ? 'border-danger' : ''}`}
              options={opciones}
              placeholder="Seleccione un Dato"
              value={tipoSustancia}
              onChange={(e) => setTipoSustancia(e.target.value)}
            />
            {!tipoSustancia && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>

          <div>
            <label
              htmlFor="sustanciaLiquidaCosto"
              className="mb-1 block text-sm font-medium"
            >
              Costo (Bs)
            </label>
            <Input
              id="sustanciaLiquidaCosto"
              type="number"
              className={`w-full ${parseFloat(costo || '0') <= 0 && submitted ? 'border-danger' : ''}`}
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
            {parseFloat(costo || '0') <= 0 && submitted && (
              <span className="text-danger text-xs mt-1">El costo debe ser mayor a 0</span>
            )}
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
              className={`w-full ${totalCantidad < 0.001 && submitted ? 'border-danger' : ''}`}
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
              className={`w-full ${totalCantidad < 0.001 && submitted ? 'border-danger' : ''}`}
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

          {totalCantidad < 0.001 && submitted && (
            <div className="col-span-1 lg:col-span-4 mt-1">
              <span className="text-danger text-xs">La cantidad total debe ser al menos 0.001 Litros (1 ml)</span>
            </div>
          )}

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
            <VristoDataTable<(typeof datos)[0]>
              rows={datos}
              total={
                totalRegistros !== undefined ? totalRegistros : datos.length
              }
              page={pagina}
              limit={limite}
              onPageChange={onCambioPagina ?? (() => { })}
              onLimitChange={onCambioLimite ?? (() => { })}
              search=""
              onSearchChange={() => { }}
              loading={cargando}
              columns={[
                {
                  accessor: 'descripcionSustancia',
                  title: 'Tipo de Sustancia',
                },
                {
                  accessor: 'cantidad',
                  title: 'Cantidad en litros',
                  render: (row: any) => Number(row.cantidad ?? 0).toFixed(3),
                },
                {
                  accessor: 'costo',
                  title: 'Costo (Bs)',
                  render: (row: any) => Number(row.costo ?? 0).toFixed(2),
                },
                {
                  accessor: 'actions',
                  title: 'Acciones',
                  render: (row: any) => (
                    <button
                      type="button"
                      className="text-danger hover:text-danger/80"
                      title="Eliminar"
                      onClick={() => handleEliminar(row.id as number)}
                      disabled={cargando}
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
