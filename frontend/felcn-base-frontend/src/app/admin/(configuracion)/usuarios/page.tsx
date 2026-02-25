import { Metadata } from 'next'
import { UsuariosDatatable } from '@/app/admin/(configuracion)/usuarios/ui/UsuariosDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Usuarios - ${siteName()}`,
  description: 'Gestión de usuarios del sistema',
}

export default function UsuariosPage() {
  return <UsuariosDatatable />
}
