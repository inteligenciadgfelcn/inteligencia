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

export function SustanciasSolidas({
    titulo,
    onGuardar,
    onEliminar,
    onRecuperar,
    datos = [],
    cargando = false,
}: SeccionFormProps) {
    const [tipoSustancia, setTipoSustancia] = useState('')
    const [kilos, setKilos] = useState('')
    const [gramos, setGramos] = useState('')
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
        }

        await onGuardar(nuevaSustancia)

        setTipoSustancia('')
        setKilos('')
        setGramos('')
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
                                    <th className="px-2 py-2 text-right">Cantidad en Kilos</th>
                                    <th className="px-2 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.map((item, index) => {
                                    return (
                                        <tr key={`${index}`} className="border-b border-[#e0e6ed]">
                                            <td className="px-2 py-2">{item.idSustanciaSolidaDescripcion}</td>
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
