import { Metadata } from 'next'

import { siteName } from '@/utils'

import { RegistroCaso } from './ui/RegistroCasoApd'

export const metadata: Metadata = {
  title: `Registro de caso LGI - ${siteName()}`,
  description: 'Registro de caso LGI.',
}

export default function RegistroCasoPage() {
  return <RegistroCaso modo="nuevo" />
}
