'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import IconDownload from '@/components/Icon/IconDownload'

import { ActuacionesApi } from '../api/actuaciones.api'
import type { ActuacionRow } from '../types/actuaciones.types'
import { formatFecha } from '../../utils/fechas'
import { PdfVistaPreviaDialog } from '../../components/PdfVistaPreviaDialog'

type Props = {
  casoId: number
}

export function ConclusionCaso({ casoId }: Props) {
  const [actuaciones, setActuaciones] = useState<ActuacionRow[]>([])
  const [opId, setOpId] = useState<number | null>(null)
  const [tipologias, setTipologias] = useState('')
  const [verbosRectores, setVerbosRectores] = useState('')
  const [etapasCiclo, setEtapasCiclo] = useState('')
  const [reporteVistaPreviaOpen, setReporteVistaPreviaOpen] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    let activo = true
    ActuacionesApi.listarActuaciones(casoId, { pagina: 1, limite: 50 })
      .then((res) => {
        if (activo) setActuaciones(res.filas ?? [])
      })
      .catch(() => undefined)
    return () => {
      activo = false
    }
  }, [casoId])

  useEffect(() => {
    if (opId == null) {
      setTipologias('')
      setVerbosRectores('')
      setEtapasCiclo('')
      setMensaje(null)
      return
    }
    const actuacion = actuaciones.find((a) => String(a.opId) === String(opId))
    setTipologias(actuacion?.tipologiasIdentificadas ?? '')
    setVerbosRectores(actuacion?.verbosRectores ?? '')
    setEtapasCiclo(actuacion?.etapasCicloLgi ?? '')
    setMensaje(null)
  }, [opId, actuaciones])

  const isFormValid =
    opId != null &&
    tipologias.trim() !== '' &&
    verbosRectores.trim() !== '' &&
    etapasCiclo.trim() !== ''

  const guardar = async () => {
    if (!isFormValid || opId == null) return
    setGuardando(true)
    setMensaje(null)
    try {
      await ActuacionesApi.actualizarConclusionCaso(opId, {
        tipologiasIdentificadas: tipologias,
        verbosRectores: verbosRectores,
        etapasCicloLgi: etapasCiclo,
      })
      setMensaje('Conclusión del caso guardada correctamente')
    } catch {
      setMensaje('Error al guardar la conclusión del caso. Intente nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
          Actuación realizada *
        </label>
        <Select
          options={actuaciones.map((a) => ({
            value: String(a.opId),
            label: `${a.opNrooper} (${formatFecha(a.opFechainf, 'dd/MM/yyyy')})`,
          }))}
          placeholder="Seleccione la actuación"
          value={opId != null ? String(opId) : ''}
          onChange={(e) => setOpId(Number(e.target.value) || null)}
        />
        <p className="mt-1 text-xs text-gray-500">
          Seleccione la actuación para registrar la conclusión del caso.
        </p>
      </div>

      {mensaje && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="panel space-y-5 p-5">
          {opId == null ? (
            <p className="text-sm text-gray-500">
              Seleccione una actuación para registrar la conclusión.
            </p>
          ) : (
            <>
              <div>
                <h6 className="text-sm font-semibold text-dark dark:text-white-light">
                  Tipologías Identificadas
                </h6>
                <p className="mb-2 text-xs text-gray-500">
                  Tipos de delitos o patrones criminales identificados en el caso.
                </p>
                <textarea
                  className="form-textarea w-full"
                  rows={4}
                  value={tipologias}
                  onChange={(e) => setTipologias(e.target.value)}
                  placeholder="Ej: Lavado de activos, Financiamiento del terrorismo, Corrupción..."
                />
              </div>

              <div>
                <h6 className="text-sm font-semibold text-dark dark:text-white-light">
                  Verbos Rectores
                </h6>
                <p className="mb-2 text-xs text-gray-500">
                  Acciones legales que definen el delito investigado.
                </p>
                <textarea
                  className="form-textarea w-full"
                  rows={4}
                  value={verbosRectores}
                  onChange={(e) => setVerbosRectores(e.target.value)}
                  placeholder="Ej: Lavado, Financiamiento, Cohecha, Extorsión..."
                />
              </div>

              <div>
                <h6 className="text-sm font-semibold text-dark dark:text-white-light">
                  Etapas / Ciclo de LGI
                </h6>
                <p className="mb-2 text-xs text-gray-500">
                  Etapas del ciclo de lavado de activos identificadas.
                </p>
                <textarea
                  className="form-textarea w-full"
                  rows={4}
                  value={etapasCiclo}
                  onChange={(e) => setEtapasCiclo(e.target.value)}
                  placeholder="Ej: Colocación, Integración, Ocultamiento..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="primary"
                  loading={guardando}
                  disabled={!isFormValid || guardando}
                  onClick={guardar}
                >
                  Guardar
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="panel flex flex-col items-center justify-center gap-4 p-5 lg:sticky lg:top-4 lg:self-start">
          <IconDownload className="h-10 w-10 text-gray-400" />
          <p className="text-center text-xs text-gray-500">
            Descargue el reporte de conclusión del caso en formato PDF.
          </p>
          <Button
            type="button"
            variant="outline-primary"
            className="w-full gap-2"
            onClick={() => setReporteVistaPreviaOpen(true)}
          >
            <IconDownload className="h-4 w-4" />
            Descargar Reporte
          </Button>
        </div>
      </div>

      <PdfVistaPreviaDialog
        isOpen={reporteVistaPreviaOpen}
        onClose={() => setReporteVistaPreviaOpen(false)}
        title="Reporte de conclusión del caso"
        obtenerBlob={() => ActuacionesApi.exportarBienesPdf()}
      />
    </div>
  )
}