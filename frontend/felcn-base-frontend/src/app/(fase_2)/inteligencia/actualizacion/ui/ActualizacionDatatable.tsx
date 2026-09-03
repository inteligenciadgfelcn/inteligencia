'use client'

import { useMemo, useState } from 'react'

import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { CasoActualizacionTable } from '../types/caso.actualizacion.table'
import { CasbinTypes } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getActualizacionData } from '../services/actualizacion.service'
import { DataTableSortStatus } from 'mantine-datatable'
import IconRefresh from '@/components/Icon/IconRefresh'
import { FormActualizacion } from './FormActualizacion'
import { dateUtcToString } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import { useAuth } from '@/context/AuthProvider'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { useRouter } from 'next/navigation'
import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '../../../../../utils/peticion'
import { InterpreteMensajes } from '../../../../../utils'
import { useAlerts } from '../../../../../hooks'

export function ActualizacionDataTable() {
  const { codigoIcia } = useAuth()
  const router = useRouter()
  const { Alerta } = useAlerts()

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
    queryKey: ['casos_registrados', pagina, limite, search, sortStatus],
    queryFn: async () => {
      // const { codigoServicio } = await verificarServicioUsuario()
      if (!codigoIcia) {
        throw new Error('No se pudo obtener el código de servicio del usuario')
      }
      return getActualizacionData(
        true,
        {
          pagina: pagina,
          limite: limite,
          filtro: search || undefined,
          ordenar: sortStatus.columnAccessor,
          direccion: sortStatus.direction,
        },
        codigoIcia
      )
    },
    placeholderData: keepPreviousData,
  })

  const filas = useMemo(() => data?.datos.filas ?? [], [data])
  const total = useMemo(() => data?.datos.total ?? 0, [data])

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return filas

    const query = search.toLowerCase().trim()

    return filas.filter((row) =>
      [
        row.idAsignacion,
        row.codigoServicio,
        row.departamento,
        row.unidad,
        row.numeroCaso ?? '',
        row.numeroOperativo,
        row.fechaOperativo,
        row.nombreCaso,
        row.asignacionCaso,
        row.fiscalAsignado,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [filas, search])

  const toggleSelected = (caso: CasoActualizacionTable) => {
    setSelectedCaso((prev) =>
      prev?.idAsignacion == caso.idAsignacion ? null : caso
    )
  }

  const columns = [
    {
      accessor: 'idAsignacion',
      title: 'id',
      render: (row: CasoActualizacionTable) => <span>{row.idAsignacion}</span>,
    },
    {
      accessor: 'codigoServicio',
      title: 'Codigo de Servicio',
      render: (row: CasoActualizacionTable) => (
        <span>{row.codigoServicio}</span>
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
      accessor: 'numeroCaso',
      title: 'Nro Caso',
      render: (row: CasoActualizacionTable) => (
        <span>{row.numeroCaso ?? ''}</span>
      ),
    },
    {
      accessor: 'numeroOperativo',
      title: 'Nro Operativo',
      render: (row: CasoActualizacionTable) => (
        <span>{row.numeroOperativo}</span>
      ),
    },
    {
      accessor: 'fechaHoraOperativo',
      title: 'Fecha y Hora del Operativo',
      render: (row: CasoActualizacionTable) => (
        <span>{dateUtcToString(row.fechaOperativo)}</span>
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
      render: (row: CasoActualizacionTable) => (
        <span>{row.asignacionCaso}</span>
      ),
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
        const isSelected = selectedCaso?.idAsignacion == row.idAsignacion
        // 3 buttons, 2 icon buttons and 1 normal button, if the row is selected, the normal button should say "Deseleccionar" and be red, otherwise it should say "Seleccionar" and be blue
        return (
          <div className="flex gap-2">
            <IconoTooltip
              id="1"
              titulo={'Editar caso'}
              color={'info'}
              accion={() => {
                // redirect to http://localhost:8080/operativos/gestion-operativo/registro/?id=36 using router
                router.push(`/operativos/registro/?id=${row.idCaso}`)
              }}
              icono={'edit'}
              name={'Editar caso'}
            />
            <IconoTooltip
              id="1"
              titulo={'Generar reporte'}
              color={'info'}
              accion={async () => {
                try {
                  Alerta({
                    autoHideDuration: 3000,
                    mensaje: 'Generando reporte...',
                    variant: 'success',
                  })
                  const url = `${Constantes.baseUrl}/reportes/operativo/pdf?numero=${encodeURIComponent(row.numeroOperativo)}`
                  const blob = await sesionPeticion<Blob>({
                    url,
                    responseType: 'blob',
                  })
                  const objectUrl = URL.createObjectURL(blob)
                  const enlace = document.createElement('a')
                  enlace.href = objectUrl
                  enlace.download = `formulario-operativo-${row.numeroOperativo}.pdf`
                  document.body.appendChild(enlace)
                  enlace.click()
                  enlace.remove()
                  URL.revokeObjectURL(objectUrl)
                } catch (e) {
                  Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
                }
              }}
              icono={'download'}
              name={'Generar reporte'}
            />
            {/* <IconoTooltip
              id={`reenviarCorreoActivacion-${params.row.id}`}
              titulo={'Reenviar correo de activación'}
              color={'info'}
              accion={() => abrirAlertaReenvioCorreo(params.row)}
              desactivado={params.row.ciudadaniaDigital}
              icono={'forward_to_inbox'}
              name={'Reenviar correo de activación'}
            /> */}
            <button
              type="button"
              className={`btn btn-sm m-1 ${
                isSelected ? 'btn-outline-danger' : 'btn-outline-primary'
              }`}
              onClick={() => toggleSelected(row)}
            >
              {isSelected ? 'Deseleccionar' : 'Seleccionar'}
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="mb-12">
      <VristoDataTable<CasoActualizacionTable>
        title="Casos ingresados"
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
          selectedCaso?.idAsignacion == row.idAsignacion
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

      <FormActualizacion
        caso={selectedCaso}
        onActualizar={() => {
          imprimir('Actualizando caso con data:')
          setSelectedCaso(null)
          refetch()
        }}
      />
    </div>
  )
}
