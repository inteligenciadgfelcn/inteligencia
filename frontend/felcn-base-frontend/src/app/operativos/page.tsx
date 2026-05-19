

'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { GestionOperativoTabs } from './ui/GestionOperativoTabs'

export default function GestionOperativoPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="panel px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Gestión Operativo - Casos Registrados
        </h2>
      </div>

      <GestionOperativoTabs />
    </div>
  )
}
