import { Metadata } from 'next'
import { AsignacionesDatatable } from '@/app/operaciones/operativo/asignaciones/ui/AsignacionesDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
    title: `Asignaciones - ${siteName()}`,
    description: 'Listado de asignaciones del usuario',
}

export default function AsignacionesPage() {
    return <AsignacionesDatatable />
}
