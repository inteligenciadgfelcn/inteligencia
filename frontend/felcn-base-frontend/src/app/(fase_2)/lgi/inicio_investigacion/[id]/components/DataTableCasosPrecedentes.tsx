'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'

type CasoPrecedenteRow = {
  id: string
  nombreCaso: string
  fechaOperativo: string
  lugarOperativo: string
  unidad: string
  relacionHecho: string
  nroInforme: string
  direccion: string
  antecedentesCaso: string
}

type FormValues = {
  nroInforme: string
  fecha: string
  unidad: string
  grupo: string
  departamento: string
  provincia: string
  municipio: string
  direccion: string
  antecedentesCaso: string
}

const unidadGrupoMap: Record<string, string[]> = {
  'Unidad Departamental La Paz': [
    'Grupo de Investigación',
    'Grupo de Análisis',
  ],
  'Unidad Departamental Cochabamba': ['Grupo de Operaciones', 'Grupo Técnico'],
  'Unidad Departamental Santa Cruz': [
    'Grupo de Inteligencia',
    'Grupo de Campo',
  ],
}

const departamentoProvinciaMunicipioMap: Record<
  string,
  Record<string, string[]>
> = {
  'La Paz': {
    Murillo: ['La Paz', 'El Alto'],
    Inquisivi: ['Inquisivi'],
  },
  Cochabamba: {
    Cercado: ['Cochabamba'],
    Chapare: ['Villa Tunari', 'Chimore'],
  },
  'Santa Cruz': {
    AndresIbanez: ['Santa Cruz de la Sierra'],
    Ichilo: ['Buena Vista', 'Yapacani'],
  },
}

const initialRows: CasoPrecedenteRow[] = [
  {
    id: 'CP-001',
    nombreCaso: 'Red de lavado de activos en zona sur',
    fechaOperativo: '2026-05-08',
    lugarOperativo: 'Zona Sur, La Paz',
    unidad: 'Unidad Departamental La Paz',
    relacionHecho: 'Coincidencia de actores y trazabilidad financiera.',
    nroInforme: 'INF-001/2026',
    direccion: 'Av. Costanera #123',
    antecedentesCaso: 'Seguimiento previo con hallazgos documentales.',
  },
  {
    id: 'CP-002',
    nombreCaso: 'Operativo de interceptación financiera',
    fechaOperativo: '2026-05-20',
    lugarOperativo: 'Cercado, Cochabamba',
    unidad: 'Unidad Departamental Cochabamba',
    relacionHecho: 'Patrón repetido de transferencias trianguladas.',
    nroInforme: 'INF-014/2026',
    direccion: 'Calle Sucre #455',
    antecedentesCaso: 'Documentación bancaria y reporte de UIF.',
  },
]

const initialFormValues: FormValues = {
  nroInforme: '',
  fecha: '',
  unidad: '',
  grupo: '',
  departamento: '',
  provincia: '',
  municipio: '',
  direccion: '',
  antecedentesCaso: '',
}

