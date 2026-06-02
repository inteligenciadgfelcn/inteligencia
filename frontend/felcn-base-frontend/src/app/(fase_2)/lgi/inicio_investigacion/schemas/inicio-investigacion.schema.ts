import { z } from 'zod'

export const inicioInvestigacionFiltersSchema = z.object({
  regionales: z.array(z.string()).default([]),
  estadosCaso: z.array(z.string()).default([]),
  nombreCaso: z.string().trim().optional().default(''),
  nroCasoGiaef: z.string().trim().optional().default(''),
  nroCasoFelcn: z.string().trim().optional().default(''),
  nroCasoFiscalia: z.string().trim().optional().default(''),
  nroPerdidaDominio: z.string().trim().optional().default(''),
  fechaRemision: z.string().trim().optional().default(''),
  busquedaCriterio: z
    .enum(['investigador', 'departamento'])
    .default('investigador'),
  busquedaValor: z.string().trim().optional().default(''),
})

export type InicioInvestigacionFiltersSchemaValues = z.infer<
  typeof inicioInvestigacionFiltersSchema
>
