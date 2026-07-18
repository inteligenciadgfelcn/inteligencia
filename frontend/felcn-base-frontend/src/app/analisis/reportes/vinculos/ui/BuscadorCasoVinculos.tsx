'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesS2iService } from '@/services/analisis'
import type { CasoReporteS2i } from '@/services/analisis'

interface Props {
  onCasoSeleccionado: (caso: CasoReporteS2i) => void
  cargando?: boolean
}

export function BuscadorCasoVinculos({ onCasoSeleccionado, cargando }: Props) {
  const { Alerta } = useAlerts()
  const [termino, setTermino] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [buscado, setBuscado] = useState(false)
  const [resultados, setResultados] = useState<CasoReporteS2i[]>([])

  const buscar = async () => {
    if (!termino.trim()) return
    setBuscando(true)
    setBuscado(false)
    try {
      const res = await ReportesS2iService.listar({})
      if (res?.finalizado) {
        const q = termino.trim().toLowerCase()
        const coincidencias = (res.datos ?? []).filter(
          (c) =>
            c.nombreCaso?.toLowerCase().includes(q) ||
            c.nroCasoCer?.toLowerCase().includes(q),
        )
        setResultados(coincidencias)
        setBuscado(true)
        if (coincidencias.length === 1) {
          onCasoSeleccionado(coincidencias[0])
        }
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="panel px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">
            Nombre del Caso o Nro. de Caso CER
          </label>
          <Input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Ej. OPERACIÓN CONDOR o CER-2025-001"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void buscar()
              }
            }}
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          type="button"
          onClick={() => void buscar()}
          disabled={buscando || cargando || !termino.trim()}
          loading={buscando}
        >
          Buscar
        </Button>
      </div>

      {buscado && resultados.length === 0 && (
        <p className="mt-3 text-xs italic text-gray-400">
          No se encontraron casos con ese nombre o número.
        </p>
      )}

      {buscado && resultados.length > 1 && (
        <div className="mt-3 max-h-52 overflow-y-auto rounded border border-[#e0e6ed] dark:border-[#1b2e4b]">
          {resultados.map((c) => (
            <button
              key={c.idCaso}
              type="button"
              className="flex w-full items-center justify-between gap-2 border-b border-[#e0e6ed] px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50 dark:border-[#1b2e4b] dark:hover:bg-[#1b2e4b]/40"
              onClick={() => onCasoSeleccionado(c)}
            >
              <span className="font-medium">{c.nombreCaso}</span>
              <span className="badge badge-outline-primary text-xs">{c.nroCasoCer || '-'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
