'use client'

import React, { useEffect, useState } from 'react'
import { SiiiLookupsService } from '@/services/parametricas'
import IconTrash from '@/components/Icon/IconTrash'
import { DataTable } from 'mantine-datatable'
import { useConfirmDialog } from '@/hooks'

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
  const [toneladas, setToneladas] = useState('')
  const [kilos, setKilos] = useState('')
  const [gramos, setGramos] = useState('')
  const [miligramos, setMiligramos] = useState('')
  const [costo, setCosto] = useState('')
  const [opciones, setOpciones] = useState<
    { id: string; label: string; value: string }[]
  >([])

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
        // Silently fail or use fallback
      }
    }
    void cargarOpciones()
    return () => {
      activo = false
    }
  }, [])

  const agregarSustancia = async () => {
    if (!tipoSustancia || (!toneladas && !kilos && !gramos && !miligramos)) {
      return
    }

    const totalKilos =
      parseFloat(toneladas || '0') * 1000 +
      parseFloat(kilos || '0') +
      parseFloat(gramos || '0') / 1000 +
      parseFloat(miligramos || '0') / 1000000

    const nuevaSustancia = {
      idSustanciaSolidaDescripcion: parseInt(tipoSustancia),
      cantidad: totalKilos,
      costo: parseFloat(costo || '0'),
    }

    await onGuardar(nuevaSustancia)

    setTipoSustancia('')
    setToneladas('')
    setKilos('')
    setGramos('')
    setMiligramos('')
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
      {/* SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS */}
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
              Tipo de Sustancia
            </label>
            <select
              id="sustanciaQuimicaSolidaTipo"
              className="form-select w-full"
              value={tipoSustancia}
              onChange={(e) => setTipoSustancia(e.target.value)}
            >
              <option value="">Seleccione un Dato</option>
              {opciones.map((opt) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sustanciaSolidaCosto"
              className="mb-1 block text-sm font-medium"
            >
              Costo
            </label>
            <input
              id="sustanciaSolidaCosto"
              type="number"
              className="form-input w-full"
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

          <div className="hidden lg:block"></div>
          <div className="hidden lg:block"></div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaToneladas"
              className="mb-1 block text-sm font-medium"
            >
              Toneladas (Tn)
            </label>
            <input
              id="sustanciaQuimicaSolidaToneladas"
              type="text"
              className="form-input w-full"
              value={toneladas}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || /^\d*$/.test(val)) {
                  setToneladas(val)
                }
              }}
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaKilos"
              className="mb-1 block text-sm font-medium"
            >
              Kilos (Kg)
            </label>
            <input
              id="sustanciaQuimicaSolidaKilos"
              type="text"
              className="form-input w-full"
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
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaGramos"
              className="mb-1 block text-sm font-medium"
            >
              Gramos (g)
            </label>
            <input
              id="sustanciaQuimicaSolidaGramos"
              type="text"
              className="form-input w-full"
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
            />
          </div>

          <div>
            <label
              htmlFor="sustanciaQuimicaSolidaMiligramos"
              className="mb-1 block text-sm font-medium"
            >
              Miligramos (Mg)
            </label>
            <input
              id="sustanciaQuimicaSolidaMiligramos"
              type="text"
              className="form-input w-full"
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
            />
          </div>

          <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={agregarSustancia}
              disabled={cargando}
            >
              Guardar
            </button>
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
                  title: 'Cantidad en Kilos',
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
                    <button
                      type="button"
                      className="text-danger hover:text-danger/80 flex justify-center w-full"
                      onClick={() => handleEliminar(row.id as number)}
                      disabled={cargando}
                    >
                      <IconTrash className="w-5 h-5" />
                    </button>
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
