'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDropdown, FormInputText } from '@/components/form'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import { useAlerts } from '@/hooks/useAlerts'
import {
  BienResponse,
  CatalogoBien,
  CatalogoClaseBien,
  CatalogoTipoBien,
  GestionOperativoBienesService,
  GestionOperativoCatalogosService,
} from '@/services/operativos'
import { LookupBasico, SiiiLookupsService } from '@/services/parametricas'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import FormInputImage from '@/components/form/FormInputImage'

const ITEMS_POR_PAGINA = 5

function CaracteristicasPanel({
  idoperativo,
  bien,
}: {
  idoperativo: number
  bien: BienResponse
}) {
  const { Alerta } = useAlerts()
  const { control: controlCaracteristica, handleSubmit: handleSubmitCaracteristica, reset: resetCaracteristica } = useForm({
    defaultValues: {
      idCatalogoCaracteristica: '',
      descripcionCaracteristica: '',
    },
  })

  const [opcionesCaracteristica, setOpcionesCaracteristica] = useState<
    { id: string; value: string; label: string }[]
  >([])
  const [cargandoCaracteristicas, setCargandoCaracteristicas] = useState(false)

  useEffect(() => {
    if (!bien.idCatalogoClase) return
    let activo = true
    const cargarCaracteristicas = async () => {
      setCargandoCaracteristicas(true)
      try {
        const res = await GestionOperativoCatalogosService.obtenerCaracteristicasBien(
          Number(bien.idCatalogoClase)
        )
        if (!activo) return
        if (res?.finalizado) {
          setOpcionesCaracteristica(
            (res.datos ?? []).map((c: any) => ({
              id: String(c.id),
              value: String(c.id),
              label: c.descripcion,
            }))
          )
        }
      } catch {
        if (activo) setOpcionesCaracteristica([])
      } finally {
        if (activo) setCargandoCaracteristicas(false)
      }
    }

    void cargarCaracteristicas()
    return () => { activo = false }
  }, [bien.idCatalogoClase])

  const onSubmitCaracteristica = async (data: {
    idCatalogoCaracteristica: string
    descripcionCaracteristica: string
  }) => {
    if (!idoperativo) return

    try {
      const res = await GestionOperativoBienesService.crearCaracteristica(
        idoperativo,
        Number(bien.id),
        {
          idCatalogoCaracteristica: Number(data.idCatalogoCaracteristica),
          descripcion: data.descripcionCaracteristica,
        }
      )
      if (res?.finalizado) {
        Alerta({
          mensaje: 'Característica registrada correctamente',
          variant: 'success',
        })
        resetCaracteristica()
      } else {
        Alerta({ mensaje: InterpreteMensajes(res), variant: 'error' })
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    }
  }

  return (
    <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Registro de Característica
      </p>
      <form onSubmit={handleSubmitCaracteristica(onSubmitCaracteristica)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormInputDropdown
            id="idCatalogoCaracteristica"
            name="idCatalogoCaracteristica"
            label="Característica"
            control={controlCaracteristica}
            options={opcionesCaracteristica}
            rules={{ required: 'Campo obligatorio' }}
            disabled={cargandoCaracteristicas}
          />
          <FormInputText
            id="descripcionCaracteristica"
            name="descripcionCaracteristica"
            label="Descripción"
            control={controlCaracteristica}
            rules={{ required: 'Campo obligatorio' }}
          />
          <div className="col-span-1 flex items-end md:col-span-2 lg:col-span-1">
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function BienItem({
  bien,
  expandido,
  onToggle,
  onEliminar,
  idoperativo,
}: {
  bien: BienResponse
  expandido: boolean
  onToggle: () => void
  onEliminar: () => void
  idoperativo: number
}) {
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  return (
    <div className="overflow-hidden border border-gray-200 dark:border-gray-700">
      <div
        className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
        onClick={onToggle}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="font-bold text-primary">#{bien.id}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Bien:</span> {bien.descripcionBien}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Tipo:</span> {bien.descripcionCatalogoTipo}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Clase:</span> {bien.descripcionCatalogoClase}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Cantidad:</span> {bien.cantidadBien}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="text-danger"
            onClick={(e) => {
              e.stopPropagation()
              onEliminar()
            }}
          >
            <IconTrashLines />
          </button>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expandido ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
            <div>
              <span className="font-medium text-gray-500">Costo Aprox.:</span> Bs. {bien.costoAproximado}
            </div>
            <div>
              <span className="font-medium text-gray-500">Costo Cuant.:</span> Bs. {bien.costoCuantificado}
            </div>
            <div>
              <span className="font-medium text-gray-500">En Investigación:</span> {bien.enInvestigacion ? 'SI' : 'NO'}
            </div>
            <div>
              <span className="font-medium text-gray-500">Ingreso:</span> {bien.fechaHoraIngreso}
            </div>
            <div>
              <span className="font-medium text-gray-500">Usuario:</span> {bien.usuario}
            </div>
          </div>

          {bien.urlFotoBien && (
            <div className="mb-4">
              <p className="mb-1 text-xs text-gray-500">Foto</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bien.urlFotoBien}
                alt="Bien"
                className="h-20 w-28 cursor-zoom-in rounded object-cover shadow-sm"
                onClick={() => setImagenAmpliada(bien.urlFotoBien ?? null)}
              />
            </div>
          )}

          <CaracteristicasPanel idoperativo={idoperativo} bien={bien} />
        </div>
      )}

      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setImagenAmpliada(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenAmpliada}
              alt="Vista ampliada"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            <button
              type="button"
              className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
              onClick={() => setImagenAmpliada(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface SeccionFormProps {
  titulo: string
  idoperativo?: number
}

export function SeccionBienesForm({ idoperativo = 0 }: SeccionFormProps) {
  const { Alerta } = useAlerts()
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      idBien: '',
      idCatalogoClase: '',
      idCatalogoTipo: '',
      cantidadBien: '',
      costoAproximado: '',
      costoCuantificado: '',
      enInvestigacion: '',
      foto: [],
    },
  })

  const [items, setItems] = useState<BienResponse[]>([])
  const [cargando, setCargando] = useState(false)
  const [bienes, setBienes] = useState<LookupBasico[]>([])
  const [clases, setClases] = useState<CatalogoClaseBien[]>([])
  const [tipos, setTipos] = useState<CatalogoTipoBien[]>([])
  const [expandidoId, setExpandidoId] = useState<string | null>(null)
  const [paginaActual, setPaginaActual] = useState(1)

  const toggleExpandido = (id: string) => {
    setExpandidoId((prev) => (prev === id ? null : id))
  }

  const cargarBienes = useCallback(async () => {
    if (!idoperativo) return
    setCargando(true)
    try {
      const res = await GestionOperativoBienesService.listar(idoperativo)
      if (res?.finalizado) {
        setItems(res.datos?.filas ?? [])
      }
    } finally {
      setCargando(false)
    }
  }, [idoperativo])

  useEffect(() => {
    void cargarBienes()
  }, [cargarBienes])

  useEffect(() => {
    SiiiLookupsService.obtenerBienes().then((res) => {
      if (res?.finalizado) setBienes(res.datos ?? [])
    })
  }, [])

  const onChangeBien = async (idBien: string) => {
    setValue('idCatalogoClase', '')
    setValue('idCatalogoTipo', '')
    setClases([])
    setTipos([])
    if (!idBien) return
    const res = await GestionOperativoCatalogosService.obtenerClasesBien(
      Number(idBien)
    )
    if (res?.finalizado) setClases(res.datos ?? [])
  }

  const onChangeClase = async (idCatalogoClase: string) => {
    setValue('idCatalogoTipo', '')
    setTipos([])
    if (!idCatalogoClase) return
    const res = await GestionOperativoCatalogosService.obtenerTiposBien(
      Number(idCatalogoClase)
    )
    if (res?.finalizado) setTipos(res.datos ?? [])
  }

  const onSubmit = async (data: Record<string, any>) => {
    if (!idoperativo) return
    const fotoBienFile =
      data.fotoBien && data.fotoBien.length > 0 ? data.fotoBien[0] : undefined

    setCargando(true)
    try {
      const res = await GestionOperativoBienesService.crear(idoperativo, {
        idCatalogoTipo: Number(data.idCatalogoTipo),
        cantidadBien: Number(data.cantidadBien),
        costoAproximado: Number(data.costoAproximado),
        costoCuantificado: Number(data.costoCuantificado),
        enInvestigacion: data.enInvestigacion === 'true',
        foto: fotoBienFile,
      })
      if (res?.finalizado) {
        await cargarBienes()
        reset()
        setClases([])
        setTipos([])
      }
    } finally {
      setCargando(false)
    }
  }

  const deleteBien = async (id: string) => {
    if (!idoperativo) return
    try {
      const res = await GestionOperativoBienesService.eliminar(
        idoperativo,
        Number(id)
      )
      if (res?.finalizado) {
        await cargarBienes()
        if (expandidoId === id) {
          setExpandidoId(null)
        }
        Alerta({ mensaje: 'Bien eliminado correctamente', variant: 'success' })
      } else {
        Alerta({ mensaje: InterpreteMensajes(res), variant: 'error' })
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    }
  }


  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(items.length / ITEMS_POR_PAGINA))
  const itemsPagina = items.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  )

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card title="BIENES U OBJETOS SECUESTRADOS">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormInputDropdown
              id="idBien"
              name="idBien"
              label="Bien"
              control={control}
              options={bienes.map((b) => ({
                id: String(b.id),
                value: String(b.id),
                label: b.descripcion,
              }))}
              onChange={(e) => void onChangeBien(e.target.value)}
            />
            <FormInputDropdown
              id="idCatalogoClase"
              name="idCatalogoClase"
              label="Clase"
              control={control}
              disabled={clases.length === 0}
              options={clases.map((c) => ({
                id: String(c.id),
                value: String(c.id),
                label: c.descripcion,
              }))}
              onChange={(e) => void onChangeClase(e.target.value)}
            />
            <FormInputDropdown
              id="idCatalogoTipo"
              name="idCatalogoTipo"
              label="Tipo"
              control={control}
              disabled={tipos.length === 0}
              options={tipos.map((t) => ({
                id: String(t.id),
                value: String(t.id),
                label: t.descripcion,
              }))}
            />
            <FormInputText
              id="cantidadBien"
              name="cantidadBien"
              label="Cantidad"
              control={control}
            />
            <FormInputText
              id="costoAproximado"
              name="costoAproximado"
              label="Costo Aproximado (Bs.)"
              control={control}
            />
            <FormInputText
              id="costoCuantificado"
              name="costoCuantificado"
              label="Costo Cuantificado (Bs.)"
              control={control}
            />
            <FormInputDropdown
              id="enInvestigacion"
              name="enInvestigacion"
              label="En Investigacion?"
              control={control}
              options={[
                { id: 'si', label: 'SI', value: 'true' },
                { id: 'no', label: 'NO', value: 'false' },
              ]}
            />
            <div className="col-span-1 lg:col-span-3">
              <FormInputImage
                id="foto"
                name="foto"
                label="Fotografia del Bien"
                control={control}
                limite={1}
                tiposPermitidos={['image/*']}
              />
            </div>

            <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
              <Button variant="primary" type="submit" disabled={cargando}>
                Agregar Bien
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <Card title="BIENES REGISTRADOS">
        {cargando ? (
          <p className="py-6 text-center text-sm text-gray-400">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            Sin registros
          </p>
        ) : (
          <div className="space-y-0">
            {itemsPagina.map((bien) => (
              <BienItem
                key={bien.id}
                bien={bien}
                expandido={expandidoId === bien.id}
                onToggle={() => toggleExpandido(bien.id)}
                onEliminar={() => void deleteBien(bien.id)}
                idoperativo={idoperativo}
              />
            ))}

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs text-gray-500">
                  Página {paginaActual} de {totalPaginas} — {items.length}{' '}
                  registros
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((p) => p - 1)}
                    className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    ‹ Anterior
                  </button>
                  <button
                    type="button"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual((p) => p + 1)}
                    className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    Siguiente ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
