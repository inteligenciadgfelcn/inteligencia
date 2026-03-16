'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormInputDropdown, FormInputText, optionType } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'

import {
  DrogaCasoPayload,
  EstadoDroga,
  GestionOperativoCatalogosService,
  GestionOperativoDrogasService,
  ResponseDroga,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'
import { useParametricas } from '@/hooks'

interface SeccionFormProps {
  titulo: string
  onGuardar?: (payload: SeccionPayloadBase) => Promise<unknown>
  onRecuperar?: () => Promise<unknown>
  cargando?: boolean
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

export function SeccionDrogasFotografiaLogotiposForm({
  idoperativo = 0,
}: SeccionFormProps) {
  const {
    control: controlDrogas,
    handleSubmit: handleSubmitDrogas,
    setValue: setDrogasValue,
    watch: watchDrogas,
    reset: resetDrogas,
  } = useForm({
    defaultValues: {
      idTipoDroga: '',
      idEstadoDroga: '',
      cantidadGramos: '',
      cantidadUnidades: '',
      costo: '',
      idFormaTransporte: '',
      idPaisProcedencia: '',
      idPaisDestino: '',
      observaciones: '',
      pruebaCampo: [],
      pesaje: [],
    },
  })

  const {
    paises,
    tiposDroga,
    cargarPaises,
    cargarTiposDroga,
    formasTransporte,
    cargarFormasTransporte,
  } = useParametricas()

  useEffect(() => {
    cargarPaises(), cargarTiposDroga(), cargarFormasTransporte()
  }, [])

  const opcionesPaises: optionType[] = paises.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: t.descripcion,
  }))
  const opcionesTiposDroga: optionType[] = tiposDroga.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: t.descripcion,
  }))

  const opcionesFormasTransporte: optionType[] = formasTransporte.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: t.descripcion,
  }))

  const tipoDrogaSeleccionada = watchDrogas('idTipoDroga')
  const [estadosDroga, setEstadosDroga] = useState<EstadoDroga[]>([])

  const cargarEstadosDroga = async (idTipoDroga: number) => {
    try {
      const res =
        await GestionOperativoCatalogosService.obtenerEstadosDroga(idTipoDroga)
      if (res?.finalizado) {
        setEstadosDroga(Array.isArray(res.datos) ? res.datos : [])
      }
    } catch {
      setEstadosDroga([])
    }
  }

  useEffect(() => {
    if (tipoDrogaSeleccionada) {
      setDrogasValue('idEstadoDroga', '')
      void cargarEstadosDroga(Number(tipoDrogaSeleccionada))
    } else {
      setEstadosDroga([])
    }
  }, [tipoDrogaSeleccionada])

  const opcionesEstadosDroga: optionType[] = estadosDroga.map((e) => ({
    id: String(e.id),
    value: String(e.id),
    label: e.descripcion,
  }))

  const [drogasItems, setDrogasItems] = useState<ResponseDroga[]>([])
  const [cargandoDrogas, setCargandoDrogas] = useState(false)

  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)
  const [idBolivia, setIdBolivia] = useState('')

  useEffect(() => {
    if (paises.length > 0) {
      const bolivia = paises.find(
        (p) => p.descripcion.trim().toLowerCase() === 'bolivia'
      )
      if (bolivia) {
        setIdBolivia(String(bolivia.id))
        setDrogasValue('idPaisProcedencia', String(bolivia.id))
        setDrogasValue('idPaisDestino', String(bolivia.id))
      }
    }
  }, [paises, setDrogasValue])

  const [cantidadTn, setCantidadTn] = useState('')
  const [cantidadKg, setCantidadKg] = useState('')
  const [cantidadG, setCantidadG] = useState('')
  const [cantidadMg, setCantidadMg] = useState('')

  const parseNumber = (valor: unknown) => {
    if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
    const normalizado = Number(String(valor ?? '').replace(',', '.'))
    return Number.isFinite(normalizado) ? normalizado : 0
  }

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

  useEffect(() => {
    void cargarDrogas()
  }, [idoperativo])

  const deleteDrogaItem = async (id: number) => {
    if (!idoperativo) return
    await GestionOperativoDrogasService.eliminar(idoperativo, id)
    await cargarDrogas()
  }

  const onSubmitDrogas = async (data: Record<string, any>) => {
    if (!idoperativo) return
    const gramos =
      parseNumber(cantidadTn) * 1_000_000 +
      parseNumber(cantidadKg) * 1_000 +
      parseNumber(cantidadG) +
      parseNumber(cantidadMg) / 1000

    const pruebaCampoFile =
      data.pruebaCampo && data.pruebaCampo.length > 0
        ? data.pruebaCampo[0]
        : undefined
    const pesajeFile =
      data.pesaje && data.pesaje.length > 0 ? data.pesaje[0] : undefined

    setCargandoDrogas(true)
    try {
      const respuesta = await GestionOperativoDrogasService.crear(idoperativo, {
        id: 0,
        idTipoDroga: data.idTipoDroga,
        idEstadoDroga: data.idEstadoDroga,
        cantidadGramos: gramos,
        cantidadUnidades: parseNumber(data.cantidadUnidades),
        costo: data.costo !== '' ? parseNumber(data.costo) : undefined,
        idFormaTransporte: data.idFormaTransporte,
        idPaisProcedencia: data.idPaisProcedencia,
        idPaisDestino: data.idPaisDestino,
        observaciones: data.observaciones
          ? String(data.observaciones)
          : undefined,
        pruebaCampo: pruebaCampoFile,
        pesaje: pesajeFile,
      })
      if (respuesta?.finalizado) {
        await cargarDrogas()
        resetDrogas({
          idTipoDroga: '',
          idEstadoDroga: '',
          cantidadGramos: '',
          cantidadUnidades: '',
          costo: '',
          idFormaTransporte: '',
          idPaisProcedencia: idBolivia,
          idPaisDestino: idBolivia,
          observaciones: '',
          pruebaCampo: [],
          pesaje: [],
        })
        setCantidadTn('')
        setCantidadKg('')
        setCantidadG('')
        setCantidadMg('')
      }
    } finally {
      setCargandoDrogas(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* ── 1. Formulario de registro ── */}
      <form onSubmit={handleSubmitDrogas(onSubmitDrogas)}>
        <Card title="REGISTRO DE DROGA">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormInputDropdown
              id="idTipoDroga"
              name="idTipoDroga"
              label="Tipo de Droga"
              control={controlDrogas}
              options={opcionesTiposDroga}
            />
            <FormInputDropdown
              id="idEstadoDroga"
              name="idEstadoDroga"
              label="Estado de la Droga"
              control={controlDrogas}
              options={opcionesEstadosDroga}
            />
            <FormInputText
              id="cantidadUnidades"
              name="cantidadUnidades"
              label="Cantidad de Unidades"
              control={controlDrogas}
            />
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Cantidad
              </label>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">Tn</span>
                  <Input
                    id="cantidadTn"
                    value={cantidadTn}
                    onChange={(event) => setCantidadTn(event.target.value)}
                    size="sm"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">Kg</span>
                  <Input
                    id="cantidadKg"
                    value={cantidadKg}
                    onChange={(event) => setCantidadKg(event.target.value)}
                    size="sm"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">g</span>
                  <Input
                    id="cantidadG"
                    value={cantidadG}
                    onChange={(event) => setCantidadG(event.target.value)}
                    size="sm"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">Mg</span>
                  <Input
                    id="cantidadMg"
                    value={cantidadMg}
                    onChange={(event) => setCantidadMg(event.target.value)}
                    size="sm"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <FormInputText
              id="costo"
              name="costo"
              label="Costo (Bs.)"
              control={controlDrogas}
            />
            <FormInputDropdown
              id="idFormaTransporte"
              name="idFormaTransporte"
              label="Forma de Transporte"
              control={controlDrogas}
              options={opcionesFormasTransporte}
            />
            <FormInputDropdown
              id="idPaisProcedencia"
              name="idPaisProcedencia"
              label="Procedencia"
              control={controlDrogas}
              options={opcionesPaises}
            />
            <FormInputDropdown
              id="idPaisDestino"
              name="idPaisDestino"
              label="Destino"
              control={controlDrogas}
              options={opcionesPaises}
            />
            <FormInputText
              id="observaciones"
              name="observaciones"
              label="Observaciones"
              control={controlDrogas}
            />
            <div className="col-span-1 lg:col-span-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInputFile
                  id="pruebaCampo"
                  name="pruebaCampo"
                  label="Fotografia Prueba de Campo"
                  control={controlDrogas}
                  limite={1}
                  tiposPermitidos={['image/*']}
                />
                <FormInputFile
                  id="pesaje"
                  name="pesaje"
                  label="Fotografia Cuantificacion y Pesaje"
                  control={controlDrogas}
                  limite={1}
                  tiposPermitidos={['image/*']}
                />
              </div>
            </div>

            <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
              <Button variant="primary" type="submit" disabled={cargandoDrogas}>
                Guardar Droga
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* ── 2. Tabla de drogas con fotos integradas ── */}
      <Card title="DROGAS REGISTRADAS">
        <div className="datatables">
          <DataTable
            withTableBorder={false}
            className="table-hover whitespace-nowrap"
            records={drogasItems}
            columns={[
              { accessor: 'id', title: '#' },
              {
                accessor: 'idEstadoDroga',
                title: 'Estado',
                render: (row) => String(row.idEstadoDroga ?? ''),
              },
              {
                accessor: 'cantidadGramos',
                title: 'Gramos',
                render: (row) => String(row.cantidadGramos ?? ''),
              },
              {
                accessor: 'cantidadUnidades',
                title: 'Unidades',
                render: (row) => String(row.cantidadUnidades ?? ''),
              },
              {
                accessor: 'costo',
                title: 'Costo (Bs.)',
                render: (row) => (row.costo != null ? String(row.costo) : '—'),
              },
              {
                accessor: 'idFormaTransporte',
                title: 'Transporte',
                render: (row) => String(row.idFormaTransporte ?? ''),
              },
              {
                accessor: 'idPaisProcedencia',
                title: 'Procedencia',
                render: (row) => String(row.idPaisProcedencia ?? ''),
              },
              {
                accessor: 'idPaisDestino',
                title: 'Destino',
                render: (row) => String(row.idPaisDestino ?? ''),
              },
              {
                accessor: 'urlFotoPruebaCampo',
                title: 'Prueba Campo',
                render: (row) =>
                  row.urlFotoPruebaCampo ? (
                    <ImagenAutenticada
                      path={row.urlFotoPruebaCampo}
                      alt="Prueba de Campo"
                      className="h-14 w-20 rounded object-cover shadow-sm"
                      onClick={setImagenAmpliada}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  ),
              },
              {
                accessor: 'urlFotoPesaje',
                title: 'Pesaje',
                render: (row) =>
                  row.urlFotoPesaje ? (
                    <ImagenAutenticada
                      path={row.urlFotoPesaje}
                      alt="Pesaje"
                      className="h-14 w-20 rounded object-cover shadow-sm"
                      onClick={setImagenAmpliada}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  ),
              },
              {
                accessor: 'actions',
                title: '',
                render: (row) => (
                  <button
                    type="button"
                    className="text-danger"
                    onClick={() => {
                      void deleteDrogaItem(row.id)
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
