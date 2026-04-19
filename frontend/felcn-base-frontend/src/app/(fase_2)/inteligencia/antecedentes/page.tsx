import { Metadata } from 'next'
import { siteName } from '@/utils'
import AntecedentesPage from '@/app/(fase_2)/inteligencia/antecedentes/ui/AntecedentesPage'

export const metadata: Metadata = {
  title: `Antecedentes - ${siteName()}`,
  description: 'Busqueda de antecedentes por datos personales.',
}

export default function AntecedentesRoutePage() {
  return <AntecedentesPage />
}
