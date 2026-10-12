import { Metadata } from 'next'

import { siteName } from '@/utils'

import { BusquedaGeneralPageApd } from './ui/BusquedaGeneralPageApd'

export const metadata: Metadata = {
  title: `Búsqueda general APD - ${siteName()}`,
  description:
    'Búsqueda de casos APD (pérdida de dominio) mediante variables cruzadas de caso, personas, bienes y empresas.',
}

export default function BusquedaGeneralPageApdRoute() {
  return <BusquedaGeneralPageApd />
}
