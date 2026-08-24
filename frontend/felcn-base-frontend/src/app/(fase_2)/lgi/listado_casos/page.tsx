import { Metadata } from 'next'

import { siteName } from '@/utils'

import { ListadoCasos } from './ui/ListadoCasos'

export const metadata: Metadata = {
  title: `Listado de casos LGI - ${siteName()}`,
  description: 'Listado de casos LGI.',
}

export default function ListadoCasosPage() {
  return <ListadoCasos />
}
