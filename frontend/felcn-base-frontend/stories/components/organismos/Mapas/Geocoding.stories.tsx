import { optionType } from '@/components/form'
import Mapa from '@/components/mapas/Mapa'
import { Meta, StoryFn } from '@storybook/react'
import { createRef, useEffect, useState } from 'react'
import { calcularZoom, getCentro } from '@/components/mapas/GeoUtils'
import { useForm } from 'react-hook-form'
import { useAlerts } from '@/hooks'
import { useDebouncedCallback } from 'use-debounce'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { delay, InterpreteMensajes } from '@/utils'
import {
  Autocomplete,
  Box,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Map } from 'leaflet'

interface AddressLeaflet {
  city: string
  county: string
  state: string
  country: string
  country_code: string
  tourism: string
  road: string
  village?: string
  neighbourhood: string
  city_district: string
  postcode: string
}

interface LeafletUbicacionType {
  place_id: string
  licence?: string
  osm_type?: string
  osm_id?: number
  boundingbox?: string[]
  lat: string
  lon: string
  display_name: string
  class?: string
  type?: string
  importance?: number
  icon?: string
  address?: AddressLeaflet
}

interface SearchType {
  zona: optionType
}

export default {
  title: 'Organismos/Mapas/Mapa con API de OSM',
  component: Mapa,
  argTypes: {},
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated' | 'releaseCandidate'
    },
    docs: {
      description: {
        component:
          'Ejemplo de componente Mapa que utiliza la API de OpenStreetMaps para buscar y mostrar una ubicación de referencia en un mapa Leaflet. El componente incluye un campo de búsqueda de ubicación, permite agregar puntos de referencia haciendo clic en el mapa y utiliza varios paquetes y servicios de terceros para su implementación. También proporciona una opción para imprimir mensajes de alerta en caso de errores.',
      },
    },
  },
} as Meta

const Template: StoryFn = (args) => {
  const [zoom, setZoom] = useState<number | undefined>()
  const [centro, setCentro] = useState<[number, number] | undefined>()
  const [puntos, setPuntos] = useState<Array<string[]>>([])

  const mapRef = createRef<Map>()

  const agregarPunto = (latlng: number[]) => {
    const puntosActuales = []
    puntosActuales.push([latlng[0].toString(), latlng[1].toString()])
    setPuntos([...puntosActuales])
  }

  useEffect(
    () => {
      if (args.puntos) {
        setPuntos([...args.puntos])
        const zoom: number = calcularZoom([...args.puntos])
        setZoom(zoom)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    setCentro(getCentro(puntos))
  }, [puntos])

  /*
  -------------------- buscador de MAPA ------------------
  */

  const { watch, setValue } = useForm<SearchType>({
    defaultValues: {},
  })

  const watchZona = watch('zona')

  const defaultOption = { id: '', value: '', label: '' }

  const { Alerta } = useAlerts()
  const [defaultCategoriaOption, setDefaultCategoriaOption] =
    useState<optionType>(defaultOption)

  const [puntosMapaLeaflet, setPuntoMapaLeafletData] = useState<
    LeafletUbicacionType[]
  >([])

  const debounced = useDebouncedCallback(async (direccion: string) => {
    await obtenerUbicacionMapa(direccion)
  }, 1000)

  const actualizacionDireccion = (direccion: string) => {
    debounced(direccion)
  }

  const obtenerUbicacionMapa = async (
    direccion?: string,
    updateMapa: boolean = true
  ) => {
    try {
      const referencia = `Bolivia`

      const parametros = [referencia, direccion ?? '']

      const respuesta = await Servicios.peticionHTTP({
        url: `${Constantes.apiOpenStreetMap}/search`,
        params: {
          q: parametros.join(' '),
          format: 'json',
          addressdetails: '1',
          limit: '10',
        },
        headers: {
          'Accept-Language': 'es',
        },
        withCredentials: false,
      })
      if (updateMapa) setPuntoMapaLeafletData(respuesta.data)
    } catch (e) {
      imprimir(`Error al obtener puntos mapa: ${e}`)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

  const actualizarUbicacion = async (select: optionType) => {
    try {
      const ubicacion: LeafletUbicacionType = JSON.parse(
        select.value != undefined ? select.value + '' : ''
      )
      const current = puntosMapaLeaflet.find((punto) =>
        `${select.id}`.includes(punto.place_id.toString())
      )
      if (current) {
        setDefaultCategoriaOption({
          id: `${current.place_id.toString()}`,
          value: current.display_name,
          label: `${current.display_name}`,
        })
      }
      setCentro([Number(ubicacion.lat), Number(ubicacion.lon)])
      await delay(500) // TODO: encontrar una mejor solución para el cambio de centro seguido el cambio de zoom
      setZoom(15)
    } catch (e) {
      imprimir('Error al actualizar ubicación', e)
    }
  }

  useEffect(
    () => {
      imprimir(typeof watchZona, watchZona)
      if (watchZona) {
        actualizarUbicacion(watchZona).finally(() => {})
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(watchZona)]
  )

  /*
  -------------------- buscador de MAPA ------------------
  */

  return (
    <>
      <Grid container direction={'column'}>
        <Grid>
          <InputLabel
            htmlFor={'zona'}
            sx={{ color: 'text.primary', fontWeight: '500' }}
          >
            Buscar zona de referencia
          </InputLabel>
          <Autocomplete
            id="zona"
            freeSolo
            options={puntosMapaLeaflet.map((punto) => ({
              id: punto.place_id.toString(),
              value: JSON.stringify(punto),
              label: punto.display_name,
            }))}
            onInputChange={(_, newInputValue) => {
              actualizacionDireccion(newInputValue)
            }}
            onChange={(_, newValue) => {
              if (newValue && typeof newValue !== 'string') {
                setValue('zona', newValue)
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Box height={10} />
        <Grid>
          <Mapa
            mapRef={mapRef}
            id={'geocoding-mapa'}
            zoom={zoom}
            centro={centro}
            onClick={agregarPunto}
          />
        </Grid>
        <Typography>{defaultCategoriaOption.value}</Typography>
      </Grid>
    </>
  )
}

export const PorDefecto = Template.bind({})
PorDefecto.storyName = 'Por defecto'
PorDefecto.args = {
  puntos: [],
}
