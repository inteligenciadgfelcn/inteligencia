'use client'

import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'

import { ParametricasLgiApi } from '../../(parametricas)/api/parametricas-apd.api'
import type { CatalogoConclusionLgi } from '../../(parametricas)/types/parametricas-apd.types'
import { ConclusionCasoApi } from '../api/conclusion-caso-apd.api'

import { abrirPdfEnNuevaPestana } from '@/utils/peticion'

type Props = {
  casoId: number
}

type Mensaje = {
  tipo: 'exito' | 'error'
  texto: string
} | null

function alternar(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((valor) => valor !== id) : [...ids, id]
}

type GrupoCheckboxProps = {
  titulo: string
  descripcion: string
  opciones: CatalogoConclusionLgi[]
  seleccionados: string[]
  onToggle: (id: string) => void
  columnas?: 1 | 2
  cargando?: boolean
}

function GrupoCheckboxes({
  titulo,
  descripcion,
  opciones,
  seleccionados,
  onToggle,
  columnas = 1,
  cargando = false,
}: GrupoCheckboxProps) {
  return (
    <div className="rounded border border-gray-300 p-4 dark:border-[#1b2e4b]">
      <h6 className="text-sm font-semibold text-dark dark:text-white-light">
        {titulo}
      </h6>
      <p className="mb-3 mt-1 text-xs text-gray-500">{descripcion}</p>

      {cargando ? (
        <p className="text-xs text-gray-500">Cargando catálogo…</p>
      ) : opciones.length === 0 ? (
        <p className="text-xs text-gray-500">Sin opciones disponibles.</p>
      ) : (
        <div
          className={
            columnas === 2
              ? 'grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2'
              : 'flex flex-col gap-1'
          }
        >
          {opciones.map((opcion) => {
            const marcado = seleccionados.includes(String(opcion.id))

            return (
              <label
                key={String(opcion.id)}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  checked={marcado}
                  onChange={() => onToggle(String(opcion.id))}
                />
                <span>{opcion.descripcion}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ConclusionCaso({ casoId }: Props) {
  const queryClient = useQueryClient()

  const [cicloIds, setCicloIds] = useState<string[]>([])
  const [verboRectorIds, setVerboRectorIds] = useState<string[]>([])
  const [tipologiaIds, setTipologiaIds] = useState<string[]>([])
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<Mensaje>(null)

  const {
    data: ciclos = [],
    isLoading: cargandoCiclos,
    isError: errorCiclos,
  } = useQuery<CatalogoConclusionLgi[]>({
    queryKey: ['lgi-conclusion-caso', 'catalogos', 'ciclos'],
    queryFn: () => ParametricasLgiApi.listarCiclos(),
    staleTime: Infinity,
  })

  const {
    data: verbosRectores = [],
    isLoading: cargandoVerbos,
    isError: errorVerbos,
  } = useQuery<CatalogoConclusionLgi[]>({
    queryKey: ['lgi-conclusion-caso', 'catalogos', 'verbos-rectores'],
    queryFn: () => ParametricasLgiApi.listarVerbosRectores(),
    staleTime: Infinity,
  })

  const {
    data: tipologias = [],
    isLoading: cargandoTipologias,
    isError: errorTipologias,
  } = useQuery<CatalogoConclusionLgi[]>({
    queryKey: ['lgi-conclusion-caso', 'catalogos', 'tipologias'],
    queryFn: () => ParametricasLgiApi.listarTipologias(),
    staleTime: Infinity,
  })

  const {
    data: conclusion,
    isLoading: cargandoConclusion,
    isError: errorConclusion,
  } = useQuery({
    queryKey: ['lgi-conclusion-caso', casoId],
    queryFn: () => ConclusionCasoApi.obtenerConclusionCaso(casoId),
    enabled: Boolean(casoId),
  })

  useEffect(() => {
    if (!conclusion) return
    setCicloIds((conclusion.ciclos ?? []).map((item) => String(item.id)))
    setVerboRectorIds(
      (conclusion.verbosRectores ?? []).map((item) => String(item.id))
    )
    setTipologiaIds(
      (conclusion.tipologias ?? []).map((item) => String(item.id))
    )
  }, [conclusion])

  const cargandoCatalogos =
    cargandoCiclos || cargandoVerbos || cargandoTipologias
  const errorCatalogos = errorCiclos || errorVerbos || errorTipologias

  const guardar = async () => {
    setGuardando(true)
    setMensaje(null)
    try {
      const resultado = await ConclusionCasoApi.guardarConclusionCaso({
        casoId: String(casoId),
        cicloIds,
        verboRectorIds,
        tipologiaIds,
      })
      setCicloIds((resultado.ciclos ?? []).map((item) => String(item.id)))
      setVerboRectorIds(
        (resultado.verbosRectores ?? []).map((item) => String(item.id))
      )
      setTipologiaIds(
        (resultado.tipologias ?? []).map((item) => String(item.id))
      )
      await queryClient.invalidateQueries({
        queryKey: ['lgi-conclusion-caso', casoId],
      })
      setMensaje({
        tipo: 'exito',
        texto: 'Conclusión del caso guardada correctamente',
      })
    } catch {
      setMensaje({
        tipo: 'error',
        texto: 'Error al guardar la conclusión del caso. Intente nuevamente.',
      })
    } finally {
      setGuardando(false)
    }
  }

  const abrirReporte = async () => {
    setMensaje(null)
    try {
      await abrirPdfEnNuevaPestana(() =>
        ConclusionCasoApi.exportarConclusionCasoPdf(casoId)
      )
    } catch {
      setMensaje({
        tipo: 'error',
        texto:
          'No se pudo abrir el reporte. Verifique que su navegador permita pestañas emergentes.',
      })
    }
  }

  const reintentarCatalogos = () => {
    void queryClient.invalidateQueries({
      queryKey: ['lgi-conclusion-caso', 'catalogos'],
    })
  }

  const reintentarConclusion = () => {
    setMensaje(null)
    void queryClient.invalidateQueries({
      queryKey: ['lgi-conclusion-caso', casoId],
    })
  }

  return (
    <div className="space-y-4">
      {mensaje && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            mensaje.tipo === 'exito'
              ? 'border-success/30 bg-success/5 text-success'
              : 'border-danger/30 bg-danger/5 text-danger'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="panel space-y-5 p-5">
          {errorCatalogos && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              <span>No se pudieron cargar los catálogos de la conclusión.</span>
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={reintentarCatalogos}
              >
                Reintentar
              </Button>
            </div>
          )}

          {errorConclusion && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              <span>
                No se pudo cargar la conclusión guardada del caso. No se permite
                guardar hasta recuperar los datos.
              </span>
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={reintentarConclusion}
              >
                Reintentar
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GrupoCheckboxes
              titulo="Etapas/Ciclos LGI"
              descripcion="Etapas del ciclo de lavado de activos identificadas en el caso."
              opciones={ciclos}
              seleccionados={cicloIds}
              onToggle={(id) => setCicloIds((actual) => alternar(actual, id))}
              cargando={cargandoCiclos}
            />

            <GrupoCheckboxes
              titulo="Verbos rectores"
              descripcion="Acciones que definen el delito investigado."
              opciones={verbosRectores}
              seleccionados={verboRectorIds}
              onToggle={(id) =>
                setVerboRectorIds((actual) => alternar(actual, id))
              }
              columnas={2}
              cargando={cargandoVerbos}
            />
          </div>

          <GrupoCheckboxes
            titulo="Tipologías investigadas"
            descripcion="Tipos de delitos o patrones criminales identificados en el caso."
            opciones={tipologias}
            seleccionados={tipologiaIds}
            onToggle={(id) => setTipologiaIds((actual) => alternar(actual, id))}
            cargando={cargandoTipologias}
          />

          <div className="flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-[#1b2e4b]">
            <Button
              type="button"
              variant="primary"
              loading={guardando}
              disabled={
                guardando ||
                cargandoConclusion ||
                cargandoCatalogos ||
                errorConclusion ||
                errorCatalogos
              }
              onClick={guardar}
            >
              Guardar
            </Button>
            <span className="text-xs text-gray-500">
              {guardando
                ? 'Procesando…'
                : errorConclusion || errorCatalogos
                  ? 'Corrija los errores de carga antes de guardar.'
                  : cargandoConclusion || cargandoCatalogos
                    ? 'Cargando datos…'
                    : 'Puede guardar aunque algún grupo no tenga selecciones.'}
            </span>
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
            onClick={abrirReporte}
          >
            <IconDownload className="h-4 w-4" />
            Descargar reporte de conclusión
          </Button>
        </div>
      </div>
    </div>
  )
}
