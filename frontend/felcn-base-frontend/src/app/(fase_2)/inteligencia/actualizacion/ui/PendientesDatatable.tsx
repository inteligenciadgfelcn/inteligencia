'use client'

import { useMemo, useState } from 'react'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { CasoActualizacionTable } from '../types/caso.actualizacion.table'
import { CasbinTypes } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getActualizacionData } from '../services/actualizacion.service'
import { DataTableSortStatus } from 'mantine-datatable'
import IconRefresh from '@/components/Icon/IconRefresh'

export function PendientesDataTable() {
  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedCaso, setSelectedCaso] =
    useState<CasoActualizacionTable | null>(null)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'orden',
    direction: 'asc',
  })

  // TODO: Cambiar a false
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: true,
    create: true,
    update: true,
    delete: true,
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
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['casos', pagina, limite, search, sortStatus],
    queryFn: getActualizacionData,
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => data ?? [], [data])
  const total = useMemo(() => data?.length ?? 0, [data])

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return filas

    const query = search.toLowerCase().trim()

    return filas.filter((row) =>
      [
        row.id,
        row.codigoRegistro,
        row.departamento,
        row.unidad,
        row.nroCaso ?? '',
        row.nroRegistro,
        row.fechaHoraOperativo,
        row.nombreCaso,
        row.asignadoCaso,
        row.fiscalAsignado,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [filas, search])

  const toggleSelected = (caso: CasoActualizacionTable) => {
    setSelectedCaso((prev) => (prev?.id == caso.id ? null : caso))
  }

  const columns = [
    {
      accessor: 'id',
      title: 'id',
      render: (row: CasoActualizacionTable) => <span>{row.id}</span>,
    },
    {
      accessor: 'codigoRegistro',
      title: 'Codigo de Registro',
      render: (row: CasoActualizacionTable) => (
        <span>{row.codigoRegistro}</span>
      ),
    },
    {
      accessor: 'departamento',
      title: 'Departamento',
      render: (row: CasoActualizacionTable) => <span>{row.departamento}</span>,
    },
    {
      accessor: 'unidad',
      title: 'Unidad',
      render: (row: CasoActualizacionTable) => <span>{row.unidad}</span>,
    },
    {
      accessor: 'nroCaso',
      title: 'Nro Caso',
      render: (row: CasoActualizacionTable) => <span>{row.nroCaso ?? ''}</span>,
    },
    {
      accessor: 'nroRegistro',
      title: 'Nro Registro',
      render: (row: CasoActualizacionTable) => <span>{row.nroRegistro}</span>,
    },
    {
      accessor: 'fechaHoraOperativo',
      title: 'Fecha y Hora del Operativo',
      render: (row: CasoActualizacionTable) => (
        <span>{row.fechaHoraOperativo}</span>
      ),
    },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del Caso',
      render: (row: CasoActualizacionTable) => <span>{row.nombreCaso}</span>,
    },
    {
      accessor: 'asignadoCaso',
      title: 'Asignado al Caso',
      render: (row: CasoActualizacionTable) => <span>{row.asignadoCaso}</span>,
    },
    {
      accessor: 'fiscalAsignado',
      title: 'Fiscal Asignado',
      render: (row: CasoActualizacionTable) => (
        <span>{row.fiscalAsignado}</span>
      ),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: CasoActualizacionTable) => {
        const isSelected = selectedCaso?.id == row.id

        return (
          <button
            type="button"
            className={`btn btn-sm m-1 ${
              isSelected ? 'btn-outline-danger' : 'btn-outline-primary'
            }`}
            onClick={() => toggleSelected(row)}
          >
            {isSelected ? 'Deseleccionar' : 'Seleccionar'}
          </button>
        )
      },
    },
  ]

  return (
    <div>
      <VristoDataTable<CasoActualizacionTable>
        titleBreadcrumb="CASOS QUE NO REGISTRARON"
        rows={filasFiltradas}
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
        rowClassName={(row) =>
          selectedCaso?.id == row.id
            ? 'bg-primary/10 dark:bg-primary/20 transition-colors'
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
    </div>
  )
}
