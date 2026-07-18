import type { ColorS2i } from '@/services/analisis'
import { ColorSwatch } from './ColorSwatch'

interface Props {
  idColor: number | null
  colores: ColorS2i[]
}

// Insignia de color sugerido por parametricas.regla_color para el documento/placa
// recién resuelto. Es solo una guía visual — no selecciona nada por sí sola.
export function BadgeColorSugerido({ idColor, colores }: Props) {
  if (idColor == null) return null
  const color = colores.find((c) => c.id === idColor)
  if (!color) return null

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e0e6ed] bg-white px-2 py-0.5 text-xs dark:border-[#1b2e4b] dark:bg-gray-800">
      Sugerido: <ColorSwatch color={color} />
    </span>
  )
}
