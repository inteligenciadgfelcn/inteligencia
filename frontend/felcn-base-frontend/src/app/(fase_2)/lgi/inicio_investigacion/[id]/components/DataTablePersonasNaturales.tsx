'use client'

import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { RHFInput } from '@/components/form/RHFInput'
import { RHFSelect } from '@/components/form/RHFSelect'

type OptionValue = {
  label: string
  value: string
  original: string
}

type CasoPrecedenteRow = {
  id: string
  nombreCaso: string
  fechaOperativo: string
  lugarOperativo: string
  unidad: string
  relacionHecho: string
}

type PersonaNaturalRow = {
  id: string
  estado: 'Registrado' | 'Observado' | 'Validado'
  personaEs: string
  nombresApellidos: string
  nacionalidad: string
  estadoCivil: string
  profesion: string
  tipoDocumento: string
  nroDocumento: string
  relacion: string
}

type PersonaNaturalFormValues = {
  personaEs: OptionValue | null
  nombres: string
  paterno: string
  materno: string
  nacionalidad: string
  estadoCivil: OptionValue | null
  profesion: string
  tipoDocumento: OptionValue | null
  nroDocumento: string
  relacion: string
  otraInformacion: string
}

const selectSchema = (message: string) =>
  z.preprocess(
    (value) => (value === null ? undefined : value),
    z.object({
      label: z.string().trim().min(1, message),
      value: z.string().trim().min(1, message),
      original: z.string().trim().min(1, message),
    })
  )

const formSchema = z.object({
  personaEs: selectSchema('Seleccione cómo es la persona'),
  nombres: z.string().trim().min(1, 'Los nombres son obligatorios'),
  paterno: z.string().trim().min(1, 'El apellido paterno es obligatorio'),
  materno: z.string().trim().min(1, 'El apellido materno es obligatorio'),
  nacionalidad: z.string().trim().min(1, 'La nacionalidad es obligatoria'),
  estadoCivil: selectSchema('Seleccione el estado civil'),
  profesion: z.string().trim().min(1, 'La profesión es obligatoria'),
  tipoDocumento: selectSchema('Seleccione el tipo de documento'),
  nroDocumento: z
    .string()
    .trim()
    .min(1, 'El número de documento es obligatorio'),
  relacion: z.string().trim().min(1, 'La relación es obligatoria'),
  otraInformacion: z
    .string()
    .trim()
    .min(1, 'La otra información es obligatoria'),
})

const mockCasosPrecedentes: CasoPrecedenteRow[] = [
  {
    id: 'CP-001',
    nombreCaso: 'Red de lavado de activos en zona sur',
    fechaOperativo: '2026-05-08',
    lugarOperativo: 'Zona Sur, La Paz',
    unidad: 'Unidad Departamental La Paz',
    relacionHecho: 'Coincidencia de actores y trazabilidad financiera.',
  },
  {
    id: 'CP-002',
    nombreCaso: 'Operativo de interceptación financiera',
    fechaOperativo: '2026-05-20',
    lugarOperativo: 'Cercado, Cochabamba',
    unidad: 'Unidad Departamental Cochabamba',
    relacionHecho: 'Patrón repetido de transferencias trianguladas.',
  },
  {
    id: 'CP-003',
    nombreCaso: 'Seguimiento a activos vinculados a organización criminal',
    fechaOperativo: '2026-05-28',
    lugarOperativo: 'Santa Cruz de la Sierra',
    unidad: 'Unidad Departamental Santa Cruz',
    relacionHecho: 'Coincidencia documental y de domicilios declarados.',
  },
]

const personaEsOptions = [
  { value: 'Titular', label: 'Titular', original: 'Titular' },
  { value: 'Vinculado', label: 'Vinculado', original: 'Vinculado' },
  { value: 'Testigo', label: 'Testigo', original: 'Testigo' },
  { value: 'Afectado', label: 'Afectado', original: 'Afectado' },
]

const estadoCivilOptions = [
  { value: 'Soltero', label: 'Soltero', original: 'Soltero' },
  { value: 'Casado', label: 'Casado', original: 'Casado' },
  { value: 'Divorciado', label: 'Divorciado', original: 'Divorciado' },
  { value: 'Viudo', label: 'Viudo', original: 'Viudo' },
]

const tipoDocumentoOptions = [
  { value: 'CI', label: 'CI', original: 'CI' },
  { value: 'Pasaporte', label: 'Pasaporte', original: 'Pasaporte' },
  { value: 'CE', label: 'CE', original: 'CE' },
]

