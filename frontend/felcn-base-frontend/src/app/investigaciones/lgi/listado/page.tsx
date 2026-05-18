'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function LgiListadoPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="panel flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Registros LGI
        </h2>
        <Button variant="outline-primary" onClick={() => router.push('/investigacion/lgi')}>
          Volver
        </Button>
      </div>

      <div className="panel p-8 text-center italic text-gray-500">
        Listado de registros LGI — en desarrollo.
      </div>
    </div>
  )
}
