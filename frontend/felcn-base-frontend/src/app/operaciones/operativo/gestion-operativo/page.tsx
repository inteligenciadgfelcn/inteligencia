import type { Metadata } from 'next'
import { siteName } from '@/utils'
import { GestionOperativoListado } from './ui/GestionOperativoListado'

export const metadata: Metadata = {
    title: `Gestion Operativo - ${siteName()}`,
    description: 'Listado de registros de gestion operativo',
}

export default function GestionOperativoPage() {
    return <GestionOperativoListado />
}
