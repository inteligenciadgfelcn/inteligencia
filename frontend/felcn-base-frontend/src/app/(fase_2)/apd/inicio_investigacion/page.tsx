import { Metadata } from 'next'

import { siteName } from '@/utils'

import { InicioInvestigacionListado } from './ui/InicioInvestigacionListado'

export const metadata: Metadata = {
  title: `Inicio investigación APD - ${siteName()}`,
  description: 'Listado de investigaciones APD.',
}

export default function InicioInvestigacionPage() {
  return <InicioInvestigacionListado />
}
