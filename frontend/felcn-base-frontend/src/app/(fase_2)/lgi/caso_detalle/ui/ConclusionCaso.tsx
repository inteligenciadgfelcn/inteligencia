'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'
import IconInfoTriangle from '@/components/Icon/IconInfoTriangle'

type Props = {
  casoId: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ConclusionCaso({ casoId }: Props) {
  const [tipologias, setTipologias] = useState('')
  const [verbosRectores, setVerbosRectores] = useState('')
  const [etapasCiclo, setEtapasCiclo] = useState('')
  const [modalPermisoOpen, setModalPermisoOpen] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const isFormValid =
    tipologias.trim() !== '' &&
    verbosRectores.trim() !== '' &&
    etapasCiclo.trim() !== ''

  const guardar = async () => {
    if (!isFormValid) return
    setGuardando(true)
    await new Promise((r) => setTimeout(r, 800))
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="panel space-y-5 p-5">
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
            {guardado && (
              <span className="text-sm font-medium text-success">
                Guardado correctamente
              </span>
            )}
          </div>
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
            onClick={() => setModalPermisoOpen(true)}
          >
            <IconDownload className="h-4 w-4" />
            Descargar Reporte
          </Button>
        </div>
      </div>

      {modalPermisoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning/10">
                <IconInfoTriangle className="h-7 w-7 text-warning" />
              </div>
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Sin Permisos
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                No se tiene permisos para descargar el reporte.
              </p>
            </div>
            <div className="flex justify-center border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="primary"
                onClick={() => setModalPermisoOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
