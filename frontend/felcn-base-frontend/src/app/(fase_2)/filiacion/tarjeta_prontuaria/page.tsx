import { Metadata } from 'next'
import { siteName } from '@/utils'
import { TarjetaProntuariaView } from './ui/TarjetaProntuariaView'

export const metadata: Metadata = {
  title: `Tarjeta prontuaria - ${siteName()}`,
  description: 'Tarjeta prontuaria de personas detenidas en operativos',
}

export default function ParentezcoPage() {
  return <TarjetaProntuariaView />
}
