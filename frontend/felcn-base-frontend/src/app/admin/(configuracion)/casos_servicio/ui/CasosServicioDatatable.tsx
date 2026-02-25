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

import { CasoServicioDetalle } from './CasoServicioDetalle'
import { AlertaEstadoCasoServicio } from './AlertaEstadoCasoServicio'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { exportToExcel, exportToPrint } from '@/utils/tableExport'
import IconFile from '@/components/Icon/IconFile'
import IconTxtFile from '@/components/Icon/IconTxtFile'
import { DataTableSortStatus } from 'mantine-datatable'
import React from 'react'
import { sortBy } from 'lodash'
import {
  CasoServicioTypeCRUD,
  ejemplosCasoServicios,
} from '../types/CasoServicioType'
import { FormCasosServicio } from './FormCasosServicio'

export function CasosServicioDataTable() {
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()
  const pathname = usePathname()

  /* STATES */

  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(10)
  const [search, setSearch] = useState('')

  // TODO: Cambiar a false
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: true,
    create: true,
    update: true,
    delete: true,
  })

  const [selected, setSelected] = useState<CasoServicioTypeCRUD | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [secciones, setSecciones] = useState<CasoServicioTypeCRUD[]>([])
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
  const obtenerCasos = async () => {
    // const res = await sesionPeticion({
    //   url: `${Constantes.baseUrl}/autorizacion/casos_servicio`,
    //   params: {
    //     pagina,
    //     limite,
    //     filtro: search || undefined,
    //     ordenar: sortStatus.columnAccessor,
    //     direccion: sortStatus.direction,
    //   },
    // })

    return {
      filas: ejemplosCasoServicios,
      total: 3,
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['casos_servicio', pagina, limite, search, sortStatus],
    queryFn: obtenerCasos,
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
  const exportHeaders = [
    'Codigo Registro',
    'Departamento',
    'Unidad',
    'Numero de Registro',
    'Fecha y Hora de la Operacion',
    'Nombre del Caso',
    'Asignado al Caso',
    'Fiscal Asignado al Caso',
  ]

  const exportColumns = [
    'codigoServicio',
    'departamento',
    'unidad',
    'nroRegistro',
    'fechaHoraOperativo',
    'nombreOperativo',
    'asignadoA.nombreCompleto',
    'fiscalAsignado.nombreCompleto',
  ] as const as readonly (keyof CasoServicioTypeCRUD)[]

  const exportExcel = () => {
    exportToExcel(filas, exportHeaders, exportColumns, 'caso_servicios')
  }

  const exportPrint = () => {
    exportToPrint(
      filas,
      exportHeaders,
      exportColumns,
      'Gestión de Casos Servicios'
    )
  }

  /* COLUMNAS */

  const columns = [
    {
      accessor: 'codigoServicio',
      title: 'Codigo Registro',
      sortable: true,
      render: (row: CasoServicioTypeCRUD) => <span>{row?.codigoServicio}</span>,
    },

    {
      accessor: 'departamento',
      title: 'Departamento',
      sortable: true,
      render: (row: CasoServicioTypeCRUD) => (
        <div className="flex items-center gap-2">
          <span>{row.departamento}</span>
        </div>
      ),
    },

    { accessor: 'unidad', title: 'Unidad' },
    { accessor: 'nroRegistro', title: 'Nro Registro' },
    { accessor: 'fechaHoraOperativo', title: 'Fecha y hora del Operativo' },
    { accessor: 'nombreOperativo', title: 'Nombre del caso' },
    {
      accessor: 'asignadoA',
      title: 'Asignado al caso',
      render: (row: CasoServicioTypeCRUD) =>
        row.asignadoA?.nombreCompleto ?? '-',
    },
    {
      accessor: 'fiscalAsignado',
      title: 'Fiscal asignado al caso',
      render: (row: CasoServicioTypeCRUD) =>
        row.fiscalAsignado?.nombreCompleto ?? '-',
    },

    {
      accessor: 'estado',
      title: 'Estado',
      sortable: true,
      render: (row: CasoServicioTypeCRUD) => (
        <span
          className={`badge ${
            row.estado === 'ACTIVO'
              ? 'bg-success'
              : row.estado === 'INACTIVO'
                ? 'bg-danger'
                : 'bg-info'
          }`}
        >
          {row.estado}
        </span>
      ),
    },

    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: CasoServicioTypeCRUD) => (
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
                setOpenEstado(true)
              }}
            >
              <IconRefresh
                className={`w-5 h-5 ${
                  row.estado === 'ACTIVO' ? 'text-success' : 'text-danger'
                }`}
              />
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
        </div>
      ),
    },
  ]

  /* RENDER */

  return (
    <div>
      {
        <div className="panel flex items-center p-3 text-primary mb-5">
          <span className="text-lg font-semibold">
            Gestión de Casos de Servicio
          </span>
        </div>
      }
      <div className="panel p-1 mb-5 w-full">
        <FormCasosServicio
          onSuccess={() => {
            setOpenForm(false)
            refetch()
          }}
        />
      </div>
      <VristoDataTable<CasoServicioTypeCRUD>
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
        <CasoServicioDetalle
          isOpen
          casoServicio={selected}
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
        <AlertaEstadoCasoServicio
          isOpen
          casoServicio={selected}
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
