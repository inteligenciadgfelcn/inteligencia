import * as z from 'zod'

import { validarFechaFormato } from '@/utils/fechas'

const requiredText = (message: string) => z.string().trim().min(1, message)

const optionValue = (message: string) =>
  z.preprocess(
    (value) => (value === null ? undefined : value),
    z.object(
      {
        value: z.string().trim().min(1, message),
        label: z.string(),
        original: z.unknown().optional(),
      },
      {
        required_error: message,
        invalid_type_error: message,
      }
    )
  )

const dateSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => validarFechaFormato(value, 'YYYY-MM-DD'), {
      message: 'La fecha no es válida',
    })

const phoneSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .regex(/^[0-9]+$/, 'Solo se permiten números')

export const agregarPersonalSchema = z.object({
  nroPaseCredencial: requiredText('El Nro Pase Credencial es obligatorio'),
  grado: optionValue('Seleccione un grado'),
  apellidoPaterno: requiredText('El apellido paterno es obligatorio'),
  apellidoMaterno: requiredText('El apellido materno es obligatorio'),
  nombres: requiredText('Los nombres son obligatorios'),
  fechaNacimiento: dateSchema('La fecha de nacimiento es obligatoria'),
  correoElectronico: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
  nroTelefonoCelular: phoneSchema(
    'El número de teléfono celular es obligatorio'
  ),
  nroTelefonoOficina: phoneSchema(
    'El número de teléfono oficina es obligatorio'
  ),
  unidad: optionValue('Seleccione una unidad'),
  distrital: optionValue('Seleccione una distrital'),
  grupo: optionValue('Seleccione un grupo'),
  rol: optionValue('Seleccione un rol'),
  habilitadoIngreso: z.string().trim().min(1, 'Seleccione una opción'),
  mostrarListaInvestigadores: z.string().trim().min(1, 'Seleccione una opción'),
})

export type AgregarPersonalFormSchemaValues = z.infer<
  typeof agregarPersonalSchema
>
