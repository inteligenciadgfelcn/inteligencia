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
  GestionOperativoLogotiposService,
  LogotipoCasoPayload,
  ResponseDroga,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'
import { useParametricas } from '@/hooks'

interface SeccionFormProps {
  titulo: string
  onGuardar?: (payload: SeccionPayloadBase) => Promise<unknown>
  onRecuperar?: () => Promise<unknown>
  cargando?: boolean
  idCaso?: number
}

function ImagenAutenticada({
  path,
  alt,
  className,
}: {
  path: string
  alt: string
  className?: string
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
  return <img src={src} alt={alt} className={className} />
}

export function SeccionDrogasFotografiaLogotiposForm({
  idCaso = 0,
}: SeccionFormProps) {
  const {
    control: controlDrogas,
    getValues: getDrogasValues,
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
      const res = await GestionOperativoCatalogosService.obtenerEstadosDroga(idTipoDroga)
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
  const [logotiposItems, setLogotiposItems] = useState<LogotipoCasoPayload[]>(
    []
  )
  const [cargandoDrogas, setCargandoDrogas] = useState(false)
  const [cargandoLogotipos, setCargandoLogotipos] = useState(false)
  const [drogaSeleccionadaId, setDrogaSeleccionadaId] = useState<number | null>(
    null
  )

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
    if (!idCaso) return
    setCargandoDrogas(true)
    try {
      const res = await GestionOperativoDrogasService.listar(idCaso)
      if (res?.finalizado) {
        const lista = Array.isArray(res.datos)
          ? (res.datos as ResponseDroga[])
          : []
        setDrogasItems(lista)
      }
    } finally {
      setCargandoDrogas(false)
    }
  }

  const cargarLogotipos = async (idDroga: number) => {
    if (!idCaso || !idDroga) return
    setCargandoLogotipos(true)
    try {
      const res = await GestionOperativoLogotiposService.listar(idCaso, idDroga)
      if (res?.finalizado) {
        setLogotiposItems(res.datos ? (res.datos as LogotipoCasoPayload[]) : [])
      }
    } finally {
      setCargandoLogotipos(false)
    }
  }

  useEffect(() => {
    void cargarDrogas()
  }, [idCaso])

  useEffect(() => {
    if (drogaSeleccionadaId) {
      void cargarLogotipos(drogaSeleccionadaId)
    }
  }, [drogaSeleccionadaId, idCaso])

  const deleteDrogaItem = async (id: number) => {
    if (!idCaso) return
    await GestionOperativoDrogasService.eliminar(idCaso, id)
    await cargarDrogas()
  }

  const deleteLogotipoItem = async (id: number) => {
    if (!idCaso || !drogaSeleccionadaId) return
    await GestionOperativoLogotiposService.eliminar(idCaso, drogaSeleccionadaId, id)
    await cargarLogotipos(drogaSeleccionadaId)
  }

  const onSubmitDrogas = async (data: Record<string, any>) => {
    if (!idCaso) return
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
      const respuesta = await GestionOperativoDrogasService.crear(idCaso, {
        id: 0,
        idTipoDroga: data.idTipoDroga,
        idEstadoDroga: data.idEstadoDroga,
        cantidadGramos: gramos,
        cantidadUnidades: parseNumber(data.cantidadUnidades),
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
        resetDrogas()
        setCantidadTn('')
        setCantidadKg('')
        setCantidadG('')
        setCantidadMg('')
      }
    } finally {
      setCargandoDrogas(false)
    }
  }

  const onSubmitLogotipos = async (data: Record<string, any>) => {
    if (!idCaso || !drogaSeleccionadaId) return

    const fotoLogoFile =
      data.fotografia && data.fotografia.length > 0
        ? data.fotografia[0]
        : undefined

    setCargandoLogotipos(true)
    try {
      const respuesta = await GestionOperativoLogotiposService.crear(
        idCaso,
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
    <div>
      <form onSubmit={handleSubmitDrogas(onSubmitDrogas)}>
        <Card title="DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES">
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
              id="observaciones"
              name="observaciones"
              label="Observaciones"
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
              id="cantidadUnidades"
              name="cantidadUnidades"
              label="Cantidad de Unidades"
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

            <div className="col-span-1 lg:col-span-3">
              <FormInputFile
                id="pruebaCampo"
                name="pruebaCampo"
                label="Fotografia Prueba de Campo"
                control={controlDrogas}
                limite={1}
                tiposPermitidos={['image/*']}
              />
            </div>

            <div className="col-span-1 lg:col-span-3">
              <FormInputFile
                id="pesaje"
                name="pesaje"
                label="Fotografia Cuantificacion y Pesaje"
                control={controlDrogas}
                limite={1}
                tiposPermitidos={['image/*']}
              />
            </div>

            <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
              <Button variant="primary" type="submit" disabled={cargandoDrogas}>
                Guardar
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <Card className="mt-5" title="DATOS DE LA DROGA">
        <div className="datatables">
          <DataTable
            withTableBorder={false}
            className="table-hover whitespace-nowrap"
            records={drogasItems}
            columns={[
              { accessor: 'id', title: 'Id' },
             
              {
                accessor: 'estadoDroga',
                title: 'Estado de la Droga',
                render: (row) =>
                  String(row.idEstadoDroga ?? row.idEstadoDroga ?? ''),
              },
              {
                accessor: 'cantidadGramos',
                title: 'Cantidad (gramos)',
                render: (row) => String(row.cantidadGramos ?? ''),
              },
              {
                accessor: 'cantidadUnidades',
                title: 'Cantidad de Unidades',
                render: (row) => String(row.cantidadUnidades ?? ''),
              },
              {
                accessor: 'formaTransporte',
                title: 'Forma de Transporte',
                render: (row) =>
                  String(row.idFormaTransporte ?? row.idFormaTransporte ?? ''),
              },
              {
                accessor: 'procedencia',
                title: 'Procedencia',
                render: (row) =>
                  String(row.idPaisProcedencia ?? row.idPaisProcedencia ?? ''),
              },
              {
                accessor: 'destino',
                title: 'Destino',
                render: (row) => String(row.idPaisDestino ?? row.idPaisDestino ?? ''),
              },
              {
                accessor: 'actions',
                title: '',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        const idDroga = row.id
                        if (idDroga > 0) {
                          setDrogaSeleccionadaId(idDroga)
                        }
                      }}
                    >
                      Logotipos
                    </Button>
                    <button
                      type="button"
                      className="text-danger"
                      onClick={() => deleteDrogaItem(row.id)}
                    >
                      <IconTrashLines />
                    </button>
                  </div>
                ),
              },
            ]}
            highlightOnHover
          />
        </div>
      </Card>

      <Card
        title="FOTOGRAFIA DE LA PRUEBA DE CAMPO Y LA CUANTIFICACION, PESAJE DE LA SUSTANCIA SECUESTRADA"
        className="mt-5"
      >
        <div className="datatables">
          <DataTable
            withTableBorder={false}
            className="table-hover whitespace-nowrap"
            records={drogasItems}
            columns={[
              { accessor: 'id', title: 'Id' },
         
              {
                accessor: 'pruebaCampo',
                title: 'Prueba de Campo',
                render: (row) =>
                  row.urlFotoPruebaCampo ? (
                    <ImagenAutenticada
                      path={row.urlFotoPruebaCampo}
                      alt="Prueba de Campo"
                      className="h-20 w-32 rounded object-cover shadow-sm"
                    />
                  ) : null,
              },
              {
                accessor: 'pesaje',
                title: 'Cuantificacion y Pesaje',
                render: (row) =>
                  row.urlFotoPesaje ? (
                    <ImagenAutenticada
                      path={row.urlFotoPesaje}
                      alt="Cuantificacion"
                      className="h-20 w-32 rounded object-cover shadow-sm"
                    />
                  ) : null,
              },
            ]}
            highlightOnHover
          />
        </div>
      </Card>

      <form onSubmit={handleSubmitLogos(onSubmitLogotipos)}>
        <Card
          title={
            drogaSeleccionadaId
              ? `LOGOTIPOS (Droga #${drogaSeleccionadaId})`
              : 'LOGOTIPOS'
          }
          className="mt-5"
        >
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
                Guardar Logo
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <Card className="mt-5" title="DETALLE DE LOGOTIPOS">
        <div className="datatables">
          <DataTable
            withTableBorder={false}
            className="table-hover whitespace-nowrap"
            records={logotiposItems}
            columns={[
              { accessor: 'id', title: 'Id' },
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
                  const fotoUrl = (row as unknown as Record<string, unknown>).fotografiaUrl ?? (row as unknown as Record<string, unknown>).urlFotografia
                  return typeof fotoUrl === 'string' && fotoUrl.length > 0 ? (
                    <img
                      src={fotoUrl}
                      alt="Logotipo"
                      className="h-20 w-32 rounded object-cover shadow-sm"
                    />
                  ) : null
                },
              },
              {
                accessor: 'actions',
                title: '',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-danger"
                      onClick={() => deleteLogotipoItem(row.id)}
                    >
                      <IconTrashLines />
                    </button>
                  </div>
                ),
              },
            ]}
            highlightOnHover
          />
        </div>
      </Card>
    </div>
  )
}
