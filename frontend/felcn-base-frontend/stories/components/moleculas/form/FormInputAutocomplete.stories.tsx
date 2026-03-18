import React, { useEffect, useState, useCallback } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useForm, useWatch } from 'react-hook-form'
import {
  FormInputAutocomplete,
  BaseOptionType,
} from '@/components/form/FormInputAutocomplete'
import { Servicios } from '@/services'
import { imprimir } from '@/utils/imprimir'

export interface PersonaType {
  id: number
  nombre: string
  apellido: string
  carnet: string
  fechaNacimiento: string
  edad: number
  productos: BaseOptionType[]
  idiomas: BaseOptionType[]
}

interface BusquedaParams {
  buscar?: string
}

interface Producto {
  id: string
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

interface RespuestaBusqueda {
  products: Producto[]
  total: number
  skip: number
  limit: number
}

export default {
  title: 'Moléculas/Formulario/FormInputAutocomplete',
  component: FormInputAutocomplete,
  parameters: {
    status: {
      type: 'deprecated',
    },
    docs: {
      description: {
        component:
          'Es un componente que utiliza la librería `react-hook-form` y la librería MUI para crear un campo de entrada de texto con autocompletado.',
      },
    },
  },
} as Meta<typeof FormInputAutocomplete>

const Template: StoryFn<typeof FormInputAutocomplete> = (args) => {
  const [opciones, setOpciones] = useState<BaseOptionType[]>([])
  const { control } = useForm<PersonaType>({
    defaultValues: {
      id: 12,
      nombre: 'Pedro',
      apellido: 'Picapiedra',
      edad: 32,
      fechaNacimiento: '05-21-1984',
      productos: [],
    },
  })

  const productos = useWatch({
    control,
    name: 'productos',
  })

  const busqueda = useCallback(async ({ buscar }: BusquedaParams) => {
    const lista: RespuestaBusqueda = await Servicios.get({
      url: 'https://dummyjson.com/products/search',
      withCredentials: false,
      params: { q: buscar },
    })

    setOpciones(
      lista.products.map((value) => ({
        id: value.id.toString(),
        value: value.id.toString(),
        label: value.title,
      }))
    )
  }, [])

  useEffect(() => {
    imprimir(`productos: `, productos)
  }, [productos])

  return (
    <FormInputAutocomplete<BaseOptionType, PersonaType, 'productos'>
      {...args}
      id={'rolesMultiple'}
      name={'productos'}
      control={control}
      label="Productos"
      options={opciones}
      multiple
      freeSolo
      filterOptions={(options) => options}
      onInputChange={async (_, value) => {
        await busqueda({ buscar: value })
      }}
      rules={{ required: 'Este campo es requerido' }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === 'string' || typeof value === 'string') {
          return option === value
        }
        return option.value === value.value
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option
        return option.label
      }}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            {typeof option === 'string' ? option : option.label}
          </li>
        )
      }}
    />
  )
}

const TemplateAbierto: StoryFn<typeof FormInputAutocomplete> = (args) => {
  const { control } = useForm<PersonaType>({
    defaultValues: {
      idiomas: [
        { id: '1', value: 'inglés', label: 'inglés' },
        { id: '2', value: 'español', label: 'español' },
        { id: '3', value: 'francés', label: 'francés' },
        { id: '4', value: 'alemán', label: 'alemán' },
        { id: '5', value: 'japonés', label: 'japonés' },
      ],
    },
  })

  const idiomas = useWatch({
    control,
    name: 'idiomas',
  })

  useEffect(() => {
    imprimir(`idiomas: `, idiomas)
  }, [idiomas])

  return (
    <FormInputAutocomplete<BaseOptionType, PersonaType, 'idiomas'>
      {...args}
      id={'idiomasAutocomplete'}
      name={'idiomas'}
      control={control}
      label="Idiomas"
      multiple
      freeSolo
      options={[]}
      filterOptions={(options) => options}
      onInputChange={(_, value) => {
        imprimir(value)
      }}
      rules={{ required: 'Este campo es requerido' }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === 'string' || typeof value === 'string') {
          return option === value
        }
        return option.value === value.value
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option
        return option.label
      }}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            {typeof option === 'string' ? option : option.label}
          </li>
        )
      }}
    />
  )
}

export const SB_Simple = Template.bind({})
SB_Simple.storyName = 'Simple'
SB_Simple.args = {
  id: '1232131',
  label: 'Idiomas',
  name: 'id-idiomas',
  searchIcon: true,
  forcePopupIcon: true,
}

export const SB_Multiple = Template.bind({})
SB_Multiple.storyName = 'Multiple'
SB_Multiple.args = {
  id: '1232131',
  label: 'Productos',
  name: 'productos',
  freeSolo: true,
  multiple: true,
  searchIcon: true,
  forcePopupIcon: true,
  newValues: false,
}

export const SB_MultipleAbierto = TemplateAbierto.bind({})
SB_MultipleAbierto.storyName = 'Campo abierto para cualquier texto'
SB_MultipleAbierto.args = {
  id: '1232131',
  label: 'Productos',
  name: 'productos',
  freeSolo: true,
  multiple: true,
  forcePopupIcon: false,
  newValues: true,
}
