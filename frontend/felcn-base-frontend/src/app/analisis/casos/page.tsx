'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { CasosS2iService, S2iLookupsService } from '@/services/analisis'
import type { CasoS2i, LookupSimple } from '@/services/analisis'
import { TablaCasos } from './ui/TablaCasos'

export default function CasosPage() {
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [casos, setCasos] = useState<CasoS2i[]>([])
  const [etapas, setEtapas] = useState<LookupSimple[]>([])
  const [idEtapaFiltro, setIdEtapaFiltro] = useState<number | undefined>(undefined)

  useEffect(() => {
    S2iLookupsService.listarEtapasInvestigacion()
      .then((r) => { if (r?.finalizado) setEtapas(r.datos ?? []) })
      .catch(() => { })
  }, [])

  const cargar = useCallback(async (idEtapa?: number) => {
    setCargando(true)
    try {
      const res = await CasosS2iService.listar(idEtapa)
      if (res?.finalizado) setCasos(res.datos ?? [])
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }, [Alerta])

  useEffect(() => { void cargar(idEtapaFiltro) }, [cargar, idEtapaFiltro])

  const seleccionarEtapa = (id: number | undefined) => {
    setIdEtapaFiltro(id)
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />

      <div className="panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-lg font-semibold dark:text-white-light">Investigaciones S2I</h5>
          <Link href="/analisis/casos/nuevo">
            <Button variant="success" size="sm">+ Nuevo Caso</Button>
          </Link>
        </div>

        {/* Filtros por etapa */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={idEtapaFiltro === undefined ? 'primary' : 'outline-primary'}
            onClick={() => seleccionarEtapa(undefined)}
          >
            Todos
          </Button>
          {etapas.map((e) => (
            <Button
              key={e.id}
              size="sm"
              variant={idEtapaFiltro === Number(e.id) ? 'primary' : 'outline-primary'}
              onClick={() => seleccionarEtapa(Number(e.id))}
            >
              {e.descripcion}
            </Button>
          ))}
        </div>

        <TablaCasos casos={casos} cargando={cargando} onRecargar={() => void cargar(idEtapaFiltro)} />
      </div>
    </div>
  )
}
