import * as z from 'zod'

import { validarFechaFormato } from '@/utils/fechas'

const optionSchema = z.object({
  value: z.string().min(1, 'Seleccione una opción'),
  label: z.string().min(1),
  original: z.unknown(),
})

const requiredText = (message: string) => z.string().trim().min(1, message)

const dateSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => validarFechaFormato(value, 'YYYY-MM-DD'), {
      message: 'La fecha no es válida',
    })

export const datosGeneralesSchema = z
  .object({
    disId: optionSchema.nullable(),
    idGrupo: optionSchema.nullable(),
    departamento: optionSchema.nullable(),
    nombreCaso: requiredText('El nombre del caso es obligatorio').max(
      30,
      'Máximo 30 caracteres'
    ),
    nroCaso: requiredText('El número de caso es obligatorio').max(
      20,
      'Máximo 20 caracteres'
    ),
    cudIfp: requiredText('El CUD o número de fiscalía es obligatorio').max(
      20,
      'Máximo 20 caracteres'
    ),
    remiteFiscal: requiredText('El fiscal que remite es obligatorio').max(
      70,
      'Máximo 70 caracteres'
    ),
    conformeA: requiredText('El conforme a es obligatorio').max(
      70,
      'Máximo 70 caracteres'
    ),
    controlJurisdiccional: requiredText(
      'El control jurisdiccional es obligatorio'
    ).max(70, 'Máximo 70 caracteres'),
  })
  .superRefine((values, context) => {
    if (!values.disId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La distrital es obligatoria',
        path: ['disId'],
      })
    }

    if (!values.idGrupo) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El grupo es obligatorio',
        path: ['idGrupo'],
      })
    }

    if (!values.departamento) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El departamento es obligatorio',
        path: ['departamento'],
      })
    }
  })

export const personaImplicadaSchema = z
  .object({
    nombres: requiredText('Los nombres son obligatorios').max(
      50,
      'Máximo 50 caracteres'
    ),
    paterno: requiredText('El apellido paterno es obligatorio').max(
      50,
      'Máximo 50 caracteres'
    ),
    materno: requiredText('El apellido materno es obligatorio').max(
      50,
      'Máximo 50 caracteres'
    ),
    esposo: z.string().trim().max(50, 'Máximo 50 caracteres').optional(),
    paisId: optionSchema.nullable(),
    estadoCivilId: optionSchema.nullable(),
    profesionId: optionSchema.nullable(),
    tipoDocumentoId: optionSchema.nullable(),
    numeroDocumento: requiredText('El número de documento es obligatorio').max(
      50,
      'Máximo 50 caracteres'
    ),
  })
  .superRefine((values, context) => {
    if (!values.tipoDocumentoId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El tipo de documento es obligatorio',
        path: ['tipoDocumentoId'],
      })
    }
  })

export const situacionJuridicaSchema = z
  .object({
    situacionLegalId: optionSchema.nullable(),
    fecha: dateSchema('La fecha de la situación jurídica es obligatoria'),
  })
  .superRefine((values, context) => {
    if (!values.situacionLegalId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La situación legal es obligatoria',
        path: ['situacionLegalId'],
      })
    }
  })

export const informacionCasoSchema = z
  .object({
    formaInicio: optionSchema.nullable(),
    nroCasoFelcn: requiredText('El número de caso FELCN es obligatorio').max(
      50,
      'Máximo 50 caracteres'
    ),
  })
  .superRefine((values, context) => {
    if (!values.formaInicio) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La forma de inicio es obligatoria',
        path: ['formaInicio'],
      })
    }
  })

export type DatosGeneralesSchemaValues = z.infer<typeof datosGeneralesSchema>
export type PersonaImplicadaSchemaValues = z.infer<
  typeof personaImplicadaSchema
>
export type SituacionJuridicaSchemaValues = z.infer<
  typeof situacionJuridicaSchema
>
export type InformacionCasoSchemaValues = z.infer<
  typeof informacionCasoSchema
>
