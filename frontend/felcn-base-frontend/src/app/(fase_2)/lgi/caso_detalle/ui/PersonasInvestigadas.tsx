'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconEdit from '@/components/Icon/IconEdit'
import IconPlus from '@/components/Icon/IconPlus'
import IconTrash from '@/components/Icon/IconTrash'
import IconClipboardText from '@/components/Icon/IconClipboardText'

import { ParametricasLgiApi } from '../../(parametricas)/api/parametricas.api'
import type {
  TipoDocumentoLgi,
  PaisLgi,
  EstadoCivilLgi,
  ProfesionLgi,
} from '../../(parametricas)/types/parametricas.types'
import { RegistroCasoApi } from '../../registro_caso/api/registro-caso.api'
import {
  formatNombreCompleto,
  buscarDescripcion,
  mapTipoDocumentoToOption,
  mapPaisToOption,
  mapEstadoCivilToOption,
  mapProfesionToOption,
  buildPersonaPayload,
} from '../../registro_caso/mappers/registro-caso.mappers'
import {
  personaImplicadaSchema,
  type PersonaImplicadaSchemaValues,
} from '../../registro_caso/schemas/registro-caso.schema'
import type {
  PersonaImplicadaRow,
  PersonaImplicadaPayload,
  SituacionLegalCatalogo,
} from '../../registro_caso/types/registro-caso.types'
import { createDefaultPersonaValues } from '../../registro_caso/utils/registro-caso.utils'

type Props = {
  casoId: number
  isLectura?: boolean
}

function buscarDescripcionLocal(
  catalogo: unknown[],
  id: string | number,
  idField: string
): string {
  const item = catalogo.find(
    (entry) => String((entry as Record<string, unknown>)[idField]) === String(id)
  )
  return ((item as Record<string, unknown>)?.descripcion as string) ?? '-'
}

