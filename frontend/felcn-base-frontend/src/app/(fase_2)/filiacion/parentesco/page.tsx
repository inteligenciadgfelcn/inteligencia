import { Metadata } from 'next'
import { siteName } from '@/utils'
import { FormParentesco } from './ui/FormParentesco'
import { ParentescoView } from './ui/ParentescoView'

export const metadata: Metadata = {
  title: `Parentezco - ${siteName()}`,
  description: 'Registro de parentezcos y nombres supuestos.',
}

export default function ParentezcoPage() {
  return <ParentescoView />
}
