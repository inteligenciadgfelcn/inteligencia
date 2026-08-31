'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconRefresh from '@/components/Icon/IconRefresh'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { DataTableSortStatus } from 'mantine-datatable'
import React from 'react'
import { sortBy } from 'lodash'
import { ServicioTable } from '../types/servicio.table'
import { getServicios } from '../services/servicio.service'
import { dateToStringAmPm } from '@/utils/fechas'
import IconFile from '@/components/Icon/IconFile'

export function ServiciosDatatable() {
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

  const [selected, setSelected] = useState<ServicioTable | null>(null)

  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'orden',
    direction: 'asc',
  })

  async function openPdfInNewTab() {
    try {
      const response = await sesionPeticion({
        url: `${Constantes.baseUrl}/prueba/export/pdf`,
        withCredentials: true,
        responseType: 'arraybuffer',
      })

      const blob = new Blob([response], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)

      const newTab = window.open()
      if (newTab) {
        newTab.location.href = url
      } else {
        throw new Error('No se pudo abrir una nueva pestaña')
      }

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al intentar abrir el PDF:', error)
    }
  }

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
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['servicios', pagina, limite, search, sortStatus],
    queryFn: () =>
      getServicios({
        pagina: pagina,
        limite: limite,
        filtro: search || undefined,
        ordenar: sortStatus.columnAccessor,
        direccion: sortStatus.direction,
      }),
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => data?.datos.filas ?? [], [data])
  const total = useMemo(() => data?.datos.total ?? 0, [data])

  const filasOrdenadas = useMemo(() => {
    if (!filas.length) return filas

    const sorted = sortBy(filas, sortStatus.columnAccessor as string)

    return sortStatus.direction === 'desc' ? sorted.reverse() : sorted
  }, [filas, sortStatus])

  /* COLUMNAS */
  const columns = [
    {
      accessor: 'codigoServicio',
      title: 'Codigo Registro',
      sortable: true,
      render: (row: ServicioTable) => <span>{row?.codigoServicio}</span>,
    },
    {
      accessor: 'usuarioPrincipal',
      title: 'Servicio entrante',
      render: (row: ServicioTable) => (
        <span>{row?.nombreUsuarioPrincipal}</span>
      ),
    },
    {
      accessor: 'usuarioEmergencia',
      title: 'Servicio auxiliar',
      render: (row: ServicioTable) => (
        <span>{row?.nombreUsuarioEmergencia}</span>
      ),
    },
    {
      accessor: 'fechaIngreso',
      title: 'Fecha y Hora de Ingreso',
      render: (row: ServicioTable) => (
        <span>{dateToStringAmPm(row?.fechaIngreso)}</span>
      ),
    },
    {
      accessor: 'fechaSalida',
      title: 'Fecha y Hora de Salida',
      render: (row: ServicioTable) => (
        <span>{dateToStringAmPm(row?.fechaSalida)}</span>
      ),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: ServicioTable) => (
        <>
          <button
            onClick={() => {
              // setSelected(row)
              // setOpenDetalle(true)
              openPdfInNewTab()
            }}
          >
            <IconFile className="h-5 text-primary" />
          </button>
          {/* {permisos.read && (
            <button
              onClick={() => {
                setSelected(row)
                setOpenDetalle(true)
              }}
            >
              <IconEye className="h-5 text-primary" />
            </button>
          )} */}

          {/* {permisos.update && (
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
            )} */}

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

  /* RENDER */
  return (
    <div>
      {/* Breadcumb */}
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Inicio
            </button>
          </li>
          <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
              Servicios
            </button>
          </li>
        </ol>
      </div>
      {/* End breadcum */}
      <VristoDataTable<ServicioTable>
        title="Servicios registrados"
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
      {/* {openDetalle && (
        <RegistroDetalle
          isOpen
          registro={selected}
          onClose={() => setOpenDetalle(false)}
        />
      )} */}

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
    </div>
  )
}
