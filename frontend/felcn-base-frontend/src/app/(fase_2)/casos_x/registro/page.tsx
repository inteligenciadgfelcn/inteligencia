import { Metadata } from 'next'
import { siteName } from '@/utils'
import { RegistroOperativoPage } from './ui/RegistroOperativoPage'

export const metadata: Metadata = {
  title: `Registro Operativo - ${siteName()}`,
  description: 'Registro operativo con busqueda por numero de caso.',
}

export default function Page() {
  return <RegistroOperativoPage />
}
