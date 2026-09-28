import { Metadata } from 'next'

import { siteName } from '@/utils'

import { InicioInvestigacionDetalle } from './ui/InicioInvestigacionDetalle'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: `Detalle inicio investigación - ${siteName()}`,
  description: 'Detalle de inicio de investigación APD.',
}

export default async function InicioInvestigacionDetallePage({
  params,
}: PageProps) {
  const resolvedParams = await params

  return <InicioInvestigacionDetalle id={resolvedParams.id} />
}