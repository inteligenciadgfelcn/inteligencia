'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ListadoCasosParalelos } from '../ui/ListadoCasosParalelos'

export default function InvestigacionListadoPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="panel flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Casos Paralelos Registrados
        </h2>
        <Button variant="outline-primary" onClick={() => router.push('/investigaciones/paralelo')}>
          Registrar Nuevo
        </Button>
      </div>

      <ListadoCasosParalelos />
    </div>
  )
}
