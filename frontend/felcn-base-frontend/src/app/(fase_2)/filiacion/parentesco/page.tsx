import { Metadata } from 'next'
import { siteName } from '@/utils'
import { FormParentesco } from './ui/FormParentesco'

export const metadata: Metadata = {
  title: `Parentezco - ${siteName()}`,
  description: 'Registro de parentezcos y nombres supuestos.',
}

export default function ParentezcoPage() {
  return (
    <div className="panel p-1 mb-5 w-full">
      <FormParentesco />
    </div>
  )
}
