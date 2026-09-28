import type { PathValue } from 'react-hook-form'

export interface CatalogOption<T = unknown> {
  value: string
  label: string
  original: T
}

export interface RegionalCatalogItem {
  id: string
  nombre: string
}

export interface GrupoCatalogItem {
  id: string
  regionalId: string
  nombre: string
}

export interface FuncionarioCatalogItem {
  id: string
  grupoId: string
  nroPase: string
  grado: string
  nombre: string
  paterno: string
  materno: string
}

export interface SimpleCatalogItem {
  id: string
  nombre: string
}

export interface RegistroCasosFormValues {
  regional: CatalogOption<RegionalCatalogItem> | null
  grupo: CatalogOption<GrupoCatalogItem> | null
  asignadoAlCaso: string[]
  departamento: CatalogOption<SimpleCatalogItem> | null
  nombreCaso: string
  tipoCaso: CatalogOption<SimpleCatalogItem> | null
  nroAsignadoFelcn: string
  cudFiscalia: string
  tipoDelito: CatalogOption<SimpleCatalogItem> | null
  nroCasoInvFinancieraParalela: string
  cudDelitoPrecedente: string
  casoPorPerdidaDominio: 'si' | 'no'
  nroCasoPerdidaDominio: string
  memorandumNro: string
  fechaAsignacionCaso: string
  inicioCasoLgi: CatalogOption<SimpleCatalogItem> | null
  remitidoGiaefFecha: string
  gestion: string
}

export interface RegistroCasosAsignacionResponse {
  codigoGenerado: string
}

export type RegistroCasosFormValuePath = PathValue<
  RegistroCasosFormValues,
  keyof RegistroCasosFormValues
>
