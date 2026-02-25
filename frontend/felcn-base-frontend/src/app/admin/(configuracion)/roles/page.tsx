import { Metadata } from 'next'
import { RolesDatatable } from '@/app/admin/(configuracion)/roles/ui/RolesDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Roles - ${siteName()}`,
  description: 'Gestión de roles del sistema',
}

export default function RolesPage() {
  return <RolesDatatable />
}
