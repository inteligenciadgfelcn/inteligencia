import { Metadata } from 'next'

import { siteName } from '@/utils'

import { BusquedaGeneralPage } from './ui/BusquedaGeneralPage'

export const metadata: Metadata = {
  title: `Búsqueda general LGI - ${siteName()}`,
  description:
    'Búsqueda de casos LGI mediante variables cruzadas de caso, personas, bienes y empresas.',
}

export default function BusquedaGeneralPageRoute() {
  return <BusquedaGeneralPage />
}
