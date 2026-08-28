import { Metadata } from 'next'
import { FormularioUsuario } from '../../../ui/FormularioUsuario'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Confirmar registro - ${siteName()}`,
  description: 'Confirmar solicitud de autorregistro',
}

export default async function ConfirmarSolicitudRegistroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <FormularioUsuario solicitudId={id} />
}
