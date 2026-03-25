import { Metadata } from 'next'
import { FormularioUsuario } from '../ui/FormularioUsuario'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Nuevo Usuario - ${siteName()}`,
  description: 'Crear nuevo usuario',
}

export default function NuevoUsuarioPage() {
  return <FormularioUsuario />
}
