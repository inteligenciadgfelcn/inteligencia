'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconEye from '@/components/Icon/IconEye'
import IconPencil from '@/components/Icon/IconPencil'
import IconRefresh from '@/components/Icon/IconRefresh'
import IconPlus from '@/components/Icon/IconPlus'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { exportToExcel, exportToPrint } from '@/utils/tableExport'
import IconFile from '@/components/Icon/IconFile'
import IconTxtFile from '@/components/Icon/IconTxtFile'
import { DataTableSortStatus } from 'mantine-datatable'
import React from 'react'
import { sortBy } from 'lodash'
import { FormRegistro } from './FormRegistro'
import { AlertaEstadoRegistro } from './AlertaEstadoRegistro'
import { RegistroDetalle } from './RegistroDetalle'
import { AsignacionTable } from '../types/asignacion.table'
import { imprimir } from '@/utils/imprimir'
import IconTrash from '@/components/Icon/IconTrash'
import IconEdit from '@/components/Icon/IconEdit'

export function RegistrosDataTable() {
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()
  const pathname = usePathname()

  /* STATES */

  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(10)
  const [search, setSearch] = useState('')

  // const [verificandoServicio, setVerificandoServicio] = useState(true)
  // const [usuarioConServicio, setUsuarioConServicio] = useState(false)
  // const { usuario } = useAuth()

  // TODO: Cambiar a false
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: true,
    create: true,
    update: true,
    delete: true,
  })

  const [selected, setSelected] = useState<AsignacionTable | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [secciones, setSecciones] = useState<AsignacionTable[]>([])
  const [tipoNuevo, setTipoNuevo] = useState<'modulo' | 'seccion'>('modulo')
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'orden',
    direction: 'asc',
  })

  /* PERMISOS */
  // TODO: Descomentar esta seccion
  // const definirPermisos = useCallback(async () => {
  //   const p = await permisoUsuario(pathname)
  //   setPermisos(p)
  // }, [permisoUsuario, pathname])

  // useEffect(() => {
  //   definirPermisos()
  // }, [definirPermisos])

  /* FETCH */
  const obtenerRegistros = async () => {
    const res = await sesionPeticion({
      url: `${Constantes.baseUrl}/asignaciones`,
      withCredentials: true,
      params: {
        pagina,
        limite,
        filtro: search || undefined,
        ordenar: sortStatus.columnAccessor,
        direccion: sortStatus.direction,
      },
    })
    imprimir('table', res)
    return res.datos
    // {
    //   filas: res.data,
    //   total: res.data.length,
    // }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['solicitud_registros', pagina, limite, search, sortStatus],
    queryFn: () => obtenerRegistros(),
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => data?.filas ?? [], [data])
  const total = useMemo(() => data?.total ?? 0, [data])

  const filasOrdenadas = React.useMemo(() => {
    if (!filas.length) return filas

    const sorted = sortBy(filas, sortStatus.columnAccessor as string)

    return sortStatus.direction === 'desc' ? sorted.reverse() : sorted
  }, [filas, sortStatus])

  /* COLUMNAS */
  const columns = [
    {
      accessor: 'idAsignacion',
      title: 'Codigo Registro',
      sortable: true,
      render: (row: AsignacionTable) => <span>{row?.idAsignacion}</span>,
    },

    {
      accessor: 'departamento',
      title: 'Departamento',
      sortable: true,
      render: (row: AsignacionTable) => (
        <div className="flex items-center gap-2">
          <span>{row.departamento?.descripcion}</span>
        </div>
      ),
    },

    {
      accessor: 'unidad',
      title: 'Unidad',
      render: (row: AsignacionTable) => (
        <div className="flex items-center gap-2">
          <span>{row.unidad.descripcion}</span>
        </div>
      ),
    },
    { accessor: 'nroOperativo', title: 'Nro Registro' },
    { accessor: 'nroCaso', title: 'Nro Caso' },
    { accessor: 'fechaSolicitud', title: 'Fecha y hora del Operativo' },
    { accessor: 'nombreCaso', title: 'Nombre del caso' },
    {
      accessor: 'asignadoA',
      title: 'Asignado al caso',
      render: (row: AsignacionTable) => row.asignado ?? '-',
    },
    {
      accessor: 'fiscalAsignado',
      title: 'Fiscal asignado al caso',
      render: (row: AsignacionTable) => row.fiscalAsignado ?? '-',
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: AsignacionTable) => (
        <>
          {permisos.read && (
            <button
              onClick={() => {
                setSelected(row)
                setOpenDetalle(true)
              }}
            >
              <IconEye className="h-5 text-primary" />
            </button>
          )}

          {permisos.update && (
            <button
              onClick={() => {
                setSelected(row)
              }}
            >
              <IconEdit className="ms-2 h-5 text-primary" />
            </button>
          )}

          {/* {permisos.update && (
            <button
              onClick={() => {
                setSelected(row)
                setOpenForm(true)
              }}
            >
              <IconPencil className="w-5 h-5 text-success" />
            </button>
          )} */}
        </>
      ),
    },
  ]

  // if (verificandoServicio) {
  //   return (
  //     <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-6 text-center">
  //       <p className="text-base font-semibold text-primary">
  //         Verificando servicio asignado...
  //       </p>
  //     </div>
  //   )
  // }

  // if (!usuarioConServicio) {
  //   return (
  //     <div className="rounded-md border border-danger/20 bg-danger/5 px-4 py-6 text-center">
  //       <p className="text-base font-semibold text-danger">
  //         No tienes un servicio asignado
  //       </p>
  //     </div>
  //   )
  // }

  /* RENDER */
  return (
    <div>
      <div className="panel flex items-center p-3 text-primary mb-5">
        <span className="text-lg font-semibold">
          Registro de casos en operativos antinarcóticos
        </span>
      </div>
      <div className="p-1 mb-12 w-full">
        <FormRegistro
          asignacion={selected}
          onSuccess={() => {
            setOpenForm(false)
            refetch()
          }}
        />
      </div>
      <VristoDataTable<AsignacionTable>
        title="Casos operativos"
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
        // onExportExcel={exportExcel}
        // onExportPrint={exportPrint}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        extraButtons={
          <>
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
        <RegistroDetalle
          isOpen
          registro={selected}
          onClose={() => setOpenDetalle(false)}
        />
      )}

      {/* {openForm && (
        <ModalModulo
          isOpen
          modulo={selected}
          modulos={secciones}
          tipoNuevo={tipoNuevo}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false)
            refetch()
          }}
        />
      )} */}

      {openEstado && (
        <AlertaEstadoRegistro
          isOpen
          asignacion={selected}
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
