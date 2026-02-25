import { Metadata } from 'next'
import { PoliticasDatatable } from '@/app/admin/(configuracion)/politicas/ui/PoliticasDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Políticas - ${siteName()}`,
  description: 'Gestión de políticas del sistema',
}

export default function PoliticasPage() {
  return <PoliticasDatatable />
}
