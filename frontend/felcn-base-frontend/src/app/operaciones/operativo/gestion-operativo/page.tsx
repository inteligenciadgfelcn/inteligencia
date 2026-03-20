import type { Metadata } from 'next'
import { siteName } from '@/utils'
import { GestionOperativoListado } from './ui/GestionOperativoListado'

export const metadata: Metadata = {
    title: `Gestion Operativo - ${siteName()}`,
    description: 'Listado de registros de gestion operativo',
}

export default function GestionOperativoPage() {
    return (
        <div className="space-y-6">
            <GestionOperativoListado 
                tipo="no-aprobado" 
                titulo="Gestión de Operativos - No Aprobados" 
            />
            <GestionOperativoListado 
                tipo="aprobado" 
                titulo="Gestión de Operativos - Aprobados" 
            />
        </div>
    )
}