export function PersonasInvestigadas({ casoId, isLectura = false }: Props) {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [personaEditando, setPersonaEditando] =
    useState<PersonaImplicadaRow | null>(null)
  const [personaEliminar, setPersonaEliminar] =
    useState<PersonaImplicadaRow | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [situacionesModalOpen, setSituacionesModalOpen] = useState(false)
  const [personaSituacion, setPersonaSituacion] =
    useState<PersonaImplicadaRow | null>(null)
  const [situacionLegalId, setSituacionLegalId] = useState<string>('')
  const [fechaSituacion, setFechaSituacion] = useState<string>('')
  const [guardandoSituacion, setGuardandoSituacion] = useState(false)

  const { data: personasData, isLoading } = useQuery({
    queryKey: ['lgi-personas-investigadas', casoId, page, limit],
    enabled: Boolean(casoId),
    queryFn: () =>
      RegistroCasoApi.listarPersonas(casoId, { pagina: page, limite: limit }),
  })

  const { data: tiposDocumento = [] } = useQuery<TipoDocumentoLgi[]>({
    queryKey: ['lgi-personas-investigadas', 'tipos-documento'],
    queryFn: () => ParametricasLgiApi.listarTiposDocumento(),
  })

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

  const { data: situacionesLegales = [] } = useQuery<SituacionLegalCatalogo[]>({
    queryKey: ['lgi-personas-investigadas', 'situaciones-legales'],
    queryFn: () => RegistroCasoApi.listarSituacionesLegales(),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonaImplicadaSchemaValues>({
    resolver: zodResolver(personaImplicadaSchema),
    defaultValues: createDefaultPersonaValues(),
  })

  const tipoDocValue = watch('tipoDocumentoId')
  const paisValue = watch('paisId')
  const estadoCivilValue = watch('estadoCivilId')
  const profesionValue = watch('profesionId')

  const abrirModal = (row?: PersonaImplicadaRow) => {
    if (row) {
      setPersonaEditando(row)
      reset({
        nombres: row.nombres,
        paterno: row.paterno,
        materno: row.materno,
        esposo: row.esposo ?? '',
        numeroDocumento: row.numeroDocumento,
        tipoDocumentoId: {
          value: String(row.tipoDocumentoId),
          label: buscarDescripcion(tiposDocumento, row.tipoDocumentoId),
          original: tiposDocumento.find(
            (t) => String(t.td_id) === String(row.tipoDocumentoId)
          )!,
        },
        paisId: {
          value: String(row.paisId),
          label: buscarDescripcionLocal(paises, row.paisId, 'pa_id'),
          original: paises.find((p) => String(p.pa_id) === String(row.paisId))!,
        },
        estadoCivilId: {
          value: String(row.estadoCivilId),
          label: buscarDescripcionLocal(estadosCiviles, row.estadoCivilId, 'ec_id'),
          original: estadosCiviles.find(
            (e) => String(e.ec_id) === String(row.estadoCivilId)
          )!,
        },
        profesionId: {
          value: String(row.profesionId),
          label: buscarDescripcionLocal(profesiones, row.profesionId, 'prof_id'),
          original: profesiones.find(
            (p) => String(p.prof_id) === String(row.profesionId)
          )!,
        },
      })
    } else {
      setPersonaEditando(null)
      reset(createDefaultPersonaValues())
    }
    setModalOpen(true)
  }

  const onSubmit = async (values: PersonaImplicadaSchemaValues) => {
    const payload: PersonaImplicadaPayload = buildPersonaPayload(casoId, values)
    if (personaEditando) {
      await RegistroCasoApi.actualizarPersona(personaEditando.deId, payload)
    } else {
      await RegistroCasoApi.crearPersona(payload)
    }
    setModalOpen(false)
    queryClient.invalidateQueries({
      queryKey: ['lgi-personas-investigadas', casoId],
    })
  }

  const confirmarEliminar = async () => {
    if (!personaEliminar) return
    setEliminando(true)
    try {
      await RegistroCasoApi.eliminarPersona(personaEliminar.deId)
      setPersonaEliminar(null)
      queryClient.invalidateQueries({
        queryKey: ['lgi-personas-investigadas', casoId],
      })
    } finally {
      setEliminando(false)
    }
  }

  const abrirSituacionesModal = (row: PersonaImplicadaRow) => {
    setPersonaSituacion(row)
    setSituacionLegalId('')
    setFechaSituacion('')
    setSituacionesModalOpen(true)
  }

  const onSubmitSituacion = async () => {
    if (!personaSituacion || !situacionLegalId || !fechaSituacion) return
    setGuardandoSituacion(true)
    try {
      await RegistroCasoApi.registrarSituacionJuridica({
        detenidoId: personaSituacion.deId,
        situacionLegalId: Number(situacionLegalId),
        fecha: fechaSituacion,
      })
      setSituacionesModalOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['lgi-personas-investigadas', casoId],
      })
    } finally {
      setGuardandoSituacion(false)
    }
  }

  const columns: Column<PersonaImplicadaRow>[] = [
    { accessor: 'deId', title: 'ID' },
    {
      accessor: 'nombres',
      title: 'Nombre completo',
      render: (row) => (
        <span className="font-medium">{formatNombreCompleto(row)}</span>
      ),
    },
    { accessor: 'numeroDocumento', title: 'Nro documento' },
    {
      accessor: 'tipoDocumentoId',
      title: 'Tipo doc.',
      render: (row) => buscarDescripcion(tiposDocumento, row.tipoDocumentoId),
    },
    {
      accessor: 'ultimaSituacionJuridica',
      title: 'Última situación jurídica',
      render: (row) =>
        row.ultimaSituacionJuridica?.situacionLegal?.descripcion ?? '-',
    },
    ...(isLectura
      ? []
      : ([
          {
            accessor: 'acciones',
            title: 'Acciones',
            render: (row: PersonaImplicadaRow) => (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  className="!p-1.5"
                  title="Editar"
                  onClick={() => abrirModal(row)}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  className="!p-1.5"
                  title="Situaciones jurídicas"
                  onClick={() => abrirSituacionesModal(row)}
                >
                  <IconClipboardText className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  className="!p-1.5"
                  title="Eliminar"
                  onClick={() => setPersonaEliminar(row)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ] as Column<PersonaImplicadaRow>[])),
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h6 className="text-sm font-semibold text-dark dark:text-white-light">
            Personas investigadas del caso
          </h6>
          <p className="text-xs text-gray-500">
            Registre, edite o elimine personas implicadas.
          </p>
        </div>
        {!isLectura && (
          <Button
            type="button"
            variant="primary"
            className="gap-2"
            onClick={() => abrirModal()}
          >
            <IconPlus className="h-4 w-4" />
            Registrar persona
          </Button>
        )}
      </div>

      <VristoDataTable<PersonaImplicadaRow>
        title="Personas"
        rows={personasData?.filas ?? []}
        total={personasData?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        columns={columns}
        loading={isLoading}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                {personaEditando ? 'Editar persona' : 'Registrar persona'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Nombres
                  </label>
                  <Input
                    {...register('nombres')}
                    placeholder="Nombres"
                  />
                  {errors.nombres && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.nombres.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Apellido paterno
                  </label>
                  <Input
                    {...register('paterno')}
                    placeholder="Apellido paterno"
                  />
                  {errors.paterno && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.paterno.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Apellido materno
                  </label>
                  <Input
                    {...register('materno')}
                    placeholder="Apellido materno"
                  />
                  {errors.materno && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.materno.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Apellido de casada
                  </label>
                  <Input
                    {...register('esposo')}
                    placeholder="Apellido de casada"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Tipo de documento
                  </label>
                  <Select
                    options={tiposDocumento.map(mapTipoDocumentoToOption)}
                    placeholder="Seleccione tipo"
                    value={tipoDocValue?.value ?? ''}
                    onChange={(e) => {
                      const opt = tiposDocumento
                        .map(mapTipoDocumentoToOption)
                        .find((o) => o.value === e.target.value)
                      setValue('tipoDocumentoId', opt ?? null, {
                        shouldValidate: true,
                      })
                    }}
                  />
                  {errors.tipoDocumentoId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tipoDocumentoId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Número de documento
                  </label>
                  <Input
                    {...register('numeroDocumento')}
                    placeholder="Número de documento"
                  />
                  {errors.numeroDocumento && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.numeroDocumento.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    País
                  </label>
                  <Select
                    options={paises.map(mapPaisToOption)}
                    placeholder="Seleccione país"
                    value={paisValue?.value ?? ''}
                    onChange={(e) => {
                      const opt = paises
                        .map(mapPaisToOption)
                        .find((o) => o.value === e.target.value)
                      setValue('paisId', opt ?? null, { shouldValidate: true })
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Estado civil
                  </label>
                  <Select
                    options={estadosCiviles.map(mapEstadoCivilToOption)}
                    placeholder="Seleccione estado civil"
                    value={estadoCivilValue?.value ?? ''}
                    onChange={(e) => {
                      const opt = estadosCiviles
                        .map(mapEstadoCivilToOption)
                        .find((o) => o.value === e.target.value)
                      setValue('estadoCivilId', opt ?? null, {
                        shouldValidate: true,
                      })
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Profesión
                  </label>
                  <Select
                    options={profesiones.map(mapProfesionToOption)}
                    placeholder="Seleccione profesión"
                    value={profesionValue?.value ?? ''}
                    onChange={(e) => {
                      const opt = profesiones
                        .map(mapProfesionToOption)
                        .find((o) => o.value === e.target.value)
                      setValue('profesionId', opt ?? null, {
                        shouldValidate: true,
                      })
                    }}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {personaEditando ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {personaEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Eliminar persona
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Seguro que desea eliminar a &quot;
                {formatNombreCompleto(personaEliminar)}&quot;?
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
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
            </div>
          </div>
        </div>
      )}

      {situacionesModalOpen && personaSituacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Registrar situación jurídica
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSituacionesModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <p className="mb-4 text-sm text-gray-500">
                Persona: <span className="font-semibold text-dark dark:text-white-light">{formatNombreCompleto(personaSituacion)}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Situación legal
                  </label>
                  <Select
                    options={situacionesLegales.map((s) => ({
                      value: String(s.slId),
                      label: s.descripcion,
                    }))}
                    placeholder="Seleccione situación legal"
                    value={situacionLegalId}
                    onChange={(e) => setSituacionLegalId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={fechaSituacion}
                    onChange={(e) => setFechaSituacion(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                disabled={guardandoSituacion}
                onClick={() => setSituacionesModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                loading={guardandoSituacion}
                disabled={!situacionLegalId || !fechaSituacion}
                onClick={onSubmitSituacion}
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
