import type {
  CatalogOption,
  DistritalCatalogItem,
  GradoCatalogItem,
  GrupoCatalogItem,
  UnidadCatalogItem,
} from '../types/agregar-personal.types'

export const mapGradoToOption = (
  item: GradoCatalogItem
): CatalogOption<GradoCatalogItem> => ({
  value: item.id,
  label: `${item.abreviatura} - ${item.nombre}`,
  original: item,
})

export const mapUnidadToOption = (
  item: UnidadCatalogItem
): CatalogOption<UnidadCatalogItem> => ({
  value: item.id,
  label: `${item.sigla} - ${item.nombre}`,
  original: item,
})

export const mapDistritalToOption = (
  item: DistritalCatalogItem
): CatalogOption<DistritalCatalogItem> => ({
  value: item.id,
  label: `${item.sigla} - ${item.nombre}`,
  original: item,
})

export const mapGrupoToOption = (
  item: GrupoCatalogItem
): CatalogOption<GrupoCatalogItem> => ({
  value: item.id,
  label: `${item.sigla} - ${item.nombre}`,
  original: item,
})
