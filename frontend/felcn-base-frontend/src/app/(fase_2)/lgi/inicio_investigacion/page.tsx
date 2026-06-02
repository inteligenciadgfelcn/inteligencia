import { Metadata } from 'next'

import { siteName } from '@/utils'

import { InicioInvestigacionListado } from './ui/InicioInvestigacionListado'

export const metadata: Metadata = {
  title: `Inicio investigación LGI - ${siteName()}`,
  description: 'Listado de investigaciones LGI.',
}

export default function InicioInvestigacionPage() {
  return <InicioInvestigacionListado />
}
