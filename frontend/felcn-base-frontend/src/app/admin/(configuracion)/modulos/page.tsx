import { Metadata } from 'next'
import { ModulosDatatable } from '@/app/admin/(configuracion)/modulos/ui/ModulosDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Módulos - ${siteName()}`,
  description: 'Gestión de módulos del sistema',
}

export default function ModulosPage() {
  return <ModulosDatatable />
}
