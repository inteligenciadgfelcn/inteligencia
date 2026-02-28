import { Metadata } from 'next'
import { AsignacionesDatatable } from '@/app/operaciones/operativo/asignaciones/ui/AsignacionesDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
    title: `Asignaciones - ${siteName()}`,
    description: 'Listado de asignaciones del usuario',
}

export default function AsignacionesPage() {
    return (
        <div className="flex flex-col gap-6">
            <AsignacionesDatatable
                title="Asignaciones Aprobadas"
                endpoint="/asignaciones/usuario/admin"
                queryKeyName="asignaciones-aprobadas"
            />
            <AsignacionesDatatable
                title="Asignaciones No Aprobadas"
                endpoint="/asignaciones/usuario/admin/no-aprobados"
                queryKeyName="asignaciones-no-aprobadas"
            />
        </div>
    )
}
