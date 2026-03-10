import { Metadata } from 'next'
import { siteName } from '@/utils'
import { ActualizacionDataTable } from './ui/ActualizacionDatatable'
import { Actualizacion } from './ui/Actualizacion'

export const metadata: Metadata = {
  title: `Actualizacion  - ${siteName()}`,
}

export default function CasosServiciosPage() {
  return <Actualizacion />
}
