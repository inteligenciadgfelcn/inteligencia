import type { SelectOption } from '@/components/ui/Select'

import type {
  CatalogosApd,
  FilaCasoApd,
  ItemCatalogo,
  ItemCatalogoVinculado,
} from '../types/busqueda-general-apd.types'

/**
 * Descarta `''`, `null` y `undefined` para no enviar campos vacíos al backend.
 * `false` sí se conserva: en los booleanos distingue "filtró por No" de "no filtró".
 */
export const limpiarVacios = (
  objeto: Record<string, unknown>
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(objeto).filter(
      ([, v]) => v !== undefined && v !== '' && v !== null
    )
  )

/** Convierte el texto de un switch a tri-estado: `undefined` cuando está apagado. */
export const aBooleano = (valor: string | undefined): boolean | undefined => {
  if (valor === undefined || valor === '') return undefined
  return valor === 'true'
}

/* ── Catálogos → opciones de Select ───────────────────────────────────────── */

const aOpciones = (
  items: ItemCatalogo[] | undefined,
  etiqueta?: (item: ItemCatalogo) => string
): SelectOption[] =>
  (items ?? []).map((item) => ({
    value: item.id,
    label: etiqueta ? etiqueta(item) : (item.descripcion ?? item.id),
  }))

export const opcionesCatalogo = (
  items: ItemCatalogo[] | undefined
): SelectOption[] => aOpciones(items)

export const opcionesDepartamento = (
  catalogos: CatalogosApd | null
): SelectOption[] =>
  (catalogos?.departamentos ?? []).map((d) => ({
    value: d.codigo,
    label: d.codigo,
  }))

/** Filtra un catálogo vinculado por su clave padre (unidadId, distritalId, ...). */
export const opcionesVinculadas = (
  items: ItemCatalogoVinculado[] | undefined,
  padreId: string | undefined,
  clave: 'unidadId' | 'distritalId' | 'etapaId' | 'categoriaId' | 'claseId'
): SelectOption[] => {
  if (!padreId) return []
  return aOpciones((items ?? []).filter((item) => item[clave] === padreId))
}

/* ── Filas → vistas de tabla ─────────────────────────────────────────────── */

/** Une unidad, distrital y grupo en una sola línea compacta. */
export const resumirUbicacion = (fila: FilaCasoApd): string =>
  [fila.unidadAbreviada, fila.distrital, fila.grupo]
    .map((p) => (p == null ? '' : p.trim()))
    .filter(Boolean)
    .join(' · ')

export const validarRangoFechas = (
  desde: string | undefined,
  hasta: string | undefined,
  nombre: string
): string | null => {
  if (desde && hasta && desde > hasta) {
    return `${nombre}: la fecha inicial no puede ser posterior a la final.`
  }
  return null
}

export const validarRangoMontos = (
  desde: number | undefined,
  hasta: number | undefined
): string | null => {
  if (desde !== undefined && hasta !== undefined && desde > hasta) {
    return 'El valor mínimo del bien no puede superar al máximo.'
  }
  return null
}
