'use client'

import { Marker } from 'react-leaflet'
import { icon } from 'leaflet'
import { BASE_PATH } from '@/imageLoader'

const ICON = icon({
  iconUrl: `${BASE_PATH}/leaflet/marker-icon.png`,
  shadowUrl: `${BASE_PATH}/leaflet/marker-shadow.png`,
  iconAnchor: [12.5, 41],
})

interface Props {
  position: [number, number]
}

/**
 * Aislado en su propio archivo para que solo se cargue vía dynamic import
 * con ssr:false — leaflet toca `window` al cargar el módulo (incluso solo
 * al construir el ICON), así que no puede importarse directo desde un
 * componente que se renderiza en el servidor.
 */
export default function MarcadorOperativo({ position }: Props) {
  return <Marker position={position} icon={ICON} />
}
