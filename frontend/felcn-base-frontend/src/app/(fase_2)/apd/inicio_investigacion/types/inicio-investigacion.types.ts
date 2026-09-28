import type { z } from 'zod'

export type InicioInvestigacionBusquedaCriterio =
  | 'investigador'
  | 'departamento'

export type InicioInvestigacionEstado =
  | 'En análisis'
  | 'En observación'
  | 'Derivado'
  | 'Cerrado'

export interface InicioInvestigacionItem {
  id: string
  regional: string
  nombreCaso: string
  estadoCaso: InicioInvestigacionEstado
  nroCasoGiaef: string
  nroCasoFelcn: string
  nroCasoFiscalia: string
  nroPerdidaDominio: string
  iaunus: string
  fiscalQueRemite: string
  fechaRemision: string
  conformeA: string
  investigador: string
  departamento: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface InicioInvestigacionFilters {
  regionales: string[]
  estadosCaso: string[]
  nombreCaso: string
  nroCasoGiaef: string
  nroCasoFelcn: string
  nroCasoFiscalia: string
  nroPerdidaDominio: string
  fechaRemision: string
  busquedaCriterio: InicioInvestigacionBusquedaCriterio
  busquedaValor: string
}

export type InicioInvestigacionFiltersSchema = z.infer<
  typeof import('../schemas/inicio-investigacion.schema').inicioInvestigacionFiltersSchema
>
