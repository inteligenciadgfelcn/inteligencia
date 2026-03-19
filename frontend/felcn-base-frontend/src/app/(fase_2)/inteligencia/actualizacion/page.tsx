import { Metadata } from 'next'
import { siteName } from '@/utils'
import { Actualizacion } from './ui/Actualizacion'

export const metadata: Metadata = {
  title: `Actualizacion  - ${siteName()}`,
}

export default function CasosServiciosPage() {
  return <Actualizacion />
}
