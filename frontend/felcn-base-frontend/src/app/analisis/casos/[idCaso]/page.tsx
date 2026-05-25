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

const TABS = ['Blancos', 'Organizaciones', 'Bienes'] as const
type Tab = typeof TABS[number]

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
                <span>{caso.descripcionPais} · {caso.lugar}</span>
                <span className="mx-2">|</span>
                <span>{caso.descripcionEstadoCaso}</span>
                <span className="mx-2">|</span>
                <span>{caso.descripcionEtapa}</span>
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
        <div className="mb-4 flex gap-2 border-b border-[#e0e6ed] dark:border-gray-700">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Blancos' && <SeccionBlancos idCaso={idCaso} />}
        {tab === 'Organizaciones' && <SeccionOrganizaciones idCaso={idCaso} />}
        {tab === 'Bienes' && <SeccionBienes idCaso={idCaso} />}
      </div>
    </div>
  )
}
