'use client'

import React, { useState, useMemo } from 'react'
import { useSession } from '@/hooks'
import { useQuery } from '@tanstack/react-query'
import { Constantes } from '@/config/Constantes'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { AsignacionType, AsignacionesRespuesta } from '../types/asignacionTypes'

export const AsignacionesDatatable: React.FC = () => {
    const { sesionPeticion } = useSession()

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')

    const obtenerAsignaciones = async (): Promise<AsignacionType[]> => {
        const respuesta = await sesionPeticion<AsignacionesRespuesta>({
            url: `${Constantes.baseUrl}/asignaciones/usuario/admin`,
        })
        return respuesta.datos ?? []
    }

    const {
        data: asignaciones = [],
        isLoading: loading,
        refetch,
    } = useQuery({
        queryKey: ['asignaciones'],
        queryFn: obtenerAsignaciones,
    })

    /* Filtro local por búsqueda */
    const filasFiltradas = useMemo(() => {
        if (!search.trim()) return asignaciones
        const q = search.toLowerCase()
        return asignaciones.filter(
            (a) =>
                a.numeroCaso?.toLowerCase().includes(q) ||
                a.codigoServicio?.toLowerCase().includes(q) ||
                a.asignacionCaso?.toLowerCase().includes(q) ||
                a.fiscalAsignado?.toLowerCase().includes(q) ||
                a.departamento?.descripcion?.toLowerCase().includes(q) ||
                a.unidad?.descripcion?.toLowerCase().includes(q),
        )
    }, [asignaciones, search])

    /* Paginación local */
    const total = filasFiltradas.length
    const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

    const formatearFecha = (fecha: string | null): string => {
        if (!fecha) return '-'
        return new Date(fecha).toLocaleDateString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    const columns: Column<AsignacionType>[] = [
        {
            accessor: 'idAsignacion',
            title: '#',
            render: (row) => (
                <span className="text-sm font-semibold text-primary">
                    {row.idAsignacion}
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
            accessor: 'codigoServicio',
            title: 'Código Servicio',
            sortable: true,
            render: (row) => (
                <span className="badge badge-outline-info text-xs">
                    {row.codigoServicio?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'nombreCaso',
            title: 'Nombre Caso',
            render: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row.nombreCaso?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'asignacionCaso',
            title: 'Asignado a',
            render: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row.asignacionCaso?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'fiscalAsignado',
            title: 'Fiscal Asignado',
            render: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row.fiscalAsignado?.trim() || '-'}
                </span>
            ),
        },
        {
            accessor: 'departamento',
            title: 'Departamento',
            render: (row) => (
                <span className="badge badge-outline-secondary text-xs">
                    {row.departamento?.descripcion || row.idDepartamento}
                </span>
            ),
        },
        {
            accessor: 'unidad',
            title: 'Unidad',
            render: (row) => (
                <span className="text-xs text-gray-600 dark:text-gray-300">
                    {row.unidad?.descripcion || row.idUnidad}
                </span>
            ),
        },
        {
            accessor: 'fechaHoraRegistro',
            title: 'Fecha Registro',
            render: (row) => (
                <span className="text-xs text-gray-400">
                    {formatearFecha(row.fechaHoraRegistro)}
                </span>
            ),
        },
    ]

    return (
        <VristoDataTable<AsignacionType>
            title="Asignaciones del Usuario"
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
