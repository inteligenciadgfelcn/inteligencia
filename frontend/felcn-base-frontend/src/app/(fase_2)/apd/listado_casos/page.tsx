import { Metadata } from 'next'

import { siteName } from '@/utils'

import { ListadoCasos } from './ui/ListadoCasos'

export const metadata: Metadata = {
  title: `Listado de casos APD - ${siteName()}`,
  description: 'Listado de casos APD.',
}

export default function ListadoCasosPage() {
  return <ListadoCasos />
}
