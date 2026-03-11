'use client'

import React, { useEffect, useState } from 'react'
import { SiiiLookupsService } from '@/services/parametricas'
import IconTrash from '@/components/Icon/IconTrash'

interface SeccionFormProps {
    titulo: string
    onGuardar: (payload: any) => Promise<unknown>
    onEliminar: (id: number) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    datos: any[]
    cargando?: boolean
}

export function SustanciasLiquidas({
    titulo,
    onGuardar,
    onEliminar,
    onRecuperar,
    datos = [],
    cargando = false,
}: SeccionFormProps) {
    const [tipoSustancia, setTipoSustancia] = useState('')
    const [litros, setLitros] = useState('')
    const [mililitros, setMililitros] = useState('')
    const [opciones, setOpciones] = useState<{ id: string; label: string; value: string }[]>([])

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

        const totalLitros = parseFloat(litros || '0') + parseFloat(mililitros || '0') / 1000

        const nuevaSustancia = {
            idSustanciaLiquidaDescripcion: parseInt(tipoSustancia),
            cantidad: totalLitros,
        }

        await onGuardar(nuevaSustancia)

        setTipoSustancia('')
        setLitros('')
        setMililitros('')
    }

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este registro?')) {
            await onEliminar(id)
        }
    }

    return (
        <div>

            {/* SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS */}
            <div className="rounded-md border border-[#e0e6ed] p-4">
                <h4 className="mb-4 text-sm font-semibold">SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label htmlFor="sustanciaQuimicaLiquidaTipo" className="mb-1 block text-sm font-medium">
                            Tipo de Sustancia
                        </label>
                        <select
                            id="sustanciaQuimicaLiquidaTipo"
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
                        <label htmlFor="sustanciaQuimicaSolidalitros" className="mb-1 block text-sm font-medium">
                            Litros
                        </label>
                        <input
                            id="sustanciaQuimicaSolidalitros"
                            type="number"
                            className="form-input w-full"
                            value={litros}
                            onChange={(e) => setLitros(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label htmlFor="sustanciaQuimicaSolidamililitros" className="mb-1 block text-sm font-medium">
                            Mililitros
                        </label>
                        <input
                            id="sustanciaQuimicaSolidamililitros"
                            type="number"
                            className="form-input w-full"
                            value={mililitros}
                            onChange={(e) => {
                                const val = e.target.value
                                if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 999)) {
                                    setMililitros(val)
                                }
                            }}
                            placeholder="0"
                            min="0"
                            max="999"
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

                {datos.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="table-auto min-w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[#e0e6ed]">
                                    <th className="px-2 py-2 text-left">Tipo de Sustancia</th>
                                    <th className="px-2 py-2 text-right">Cantidad en litros</th>
                                    <th className="px-2 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.map((item, index) => {
                                    return (
                                        <tr key={`${index}`} className="border-b border-[#e0e6ed]">
                                            <td className="px-2 py-2">{item.idSustanciaLiquidaDescripcion}</td>
                                            <td className="px-2 py-2 text-right">{Number(item.cantidad ?? 0).toFixed(3)}</td>
                                            <td className="px-2 py-2 text-center">
                                                <button
                                                    type="button"
                                                    className="text-danger hover:text-danger/80"
                                                    onClick={() => handleEliminar(item.id)}
                                                    disabled={cargando}
                                                >
                                                    <IconTrash className="w-5 h-5 mx-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
