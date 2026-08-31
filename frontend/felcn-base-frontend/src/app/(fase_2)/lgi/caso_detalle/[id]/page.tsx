import { Metadata } from 'next'

import { siteName } from '@/utils'

import { CasoDetallePage } from '../ui/CasoDetallePage'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: `Detalle del caso - ${siteName()}`,
  description: 'Detalle del caso LGI.',
}

export default async function CasoDetallePageServer({ params }: PageProps) {
  const resolvedParams = await params

  return <CasoDetallePage casoId={resolvedParams.id} />
}
