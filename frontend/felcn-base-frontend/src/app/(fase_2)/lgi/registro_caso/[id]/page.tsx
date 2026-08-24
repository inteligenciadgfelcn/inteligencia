import { Metadata } from 'next'

import { siteName } from '@/utils'

import { RegistroCaso } from '../ui/RegistroCaso'

type PageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    modo?: string
  }>
}

export const metadata: Metadata = {
  title: `Detalle de caso LGI - ${siteName()}`,
  description: 'Detalle y edición de un caso LGI.',
}

export default async function RegistroCasoDetallePage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return (
    <RegistroCaso
      casoId={resolvedParams.id}
      modo={resolvedSearchParams.modo === 'ver' ? 'ver' : 'editar'}
    />
  )
}
