import { Metadata } from 'next'
import { siteName } from '@/utils'
import { RegistrosDataTable } from './ui/RegistrosDatatable'

export const metadata: Metadata = {
  title: `Pasar casos - ${siteName()}`,
}

export default function CasosServiciosPage() {
  return <RegistrosDataTable />
}
