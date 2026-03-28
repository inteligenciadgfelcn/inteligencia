'use client'

import React, { useEffect, useState } from 'react'
import { SiiiLookupsService } from '@/services/parametricas'
import IconTrash from '@/components/Icon/IconTrash'
import { DataTable } from 'mantine-datatable'

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
    const [tipoSustancia, setTipoSustancia] = useState('')
    const [kilos, setKilos] = useState('')
    const [gramos, setGramos] = useState('')
    const [costo, setCosto] = useState('')
    const [opciones, setOpciones] = useState<{ id: string; label: string; value: string }[]>([])

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
        if (!tipoSustancia || (!kilos && !gramos)) {
            return
        }

        const totalKilos = parseFloat(kilos || '0') + parseFloat(gramos || '0') / 1000

        const nuevaSustancia = {
            idSustanciaSolidaDescripcion: parseInt(tipoSustancia),
            cantidad: totalKilos,
            costo: parseFloat(costo || '0'),
        }

        await onGuardar(nuevaSustancia)

        setTipoSustancia('')
        setKilos('')
        setGramos('')
        setCosto('')
    }

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este registro?')) {
            await onEliminar(id)
        }
    }

    return (
        <div>

            {/* SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS */}
            <div className="rounded-md border border-[#e0e6ed] p-4">
                <h4 className="mb-4 text-sm font-semibold">SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label htmlFor="sustanciaQuimicaSolidaTipo" className="mb-1 block text-sm font-medium">
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
                        <label htmlFor="sustanciaQuimicaSolidaKilos" className="mb-1 block text-sm font-medium">
                            Kilos
                        </label>
                        <input
                            id="sustanciaQuimicaSolidaKilos"
                            type="number"
                            className="form-input w-full"
                            value={kilos}
                            onChange={(e) => setKilos(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label htmlFor="sustanciaQuimicaSolidaGramos" className="mb-1 block text-sm font-medium">
                            Gramos
                        </label>
                        <input
                            id="sustanciaQuimicaSolidaGramos"
                            type="number"
                            className="form-input w-full"
                            value={gramos}
                            onChange={(e) => {
                                const val = e.target.value
                                if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 999)) {
                                    setGramos(val)
                                }
                            }}
                            placeholder="0"
                            min="0"
                            max="999"
                        />
                    </div>

                    <div>
                        <label htmlFor="sustanciaSolidaCosto" className="mb-1 block text-sm font-medium">
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

                    <div className="col-span-1 mt-2 lg:col-span-4">
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={agregarSustancia}
                            disabled={cargando}
                        >
                            Agregar Sustancia
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
                            totalRecords={totalRegistros !== undefined ? totalRegistros : datos.length}
                            recordsPerPage={limite}
                            page={pagina}
                            onPageChange={onCambioPagina ?? (() => { })}
                            recordsPerPageOptions={[10, 20, 50]}
                            onRecordsPerPageChange={onCambioLimite ?? (() => { })}
                            columns={[
                                {
                                    accessor: 'descripcionSustancia',
                                    title: 'Tipo de Sustancia',
                                    footer: <span className="font-bold text-sm">Total Costo:</span>,
                                },
                                {
                                    accessor: 'cantidad',
                                    title: 'Cantidad en Kilos',
                                    textAlign: 'right',
                                    render: (row: any) => Number(row.cantidad ?? 0).toFixed(3),
                                },
                                {
                                    accessor: 'costo',
                                    title: 'Costo',
                                    textAlign: 'right',
                                    render: (row: any) => Number(row.costo ?? 0).toFixed(2),
                                    footer: (
                                        <span className="font-bold text-sm">
                                            {datos.reduce((sum, item) => sum + Number(item.costo ?? 0), 0).toFixed(2)}
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
