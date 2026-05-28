'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { GestionAnalisisTabs } from './ui/GestionAnalisisTabs'

export default function AnalisisPage() {
  return (
    <div className="space-y-6">
      <div className="panel px-5 py-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Casos Investigados
        </h2>
        <Link href="/analisis/casos/nuevo">
          <Button variant="success" size="sm">+ Nuevo</Button>
        </Link>
      </div>

      <GestionAnalisisTabs />
    </div>
  )
}