export function DataTableCasosPrecedentes() {
  const [rows, setRows] = useState<CasoPrecedenteRow[]>(initialRows)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues)

  const unidadOptions = Object.keys(unidadGrupoMap).map((value) => ({
    value,
    label: value,
  }))

  const grupoOptions = (unidadGrupoMap[formValues.unidad] ?? []).map(
    (value) => ({
      value,
      label: value,
    })
  )

  const departamentoOptions = Object.keys(
    departamentoProvinciaMunicipioMap
  ).map((value) => ({
    value,
    label: value,
  }))

  const provinciaOptions = Object.keys(
    departamentoProvinciaMunicipioMap[formValues.departamento] ?? {}
  ).map((value) => ({
    value,
    label: value,
  }))

  const municipioOptions = (
    departamentoProvinciaMunicipioMap[formValues.departamento]?.[
      formValues.provincia
    ] ?? []
  ).map((value) => ({
    value,
    label: value,
  }))

  const pagedRows = useMemo(() => {
    const start = (page - 1) * limit
    return rows.slice(start, start + limit)
  }, [rows, page, limit])

  const columns: Column<CasoPrecedenteRow>[] = [
    { accessor: 'nombreCaso', title: 'Nombre del Caso' },
    { accessor: 'fechaOperativo', title: 'Fecha operativo' },
    { accessor: 'lugarOperativo', title: 'Lugar operativo' },
    { accessor: 'unidad', title: 'Unidad' },
    { accessor: 'relacionHecho', title: 'Relacion del hecho' },
  ]

  const updateFormValue = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ) => {
    setFormValues((current) => ({ ...current, [key]: value }))
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setFormValues(initialFormValues)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !formValues.nroInforme ||
      !formValues.fecha ||
      !formValues.unidad ||
      !formValues.grupo ||
      !formValues.departamento ||
      !formValues.provincia ||
      !formValues.municipio ||
      !formValues.direccion ||
      !formValues.antecedentesCaso
    ) {
      return
    }

    const newRow: CasoPrecedenteRow = {
      id: `CP-${String(rows.length + 1).padStart(3, '0')}`,
      nombreCaso: formValues.nroInforme,
      fechaOperativo: formValues.fecha,
      lugarOperativo: `${formValues.departamento} - ${formValues.provincia} - ${formValues.municipio}`,
      unidad: `${formValues.unidad} / ${formValues.grupo}`,
      relacionHecho: formValues.antecedentesCaso,
      nroInforme: formValues.nroInforme,
      direccion: formValues.direccion,
      antecedentesCaso: formValues.antecedentesCaso,
    }

    setRows((current) => [newRow, ...current])
    setPage(1)
    closeDialog()
  }

  return (
    <>
      <VristoDataTable<CasoPrecedenteRow>
        title="Casos precedentes"
        rows={pagedRows}
        total={rows.length}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        columns={columns}
        extraButtons={
          <Button
            type="button"
            variant="primary"
            className="btn-sm m-1"
            onClick={() => setIsDialogOpen(true)}
          >
            Agregar nuevo caso
          </Button>
        }
      />

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="panel w-full max-w-5xl p-0 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#e0e6ed] px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Agregar nuevo caso precedente
              </h3>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={closeDialog}
              >
                Cerrar
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Nro informe
                  </label>
                  <Input
                    value={formValues.nroInforme}
                    onChange={(e) =>
                      updateFormValue('nroInforme', e.target.value)
                    }
                    placeholder="Ingrese nro de informe"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={formValues.fecha}
                    onChange={(e) => updateFormValue('fecha', e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Unidad
                  </label>
                  <Select
                    options={unidadOptions}
                    placeholder="Seleccione unidad"
                    value={formValues.unidad}
                    onChange={(e) => {
                      updateFormValue('unidad', e.target.value)
                      updateFormValue('grupo', '')
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Grupo
                  </label>
                  <Select
                    options={grupoOptions}
                    placeholder="Seleccione grupo"
                    value={formValues.grupo}
                    disabled={!formValues.unidad}
                    onChange={(e) => updateFormValue('grupo', e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Departamento
                  </label>
                  <Select
                    options={departamentoOptions}
                    placeholder="Seleccione departamento"
                    value={formValues.departamento}
                    onChange={(e) => {
                      updateFormValue('departamento', e.target.value)
                      updateFormValue('provincia', '')
                      updateFormValue('municipio', '')
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Provincia
                  </label>
                  <Select
                    options={provinciaOptions}
                    placeholder="Seleccione provincia"
                    value={formValues.provincia}
                    disabled={!formValues.departamento}
                    onChange={(e) => {
                      updateFormValue('provincia', e.target.value)
                      updateFormValue('municipio', '')
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Municipio
                  </label>
                  <Select
                    options={municipioOptions}
                    placeholder="Seleccione municipio"
                    value={formValues.municipio}
                    disabled={!formValues.provincia}
                    onChange={(e) =>
                      updateFormValue('municipio', e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Direccion
                  </label>
                  <Input
                    value={formValues.direccion}
                    onChange={(e) =>
                      updateFormValue('direccion', e.target.value)
                    }
                    placeholder="Ingrese direccion"
                  />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Antecedentes del caso
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={formValues.antecedentesCaso}
                    onChange={(e) =>
                      updateFormValue('antecedentesCaso', e.target.value)
                    }
                    placeholder="Ingrese antecedentes del caso"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={closeDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Guardar caso
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
