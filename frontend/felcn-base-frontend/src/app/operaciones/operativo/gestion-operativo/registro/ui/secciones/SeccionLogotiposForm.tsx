'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputFile, FormInputText } from '@/components/form'
import IconTrashLines from '@/components/Icon/IconTrashLines'

import {
  GestionOperativoDrogasService,
  GestionOperativoLogotiposService,
  LogotipoCasoPayload,
  ResponseDroga,
} from '@/services/operativos'

interface SeccionLogotiposFormProps {
  titulo: string
  idoperativo?: number
}

function ImagenAutenticada({
  path,
  alt,
  className,
  onClick,
}: {
  path: string
  alt: string
  className?: string
  onClick?: (src: string) => void
}) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string

    GestionOperativoDrogasService.obtenerFoto(path)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => setSrc(null))

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [path])

  if (!src) return null
  // blob URLs no son compatibles con next/image — se usa <img> intencionalmente
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={onClick ? `${className ?? ''} cursor-zoom-in` : className}
      onClick={() => onClick?.(src)}
    />
  )
}

export function SeccionLogotiposForm({
  idoperativo = 0,
}: SeccionLogotiposFormProps) {
  const {
    control: controlLogos,
    handleSubmit: handleSubmitLogos,
    reset: resetLogos,
  } = useForm({
    defaultValues: {
      imagen: '',
      descripcionLogo: '',
      organizacion: '',
      blanco: '',
      observacion: '',
      fotografia: [],
    },
  })

  const [drogasItems, setDrogasItems] = useState<ResponseDroga[]>([])
  const [logotiposItems, setLogotiposItems] = useState<LogotipoCasoPayload[]>([])
  const [cargandoDrogas, setCargandoDrogas] = useState(false)
  const [cargandoLogotipos, setCargandoLogotipos] = useState(false)

  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  const cargarDrogas = async () => {
    if (!idoperativo) return
    setCargandoDrogas(true)
    try {
      const res = await GestionOperativoDrogasService.listar(idoperativo)
      if (res?.finalizado) {
        setDrogasItems(res.datos?.filas ?? [])
      }
    } finally {
      setCargandoDrogas(false)
    }
  }

  const cargarLogotipos = async (idDroga: number) => {
    if (!idoperativo || !idDroga) return
    setCargandoLogotipos(true)
    try {
      const res = await GestionOperativoLogotiposService.listar(idoperativo, idDroga)
      if (res?.finalizado) {
        setLogotiposItems(res.datos ? (res.datos as LogotipoCasoPayload[]) : [])
      }
    } finally {
      setCargandoLogotipos(false)
    }
  }

  useEffect(() => {
    void cargarDrogas()
  }, [idoperativo])



  const deleteLogotipoItem = async (id: number) => {
    if (!idoperativo || !drogaSeleccionadaId) return
    await GestionOperativoLogotiposService.eliminar(idoperativo, id)
    await cargarLogotipos(drogaSeleccionadaId)
  }

  const onSubmitLogotipos = async (data: Record<string, any>) => {
    if (!idoperativo || !drogaSeleccionadaId) return

    const fotoLogoFile =
      data.fotografia && data.fotografia.length > 0 ? data.fotografia[0] : undefined

    setCargandoLogotipos(true)
    try {
      const respuesta = await GestionOperativoLogotiposService.crear(
        idoperativo,
        drogaSeleccionadaId,
        {
          id: 0,
          imagen: String(data.imagen ?? ''),
          descripcionLogo: String(data.descripcionLogo ?? ''),
          organizacion: String(data.organizacion ?? ''),
          blanco: data.blanco ? String(data.blanco) : undefined,
          observacion: data.observacion ? String(data.observacion) : undefined,
          fotografia: fotoLogoFile,
        }
      )
      if (respuesta?.finalizado) {
        await cargarLogotipos(drogaSeleccionadaId)
        resetLogos()
      }
    } finally {
      setCargandoLogotipos(false)
    }
  }

  return (
    <div className="space-y-5">
     
      {/* ── Panel de logotipos (visible al seleccionar una droga) ── */}
      {drogaSeleccionadaId && (
        <div className="relative ml-6 border-l-2 border-primary pl-6">
          {/* Conector visual */}
          <div className="absolute -left-[9px] top-5 h-4 w-4 rounded-full border-2 border-primary bg-white dark:bg-black" />

          {/* Cabecera del panel */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                Droga #{drogaSeleccionadaId}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Logotipos asociados
              </span>
            </div>
        
          </div>

          <div className="space-y-4">
            {/* Formulario de logotipo */}
            <form onSubmit={handleSubmitLogos(onSubmitLogotipos)}>
              <Card title="REGISTRAR LOGOTIPO">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormInputText
                    id="imagen"
                    name="imagen"
                    label="Imagen"
                    control={controlLogos}
                  />
                  <FormInputText
                    id="descripcionLogo"
                    name="descripcionLogo"
                    label="Descripcion del Logo"
                    control={controlLogos}
                  />
                  <FormInputText
                    id="organizacion"
                    name="organizacion"
                    label="Organizacion Criminal"
                    control={controlLogos}
                  />
                  <FormInputText
                    id="blanco"
                    name="blanco"
                    label="Posibles Blancos"
                    control={controlLogos}
                  />
                  <FormInputText
                    id="observacion"
                    name="observacion"
                    label="Observacion"
                    control={controlLogos}
                  />
                  <div className="hidden lg:block" />

                  <div className="col-span-1 lg:col-span-3">
                    <FormInputFile
                      id="fotografia"
                      name="fotografia"
                      label="Fotografia"
                      control={controlLogos}
                      limite={1}
                      tiposPermitidos={['image/*']}
                    />
                  </div>

                  <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={cargandoLogotipos}
                    >
                      Guardar Logotipo
                    </Button>
                  </div>
                </div>
              </Card>
            </form>

            {/* Tabla de logotipos */}
            <Card title="LOGOTIPOS REGISTRADOS">
              <div className="datatables">
                <DataTable
                  withTableBorder={false}
                  className="table-hover whitespace-nowrap"
                  fetching={cargandoLogotipos}
                  records={logotiposItems}
                  columns={[
                    { accessor: 'id', title: '#' },
                    {
                      accessor: 'descripcionLogo',
                      title: 'Descripcion',
                      render: (row) => String(row.descripcionLogo ?? ''),
                    },
                    {
                      accessor: 'organizacion',
                      title: 'Organizacion',
                      render: (row) => String(row.organizacion ?? ''),
                    },
                    {
                      accessor: 'blanco',
                      title: 'Blancos',
                      render: (row) => String(row.blanco ?? ''),
                    },
                    {
                      accessor: 'observacion',
                      title: 'Observacion',
                      render: (row) => String(row.observacion ?? ''),
                    },
                    {
                      accessor: 'foto',
                      title: 'Foto',
                      render: (row) => {
                        const fotoUrl =
                          (row as unknown as Record<string, unknown>).fotografiaUrl ??
                          (row as unknown as Record<string, unknown>).urlFotografia
                        return typeof fotoUrl === 'string' && fotoUrl.length > 0 ? (
                          <ImagenAutenticada
                            path={fotoUrl}
                            alt="Logotipo"
                            className="h-14 w-20 rounded object-cover shadow-sm"
                            onClick={setImagenAmpliada}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )
                      },
                    },
                    {
                      accessor: 'actions',
                      title: '',
                      render: (row) => (
                        <button
                          type="button"
                          className="text-danger"
                          onClick={() => {
                            void deleteLogotipoItem(row.id)
                          }}
                        >
                          <IconTrashLines />
                        </button>
                      ),
                    },
                  ]}
                  highlightOnHover
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
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
