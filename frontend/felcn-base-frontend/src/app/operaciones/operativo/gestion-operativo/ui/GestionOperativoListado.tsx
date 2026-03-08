'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GestionOperativoService } from '@/services/operativos'
import type { GestionOperativoItem } from '../types'

export function GestionOperativoListado() {
    const { data, isLoading } = useQuery({
        queryKey: ['gestion-operativo-listado'],
        queryFn: () => GestionOperativoService.listar(),
    })

    const filas: GestionOperativoItem[] = useMemo(() => data?.datos ?? [], [data])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Gestion Operativo</h1>
                <Link
                    className="btn btn-primary btn-sm"
                    href="/operaciones/operativo/gestion-operativo/registro"
                >
                    Nuevo Registro
                </Link>
            </div>

            <div className="panel">
                {isLoading && <p className="text-sm text-gray-500">Cargando...</p>}
                {!isLoading && filas.length === 0 && (
                    <p className="text-sm text-gray-500">Sin registros</p>
                )}

                {!isLoading && filas.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left p-2">ID</th>
                                    <th className="text-left p-2">Codigo</th>
                                    <th className="text-left p-2">Caso</th>
                                    <th className="text-left p-2">Fecha</th>
                                    <th className="text-left p-2">Estado</th>
                                    <th className="text-left p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filas.map((fila) => (
                                    <tr key={fila.id}>
                                        <td className="p-2">{fila.id}</td>
                                        <td className="p-2">{fila.codigo}</td>
                                        <td className="p-2">{fila.nombreCaso}</td>
                                        <td className="p-2">{fila.fechaRegistro}</td>
                                        <td className="p-2">{fila.estado}</td>
                                        <td className="p-2">
                                            <Link
                                                className="btn btn-outline-primary btn-sm"
                                                href={`/operaciones/operativo/gestion-operativo/registro?id=${fila.id}`}
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
