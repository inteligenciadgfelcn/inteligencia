import { Metadata } from 'next'
import { siteName } from '@/utils'
import { RegistrosDataTable } from './ui/RegistrosDatatable'

export const metadata: Metadata = {
  title: `Registro casos - ${siteName()}`,
  description: 'Gestión de casos en operativos antinarcóticos.',
}

export default function CasosServiciosPage() {
  return <RegistrosDataTable />
}
