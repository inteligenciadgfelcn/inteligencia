'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { ModuloCRUDType } from '@/app/admin/(configuracion)/modulos/types/CrearEditarModulosType'

import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconEye from '@/components/Icon/IconEye'
import IconPencil from '@/components/Icon/IconPencil'
import IconRefresh from '@/components/Icon/IconRefresh'
import IconPlus from '@/components/Icon/IconPlus'

import { ModalModulo } from './ModalModulo'
import { ModalModuloDetalle } from './ModalModuloDetalle'
import { AlertaEstadoModulo } from './AlertaEstadoModulo'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { exportToExcel, exportToPrint } from '@/utils/tableExport'
import { Icono } from '@/components/Icono'
import IconFile from '@/components/Icon/IconFile'
import IconTxtFile from '@/components/Icon/IconTxtFile'
import { DataTableSortStatus } from 'mantine-datatable'
import React from 'react'
import { sortBy } from 'lodash'

export function ModulosDatatable() {
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

  const [selected, setSelected] = useState<ModuloCRUDType | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [secciones, setSecciones] = useState<ModuloCRUDType[]>([])
  const [tipoNuevo, setTipoNuevo] = useState<'modulo' | 'seccion'>('modulo')
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

  const obtenerModulos = async () => {
    const res = await sesionPeticion({
      url: `${Constantes.baseUrl}/autorizacion/modulos`,
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

  const obtenerSecciones = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.baseUrl}/autorizacion/modulos`,
      params: {
        pagina: 1,
        limite: 20,
        seccion: true,
      },
    })
    return respuesta.datos?.filas
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['modulos', pagina, limite, search, sortStatus],
    queryFn: obtenerModulos,
    placeholderData: keepPreviousData,
  })

  const { data: seccionesData } = useQuery({
    queryKey: ['secciones'],
    queryFn: obtenerSecciones,
  })

  useEffect(() => {
    if (seccionesData) {
      setSecciones(seccionesData)
    }
  }, [seccionesData])

  const filas = useMemo(() => data?.filas ?? [], [data])
  const total = useMemo(() => data?.total ?? 0, [data])

  const filasOrdenadas = React.useMemo(() => {
    if (!filas.length) return filas

    const sorted = sortBy(filas, sortStatus.columnAccessor as string)

    return sortStatus.direction === 'desc' ? sorted.reverse() : sorted
  }, [filas, sortStatus])

  /* EXPORT CONFIG */
  const exportHeaders = [
    'Orden',
    'Label',
    'Nombre',
    'Descripción',
    'URL',
    'Estado',
  ]

  const exportColumns = [
    'propiedades.orden',
    'label',
    'nombre',
    'propiedades.descripcion',
    'url',
    'estado',
  ] as const

  const exportExcel = () => {
    exportToExcel(filas, exportHeaders, exportColumns, 'modulos')
  }

  const exportPrint = () => {
    exportToPrint(filas, exportHeaders, exportColumns, 'Gestión de Módulos')
  }

  /* COLUMNAS */

  const columns = [
    {
      accessor: 'propiedades.orden',
      title: 'Orden',
      sortable: true,
      render: (row: ModuloCRUDType) => <span>{row?.propiedades?.orden}</span>,
    },

    {
      accessor: 'label',
      title: 'Label',
      sortable: true,
      render: (row: ModuloCRUDType) => (
        <div className="flex items-center gap-2">
          {row?.propiedades?.icono && (
            <Icono className="text-base">{row.propiedades.icono}</Icono>
          )}
          <span>{row.label}</span>
        </div>
      ),
    },

    { accessor: 'nombre', title: 'Nombre' },

    {
      accessor: 'descripcion',
      title: 'Descripción',
      sortable: true,
      render: (row: ModuloCRUDType) => (
        <span className="text-sm">{row?.propiedades?.descripcion}</span>
      ),
    },

    { accessor: 'url', title: 'URL' },

    {
      accessor: 'estado',
      title: 'Estado',
      sortable: true,
      render: (row: ModuloCRUDType) => (
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
      render: (row: ModuloCRUDType) => (
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
      <VristoDataTable<ModuloCRUDType>
        title="Gestión de Módulos"
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
              <div className="relative inline-block">
                {/* BOTÓN PRINCIPAL */}
                <button
                  type="button"
                  onClick={() => setOpenMenu(!openMenu)}
                  className="
        btn btn-success btn-sm m-1
        flex items-center gap-2
      "
                >
                  <IconPlus className="w-5 h-5" />
                  Agregar
                </button>

                {/* MENÚ */}
                {openMenu && (
                  <div
                    className="
          absolute right-0 mt-2 w-52
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg z-50
          overflow-hidden
        "
                  >
                    {/* NUEVO MÓDULO */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(null)
                        setTipoNuevo('modulo')
                        setOpenForm(true)
                        setOpenMenu(false)
                      }}
                      className="
            w-full px-4 py-2
            flex items-center gap-3
            text-left text-sm
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
          "
                    >
                      <IconFile className="w-5 h-5 text-primary" />
                      <span>Nuevo módulo</span>
                    </button>

                    <div className="h-px bg-gray-200 dark:bg-gray-700" />

                    {/* NUEVA SECCIÓN */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(null)
                        setTipoNuevo('seccion')
                        setOpenForm(true)
                        setOpenMenu(false)
                      }}
                      className="
            w-full px-4 py-2
            flex items-center gap-3
            text-left text-sm
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
          "
                    >
                      <IconTxtFile className="w-5 h-5 text-success" />
                      <span>Nueva sección</span>
                    </button>
                  </div>
                )}
              </div>
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
        <ModalModuloDetalle
          isOpen
          modulo={selected}
          onClose={() => setOpenDetalle(false)}
        />
      )}

      {openForm && (
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
      )}

      {openEstado && (
        <AlertaEstadoModulo
          isOpen
          modulo={selected}
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
