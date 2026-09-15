import { Metadata } from 'next'
import { siteName } from '@/utils'
import { DetalleDetenidoPage } from './ui/DetalleDetenidoPage'

type PageProps = {
  params: Promise<{
    idDetenido: string
  }>
}

export const metadata: Metadata = {
  title: `Detalle de persona - ${siteName()}`,
  description: 'Detalle de la persona encontrada en variables cruzadas.',
}

export default async function DetalleDetenidoPageServer({ params }: PageProps) {
  const resolvedParams = await params

  return <DetalleDetenidoPage idDetenido={resolvedParams.idDetenido} />
}