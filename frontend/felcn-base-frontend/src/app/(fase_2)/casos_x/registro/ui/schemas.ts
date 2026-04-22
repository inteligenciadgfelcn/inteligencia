import * as z from 'zod'

const selectSchema = (message: string) =>
  z.preprocess(
    (value) => (value === null ? undefined : value),
    z.object(
      {
        value: z.number(),
        label: z.string(),
        original: z.any(),
      },
      { required_error: message }
    )
  )

export const operativoSchema = z.object({
  codigoRadiograma: z.string().min(1, 'Codigo radiograma obligatorio'),
  fechaHoraOperativo: z.string().min(1, 'Fecha hora del operativo obligatoria'),
  departamento: selectSchema('Departamento obligatorio'),
  provincia: selectSchema('Provincia obligatoria'),
  municipio: selectSchema('Municipio obligatorio'),
  localidadODireccion: z.string().min(1, 'Localidad o Direccion obligatoria'),
  operativoRealizadoEn: z.string().min(1, 'Operativo realizado en obligatorio'),
  unidadOperativa: z.string().min(1, 'Unidad operativa obligatoria'),
  alMandoDe: z.string().min(1, 'Al mando de obligatorio'),
  resumen: z.string().min(1, 'Resumen obligatorio'),
})

export const personaSchema = z.object({
  nombres: z.string().min(1, 'Nombre(s) obligatorio'),
  paterno: z.string().min(1, 'Paterno obligatorio'),
  materno: z.string().min(1, 'Materno obligatorio'),
  apEsposo: z.string().optional(),
  pais: selectSchema('Pais obligatorio'),
  sexo: selectSchema('Sexo obligatorio'),
  direccion: z.string().min(1, 'Direccion obligatoria'),
  tipoDocumento: selectSchema('Tipo de documento obligatorio'),
  numeroDocumento: z.string().min(1, 'Numero obligatorio'),
  estado: selectSchema('Estado obligatorio'),
})

export type OperativoFormValues = z.infer<typeof operativoSchema>
export type PersonaFormValues = z.infer<typeof personaSchema>
