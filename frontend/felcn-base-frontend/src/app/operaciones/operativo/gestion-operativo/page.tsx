import type { Metadata } from 'next'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Gestion Operativo - ${siteName()}`,
  description: 'Listado de registros de gestion operativo',
}

import { GestionOperativoTabs } from './ui/GestionOperativoTabs'

export default function GestionOperativoPage() {
  return (
    <div className="space-y-6">
      <GestionOperativoTabs />
    </div>
  )
}
