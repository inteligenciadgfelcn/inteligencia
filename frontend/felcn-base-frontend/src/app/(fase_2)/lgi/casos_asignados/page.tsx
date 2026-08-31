import { Metadata } from 'next'

import { siteName } from '@/utils'

import { CasosAsignados } from './ui/CasosAsignados'

export const metadata: Metadata = {
  title: `Casos asignados - ${siteName()}`,
  description: 'Casos asignados.',
}

export default function ListadoCasosPage() {
  return <CasosAsignados />
}
