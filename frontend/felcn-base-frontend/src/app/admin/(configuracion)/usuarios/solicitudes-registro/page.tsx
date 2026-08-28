import { Metadata } from 'next'
import { Suspense } from 'react'
import { SolicitudesRegistroDatatable } from './ui/SolicitudesRegistroDatatable'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Solicitudes de registro - ${siteName()}`,
  description: 'Revisión de solicitudes de autorregistro',
}

export default function SolicitudesRegistroPage() {
  return (
    <Suspense>
      <SolicitudesRegistroDatatable />
    </Suspense>
  )
}
