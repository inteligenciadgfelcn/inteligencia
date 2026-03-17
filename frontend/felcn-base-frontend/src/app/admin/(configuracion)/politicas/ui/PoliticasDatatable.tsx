'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { PoliticaCRUDType } from '@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes'
import { RolType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'

import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconEye from '@/components/Icon/IconEye'
import IconPencil from '@/components/Icon/IconPencil'
import IconTrash from '@/components/Icon/IconTrash'
import IconPlus from '@/components/Icon/IconPlus'
import IconRefresh from '@/components/Icon/IconRefresh'

import { ModalPolitica } from '@/app/admin/(configuracion)/politicas/ui/ModalPoliticas'
import { ModalPoliticaDetalle } from './ModalPoliticaDetalle'
import { AlertaEliminarPolitica } from './AlertaEliminarPolitica'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { exportToExcel, exportToPrint } from '@/utils/tableExport'
import { DataTableSortStatus } from 'mantine-datatable'
import React from 'react'
import sortBy from 'lodash/sortBy'

export function PoliticasDatatable() {
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

  const [selected, setSelected] = useState<PoliticaCRUDType | null>(null)

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

  /*  FETCH POLITICAS */

  const obtenerPoliticas = async () => {
    const res = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/politicas`,
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

  const {
    data: politicasData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['politicas', pagina, limite, search],
    queryFn: obtenerPoliticas,
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => politicasData?.filas ?? [], [politicasData])
  const total = useMemo(() => politicasData?.total ?? 0, [politicasData])

  const filasOrdenadas = useMemo(() => {
    if (!filas.length) return []

    const filasConId = (filas as any[]).map((f, index) => ({
      ...f,
      id: index,
    }))

    const sorted = sortBy(filasConId, sortStatus.columnAccessor as string)

    return sortStatus.direction === 'desc' ? sorted.reverse() : sorted
  }, [filas, sortStatus])

  /* FETCH ROLES */

  const obtenerRoles = async (): Promise<RolType[]> => {
    const res = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/roles`,
    })
    return res.datos
  }

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: obtenerRoles,
  })

  /* EXPORT */

  const exportHeaders = ['Sujeto', 'Objeto', 'Acción', 'App']
  const exportColumns = ['sujeto', 'objeto', 'accion', 'app'] as const

  const exportExcel = () => {
    exportToExcel(filas, exportHeaders, exportColumns, 'politicas')
  }

  const exportPrint = () => {
    exportToPrint(filas, exportHeaders, exportColumns, 'Gestión de Políticas')
  }

  /* COLUMNAS*/

  const columns = [
    { accessor: 'sujeto', title: 'Sujeto', sortable: true },
    { accessor: 'objeto', title: 'Objeto' },
    {
      accessor: 'accion',
      title: 'Acción',
      render: (row: PoliticaCRUDType) => (
        <div className="flex flex-wrap gap-1">
          {row.accion.split('|').map((a: string) => (
            <span key={`${row}-${a}`} className="badge bg-info">
              {a}
            </span>
          ))}
        </div>
      ),
    },
    { accessor: 'app', title: 'App' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: PoliticaCRUDType) => (
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

          {permisos.delete && (
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

  /* RENDER */

  return (
    <div>
      <VristoDataTable<PoliticaCRUDType>
        title="Gestión de Políticas"
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

      {openDetalle && (
        <ModalPoliticaDetalle
          isOpen
          politica={selected}
          onClose={() => setOpenDetalle(false)}
        />
      )}

      {openForm && (
        <ModalPolitica
          isOpen
          politica={selected}
          roles={roles}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false)
            refetch()
          }}
        />
      )}

      {openEstado && (
        <AlertaEliminarPolitica
          isOpen
          politica={selected}
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
