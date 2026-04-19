import { Metadata } from 'next'
import { siteName } from '@/utils'
import BuscarOperativoPage from '@/app/(fase_2)/inteligencia/buscar_operativo/ui/BuscarOperativoPage'

export const metadata: Metadata = {
  title: `Buscar operativo - ${siteName()}`,
  description: 'Busqueda de operativo por numero de caso.',
}

export default function BuscarOperativoRoutePage() {
  return <BuscarOperativoPage />
}
