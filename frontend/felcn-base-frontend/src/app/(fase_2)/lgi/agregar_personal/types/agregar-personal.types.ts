import type { PathValue } from 'react-hook-form'

export interface CatalogOption<T = unknown> {
  value: string
  label: string
  original: T
}

export interface GradoCatalogItem {
  id: string
  nombre: string
  abreviatura: string
}

export interface UnidadCatalogItem {
  id: string
  nombre: string
  sigla: string
}

export interface DistritalCatalogItem {
  id: string
  unidadId: string
  nombre: string
  sigla: string
}

export interface GrupoCatalogItem {
  id: string
  distritalId: string
  nombre: string
  sigla: string
}

export type AgregarPersonalRol = 'investigador' | 'perito' | 'consultas'

export type AgregarPersonalSiNo = 'si' | 'no'

export interface AgregarPersonalFormValues {
  nroPaseCredencial: string
  grado: CatalogOption<GradoCatalogItem> | null
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  fechaNacimiento: string
  correoElectronico: string
  nroTelefonoCelular: string
  nroTelefonoOficina: string
  unidad: CatalogOption<UnidadCatalogItem> | null
  distrital: CatalogOption<DistritalCatalogItem> | null
  grupo: CatalogOption<GrupoCatalogItem> | null
  rol: CatalogOption<AgregarPersonalRol> | null
  habilitadoIngreso: string
  mostrarListaInvestigadores: string
}

export interface AgregarPersonalRegistroPreview {
  codigoTemporal: string
  nombreCompleto: string
  rol: AgregarPersonalRol
  unidad: string
  distrital: string
  grupo: string
}

export type AgregarPersonalFormValuePath = PathValue<
  AgregarPersonalFormValues,
  keyof AgregarPersonalFormValues
>
