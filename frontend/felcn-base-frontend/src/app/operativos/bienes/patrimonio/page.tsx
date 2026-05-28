import type { Metadata } from 'next'
import { siteName } from '@/utils'
import { PatrimonioView } from './ui/PatrimonioView'

export const metadata: Metadata = {
  title: `Patrimonio Bienes - ${siteName()}`,
  description: 'Cálculo de patrimonio total afectado y actualización de costos por bien secuestrado',
}

interface PatrimonioPageProps {
  searchParams: Promise<{ caso?: string }>
}

export default async function PatrimonioPage({ searchParams }: PatrimonioPageProps) {
  const params = await searchParams
  return <PatrimonioView idOperativo={params.caso} />
}
