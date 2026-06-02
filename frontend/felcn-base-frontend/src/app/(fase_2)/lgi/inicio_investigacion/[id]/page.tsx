import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { siteName } from '@/utils'

import { InicioInvestigacionDetalle } from './ui/InicioInvestigacionDetalle'
import { mockInvestigaciones } from '../utils/inicio-investigacion.utils'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: `Detalle inicio investigación - ${siteName()}`,
  description: 'Detalle de inicio de investigación LGI.',
}

export default async function InicioInvestigacionDetallePage({
  params,
}: PageProps) {
  const resolvedParams = await params
  const item = mockInvestigaciones.find((row) => row.id === resolvedParams.id)

  if (!item) {
    notFound()
  }

  return <InicioInvestigacionDetalle item={item} />
}
