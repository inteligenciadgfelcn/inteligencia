'use client'

import { CircleMarker, Tooltip } from 'react-leaflet'
import type { MarcadorSig } from '@/services/analisis'

interface Props {
  marcadores: MarcadorSig[]
  color: Record<MarcadorSig['tipo'], string>
}

/**
 * Aislado en su propio archivo para que solo se cargue vía dynamic import
 * con ssr:false — react-leaflet toca `window` al cargar el módulo, así que
 * no puede importarse directo desde un componente que sí se renderiza en
 * el servidor (rompía el SSR de /operativos, /reportes/cruzados-all y
 * /analisis/reportes al compartir chunk).
 */
export default function MarcadoresSig({ marcadores, color }: Props) {
  return (
    <>
      {marcadores.map((m, i) => (
        <CircleMarker
          key={i}
          center={[m.lat, m.lon]}
          radius={9}
          pathOptions={{
            color: color[m.tipo],
            fillColor: color[m.tipo],
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} permanent={false}>
            <span className="text-xs">{m.descripcion}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  )
}
