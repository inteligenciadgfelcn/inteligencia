import { Metadata } from 'next'

import { siteName } from '@/utils'

import { RegistroCaso } from './ui/RegistroCaso'

export const metadata: Metadata = {
  title: `Registro de caso APD - ${siteName()}`,
  description: 'Registro de caso APD.',
}

export default function RegistroCasoPage() {
  return <RegistroCaso modo="nuevo" />
}
