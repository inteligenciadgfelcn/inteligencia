import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import G from 'geojson'
import { FeatureGroup, Map as LeafletMap } from 'leaflet'
import MapaDibujar from '@/components/mapas/MapaDibujar'
import { calcularZoom, getCentro } from '@/components/mapas/GeoUtils'

const poligonoEjemplo: G.Feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-66.172371, -17.359486],
        [-66.133232, -17.369316],
        [-66.142845, -17.380784],
        [-66.136665, -17.3952],
        [-66.147308, -17.399459],
        [-66.142159, -17.418787],
        [-66.126366, -17.434511],
        [-66.129799, -17.450232],
        [-66.154518, -17.430252],
        [-66.164131, -17.428287],
        [-66.169968, -17.409615],
        [-66.187134, -17.400442],
        [-66.178207, -17.382095],
        [-66.172371, -17.359486],
      ],
    ],
  },
}

export default {
  title: 'Moléculas/Mapas/Polígonos',
  component: MapaDibujar,
  parameters: {
    docs: {
      description: {
        component:
          'Componente que utiliza la biblioteca Leaflet para mostrar un mapa interactivo con capacidad para dibujar y editar polígonos.',
      },
    },
  },
} as Meta

interface TemplateProps {
  poligono?: G.Feature | null
  onlyread: boolean
}

const Template: StoryFn<TemplateProps> = ({ poligono, onlyread }) => {
  const [zoom, setZoom] = useState<number | undefined>()
  const [centro, setCentro] = useState<[number, number] | undefined>()
  const [puntos, setPuntos] = useState<Array<[number, number]>>([])

  const featureGroupRef = useRef<FeatureGroup | null>(null)
  const mapRef = useRef<LeafletMap>(null)

  const procesarPoligono = useCallback((poly: G.Feature | null | undefined) => {
    if (poly?.geometry?.type === 'Polygon' && poly.geometry.coordinates) {
      const points = poly.geometry.coordinates[0].map(
        (coord) => [coord[0], coord[1]] as [number, number]
      )
      setPuntos(points)
      const newZoom = calcularZoom(points)
      setZoom(newZoom)
    } else {
      // Si no hay polígono, establecemos valores por defecto
      setPuntos([])
      setZoom(6) // Un zoom por defecto
      setCentro([-16.2902, -63.5887]) // Centro de Bolivia
    }
  }, [])

  useEffect(() => {
    procesarPoligono(poligono)
  }, [poligono, procesarPoligono])

  useEffect(() => {
    const newCentro = getCentro(puntos)
    if (newCentro) {
      setCentro([newCentro[0], newCentro[1]])
    }
  }, [puntos])

  return (
    <MapaDibujar
      mapRef={mapRef}
      featureGroupRef={featureGroupRef}
      onlyread={onlyread}
      id="mapa-poligonos-dibujar"
      key="mapa-poligonos-dibujar"
      height={500}
      zoom={zoom}
      centro={centro}
      poligono={poligono ?? null}
    />
  )
}

export const PorDefecto = Template.bind({})
PorDefecto.storyName = 'Por defecto'
PorDefecto.args = {
  poligono: null,
  onlyread: false,
}

export const SoloLectura = Template.bind({})
SoloLectura.storyName = 'Solo lectura'
SoloLectura.args = {
  poligono: poligonoEjemplo,
  onlyread: true,
}
