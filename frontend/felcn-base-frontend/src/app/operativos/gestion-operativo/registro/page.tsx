import type { Metadata } from 'next'
import { siteName } from '@/utils'
import { FormGestionOperativo } from './ui/FormGestionOperativo'

export const metadata: Metadata = {
  title: `Registro Gestion Operativo - ${siteName()}`,
  description: 'Formulario de registro y edicion de gestion operativo',
}

interface RegistroPageProps {
  searchParams: Promise<{
    id?: string
  }>
}

export default async function RegistroGestionOperativoPage({
  searchParams,
}: RegistroPageProps) {
  const params = await searchParams
  return <FormGestionOperativo idGestionOperativo={params.id} />
}
