import type {
  CatalogOption,
  FuncionarioCatalogItem,
  GrupoCatalogItem,
  RegionalCatalogItem,
  SimpleCatalogItem,
} from '../types/registro-casos.types'
import { formatFuncionarioLabel } from '../utils/registro-casos.utils'

export const mapSimpleCatalogToOption = (
  item: SimpleCatalogItem
): CatalogOption<SimpleCatalogItem> => ({
  value: item.id,
  label: item.nombre,
  original: item,
})

export const mapRegionalToOption = (
  item: RegionalCatalogItem
): CatalogOption<RegionalCatalogItem> => ({
  value: item.id,
  label: item.nombre,
  original: item,
})

export const mapGrupoToOption = (
  item: GrupoCatalogItem
): CatalogOption<GrupoCatalogItem> => ({
  value: item.id,
  label: item.nombre,
  original: item,
})

export const mapFuncionarioToDropdownOption = (
  item: FuncionarioCatalogItem
) => ({
  id: item.id,
  value: item.id,
  label: formatFuncionarioLabel(item),
})
