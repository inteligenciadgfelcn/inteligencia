'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import IconArrowBackward from '@/components/Icon/IconArrowBackward'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesS2iService } from '@/services/analisis'
import type {
  CasoReporteS2i,
  DetalleCasoPreview,
  VinculosCruzadosCaso,
} from '@/services/analisis'
import { BuscadorCasoVinculos } from './ui/BuscadorCasoVinculos'
import { PanelDetalleNodo } from './ui/PanelDetalleNodo'
import { construirGrafo, fusionarVinculosCruzados, type NodoVinculo } from './ui/construirGrafo'

const GrafoVinculos = dynamic(() => import('./ui/GrafoVinculos'), {
  ssr: false,
  loading: () => (
    <div className="h-[650px] animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
  ),
})

const casoMinimo = (idCaso: string): CasoReporteS2i => ({
  idCaso,
  nroCasoCer: null,
  pais: null,
  lugar: '',
  nombreCaso: '',
  estadoCaso: null,
  etapaInvestigacion: null,
  fechaInicio: '',
  antecedentes: null,
})

export default function VinculosPage() {
  const { Alerta } = useAlerts()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [casoSeleccionado, setCasoSeleccionado] = useState<CasoReporteS2i | null>(null)
  const [detalle, setDetalle] = useState<DetalleCasoPreview | null>(null)
  const [vinculosCruzados, setVinculosCruzados] = useState<VinculosCruzadosCaso | null>(null)
  const [cargando, setCargando] = useState(false)
  const [nodoSeleccionado, setNodoSeleccionado] = useState<NodoVinculo | null>(null)

  const seleccionarCaso = useCallback(
    async (caso: CasoReporteS2i) => {
      setCasoSeleccionado(caso)
      setDetalle(null)
      setVinculosCruzados(null)
      setNodoSeleccionado(null)
      setCargando(true)
      try {
        const [resDetalle, resCruzados] = await Promise.all([
          ReportesS2iService.verDetalle(caso.idCaso),
          ReportesS2iService.verVinculosCruzados(caso.idCaso),
        ])
        if (resDetalle?.finalizado) setDetalle(resDetalle.datos)
        if (resCruzados?.finalizado) setVinculosCruzados(resCruzados.datos)
      } catch (e) {
        Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      } finally {
        setCargando(false)
      }
    },
    [Alerta],
  )

  // Permite llegar directo a un caso desde el nodo "caso externo" de otro diagrama.
  // El query param se limpia apenas se consume para no re-disparar la carga ni
  // pisar una búsqueda manual posterior del usuario.
  useEffect(() => {
    const idCasoUrl = searchParams.get('caso')
    if (idCasoUrl) {
      void seleccionarCaso(casoMinimo(idCasoUrl))
      router.replace('/analisis/reportes/vinculos')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const grafo = useMemo(() => {
    if (!detalle) return null
    const base = construirGrafo(detalle)
    return vinculosCruzados ? fusionarVinculosCruzados(base, vinculosCruzados) : base
  }, [detalle, vinculosCruzados])

  const onSeleccionarNodo = useCallback((nodo: NodoVinculo | null) => {
    setNodoSeleccionado(nodo)
  }, [])

  return (
    <div className="space-y-6">
      <div className="panel flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Diagrama de Vínculos
          </h2>
          <p className="text-xs text-gray-500">
            Visualice las relaciones entre investigados, organizaciones y bienes de un caso.
          </p>
        </div>
        <Link href="/analisis/reportes">
          <Button variant="outline-secondary" size="sm">
            <IconArrowBackward className="mr-1 h-4 w-4" /> Volver a Reportes
          </Button>
        </Link>
      </div>

      <BuscadorCasoVinculos onCasoSeleccionado={seleccionarCaso} cargando={cargando} />

      {!casoSeleccionado && (
        <div className="panel">
          <div className="flex items-center justify-center py-10 text-center text-sm text-gray-400">
            Busque un caso por nombre o número CER para generar su diagrama de vínculos.
          </div>
        </div>
      )}

      {casoSeleccionado && cargando && (
        <div className="panel">
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">
            Cargando datos del caso...
          </div>
        </div>
      )}

      {casoSeleccionado && !cargando && grafo && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <GrafoVinculos datos={grafo} onSeleccionarNodo={onSeleccionarNodo} />
            <p className="mt-2 text-xs text-gray-400">
              Punteado ámbar: vínculo inferido por coincidencia de nombre con el representante
              legal de una organización — verifíquelo antes de usarlo como evidencia. Morado
              punteado: mismo documento/NIT encontrado en otro caso (dato exacto).
            </p>
          </div>
          <div className="lg:col-span-1">
            <PanelDetalleNodo nodo={nodoSeleccionado} onCerrar={() => setNodoSeleccionado(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
