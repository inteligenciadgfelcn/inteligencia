import { Metadata } from 'next'

import { siteName } from '@/utils'

import { PersonasInvestigadas } from '../ui/PersonasInvestigadas'

export const metadata: Metadata = {
  title: `Personas investigadas - ${siteName()}`,
  description: 'Personas investigadas de un caso LGI.',
}

interface PageProps {
  params: Promise<{ casoId: string }>
}

export default async function PersonasInvestigadasPage({
  params,
}: PageProps) {
  const { casoId } = await params
  return <PersonasInvestigadas casoId={Number(casoId)} />
}
