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

export function SustanciasSolidas({
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
  const [toneladas, setToneladas] = useState('0')
  const [kilos, setKilos] = useState('0')
  const [gramos, setGramos] = useState('0')
  const [miligramos, setMiligramos] = useState('0')
  const [costo, setCosto] = useState('0')
  const [opciones, setOpciones] = useState<
    { id: string; label: string; value: string }[]
  >([])

  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let activo = true
    const cargarOpciones = async () => {
      try {
        const res = await SiiiLookupsService.obtenerSustanciasSolidasDesc()
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
    if (!toneladas && !kilos && !gramos && !miligramos) {
      return
    }

    const totalKilos =
      parseFloat(toneladas || '0') * 1000 +
      parseFloat(kilos || '0') +
      parseFloat(gramos || '0') / 1000 +
      parseFloat(miligramos || '0') / 1000000

    if (totalKilos < 0.001) {
      return
    }

    if (parseFloat(costo || '0') <= 0) {
      return
    }

    const nuevaSustancia = {
      idSustanciaSolidaDescripcion: parseInt(tipoSustancia),
      cantidad: totalKilos,
      costo: parseFloat(costo || '0'),
    }

    await onGuardar(nuevaSustancia)

    setTipoSustancia('')
    setToneladas('0')
    setKilos('0')
    setGramos('0')
    setMiligramos('0')
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

  const totalCantidad =
    parseFloat(toneladas || '0') * 1000 +
    parseFloat(kilos || '0') +
    parseFloat(gramos || '0') / 1000 +
    parseFloat(miligramos || '0') / 1000000

  return (
    <div>
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <div className="rounded-md border border-[#e0e6ed] p-4">
        <h4 className="mb-4 text-sm font-semibold">
          SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaTipo"
              className="mb-1 block text-sm font-medium"
            >
              Tipo de Sustancia <span className="text-danger">*</span>
            </label>
            <Select
              id="sustanciaQuimicaSolidaTipo"
              options={opciones.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              placeholder="Seleccione un Dato"
              value={tipoSustancia}
              onChange={(e) => setTipoSustancia(e.target.value)}
              className={!tipoSustancia && submitted ? 'border-danger' : ''}
            />
            {!tipoSustancia && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>

          <div>
            <label
              htmlFor="sustanciaSolidaCosto"
              className="mb-1 block text-sm font-medium"
            >
              Costo (Bs)
            </label>
            <Input
              id="sustanciaSolidaCosto"
              type="number"
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
              className={`w-full ${parseFloat(costo || '0') <= 0 && submitted ? 'border-danger' : ''}`}
            />
            {parseFloat(costo || '0') <= 0 && submitted && (
              <span className="text-danger text-xs mt-1">El costo debe ser mayor a 0</span>
            )}
          </div>

          <div className="hidden lg:block"></div>
          <div className="hidden lg:block"></div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaToneladas"
              className="mb-1 block text-sm font-medium"
            >
              Toneladas (Tn)
            </label>
            <Input
              id="sustanciaQuimicaSolidaToneladas"
              type="text"
              value={toneladas}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || /^\d*$/.test(val)) {
                  setToneladas(val)
                }
              }}
              placeholder="0"
              className={totalCantidad < 0.001 && submitted ? 'border-danger' : ''}
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaKilos"
              className="mb-1 block text-sm font-medium"
            >
              Kilos (Kg)
            </label>
            <Input
              id="sustanciaQuimicaSolidaKilos"
              type="text"
              value={kilos}
              onChange={(e) => {
                const val = e.target.value
                if (
                  val === '' ||
                  (parseInt(val) >= 0 && parseInt(val) <= 999)
                ) {
                  setKilos(val)
                }
              }}
              placeholder="0"
              className={totalCantidad < 0.001 && submitted ? 'border-danger' : ''}
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaGramos"
              className="mb-1 block text-sm font-medium"
            >
              Gramos (g)
            </label>
            <Input
              id="sustanciaQuimicaSolidaGramos"
              type="text"
              value={gramos}
              onChange={(e) => {
                const val = e.target.value
                if (
                  val === '' ||
                  (parseInt(val) >= 0 && parseInt(val) <= 999)
                ) {
                  setGramos(val)
                }
              }}
              placeholder="0"
              className={totalCantidad < 0.001 && submitted ? 'border-danger' : ''}
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaMiligramos"
              className="mb-1 block text-sm font-medium"
            >
              Miligramos (Mg)
            </label>
            <Input
              id="sustanciaQuimicaSolidaMiligramos"
              type="text"
              value={miligramos}
              onChange={(e) => {
                const val = e.target.value
                if (
                  val === '' ||
                  (parseInt(val) >= 0 && parseInt(val) <= 999)
                ) {
                  setMiligramos(val)
                }
              }}
              placeholder="0"
              className={totalCantidad < 0.001 && submitted ? 'border-danger' : ''}
            />
          </div>

          {totalCantidad < 0.001 && submitted && (
            <div className="col-span-1 lg:col-span-4 mt-1">
              <span className="text-danger text-xs">La cantidad total debe ser al menos 0.001 Kg (1 g)</span>
            </div>
          )}

          <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
            <Button
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
            <VristoDataTable
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
              columns={
                [
                  {
                    accessor: 'descripcionSustancia',
                    title: 'Tipo de Sustancia',
                  },
                  {
                    accessor: 'cantidad',
                    title: 'Cantidad en Kilos',
                    className: 'text-right [&>div]:justify-end',
                    render: (row) => Number(row.cantidad ?? 0).toFixed(3),
                  },
                  {
                    accessor: 'costo',
                    title: 'Costo (Bs)',
                    className: 'text-right [&>div]:justify-end',
                    render: (row) => Number(row.costo ?? 0).toFixed(2),
                  },
                  {
                    accessor: 'actions',
                    title: 'Acciones',
                    render: (row) => (
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
                ] as Column<(typeof datos)[0]>[]
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
