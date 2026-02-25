import { Metadata } from 'next'
import { siteName } from '@/utils'
import { CasosServicioDataTable } from './ui/CasosServicioDatatable'

export const metadata: Metadata = {
  title: `Casos de servicio - ${siteName()}`,
  description: 'Gestión de casos de servicio del sistema',
}

export default function CasosServiciosPage() {
  return <CasosServicioDataTable />
}
