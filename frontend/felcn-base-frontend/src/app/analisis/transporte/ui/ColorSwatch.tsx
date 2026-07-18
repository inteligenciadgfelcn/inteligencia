import type { ColorS2i } from '@/services/analisis'

interface Props {
  color: ColorS2i
}

// Punto de color + nombre (campo `color`, el mismo que usa el Select de color).
export function ColorSwatch({ color }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
        style={{ backgroundColor: color.hexadecimal }}
      />
      {color.color}
    </span>
  )
}
