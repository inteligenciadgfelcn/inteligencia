import { Metadata } from 'next'
import { siteName } from '@/utils'
import { ServicioForm } from './ui/ServicioForm'

export const metadata: Metadata = {
  title: `Servicios - ${siteName()}`,
}

export default function CasosServiciosPage() {
  return <ServicioForm />
}
