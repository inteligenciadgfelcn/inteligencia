'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import { Constantes } from '@/config/Constantes'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { AsignacionType, AsignacionesRespuesta } from '../types/asignacionTypes'
import { Button } from '@/components/ui/Button'

interface Props {
    title: string
    endpoint: string
    queryKeyName: string
}

export const AsignacionesDatatable: React.FC<Props> = ({ title, endpoint, queryKeyName }) => {
    const router = useRouter()
    const { sesionPeticion } = useSession()
    const { usuario } = useAuth()

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')

    const endpointResuelto = useMemo(() => {
        const usuarioActual = usuario?.usuario?.trim()
        if (!usuarioActual) return ''
        return endpoint.replace(':usuario', encodeURIComponent(usuarioActual))
    }, [endpoint, usuario?.usuario])

    const obtenerAsignaciones = async (): Promise<AsignacionType[]> => {
        const respuesta = await sesionPeticion<AsignacionesRespuesta>({
            url: `${Constantes.baseUrl}${endpointResuelto}`,
        })
        return respuesta.datos ?? []
    }

    const {
        data: asignaciones = [],
        isLoading: loading,
        refetch,
    } = useQuery({
        queryKey: [queryKeyName, endpointResuelto],
        queryFn: obtenerAsignaciones,
        enabled: !!endpointResuelto,
    })

    /* Filtro local por búsqueda */
    const filasFiltradas = useMemo(() => {
        if (!search.trim()) return asignaciones
        const q = search.toLowerCase()
        return asignaciones.filter(
            (a) =>
                a.idCaso.toLowerCase().includes(q) ||
                a.numeroCaso.toLowerCase().includes(q) ||
                a.numeroCasoPerDom.toLowerCase().includes(q) ||
                a.numeroOperativo.toLowerCase().includes(q) ||
                a.nombreCaso.toLowerCase().includes(q) ||
                a.asignadoCaso.toLowerCase().includes(q) ||
                a.fiscalAsignadoCaso.toLowerCase().includes(q) ||
                a.distritaleDescripcion.toLowerCase().includes(q) ||
                a.grupoDescripcion.toLowerCase().includes(q) ||
                a.unidadDescripcion.toLowerCase().includes(q),
        )
    }, [asignaciones, search])

    /* Paginación local */
    const total = filasFiltradas.length
    const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

    const columns: Column<AsignacionType>[] = [
       {
            accessor: 'numeroOperativo',
            title: 'Nro. Operativo',
            sortable: true,
            render: (row) => (
                <span className="badge badge-outline-primary text-xs font-semibold">
                    {row.numeroOperativo || '-'}
                </span>
            ),
        },
        {
            accessor: 'numeroCaso',
            title: 'Nro. Caso',
            sortable: true,
            render: (row) => (
                <span className="text-sm font-medium text-dark dark:text-white">
                    {row.numeroCaso?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'nombreCaso',
            title: 'Nombre del Caso',
            sortable: true,
            render: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {row.nombreCaso?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'unidadDescripcion',
            title: 'Unidad',
            render: (row) => (
                <span className="text-xs text-gray-600 dark:text-gray-300">
                    {row.unidadDescripcion || '-'}
                </span>
            ),
        },
        {
            accessor: 'distritaleDescripcion',
            title: 'Distrital',
            render: (row) => (
                <span className="badge badge-outline-secondary text-xs">
                    {row.distritaleDescripcion || '-'}
                </span>
            ),
        },
        {
            accessor: 'grupoDescripcion',
            title: 'Grupo',
            render: (row) => (
                <span className="text-xs text-gray-400">
                    {row.grupoDescripcion || '-'}
                </span>
            ),
        },
        {
            accessor: 'asignadoCaso',
            title: 'Asignado al Caso',
            render: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row.asignadoCaso?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'fiscalAsignadoCaso',
            title: 'Fiscal Asignado',
            render: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row.fiscalAsignadoCaso?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'idCaso',
            title: 'Acciones',
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {(row.numeroCaso?.trim() || row.numeroOperativo?.trim()) && (
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                                router.push(
                                    `/operaciones/operativo/gestion-operativo/registro?id=${row.idCaso}`,
                                )
                            }
                        >
                            Ver Caso
                        </Button>
                    )}
                </div>
            ),
        },
    ]

    return (
        <VristoDataTable<AsignacionType>
            title={title}
            rows={filasPagina}
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1) }}
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1) }}
            columns={columns}
            loading={loading}
            onExportPrint={() => window.print()}
            extraButtons={
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm m-1"
                    onClick={() => refetch()}
                >
                    Actualizar
                </button>
            }
        />
    )
}
