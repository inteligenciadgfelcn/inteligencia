import { Metadata } from 'next'
import { siteName } from '@/utils'
import { ServiciosDatatable } from './ui/ServiciosDatatable'

export const metadata: Metadata = {
  title: `Creacion servicio - ${siteName()}`,
}

export default function CasosServiciosPage() {
  return <ServiciosDatatable />
}
