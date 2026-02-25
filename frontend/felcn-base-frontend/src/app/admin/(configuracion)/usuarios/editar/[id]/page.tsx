import { Metadata } from 'next'
import { FormularioUsuario } from '../../ui/FormularioUsuario'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Editar Usuario - ${siteName()}`,
  description: 'Editar usuario existente',
}

export default async function EditarUsuarioPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  return <FormularioUsuario usuarioId={id} />
}
