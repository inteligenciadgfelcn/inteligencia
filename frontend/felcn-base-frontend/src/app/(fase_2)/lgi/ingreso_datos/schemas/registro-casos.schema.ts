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

export const registroCasosSchema = z
  .object({
    regional: optionSchema.nullable(),
    grupo: optionSchema.nullable(),
    asignadoAlCaso: z
      .array(z.string().min(1))
      .min(1, 'Seleccione al menos un funcionario'),
    departamento: optionSchema.nullable(),
    nombreCaso: requiredText('El nombre del caso es obligatorio'),
    tipoCaso: optionSchema.nullable(),
    nroAsignadoFelcn: requiredText(
      'El número asignado por la FELCN es obligatorio'
    ),
    cudFiscalia: requiredText(
      'El CUD o número asignado por fiscalía es obligatorio'
    ),
    tipoDelito: optionSchema.nullable(),
    nroCasoInvFinancieraParalela: requiredText(
      'El número de caso de investigación financiera paralela es obligatorio'
    ),
    cudDelitoPrecedente: requiredText(
      'El CUD del delito precedente es obligatorio'
    ),
    casoPorPerdidaDominio: z.enum(['si', 'no'], {
      required_error: 'Seleccione una opción',
    }),
    nroCasoPerdidaDominio: z.string().trim().optional().or(z.literal('')),
    memorandumNro: requiredText('El memorándum nro es obligatorio'),
    fechaAsignacionCaso: dateSchema('La fecha de asignación es obligatoria'),
    inicioCasoLgi: optionSchema.nullable(),
    remitidoGiaefFecha: dateSchema('La fecha de remisión es obligatoria'),
    gestion: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'La gestión debe tener 4 dígitos'),
  })
  .superRefine((values, context) => {
    if (
      values.casoPorPerdidaDominio === 'si' &&
      !values.nroCasoPerdidaDominio?.trim()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número de caso por pérdida de dominio es obligatorio',
        path: ['nroCasoPerdidaDominio'],
      })
    }

    if (values.regional === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La regional es obligatoria',
        path: ['regional'],
      })
    }

    if (values.grupo === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El grupo es obligatorio',
        path: ['grupo'],
      })
    }

    if (values.departamento === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El departamento es obligatorio',
        path: ['departamento'],
      })
    }

    if (values.tipoCaso === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El tipo de caso es obligatorio',
        path: ['tipoCaso'],
      })
    }

    if (values.tipoDelito === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El tipo de delito es obligatorio',
        path: ['tipoDelito'],
      })
    }

    if (values.inicioCasoLgi === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El inicio de caso por LGI es obligatorio',
        path: ['inicioCasoLgi'],
      })
    }
  })

export type RegistroCasosFormSchemaValues = z.infer<typeof registroCasosSchema>
