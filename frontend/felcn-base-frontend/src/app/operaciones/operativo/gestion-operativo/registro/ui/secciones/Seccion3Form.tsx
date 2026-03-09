'use client'

import { useState } from 'react'
import type { SeccionPayloadBase } from '../../../types'

interface SeccionFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    cargando?: boolean
}

export function Seccion3Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const [tipoSustancia, setTipoSustancia] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [kilos, setKilos] = useState('')
    const [gramos, setGramos] = useState('')
    const [payload, setPayload] = useState<SeccionPayloadBase>({
        sustanciasQuimicasControladasSolidas: [],
    })

    const sustancias = Array.isArray(payload.sustanciasQuimicasControladasSolidas)
        ? payload.sustanciasQuimicasControladasSolidas
        : []

    const agregarSustancia = () => {
        const nuevaSustancia = {
            tipo: tipoSustancia,
            cantidad,
            kilos,
            gramos,
        }

        setPayload((prev) => ({
            ...prev,
            sustanciasQuimicasControladasSolidas: [
                ...(Array.isArray(prev.sustanciasQuimicasControladasSolidas)
                    ? prev.sustanciasQuimicasControladasSolidas
                    : []),
                nuevaSustancia,
            ],
        }))

        setTipoSustancia('')
        setCantidad('')
        setKilos('')
        setGramos('')
    }

    return (
        <div >

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
                            <option value="precursor">Precursor</option>
                            <option value="reactivo">Reactivo</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sustanciaQuimicaSolidaCantidad" className="mb-1 block text-sm font-medium">
                            Cantidad
                        </label>
                        <input
                            id="sustanciaQuimicaSolidaCantidad"
                            className="form-input w-full"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="sustanciaQuimicaSolidaKilos" className="mb-1 block text-sm font-medium">
                            Kilos
                        </label>
                        <input
                            id="sustanciaQuimicaSolidaKilos"
                            className="form-input w-full"
                            value={kilos}
                            onChange={(e) => setKilos(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="sustanciaQuimicaSolidaGramos" className="mb-1 block text-sm font-medium">
                            Gramos
                        </label>
                        <input
                            id="sustanciaQuimicaSolidaGramos"
                            className="form-input w-full"
                            value={gramos}
                            onChange={(e) => setGramos(e.target.value)}
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

                {sustancias.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="table-auto min-w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[#e0e6ed]">
                                    <th className="px-2 py-2 text-left">Tipo de Sustancia</th>
                                    <th className="px-2 py-2 text-left">Cantidad</th>
                                    <th className="px-2 py-2 text-left">Kilos</th>
                                    <th className="px-2 py-2 text-left">Gramos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sustancias.map((item, index) => {
                                    const fila = item as Record<string, unknown>

                                    return (
                                        <tr key={`${String(fila.tipo ?? '')}-${index}`} className="border-b border-[#e0e6ed]">
                                            <td className="px-2 py-2">{String(fila.tipo ?? '')}</td>
                                            <td className="px-2 py-2">{String(fila.cantidad ?? '')}</td>
                                            <td className="px-2 py-2">{String(fila.kilos ?? '')}</td>
                                            <td className="px-2 py-2">{String(fila.gramos ?? '')}</td>
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
