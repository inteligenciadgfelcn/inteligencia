import { Metadata } from 'next'
import { siteName } from '@/utils'
import { RegistroCasosIngresoDatos } from './ui/RegistroCasosIngresoDatos'

export const metadata: Metadata = {
  title: `Registro de casos LGI - ${siteName()}`,
  description: 'Registro de casos LGI.',
}

export default function IngresoDatosPage() {
  return <RegistroCasosIngresoDatos />
}
