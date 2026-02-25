'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { ParametroCRUDType } from '../types/parametrosCRUDTypes'

import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconEye from '@/components/Icon/IconEye'
import IconPencil from '@/components/Icon/IconPencil'
import IconTrash from '@/components/Icon/IconTrash'
import IconPlus from '@/components/Icon/IconPlus'
import IconRefresh from '@/components/Icon/IconRefresh'

import { ModalParametros } from './ModalParametros'
import { ModalParametroDetalle } from './ModalParametroDetalle'
import { AlertaEstadoParametro } from './AlertaEstadoParametro'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { exportToExcel, exportToPrint } from '@/utils/tableExport'
import { sortBy } from 'lodash'
import React from 'react'
import { DataTableSortStatus } from 'mantine-datatable'

export function ParametrosDatatable() {
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()
  const pathname = usePathname()

  /* STATES */

  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(10)
  const [search, setSearch] = useState('')

  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const [selected, setSelected] = useState<ParametroCRUDType | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'orden',
    direction: 'asc',
  })

  /* PERMISOS */

  const definirPermisos = useCallback(async () => {
    const p = await permisoUsuario(pathname)
    setPermisos(p)
  }, [permisoUsuario, pathname])

  useEffect(() => {
    definirPermisos()
  }, [definirPermisos])

  /* FETCH */

  const obtenerParametros = async () => {
    const res = await sesionPeticion({
      url: `${Constantes.baseUrl}/parametros`,
      params: {
        pagina,
        limite,
        filtro: search || undefined,
        ordenar: sortStatus.columnAccessor,
        direccion: sortStatus.direction,
      },
    })

    return res.datos
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['parametros', pagina, limite, search, sortStatus],
    queryFn: obtenerParametros,
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => data?.filas ?? [], [data])
  const total = useMemo(() => data?.total ?? 0, [data])

  const filasOrdenadas = React.useMemo(() => {
    if (!filas.length) return filas

    const sorted = sortBy(filas, sortStatus.columnAccessor as string)

    return sortStatus.direction === 'desc' ? sorted.reverse() : sorted
  }, [filas, sortStatus])

  /* EXPORT CONFIG */

  const exportHeaders = ['Código', 'Nombre', 'Descripción', 'Grupo', 'Estado']

  const exportColumns = [
    'codigo',
    'nombre',
    'descripcion',
    'grupo',
    'estado',
  ] as const

  const exportExcel = () => {
    exportToExcel(filas, exportHeaders, exportColumns, 'parametros')
  }

  const exportPrint = () => {
    exportToPrint(filas, exportHeaders, exportColumns, 'Gestión de Parámetros')
  }

  /* COLUMNAS*/

  const columns = [
    { accessor: 'codigo', title: 'Código', sortable: true },
    { accessor: 'nombre', title: 'Nombre', sortable: true },
    { accessor: 'descripcion', title: 'Descripción', sortable: true },
    { accessor: 'grupo', title: 'Grupo', sortable: true },

    {
      accessor: 'estado',
      title: 'Estado',
      render: (row: ParametroCRUDType) => (
        <span
          className={`badge ${
            row.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'
          }`}
        >
          {row.estado}
        </span>
      ),
    },

    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: ParametroCRUDType) => (
        <div className="flex gap-3">
          {permisos.read && (
            <button
              onClick={() => {
                setSelected(row)
                setOpenDetalle(true)
              }}
            >
              <IconEye className="w-5 h-5 text-primary" />
            </button>
          )}

          {permisos.update && (
            <button
              onClick={() => {
                setSelected(row)
                setOpenForm(true)
              }}
            >
              <IconPencil className="w-5 h-5 text-success" />
            </button>
          )}

          {permisos.update && (
            <button
              onClick={() => {
                setSelected(row)
                setOpenEstado(true)
              }}
            >
              <IconTrash className="w-5 h-5 text-danger" />
            </button>
          )}
        </div>
      ),
    },
  ]

  /* RENDER*/

  return (
    <div>
      {/* TABLA */}
      <VristoDataTable<ParametroCRUDType>
        title="Gestión de Parámetros"
        rows={filasOrdenadas}
        total={total}
        page={pagina}
        limit={limite}
        onPageChange={setPagina}
        onLimitChange={setLimite}
        search={search}
        onSearchChange={setSearch}
        columns={columns}
        loading={isFetching}
        onExportExcel={exportExcel}
        onExportPrint={exportPrint}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        extraButtons={
          <>
            {permisos.create && (
              <button
                className="btn btn-success btn-sm m-1"
                onClick={() => {
                  setSelected(null)
                  setOpenForm(true)
                }}
              >
                <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Agregar
              </button>
            )}

            <button
              className="btn btn-outline-primary btn-sm m-1"
              onClick={() => refetch()}
            >
              <IconRefresh className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Actualizar
            </button>
          </>
        }
      />

      {/* MODALES */}
      {openDetalle && (
        <ModalParametroDetalle
          isOpen
          parametro={selected}
          onClose={() => setOpenDetalle(false)}
        />
      )}

      {openForm && (
        <ModalParametros
          isOpen
          parametro={selected}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false)
            refetch()
          }}
        />
      )}

      {openEstado && (
        <AlertaEstadoParametro
          isOpen
          parametro={selected}
          onClose={() => setOpenEstado(false)}
          onSuccess={() => {
            setOpenEstado(false)
            refetch()
          }}
        />
      )}
    </div>
  )
}
