import { Metadata } from 'next'
import { AsignacionesDatatable } from '@/app/operativos/asignaciones/ui/AsignacionesDatatable'
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
        endpoint="/operativos/casos/usuario/:usuario"
        queryKeyName="asignaciones-aprobadas"
      />
      <AsignacionesDatatable
        title="Asignaciones No Aprobadas"
        endpoint="/operativos/casos/no-aprobados/usuario/:usuario"
        queryKeyName="asignaciones-no-aprobadas"
      />
    </div>
  )
}