const initialPersonsByCase: Record<string, PersonaNaturalRow[]> = {
  'CP-001': [
    {
      id: 'PN-001',
      estado: 'Registrado',
      personaEs: 'Titular',
      nombresApellidos: 'Juan Carlos Pérez Rojas',
      nacionalidad: 'Boliviana',
      estadoCivil: 'Casado',
      profesion: 'Contador',
      tipoDocumento: 'CI',
      nroDocumento: '5487123',
      relacion: 'Titular del caso',
    },
  ],
  'CP-002': [
    {
      id: 'PN-010',
      estado: 'Observado',
      personaEs: 'Vinculado',
      nombresApellidos: 'María Fernanda López Arias',
      nacionalidad: 'Boliviana',
      estadoCivil: 'Soltero',
      profesion: 'Administradora',
      tipoDocumento: 'CI',
      nroDocumento: '7788991',
      relacion: 'Socia comercial',
    },
  ],
  'CP-003': [],
}

const caseSelectOptions = mockCasosPrecedentes.map((item) => ({
  value: item.id,
  label: `${item.id} - ${item.nombreCaso}`,
}))

const createDefaultValues = (): PersonaNaturalFormValues => ({
  personaEs: null,
  nombres: '',
  paterno: '',
  materno: '',
  nacionalidad: '',
  estadoCivil: null,
  profesion: '',
  tipoDocumento: null,
  nroDocumento: '',
  relacion: '',
  otraInformacion: '',
})

const estadoBadgeClass: Record<PersonaNaturalRow['estado'], string> = {
  Registrado: 'badge-outline-success',
  Observado: 'badge-outline-warning',
  Validado: 'badge-outline-primary',
}

