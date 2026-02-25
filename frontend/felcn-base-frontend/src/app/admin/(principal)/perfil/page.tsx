import { Perfil } from './components/Perfil'
import { Metadata } from 'next'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Perfil - ${siteName()}`,
  description: 'Perfil de usuario del sistema',
}

export default function PerfilPage() {
  return <Perfil />
}
