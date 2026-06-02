import { Metadata } from 'next'

import { siteName } from '@/utils'

import { AgregarPersonalForm } from './ui/AgregarPersonalForm'

export const metadata: Metadata = {
  title: `Agregar personal LGI - ${siteName()}`,
  description: 'Ingreso de datos para el registro de nuevos funcionarios.',
}

export default function AgregarPersonalPage() {
  return <AgregarPersonalForm />
}
