import { Metadata } from 'next'
import { siteName } from '@/utils'
import { ParametrosDatatable } from './ui/ParametrosDatatable'

export const metadata: Metadata = {
  title: `Parámetros - ${siteName()}`,
  description: 'Gestión de parámetros del sistema',
}

export default function ParametrosPage() {
  return <ParametrosDatatable />
}
