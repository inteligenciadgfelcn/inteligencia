'use client'

import { type RefObject } from 'react'
import { Marker } from 'react-leaflet'
import { icon, type Map as LeafletMap } from 'leaflet'
import Mapa from './Mapa'

const MARCADOR_ICON = icon({
  iconRetinaUrl: '/leaflet/marker-icon.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconAnchor: [12.5, 41],
})

export interface MapaConMarcadorProps {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRef: RefObject<LeafletMap | any>
  centro?: [number, number]
  /** Coordenadas [lat, lng] del marcador. Sin valor = sin marcador. */
  coordenadas?: [number, number] | null
  onClick?: (center: [number, number], zoom: number) => void
  height?: number | string
  zoom?: number
  scrollWheelZoom?: boolean
}

export default function MapaConMarcador({
  coordenadas,
  ...props
}: MapaConMarcadorProps) {
  return (
    <Mapa
      {...props}
      markers={
        coordenadas ? (
          <Marker position={coordenadas} icon={MARCADOR_ICON} />
        ) : null
      }
    />
  )
}
