'use client'

import { useCallback, useEffect, useState } from 'react'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesFlujoTransporteService } from '@/services/analisis'
import type { FlujoTransporteReporteFila } from '@/services/analisis'
import { columnasFlujoTransporte, fondoFilaFlujoTransporte } from './columnasFlujoTransporte'

interface Props {
  idColor: number
}

const LIMITE_DEFAULT = 10

/** Tab por color de parametricas.color: misma grilla, filtrada y paginada por idColor. */
export function ReporteFlujoTransportePorColor({ idColor }: Props) {
  const { Alerta } = useAlerts()

  const [filas, setFilas] = useState<FlujoTransporteReporteFila[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(LIMITE_DEFAULT)
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(
    async (pag: number, lim: number) => {
      setCargando(true)
      try {
        const res = await ReportesFlujoTransporteService.listar({ idColor }, pag, lim)
        if (res?.finalizado) {
          setFilas(res.datos?.filas ?? [])
          setTotal(res.datos?.page?.totalElements ?? 0)
        }
      } catch (e) {
        Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      } finally {
        setCargando(false)
      }
    },
    [idColor, Alerta],
  )

  useEffect(() => {
    setPagina(1)
    void cargar(1, limite)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idColor])

  const handleCambioPagina = (p: number) => {
    setPagina(p)
    void cargar(p, limite)
  }

  const handleCambioLimite = (l: number) => {
    setLimite(l)
    setPagina(1)
    void cargar(1, l)
  }

  return (
    <div className="panel p-0">
      <VristoDataTable<FlujoTransporteReporteFila>
        rows={filas}
        total={total}
        page={pagina}
        limit={limite}
        onPageChange={handleCambioPagina}
        onLimitChange={handleCambioLimite}
        columns={columnasFlujoTransporte}
        loading={cargando}
        rowStyle={(row) => ({ backgroundColor: fondoFilaFlujoTransporte(row.colorHex) })}
      />
    </div>
  )
}
