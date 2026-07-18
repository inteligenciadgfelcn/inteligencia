'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { CasosS2iService } from '@/services/analisis'
import type { CasoS2i } from '@/services/analisis'
import { SeccionBlancos } from './ui/SeccionBlancos'
import { SeccionOrganizaciones } from './ui/SeccionOrganizaciones'
import { SeccionBienes } from './ui/SeccionBienes'

import IconUsers from '@/components/Icon/IconUsers'
import IconUsersGroup from '@/components/Icon/IconUsersGroup'
import IconCashBanknotes from '@/components/Icon/IconCashBanknotes'

// Tabs de Telefonía y Vehículos ocultos a pedido de negocio (SeccionTelefonos/
// SeccionVehiculos se mantienen sin usar por si se reactivan más adelante).
const TABS = [
  { key: 'Blancos', label: 'Blancos', Icon: IconUsers },
  { key: 'Organizaciones', label: 'Organizaciones', Icon: IconUsersGroup },
  { key: 'Bienes', label: 'Bienes', Icon: IconCashBanknotes },
] as const
type Tab = typeof TABS[number]['key']

const formatFecha = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DetalleCasoPage() {
  const params = useParams()
  const router = useRouter()
  const idCaso = String(params?.idCaso ?? '')

  const [caso, setCaso] = useState<CasoS2i | null>(null)
  const [cargando, setCargando] = useState(true)
  const [tab, setTab] = useState<Tab>('Blancos')

  useEffect(() => {
    if (!idCaso) return
    CasosS2iService.buscarPorId(idCaso)
      .then((r) => { if (r?.finalizado) setCaso(r.datos) })
      .catch(() => { })
      .finally(() => setCargando(false))
  }, [idCaso])

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />

      {/* ── Encabezado del caso ── */}
      <div className="panel">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h5 className="text-lg font-semibold dark:text-white-light">
              {caso?.nombreCaso ?? 'Cargando...'}
            </h5>
            {caso && (
              <p className="mt-1 text-xs text-gray-500">
                {caso.nroCasoCer && <span className="mr-3 font-medium text-primary">{caso.nroCasoCer}</span>}
                <span>{caso.pais.descripcion} · {caso.lugar}</span>
                <span className="mx-2">|</span>
                <span>{caso.estadoCaso.descripcion}</span>
                <span className="mx-2">|</span>
                <span>{caso.etapaInvestigacion.descripcion}</span>
                <span className="mx-2">|</span>
                <span>Inicio: {formatFecha(caso.fechaInicio)}</span>
              </p>
            )}
          </div>
          <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>
            ← Volver
          </Button>
        </div>

        {caso?.antecedentes && (
          <div className="mt-2 rounded bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <span className="font-semibold">Antecedentes: </span>{caso.antecedentes}
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="panel">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-[#e0e6ed] dark:border-gray-700">
          {TABS.map((t) => {
            const Icon = t.Icon
            const activa = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`-mb-px flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${activa
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'Blancos' && <SeccionBlancos idCaso={idCaso} />}
        {tab === 'Organizaciones' && <SeccionOrganizaciones idCaso={idCaso} />}
        {tab === 'Bienes' && <SeccionBienes idCaso={idCaso} />}
      </div>
    </div>
  )
}
