'use client'

import { useCallback, useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import sortBy from 'lodash/sortBy'
import { DataTableSortStatus } from 'mantine-datatable'

import { RolCRUDType } from '@/app/admin/(configuracion)/roles/types/rolCRUDType'
import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconEye from '@/components/Icon/IconEye'
import IconPencil from '@/components/Icon/IconPencil'
import IconPlus from '@/components/Icon/IconPlus'
import IconRefresh from '@/components/Icon/IconRefresh'

import { ModalRol } from './ModalRol'
import { ModalRolDetalle } from './ModalRolDetalle'
import { AlertaEstadoRol } from '@/app/admin/(configuracion)/roles/ui/AlertaEstadoRol'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { exportToExcel, exportToPrint } from '@/utils/tableExport'

export function RolesDatatable() {
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

  const [selected, setSelected] = useState<RolCRUDType | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)

  const [sortStatus, setSortStatus] =
    useState<DataTableSortStatus>({
      columnAccessor: 'rol',
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

  const obtenerRoles = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/roles/todos`,
      params: {
        pagina,
        limite,
        filtro: search || undefined,
      },
    })

    return respuesta.datos
  }
  

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['roles', pagina, limite, search],
    queryFn: obtenerRoles,
    placeholderData: keepPreviousData,
  })

  const filas = data?.filas ?? []
  const total = data?.total ?? 0

  /* SORT FRONTEND */

  const filasOrdenadas = (() => {
    if (!filas.length) return filas

    const sorted = sortBy(
      filas,
      sortStatus.columnAccessor as string
    )

    return sortStatus.direction === 'desc'
      ? sorted.reverse()
      : sorted
  })()

  /* EXPORT */

  const exportHeaders = ['Rol', 'Nombre', 'Descripción', 'Estado']
  const exportColumns = ['rol', 'nombre', 'descripcion', 'estado'] as const

  const exportExcel = () => {
    exportToExcel(filas, exportHeaders, exportColumns, 'roles')
  }

  const exportPrint = () => {
    exportToPrint(filas, exportHeaders, exportColumns, 'Gestión de Roles')
  }

  /* COLUMNAS */

  const columns = [
    { accessor: 'rol', title: 'Rol', sortable: true },

    { accessor: 'nombre', title: 'Nombre', sortable: true },

    { accessor: 'descripcion', title: 'Descripción', sortable: true },

    {
      accessor: 'estado',
      title: 'Estado',
      sortable: true,
      render: (row: RolCRUDType) => (
        <span
          className={`badge ${
            row.estado === 'ACTIVO'
              ? 'bg-success'
              : 'bg-danger'
          }`}
        >
          {row.estado}
        </span>
      ),
    },

    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: RolCRUDType) => (
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
              aria-label={
                row.estado === 'ACTIVO'
                  ? 'Inactivar'
                  : 'Activar'
              }
              onClick={() => {
                setSelected(row)
                setOpenEstado(true)
              }}
            >
              <IconRefresh
                className={`w-5 h-5 ${
                  row.estado === 'ACTIVO'
                    ? 'text-success'
                    : 'text-danger'
                }`}
              />
            </button>
          )}
        </div>
      ),
    },
  ]

  /* RENDER */

  return (
    <div>
      <VristoDataTable<RolCRUDType>
        title="Gestión de Roles"
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
        <ModalRolDetalle
          isOpen
          rol={selected}
          onClose={() => setOpenDetalle(false)}
        />
      )}

      {openForm && (
        <ModalRol
          isOpen
          rol={selected}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false)
            refetch()
          }}
        />
      )}

      {openEstado && (
        <AlertaEstadoRol
          isOpen
          rol={selected}
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