export function DataTablePersonasNaturales() {
  const [selectedCaseId, setSelectedCaseId] = useState('CP-001')
  const [rowsByCase, setRowsByCase] =
    useState<Record<string, PersonaNaturalRow[]>>(initialPersonsByCase)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const selectedCase = useMemo(
    () => mockCasosPrecedentes.find((item) => item.id === selectedCaseId),
    [selectedCaseId]
  )

  const selectedPersons = rowsByCase[selectedCaseId] ?? []
  const pagedCases = useMemo(() => mockCasosPrecedentes, [])
  const pagedPersons = useMemo(() => {
    const start = (page - 1) * limit
    return selectedPersons.slice(start, start + limit)
  }, [selectedPersons, page, limit])

  const form = useForm<PersonaNaturalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  const caseColumns: Column<CasoPrecedenteRow>[] = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'nombreCaso', title: 'Caso precedente' },
    {
      accessor: 'fechaOperativo',
      title: 'Fecha operativo',
      render: (row) => dayjs(row.fechaOperativo).format('DD/MM/YYYY'),
    },
    { accessor: 'lugarOperativo', title: 'Lugar operativo' },
    { accessor: 'unidad', title: 'Unidad' },
    { accessor: 'relacionHecho', title: 'Relacion del hecho' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <Button
          type="button"
          variant={row.id === selectedCaseId ? 'primary' : 'outline-primary'}
          className="btn-sm"
          onClick={() => {
            setSelectedCaseId(row.id)
            setPage(1)
          }}
        >
          {row.id === selectedCaseId ? 'Seleccionado' : 'Seleccionar'}
        </Button>
      ),
    },
  ]

  const personColumns: Column<PersonaNaturalRow>[] = [
    { accessor: 'id', title: 'ID' },
    {
      accessor: 'estado',
      title: 'Estado',
      render: (row) => (
        <span className={`badge ${estadoBadgeClass[row.estado]}`}>
          {row.estado}
        </span>
      ),
    },
    {
      accessor: 'nombresApellidos',
      title: 'Nombre y apellidos',
      render: (row) => (
        <span className="font-medium">{row.nombresApellidos}</span>
      ),
    },
    { accessor: 'nacionalidad', title: 'Nacionalidad' },
    { accessor: 'estadoCivil', title: 'Estado civil' },
    { accessor: 'profesion', title: 'Profesion' },
    { accessor: 'tipoDocumento', title: 'Tipo de documento' },
    { accessor: 'nroDocumento', title: 'Nro documento' },
    { accessor: 'relacion', title: 'Relacion' },
  ]

  const closeDialog = () => {
    setIsDialogOpen(false)
    reset(createDefaultValues())
  }

  const onSubmit = (values: PersonaNaturalFormValues) => {
    if (!selectedCase) return

    const newPerson: PersonaNaturalRow = {
      id: `PN-${String((selectedPersons.length ?? 0) + 1).padStart(3, '0')}`,
      estado: 'Registrado',
      personaEs: values.personaEs?.value ?? '',
      nombresApellidos: `${values.nombres} ${values.paterno} ${values.materno}`
        .replace(/\s+/g, ' ')
        .trim(),
      nacionalidad: values.nacionalidad,
      estadoCivil: values.estadoCivil?.value ?? '',
      profesion: values.profesion,
      tipoDocumento: values.tipoDocumento?.value ?? '',
      nroDocumento: values.nroDocumento,
      relacion: values.relacion,
    }

    setRowsByCase((current) => ({
      ...current,
      [selectedCase.id]: [newPerson, ...(current[selectedCase.id] ?? [])],
    }))
    closeDialog()
  }

  return (
    <div className="space-y-5">
      <div className="panel p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Personas Naturales
            </p>
            <h3 className="text-lg font-bold text-dark dark:text-white-light">
              Seleccione un caso precedente para administrar personas
            </h3>
          </div>
        </div>
      </div>

      <VristoDataTable<CasoPrecedenteRow>
        rows={pagedCases}
        total={mockCasosPrecedentes.length}
        page={1}
        limit={10}
        onPageChange={() => undefined}
        onLimitChange={() => undefined}
        columns={caseColumns}
        rowClassName={(row) =>
          row.id === selectedCaseId ? 'bg-primary/5 dark:bg-primary/10' : ''
        }
      />

      <div className="pt-5">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h4 className="text-lg font-bold text-dark dark:text-white-light">
              Listado de personas naturales
            </h4>
            <p className="text-sm text-gray-500">
              {selectedCase
                ? `${selectedCase.id} - ${selectedCase.nombreCaso}`
                : 'Seleccione un caso precedente'}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="btn-sm"
            onClick={() => setIsDialogOpen(true)}
            disabled={!selectedCase}
          >
            Agregar persona
          </Button>
        </div>

        <VristoDataTable<PersonaNaturalRow>
          rows={pagedPersons}
          total={selectedPersons.length}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={personColumns}
          loading={!selectedCase}
        />
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="panel w-full max-w-5xl p-0 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#e0e6ed] px-5 py-4 dark:border-[#1b2e4b]">
              <div>
                <h3 className="text-lg font-bold text-dark dark:text-white-light">
                  Agregar persona natural
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedCase?.nombreCaso ?? 'Sin caso seleccionado'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={closeDialog}
              >
                Cerrar
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <RHFSelect
                  id="personaEs"
                  name="personaEs"
                  label="La persona es"
                  control={control}
                  originalData={personaEsOptions}
                  mapOption={(item) => {
                    return {
                      value: item.value,
                      label: item.label,
                      original: item,
                    }
                  }}
                />

                <RHFInput
                  id="nombres"
                  name="nombres"
                  control={control}
                  label="Nombres"
                />

                <RHFInput
                  id="paterno"
                  name="paterno"
                  control={control}
                  label="Paterno"
                />

                <RHFInput
                  id="materno"
                  name="materno"
                  control={control}
                  label="Materno"
                />

                <RHFInput
                  id="nacionalidad"
                  name="nacionalidad"
                  control={control}
                  label="Nacionalidad"
                />

                <RHFSelect
                  id="estadoCivil"
                  name="estadoCivil"
                  label="Estado Civil"
                  control={control}
                  originalData={estadoCivilOptions}
                  mapOption={(option) => ({
                    value: option.value,
                    label: option.label,
                    original: option,
                  })}
                />

                <RHFInput
                  id="profesion"
                  name="profesion"
                  control={control}
                  label="Profesion"
                />

                <RHFSelect
                  id="tipoDocumento"
                  name="tipoDocumento"
                  label="Tipo de Documento"
                  control={control}
                  originalData={tipoDocumentoOptions}
                  mapOption={(item) => {
                    return {
                      value: item.value,
                      label: item.label,
                      original: item,
                    }
                  }}
                />

                <RHFInput
                  id="nroDocumento"
                  name="nroDocumento"
                  control={control}
                  label="Nro de Documento"
                />

                <RHFInput
                  id="relacion"
                  name="relacion"
                  control={control}
                  label="Relacion"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Otra informacion
                </label>
                <Controller
                  name="otraInformacion"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <textarea
                        {...field}
                        rows={4}
                        className={`form-textarea w-full ${error ? '!border-danger' : ''}`}
                        placeholder="Ingrese otra información"
                      />
                      {!!error && (
                        <p className="mt-1 text-xs text-danger">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={closeDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Guardar persona
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
