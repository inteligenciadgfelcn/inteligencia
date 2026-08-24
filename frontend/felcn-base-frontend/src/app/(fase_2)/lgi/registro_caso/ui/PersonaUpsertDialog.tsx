'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { RHFSelect } from '@/components/form/RHFSelect'

import type {
  EstadoCivilLgi,
  PaisLgi,
  ProfesionLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas.types'
import {
  formatNombreCompleto,
  mapEstadoCivilToOption,
  mapPaisToOption,
  mapProfesionToOption,
  mapTipoDocumentoToOption,
  buildPersonaPayload,
} from '../mappers/registro-caso.mappers'
import {
  personaImplicadaSchema,
  type PersonaImplicadaSchemaValues,
} from '../schemas/registro-caso.schema'
import type {
  CatalogOption,
  PersonaImplicadaPayload,
  PersonaImplicadaRow,
} from '../types/registro-caso.types'
import { createDefaultPersonaValues } from '../utils/registro-caso.utils'

interface PersonaUpsertDialogProps {
  open: boolean
  persona: PersonaImplicadaRow | null
  casoId: number
  tiposDocumento: TipoDocumentoLgi[]
  paises: PaisLgi[]
  estadosCiviles: EstadoCivilLgi[]
  profesiones: ProfesionLgi[]
  onClose: () => void
  onGuardar: (payload: PersonaImplicadaPayload) => Promise<void>
}

const catalogoOption = (
  catalogo: TipoDocumentoLgi[],
  id?: number
): CatalogOption<TipoDocumentoLgi> | null => {
  const item = catalogo.find((c) => String(c.td_id) === String(id))
  return item ? mapTipoDocumentoToOption(item) : null
}

const paisOption = (
  catalogo: PaisLgi[],
  id?: number
): CatalogOption<PaisLgi> | null => {
  const item = catalogo.find((c) => String(c.pa_id) === String(id))
  return item ? mapPaisToOption(item) : null
}

const estadoCivilOption = (
  catalogo: EstadoCivilLgi[],
  id?: number
): CatalogOption<EstadoCivilLgi> | null => {
  const item = catalogo.find((c) => String(c.ec_id) === String(id))
  return item ? mapEstadoCivilToOption(item) : null
}

const profesionOption = (
  catalogo: ProfesionLgi[],
  id?: number
): CatalogOption<ProfesionLgi> | null => {
  const item = catalogo.find((c) => String(c.prof_id) === String(id))
  return item ? mapProfesionToOption(item) : null
}

export function PersonaUpsertDialog({
  open,
  persona,
  casoId,
  tiposDocumento,
  paises,
  estadosCiviles,
  profesiones,
  onClose,
  onGuardar,
}: PersonaUpsertDialogProps) {
  const [guardando, setGuardando] = useState(false)

  const form = useForm<PersonaImplicadaSchemaValues>({
    resolver: zodResolver(personaImplicadaSchema),
    defaultValues: createDefaultPersonaValues(),
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      persona
          ? {
              nombres: persona.nombres,
              paterno: persona.paterno,
              materno: persona.materno,
              esposo: persona.esposo,
              paisId: paisOption(paises, persona.paisId),
              estadoCivilId: estadoCivilOption(
                estadosCiviles,
                persona.estadoCivilId
              ),
              profesionId: profesionOption(
                profesiones,
                persona.profesionId
              ),
              tipoDocumentoId: catalogoOption(
                tiposDocumento,
                persona.tipoDocumentoId
              ),
              numeroDocumento: persona.numeroDocumento,
            }
          : createDefaultPersonaValues()
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, persona, tiposDocumento, paises, estadosCiviles, profesiones])

  const onSubmit = async (values: PersonaImplicadaSchemaValues) => {
    setGuardando(true)
    try {
      await onGuardar(buildPersonaPayload(casoId, values))
    } finally {
      setGuardando(false)
    }
  }

  const { errors } = form.formState

  return (
    <CustomDialog
      isOpen={open}
      handleClose={onClose}
      title={
        persona
          ? `Editar persona: ${formatNombreCompleto(persona)}`
          : 'Registrar persona investigada'
      }
      maxWidth="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Nombres
            </label>
            <Input
              {...form.register('nombres')}
              error={!!errors.nombres}
              className="w-full"
              placeholder="Nombres"
            />
            {errors.nombres && (
              <p className="mt-1 text-xs text-danger">
                {errors.nombres.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Paterno
            </label>
            <Input
              {...form.register('paterno')}
              error={!!errors.paterno}
              className="w-full"
              placeholder="Apellido paterno"
            />
            {errors.paterno && (
              <p className="mt-1 text-xs text-danger">
                {errors.paterno.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Materno
            </label>
            <Input
              {...form.register('materno')}
              error={!!errors.materno}
              className="w-full"
              placeholder="Apellido materno"
            />
            {errors.materno && (
              <p className="mt-1 text-xs text-danger">
                {errors.materno.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Ape. esposo (opcional)
            </label>
            <Input
              {...form.register('esposo')}
              error={!!errors.esposo}
              className="w-full"
              placeholder="Apellido de casada"
            />
            {errors.esposo && (
              <p className="mt-1 text-xs text-danger">
                {errors.esposo.message}
              </p>
            )}
          </div>

          <RHFSelect<PaisLgi>
            id="paisId"
            name="paisId"
            control={form.control}
            label="País"
            error={errors.paisId?.message as string | undefined}
            originalData={paises}
            mapOption={mapPaisToOption}
          />

          <RHFSelect<EstadoCivilLgi>
            id="estadoCivilId"
            name="estadoCivilId"
            control={form.control}
            label="Estado civil"
            error={errors.estadoCivilId?.message as string | undefined}
            originalData={estadosCiviles}
            mapOption={mapEstadoCivilToOption}
          />

          <RHFSelect<ProfesionLgi>
            id="profesionId"
            name="profesionId"
            control={form.control}
            label="Profesión"
            error={errors.profesionId?.message as string | undefined}
            originalData={profesiones}
            mapOption={mapProfesionToOption}
          />

          <RHFSelect<TipoDocumentoLgi>
            id="tipoDocumentoId"
            name="tipoDocumentoId"
            control={form.control}
            label="Tipo de documento"
            error={errors.tipoDocumentoId?.message as string | undefined}
            originalData={tiposDocumento}
            mapOption={mapTipoDocumentoToOption}
          />

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Nro de documento
            </label>
            <Input
              {...form.register('numeroDocumento')}
              error={!!errors.numeroDocumento}
              className="w-full"
              placeholder="Número de documento"
            />
            {errors.numeroDocumento && (
              <p className="mt-1 text-xs text-danger">
                {errors.numeroDocumento.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            variant="outline-secondary"
            disabled={guardando}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={guardando}>
            {persona ? 'Actualizar persona' : 'Registrar persona'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}
