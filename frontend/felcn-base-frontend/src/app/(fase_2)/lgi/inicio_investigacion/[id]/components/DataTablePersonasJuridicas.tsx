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

type PersonaJuridicaRow = {
  id: string
  nombre: string
  nit: string
  matriculaComercio: string
  representanteLegal: string
  otraInformacion: string
}

type PersonaJuridicaFormValues = {
  id: string
  nombre: string
  nit: string
  matriculaComercio: string
  representanteLegal: string
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

const initialPersonsByCase: Record<string, PersonaJuridicaRow[]> = {
  'CP-001': [
    {
      id: '001',
      nombre: 'Juan Carlos Pérez Rojas',
      nit: '10047362',
      matriculaComercio: '123456',
      representanteLegal: 'Juan Carlos Pérez Rojas',
      otraInformacion: 'Ninguna',
    },
    {
      id: '005',
      nombre: 'Ana Sofía Rodríguez Quiroga',
      nit: '10047365',
      matriculaComercio: '123459',
      representanteLegal: 'Ana Sofía Rodríguez Quiroga',
      otraInformacion: 'Importación y exportación',
    },
    {
      id: '006',
      nombre: 'Luis Fernando Gutiérrez Salazar',
      nit: '10047366',
      matriculaComercio: '123460',
      representanteLegal: 'Luis Fernando Gutiérrez Salazar',
      otraInformacion: 'Registro actualizado en 2025',
    },
  ],
  'CP-002': [
    {
      id: '002',
      nombre: 'Juan Carlos Pérez Rojas',
      nit: '10047362',
      matriculaComercio: '123456',
      representanteLegal: 'Juan Carlos Pérez Rojas',
      otraInformacion: 'Ninguna',
    },
    {
      id: '007',
      nombre: 'Patricia Elena Morales Sánchez',
      nit: '10047367',
      matriculaComercio: '123461',
      representanteLegal: 'Patricia Elena Morales Sánchez',
      otraInformacion: 'Sin observaciones',
    },
  ],
  'CP-003': [
    {
      id: '003',
      nombre: 'María Fernanda López Vargas',
      nit: '10047363',
      matriculaComercio: '123457',
      representanteLegal: 'María Fernanda López Vargas',
      otraInformacion: 'Empresa de servicios tecnológicos',
    },
    {
      id: '004',
      nombre: 'Carlos Alberto Mendoza Flores',
      nit: '10047364',
      matriculaComercio: '123458',
      representanteLegal: 'Carlos Alberto Mendoza Flores',
      otraInformacion: 'Sucursal en Santa Cruz',
    },
  ],
}

const caseSelectOptions = mockCasosPrecedentes.map((item) => ({
  value: item.id,
  label: `${item.id} - ${item.nombreCaso}`,
}))

const createDefaultValues = (): PersonaJuridicaFormValues => ({
  id: '',
  nombre: '',
  nit: '',
  matriculaComercio: '',
  representanteLegal: '',
  otraInformacion: '',
})

export function DataTablePersonasJuridicas() {
  const [selectedCaseId, setSelectedCaseId] = useState('CP-001')
  const [rowsByCase, setRowsByCase] =
    useState<Record<string, PersonaJuridicaRow[]>>(initialPersonsByCase)
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

  const form = useForm<PersonaJuridicaFormValues>({
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

  const personColumns: Column<PersonaJuridicaRow>[] = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'nombreCaso', title: 'Caso precedente' },
    {
      accessor: 'nit',
      title: 'Numero de identificacion tributaria (NIT)',
    },
    { accessor: 'matriculaComercio', title: 'Matricula Comercio' },
    { accessor: 'representanteLegal', title: 'Representante Legal' },
    { accessor: 'otraInformacion', title: 'Otra Informacion' },
  ]

  const closeDialog = () => {
    setIsDialogOpen(false)
    reset(createDefaultValues())
  }

  const onSubmit = (values: PersonaJuridicaFormValues) => {
    if (!selectedCase) return

    const newPerson: PersonaJuridicaRow = {
      id: `PJ-${String((selectedPersons.length ?? 0) + 1).padStart(3, '0')}`,
      nombre: values.nombre,
      nit: values.nit,
      matriculaComercio: values.matriculaComercio,
      representanteLegal: values.representanteLegal,
      otraInformacion: values.otraInformacion,
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
              Personas Juridicas
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
              Listado de personas juridicas vinculadas al caso precedente
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
            Agregar persona juridica
          </Button>
        </div>

        <VristoDataTable<PersonaJuridicaRow>
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
                <RHFInput
                  id="nombreCaso"
                  name="nombre"
                  control={control}
                  label="Nombre caso"
                />

                <RHFInput
                  id="nit"
                  name="nit"
                  control={control}
                  label="Numero de identificacion tributaria (NIT)"
                />

                <RHFInput
                  id="matriculaComercio"
                  name="matriculaComercio"
                  control={control}
                  label="Matricula de comercio"
                />

                <RHFInput
                  id="representanteLegal"
                  name="representanteLegal"
                  control={control}
                  label="Representante legal"
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
