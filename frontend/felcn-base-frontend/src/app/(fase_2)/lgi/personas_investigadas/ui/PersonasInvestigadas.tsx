'use client'

import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { AlertDialog } from '@/components/modales/AlertDialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconClipboardText from '@/components/Icon/IconClipboardText'
import IconEdit from '@/components/Icon/IconEdit'
import IconEye from '@/components/Icon/IconEye'
import IconPlus from '@/components/Icon/IconPlus'
import IconSearch from '@/components/Icon/IconSearch'
import IconTrash from '@/components/Icon/IconTrash'

import type {
  EstadoCivilLgi,
  PaisLgi,
  ProfesionLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas.types'
import { ParametricasLgiApi } from '../../(parametricas)/api/parametricas.api'
import { PersonaUpsertDialog } from '../../registro_caso/ui/PersonaUpsertDialog'
import { formatNombreCompleto } from '../../registro_caso/mappers/registro-caso.mappers'
import type {
  PersonaImplicadaPayload,
  PersonaImplicadaRow,
} from '../../registro_caso/types/registro-caso.types'
import { PersonasInvestigadasApi } from '../api/personas-investigadas.api'
import {
  obtenerUltimaSituacionJuridica,
  resolverEstadoCivil,
  resolverPais,
  resolverProfesion,
  resolverTipoDocumento,
} from '../mappers/personas-investigadas.mappers'
import type { SituacionJuridicaRow } from '../types/personas-investigadas.types'
import { PersonaDetalleDialog } from './PersonaDetalleDialog'
import { SituacionesJuridicasDialog } from './SituacionesJuridicasDialog'

interface PersonasInvestigadasProps {
  casoId: number
}

export function PersonasInvestigadas({ casoId }: PersonasInvestigadasProps) {
  const queryClient = useQueryClient()

  const [filtro, setFiltro] = useState('')
  const [filtroAplicado, setFiltroAplicado] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [personaModalOpen, setPersonaModalOpen] = useState(false)
  const [personaEditando, setPersonaEditando] =
    useState<PersonaImplicadaRow | null>(null)
  const [personaDetalle, setPersonaDetalle] =
    useState<PersonaImplicadaRow | null>(null)
  const [personaSituaciones, setPersonaSituaciones] =
    useState<PersonaImplicadaRow | null>(null)
  const [personaEliminar, setPersonaEliminar] =
    useState<PersonaImplicadaRow | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const { data: paises = [] } = useQuery<PaisLgi[]>({
    queryKey: ['lgi-personas-investigadas', 'paises'],
    queryFn: () => ParametricasLgiApi.listarPaises(),
  })

  const { data: estadosCiviles = [] } = useQuery<EstadoCivilLgi[]>({
    queryKey: ['lgi-personas-investigadas', 'estados-civiles'],
    queryFn: () => ParametricasLgiApi.listarEstadosCiviles(),
  })

  const { data: profesiones = [] } = useQuery<ProfesionLgi[]>({
    queryKey: ['lgi-personas-investigadas', 'profesiones'],
    queryFn: () => ParametricasLgiApi.listarProfesiones(),
  })

  const { data: tiposDocumento = [] } = useQuery<TipoDocumentoLgi[]>({
    queryKey: ['lgi-personas-investigadas', 'tipos-documento'],
    queryFn: () => ParametricasLgiApi.listarTiposDocumento(),
  })

  const {
    data: personasData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      'lgi-personas-investigadas',
      'personas',
      casoId,
      page,
      limit,
      filtroAplicado,
    ],
    queryFn: () =>
      PersonasInvestigadasApi.listarPersonas(casoId, {
        pagina: page,
        limite: limit,
        filtro: filtroAplicado || undefined,
      }),
  })

  const filas = personasData?.filas ?? []

  const { data: situacionesPorPersona } = useQuery<
    Record<number, SituacionJuridicaRow[]>
  >({
    queryKey: [
      'lgi-personas-investigadas',
      'situaciones-tabla',
      casoId,
      page,
    ],
    enabled: filas.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        filas.map(async (p) => [
          p.deId,
          await PersonasInvestigadasApi.listarSituacionesJuridicasPersona(
            p.deId
          ),
        ] as const)
      )
      return Object.fromEntries(entries)
    },
  })

  const abrirNuevo = () => {
    setPersonaEditando(null)
    setPersonaModalOpen(true)
  }

  const abrirEditar = (row: PersonaImplicadaRow) => {
    setPersonaEditando(row)
    setPersonaModalOpen(true)
  }

  const guardarPersona = async (payload: PersonaImplicadaPayload) => {
    if (personaEditando) {
      await PersonasInvestigadasApi.actualizarPersona(
        personaEditando.deId,
        payload
      )
    } else {
      await PersonasInvestigadasApi.crearPersona(payload)
    }
    setPersonaModalOpen(false)
    refetch()
  }

  const confirmarEliminar = async () => {
    if (!personaEliminar) return
    setEliminando(true)
    try {
      await PersonasInvestigadasApi.eliminarPersona(personaEliminar.deId)
      setPersonaEliminar(null)
      refetch()
      queryClient.invalidateQueries({ queryKey: ['lgi-listado-casos'] })
    } finally {
      setEliminando(false)
    }
  }

  const columns: Column<PersonaImplicadaRow>[] = useMemo(() => {
    const ultimaSituacion = (row: PersonaImplicadaRow): string => {
      const lista = situacionesPorPersona?.[row.deId] ?? []
      const ultima = obtenerUltimaSituacionJuridica(lista)
      return ultima?.descripcion ?? '-'
    }

    return [
      {
        accessor: 'nombres',
        title: 'Nombres',
        render: (row) => <span className="font-medium">{row.nombres}</span>,
      },
      { accessor: 'paterno', title: 'Apellido Paterno' },
      { accessor: 'materno', title: 'Apellido Materno' },
      { accessor: 'esposo', title: 'Apellido esposo' },
      {
        accessor: 'paisId',
        title: 'Nacionalidad',
        render: (row) => resolverPais(paises, row.paisId),
      },
      {
        accessor: 'estadoCivilId',
        title: 'Estado civil',
        render: (row) => resolverEstadoCivil(estadosCiviles, row.estadoCivilId),
      },
      {
        accessor: 'profesionId',
        title: 'Profesión',
        render: (row) => resolverProfesion(profesiones, row.profesionId),
      },
      {
        accessor: 'tipoDocumentoId',
        title: 'Tipo de documento',
        render: (row) =>
          resolverTipoDocumento(tiposDocumento, row.tipoDocumentoId),
      },
      { accessor: 'numeroDocumento', title: 'Nro. De documento' },
      {
        accessor: 'situacionJuridica',
        title: 'Situación jurídica',
        render: (row) => ultimaSituacion(row),
      },
      {
        accessor: 'acciones',
        title: 'Acciones',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              className="!p-1.5"
              aria-label={`Ver detalle de ${formatNombreCompleto(row)}`}
              title="Ver detalle"
              onClick={() => setPersonaDetalle(row)}
            >
              <IconEye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              className="!p-1.5"
              aria-label={`Situaciones jurídicas de ${formatNombreCompleto(row)}`}
              title="Listar situaciones jurídicas"
              onClick={() => setPersonaSituaciones(row)}
            >
              <IconClipboardText className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              className="!p-1.5"
              aria-label={`Editar ${formatNombreCompleto(row)}`}
              title="Editar"
              onClick={() => abrirEditar(row)}
            >
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              className="!p-1.5"
              aria-label={`Eliminar ${formatNombreCompleto(row)}`}
              title="Eliminar"
              onClick={() => setPersonaEliminar(row)}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ]
  }, [
    paises,
    estadosCiviles,
    profesiones,
    tiposDocumento,
    situacionesPorPersona,
  ])

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white-light">
              Personas investigadas
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Registre, edite o elimine personas implicadas del caso.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="gap-2"
            onClick={abrirNuevo}
          >
            <IconPlus className="h-4 w-4" />
            Nuevo registro
          </Button>
        </div>
      </div>

      <div className="panel space-y-5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-md">
            <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
              Buscar persona
            </label>
            <div className="flex gap-3">
              <Input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Nombres, apellidos, nro documento..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFiltroAplicado(filtro)
                    setPage(1)
                  }
                }}
              />
              <Button
                type="button"
                variant="primary"
                className="gap-2"
                onClick={() => {
                  setFiltroAplicado(filtro)
                  setPage(1)
                }}
              >
                <IconSearch className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              setFiltro('')
              setFiltroAplicado('')
              setPage(1)
            }}
          >
            Limpiar filtros
          </Button>
        </div>

        <VristoDataTable<PersonaImplicadaRow>
          title="Personas investigadas"
          rows={filas}
          total={personasData?.total ?? 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={columns}
          loading={isLoading || isFetching}
        />
      </div>

      <PersonaUpsertDialog
        open={personaModalOpen}
        persona={personaEditando}
        casoId={casoId}
        tiposDocumento={tiposDocumento}
        paises={paises}
        estadosCiviles={estadosCiviles}
        profesiones={profesiones}
        onClose={() => setPersonaModalOpen(false)}
        onGuardar={guardarPersona}
      />

      <PersonaDetalleDialog
        open={!!personaDetalle}
        persona={personaDetalle}
        paises={paises}
        estadosCiviles={estadosCiviles}
        profesiones={profesiones}
        tiposDocumento={tiposDocumento}
        onClose={() => setPersonaDetalle(null)}
      />

      <SituacionesJuridicasDialog
        open={!!personaSituaciones}
        persona={personaSituaciones}
        onClose={() => setPersonaSituaciones(null)}
      />

      <AlertDialog
        isOpen={!!personaEliminar}
        titulo="Eliminar persona"
        texto={`¿Seguro que desea eliminar a "${personaEliminar ? formatNombreCompleto(personaEliminar) : ''}"? Esta acción no se puede deshacer.`}
      >
        <Button
          type="button"
          variant="outline-secondary"
          disabled={eliminando}
          onClick={() => setPersonaEliminar(null)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          loading={eliminando}
          onClick={confirmarEliminar}
        >
          Eliminar
        </Button>
      </AlertDialog>
    </div>
  )
}
