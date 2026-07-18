'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { PanelConductor } from './ui/PanelConductor'
import { PanelTransporte } from './ui/PanelTransporte'
import { SeccionFlujoTransporte } from './ui/SeccionFlujoTransporte'
import type { ConductorS2i, TransporteS2i } from '@/services/analisis'

export default function FlujoTransportePage() {
  const router = useRouter()

  const [conductor, setConductor] = useState<ConductorS2i | null>(null)
  const [transporte, setTransporte] = useState<TransporteS2i | null>(null)
  const [resetToken, setResetToken] = useState(0)

  const registrarOtro = () => {
    setConductor(null)
    setTransporte(null)
    setResetToken((t) => t + 1)
  }

  return (
    <div className="space-y-4">
      <div className="panel">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h5 className="text-lg font-semibold dark:text-white-light">Flujo de Transporte</h5>
            <p className="mt-1 text-xs text-gray-500">
              Busque una persona por documento y un vehículo por placa para resolver el
              conductor y el transporte, luego complete el lugar, color y datos del viaje
              para registrar el flujo de transporte en felcn_s2i.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/analisis/transporte/reportes">
              <Button variant="outline-primary" size="sm">Reporte de Flujo de Transporte</Button>
            </Link>
            <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>
              ← Volver
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelConductor key={`conductor-${resetToken}`} onResuelto={setConductor} />
        <PanelTransporte key={`transporte-${resetToken}`} onResuelto={setTransporte} />
      </div>

      <SeccionFlujoTransporte
        key={`flujo-${resetToken}`}
        conductor={conductor}
        transporte={transporte}
        onRegistrado={registrarOtro}
      />
    </div>
  )
}
