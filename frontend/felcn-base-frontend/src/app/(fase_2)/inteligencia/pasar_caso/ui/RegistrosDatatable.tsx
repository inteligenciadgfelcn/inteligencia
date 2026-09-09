'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { CasbinTypes } from '@/types'

import IconEye from '@/components/Icon/IconEye'
import IconRefresh from '@/components/Icon/IconRefresh'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { DataTableSortStatus } from 'mantine-datatable'
import React from 'react'
import { sortBy } from 'lodash'
import { AlertaEstadoRegistro } from './AlertaEstadoRegistro'
import { RegistroDetalle } from './RegistroDetalle'
import { AsignacionTable } from '../types/asignacion.table'
import { imprimir } from '@/utils/imprimir'
import IconEdit from '@/components/Icon/IconEdit'
import IconChecks from '../../../../../components/Icon/IconChecks'
import IconListCheck from '../../../../../components/Icon/IconListCheck'
import IconCircleCheck from '../../../../../components/Icon/IconCircleCheck'
import IconArrowForward from '@/components/Icon/IconArrowForward'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import FormInputWithPrefix from '@/components/form/FormInputWithPrefix'

export function RegistrosDataTable() {
  const { sesionPeticion } = useSession()
  const { permisoUsuario, codigoIcia, nroPase } = useAuth()
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

  const [numeroRegistro, setNumeroRegistro] = useState('')

  const [asignandoServicio, setAsignandoServicio] = useState(false)

  const [codigoServicioSeleccionado, setCodigoServicioSeleccionado] =
    useState('')
  const [listadoFilas, setListadoFilas] = useState<AsignacionTable[]>([])
  const [listadoTotal, setListadoTotal] = useState(0)
  const [listadoCargando, setListadoCargando] = useState(false)
  const [paginaListado, setPaginaListado] = useState(1)
  const [limiteListado, setLimiteListado] = useState(10)
  const [searchListado, setSearchListado] = useState('')
  const [sortListado, setSortListado] = useState<DataTableSortStatus>({
    columnAccessor: 'idAsignacion',
    direction: 'asc',
  })

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
    console.log(`Entra aqui ${codigoIcia} ==`)

    if (!codigoIcia) {
      return []
    }

    const res = await sesionPeticion({
      url: `${Constantes.baseUrl}/asignaciones/${codigoIcia}`,
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
    queryKey: [
      'solicitud_registros',
      pagina,
      limite,
      search,
      sortStatus,
      codigoIcia,
    ],
    queryFn: () => obtenerRegistros(),
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => data?.filas ?? [], [data])
  const total = useMemo(() => data?.total ?? 0, [data])

  /* SERVICIOS (codigo icia) */
  const obtenerServicios = async () => {
    const res = await sesionPeticion({
      url: `${Constantes.baseUrl}/servicio/todos`,
      withCredentials: true,
    })

    return res ?? []
  }

  const { data: servicios } = useQuery({
    queryKey: ['servicios_todos'],
    queryFn: () => obtenerServicios(),
  })

  const opcionesServicio = useMemo(() => {
    const lista = servicios ?? []
    return Array.isArray(lista)
      ? lista.map((s: { codigoServicio: string }) => ({
          value: s.codigoServicio,
          label: s.codigoServicio,
        }))
      : []
  }, [servicios])

  /* LISTADO POR CODIGO SERVICIO SELECCIONADO */
  const listarPorCodigoServicio = async () => {
    if (!codigoServicioSeleccionado) return

    setListadoCargando(true)
    try {
      const res = await sesionPeticion({
        url: `${Constantes.baseUrl}/asignaciones/${codigoServicioSeleccionado}`,
        withCredentials: true,
        params: {
          pagina: paginaListado,
          limite: limiteListado,
          filtro: searchListado || undefined,
          ordenar: sortListado.columnAccessor,
          direccion: sortListado.direction,
        },
      })
      setListadoFilas(res.datos?.filas ?? [])
      setListadoTotal(res.datos?.total ?? 0)
    } finally {
      setListadoCargando(false)
    }
  }

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
    {
      accessor: 'fechaOperativo',
      title: 'Fecha y hora del Operativo',
      render: (row: AsignacionTable) =>
        new Date(row.fechaOperativo ?? '').toLocaleString(),
    },
    { accessor: 'nombreCaso', title: 'Nombre del caso' },
    {
      accessor: 'asignadoA',
      title: 'Asignado al caso',
      render: (row: AsignacionTable) => row.siii?.asignado_caso ?? '-',
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
                setSelected((prev) => {
                  const data =
                    prev?.idAsignacion == row.idAsignacion ? null : row
                  return data
                })
                setNumeroRegistro(row.nroOperativo)
              }}
            >
              <IconCircleCheck className="ms-2 h-5 text-primary" />
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
      <VristoDataTable<AsignacionTable>
        title="Casos del servicio"
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
        rowClassName={(row) =>
          selected?.idAsignacion === row.idAsignacion
            ? 'bg-blue-200 dark:bg-blue-900'
            : ''
        }
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

      {/* Seccion operativo a pasar */}
      <div className="panel mt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <FormInputWithPrefix
              id="numeroRegistro"
              type="text"
              prefix="Número de registro a pasar"
              containerClassName="w-full"
              value={numeroRegistro}
              onChange={(e) => setNumeroRegistro(e.target.value)}
              placeholder="Seleccione un registro del listado"
            />
          </div>
          <div>
            <FormInputWithPrefix
              id="codigoServicio"
              type="text"
              prefix="Código servicio"
              containerClassName="w-full"
              value={String(codigoIcia ?? '')}
              readOnly
            />
          </div>
          <div>
            <FormInputWithPrefix
              id="cuenta"
              type="text"
              prefix="Cuenta"
              containerClassName="w-full"
              value={String(nroPase ?? '')}
              readOnly
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            disabled={
              !numeroRegistro || !selected || !codigoServicioSeleccionado
            }
            loading={asignandoServicio}
            onClick={async () => {
              if (!selected) return
              setAsignandoServicio(true)
              try {
                const res = await sesionPeticion({
                  method: 'patch',
                  url: `${Constantes.baseUrl}/asignaciones/${selected.idAsignacion}`,
                  withCredentials: true,
                  body: {
                    codigoServicio: codigoServicioSeleccionado,
                  },
                })
                imprimir('Asignación realizada', res)
                setSelected(null)
                await refetch()
              } finally {
                setAsignandoServicio(false)
              }
            }}
            icon={<IconArrowForward />}
          >
            Asignar al siguiente servicio
          </Button>
        </div>
      </div>

      {/* Seccion listado usando codigo icia */}
      <div className="panel mt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="codigoServicioListado"
              className="mb-1 block text-sm font-medium"
            >
              Código Servicio
            </label>
            <Select
              id="codigoServicioListado"
              className="w-full"
              placeholder="Seleccione un código de servicio"
              value={codigoServicioSeleccionado}
              onChange={(e) => setCodigoServicioSeleccionado(e.target.value)}
              options={opcionesServicio}
            />
          </div>
          <div>
            <Button
              variant="primary"
              disabled={!codigoServicioSeleccionado}
              loading={listadoCargando}
              onClick={() => listarPorCodigoServicio()}
              icon={<IconListCheck />}
            >
              Listar
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <VristoDataTable<AsignacionTable>
            rows={listadoFilas}
            total={listadoTotal}
            page={paginaListado}
            limit={limiteListado}
            onPageChange={setPaginaListado}
            onLimitChange={setLimiteListado}
            // search={searchListado}
            // onSearchChange={setSearchListado}
            columns={columns}
            loading={listadoCargando}
            sortStatus={sortListado}
            onSortStatusChange={setSortListado}
            extraButtons={
              <>
                <button
                  className="btn btn-outline-primary btn-sm m-1"
                  onClick={() => listarPorCodigoServicio()}
                >
                  <IconRefresh className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Actualizar
                </button>
              </>
            }
          />
        </div>
      </div>

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
