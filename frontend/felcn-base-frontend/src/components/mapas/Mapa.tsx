'use client'

import React, { useCallback, useEffect, memo } from 'react'
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet'
import { Map as LeafletMap } from 'leaflet'
import { ReactNode, RefObject } from 'react'
import 'leaflet/dist/leaflet.css'

export interface MapaProps {
  mapRef: RefObject<LeafletMap>
  centro?: [number, number]
  onZoomed?: (zoom: number, center: [number, number]) => void
  onClick?: (center: [number, number], zoom: number) => void
  height?: number | string
  width?: number | string
  zoom?: number
  id: string
  children?: ReactNode
  markers?: ReactNode
  zoomControl?: boolean
  scrollWheelZoom?: boolean
  maxZoom?: number
  /** URL del tile principal. Por defecto usa OpenStreetMap. */
  tileUrl?: string
  /** URL de un segundo tile que se superpone (usado para modo híbrido). */
  tileUrlOverlay?: string
}

interface ChangeMapViewProps {
  centro: [number, number]
  zoom: number
  onClick: (center: [number, number], zoom: number) => void
}

const ChangeMapView: React.FC<ChangeMapViewProps> = memo(
  ({ centro, zoom, onClick }) => {
    const map = useMap()

    useEffect(() => {
      map.flyTo(centro, zoom)
    }, [map, centro, zoom])

    useMapEvents({
      click: (e) => {
        onClick([e.latlng.lat, e.latlng.lng], map.getZoom())
      },
    })

    return null
  }
)

ChangeMapView.displayName = 'ChangeMapView'

const DEFAULT_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const Mapa: React.FC<MapaProps> = ({
  mapRef,
  markers,
  centro = [-17.405356227442883, -66.15823659326952],
  height = 400,
  width = '100%',
  onClick,
  id,
  zoom = 6,
  maxZoom = 19,
  scrollWheelZoom = false,
  zoomControl = false,
  tileUrl = DEFAULT_TILE,
  tileUrlOverlay,
}) => {
  const memoizedOnClick = useCallback(
    (center: [number, number], zoom: number) => {
      if (onClick) {
        onClick(center, zoom)
      }
    },
    [onClick]
  )

  return (
    <div>
      <MapContainer
        id={id}
        ref={mapRef}
        maxZoom={maxZoom}
        center={centro}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={zoomControl}
        style={{ height, width }}
      >
        <ChangeMapView centro={centro} zoom={zoom} onClick={memoizedOnClick} />
        <TileLayer url={tileUrl} />
        {tileUrlOverlay && <TileLayer url={tileUrlOverlay} />}
        <ZoomControl
          zoomInTitle="Acercar"
          zoomOutTitle="Alejar"
          position="bottomright"
        />
        {markers}
      </MapContainer>
    </div>
  )
}

export default memo(Mapa)
