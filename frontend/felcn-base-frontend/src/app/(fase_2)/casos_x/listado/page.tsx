import { Metadata } from 'next'
import { siteName } from '@/utils'
import { CasosXListadoPage } from './ui/CasosXListadoPage'

export const metadata: Metadata = {
  title: `Listado Casos X - ${siteName()}`,
  description: 'Listado de operativos registrados en Casos X.',
}

export default function Page() {
  return <CasosXListadoPage />
}
