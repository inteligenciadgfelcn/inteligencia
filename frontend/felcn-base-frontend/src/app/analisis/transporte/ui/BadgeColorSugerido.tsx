import type { ColorS2i } from '@/services/analisis'
import { ColorSwatch } from './ColorSwatch'

interface Props {
  idColores: number[]
  colores: ColorS2i[]
}

// Insignia de colores sugeridos por parametricas.regla_color para el documento/placa
// recién resuelto (una regla activa puede aportar más de un color). Es solo una guía
// visual — no selecciona nada por sí sola.
export function BadgeColorSugerido({ idColores, colores }: Props) {
  const encontrados = idColores
    .map((id) => colores.find((c) => c.id === id))
    .filter((c): c is ColorS2i => c != null)
  if (encontrados.length === 0) return null

  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-[#e0e6ed] bg-white px-3 py-1 text-xs dark:border-[#1b2e4b] dark:bg-gray-800">
      Sugerido:
      {encontrados.map((color) => (
        <ColorSwatch key={color.id} color={color} />
      ))}
    </span>
  )
}
