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

type BienesSecuestradosRow = {
  id: string
  bien: string
  clase: string
  tipo: string
  cantidad: number
}

type BienesSecuestradosCaracteristica = {
  id: string
  caracteristica: string
  descripcion: string
}

type BienesSecuestradosFormValues = {
  bien: string
  clase: string
  tipo: string
  cantidad: number
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
  bien: z.string().trim().min(1, 'Los nombres son obligatorios'),
  clase: z.string().trim().min(1, 'El apellido paterno es obligatorio'),
  tipo: z.string().trim().min(1, 'El apellido materno es obligatorio'),
  cantidad: z.string().trim().min(1, 'La nacionalidad es obligatoria'),
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

const initialPersonsByCase: Record<string, BienesSecuestradosRow[]> = {
  'CP-001': [
    {
      id: 'BS-001',
      bien: 'Medio de transporte',
      clase: 'Terrestre',
      tipo: 'BUS',
      cantidad: 1,
    },
    {
      id: 'BS-002',
      bien: 'Medio de transporte',
      clase: 'Terrestre',
      tipo: 'CAMIÓN',
      cantidad: 2,
    },
  ],
  'CP-002': [
    {
      id: 'BS-003',
      bien: 'Medio de transporte',
      clase: 'Aéreo',
      tipo: 'AVIÓN',
      cantidad: 1,
    },
  ],
  'CP-003': [
    {
      id: 'BS-004',
      bien: 'Medio de transporte',
      clase: 'Acuático',
      tipo: 'LANCHA',
      cantidad: 3,
    },
    {
      id: 'BS-005',
      bien: 'Maquinaria',
      clase: 'Industrial',
      tipo: 'EXCAVADORA',
      cantidad: 2,
    },
  ],
}

const createDefaultValues = (): BienesSecuestradosFormValues => ({
  bien: '',
  clase: '',
  tipo: '',
  cantidad: 0,
})

export function DataTableBienesSecuestrados() {
  const [selectedCaseId, setSelectedCaseId] = useState('CP-001')
  const [rowsByCase, setRowsByCase] =
    useState<Record<string, BienesSecuestradosRow[]>>(initialPersonsByCase)
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

  const form = useForm<BienesSecuestradosFormValues>({
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

  const personColumns: Column<BienesSecuestradosRow>[] = [
    { accessor: 'id', title: 'ID' },

    { accessor: 'bien', title: 'Bien' },
    { accessor: 'clase', title: 'Catalogo clase' },
    { accessor: 'tipo', title: 'Catalago tipo' },
    { accessor: 'cantidad', title: 'Cantidad' },
  ]

  const closeDialog = () => {
    setIsDialogOpen(false)
    reset(createDefaultValues())
  }

  const onSubmit = (values: BienesSecuestradosFormValues) => {
    if (!selectedCase) return

    const newPerson: BienesSecuestradosRow = {
      id: `BS-${String((selectedPersons.length ?? 0) + 1).padStart(3, '0')}`,
      bien: values.bien,
      clase: values.clase,
      tipo: values.tipo,
      cantidad: values.cantidad,
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
              Bienes secuestrados - casos precedentes
            </p>
            <h3 className="text-lg font-bold text-dark dark:text-white-light">
              Seleccione un caso precedente para administrar bienes secuestrados
              relacionados
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
              Listado de bienes secuestrados relacionados al caso precedente
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
            Agregar bien secuestrado
          </Button>
        </div>

        <VristoDataTable<BienesSecuestradosRow>
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
                  Agregar bien secuestrado
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
                  id="bien"
                  name="bien"
                  control={control}
                  label="Bien"
                />

                <RHFInput
                  id="clase"
                  name="clase"
                  control={control}
                  label="Clase"
                />

                <RHFInput
                  id="tipo"
                  name="tipo"
                  control={control}
                  label="Tipo"
                />

                <RHFInput
                  id="cantidad"
                  name="cantidad"
                  control={control}
                  label="Cantidad"
                  type="number"
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
                  Guardar bien
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
