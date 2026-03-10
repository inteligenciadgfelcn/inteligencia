'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormInputDropdown, FormInputText } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import { SiiiLookupsService } from '@/services/parametricas'
import {
  DrogaCasoPayload,
  GestionOperativoCatalogosService,
  GestionOperativoDrogasService,
  GestionOperativoLogotiposService,
  LogotipoCasoPayload,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'

interface SeccionFormProps {
  titulo: string
  onGuardar?: (payload: SeccionPayloadBase) => Promise<unknown>
  onRecuperar?: () => Promise<unknown>
  cargando?: boolean
  idCaso?: number
}

export function SeccionDrogasFotografiaLogotiposForm({
  idCaso = 0,
}: SeccionFormProps) {
  const normalizarValorPais = (valor: string) =>
    valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')

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

  const [opcionesTiposDroga, setOpcionesTiposDroga] = useState([
    { id: 'marihuana', label: 'Marihuana', value: 'marihuana' },
    { id: 'cocaina', label: 'Cocaina', value: 'cocaina' },
  ])
  const [opcionesEstadosDroga, setOpcionesEstadosDroga] = useState([
    { id: 'seco', label: 'Seco', value: 'seco' },
    { id: 'humedo', label: 'Humedo', value: 'humedo' },
  ])
  const [opcionesFormasTransporte, setOpcionesFormasTransporte] = useState([
    { id: 'terrestre', label: 'Terrestre', value: 'terrestre' },
    { id: 'aereo', label: 'Aereo', value: 'aereo' },
    { id: 'fluvial', label: 'Fluvial', value: 'fluvial' },
  ])
  const [opcionesPaises, setOpcionesPaises] = useState([
    { id: 'bolivia', label: 'Bolivia', value: 'bolivia' },
  ])
  const tipoDrogaSeleccionada = watchDrogas('idTipoDroga')

  useEffect(() => {
    let activo = true

    const cargarTiposDroga = async () => {
      try {
        const res = await SiiiLookupsService.obtenerTiposDroga()
        if (!activo || !res?.finalizado) return

        const opciones = (res.datos ?? [])
          .map((item: Record<string, unknown>, index: number) => {
            const idRaw =
              item.id ?? item.codigo ?? item.valor ?? item.value ?? index
            const valueRaw =
              item.valor ?? item.value ?? item.codigo ?? item.id ?? ''
            const labelRaw =
              item.descripcion ??
              item.nombre ??
              item.detalle ??
              item.label ??
              valueRaw

            return {
              id: String(idRaw),
              value: String(valueRaw),
              label: String(labelRaw),
            }
          })
          .filter((opcion) => opcion.value.length > 0)

        if (opciones.length > 0) {
          setOpcionesTiposDroga(opciones)
          const tipoActual = String(getDrogasValues('idTipoDroga') ?? '')
          if (!opciones.some((opcion) => opcion.value === tipoActual)) {
            setDrogasValue('idTipoDroga', opciones[0].value)
          }
        }
      } catch {
        // Mantener fallback local si la consulta falla
      }
    }

    void cargarTiposDroga()

    return () => {
      activo = false
    }
  }, [getDrogasValues, setDrogasValue])

  useEffect(() => {
    let activo = true

    const cargarPaises = async () => {
      try {
        const res = await SiiiLookupsService.obtenerPaises()
        if (!activo || !res?.finalizado) return

        const opciones = (res.datos ?? [])
          .map((item, index) => {
            const descripcion = String(item.descripcion ?? '').trim()
            const id = item.id ? String(item.id) : `pais-${index}`
            const value = normalizarValorPais(descripcion || id)

            return {
              id,
              value,
              label: descripcion || id,
            }
          })
          .filter((opcion) => opcion.label.length > 0)

        if (opciones.length > 0) {
          setOpcionesPaises(opciones)

          const opcionBolivia =
            opciones.find((opcion) => opcion.value === 'bolivia') ?? opciones[0]
          const procedenciaActual = String(
            getDrogasValues('idPaisProcedencia') ?? ''
          )
          const destinoActual = String(getDrogasValues('idPaisDestino') ?? '')

          if (
            procedenciaActual.length === 0 ||
            !opciones.some((opcion) => opcion.value === procedenciaActual)
          ) {
            setDrogasValue('idPaisProcedencia', opcionBolivia.value)
          }

          if (
            destinoActual.length === 0 ||
            !opciones.some((opcion) => opcion.value === destinoActual)
          ) {
            setDrogasValue('idPaisDestino', opcionBolivia.value)
          }
        }
      } catch {
        // Mantener fallback local si la consulta falla
      }
    }

    void cargarPaises()

    return () => {
      activo = false
    }
  }, [getDrogasValues, setDrogasValue])

  useEffect(() => {
    let activo = true

    const cargarFormasTransporte = async () => {
      try {
        const res = await SiiiLookupsService.obtenerFormasTransporte()
        if (!activo || !res?.finalizado) return

        const opciones = (res.datos ?? [])
          .map((item: Record<string, unknown>, index: number) => {
            const idRaw =
              item.id ?? item.codigo ?? item.valor ?? item.value ?? index
            const valueRaw =
              item.valor ?? item.value ?? item.codigo ?? item.id ?? ''
            const labelRaw =
              item.descripcion ??
              item.nombre ??
              item.detalle ??
              item.label ??
              valueRaw

            return {
              id: String(idRaw),
              value: String(valueRaw),
              label: String(labelRaw),
            }
          })
          .filter((opcion) => opcion.value.length > 0)

        if (opciones.length > 0) {
          setOpcionesFormasTransporte(opciones)
          const formaActual = String(getDrogasValues('idFormaTransporte') ?? '')
          if (!opciones.some((opcion) => opcion.value === formaActual)) {
            setDrogasValue('idFormaTransporte', opciones[0].value)
          }
        }
      } catch {
        // Mantener fallback local si la consulta falla
      }
    }

    void cargarFormasTransporte()

    return () => {
      activo = false
    }
  }, [getDrogasValues, setDrogasValue])

  useEffect(() => {
    let activo = true

    const cargarEstadosDroga = async () => {
      const tipoSeleccionado = String(tipoDrogaSeleccionada ?? '')
      const idDesdeValor = Number(tipoSeleccionado)
      const idDesdeOpcion = Number(
        opcionesTiposDroga.find((opcion) => opcion.value === tipoSeleccionado)
          ?.id
      )
      const idTipoDroga =
        Number.isFinite(idDesdeValor) && idDesdeValor > 0
          ? idDesdeValor
          : Number.isFinite(idDesdeOpcion) && idDesdeOpcion > 0
            ? idDesdeOpcion
            : 0

      if (idTipoDroga <= 0) {
        return
      }

      try {
        const res =
          await GestionOperativoCatalogosService.obtenerEstadosDroga(
            idTipoDroga
          )
        if (!activo || !res?.finalizado) return

        const opciones = (res.datos ?? [])
          .map((item: Record<string, unknown>, index: number) => {
            const idRaw =
              item.id ?? item.codigo ?? item.valor ?? item.value ?? index
            const valueRaw =
              item.valor ?? item.value ?? item.codigo ?? item.id ?? ''
            const labelRaw =
              item.descripcion ??
              item.nombre ??
              item.detalle ??
              item.label ??
              valueRaw

            return {
              id: String(idRaw),
              value: String(valueRaw),
              label: String(labelRaw),
            }
          })
          .filter((opcion) => opcion.value.length > 0)

        if (opciones.length > 0) {
          setOpcionesEstadosDroga(opciones)
          const estadoActual = String(getDrogasValues('idEstadoDroga') ?? '')
          if (!opciones.some((opcion) => opcion.value === estadoActual)) {
            setDrogasValue('idEstadoDroga', opciones[0].value)
          }
        }
      } catch {
        // Mantener fallback local si la consulta falla
      }
    }

    void cargarEstadosDroga()

    return () => {
      activo = false
    }
  }, [
    getDrogasValues,
    opcionesTiposDroga,
    setDrogasValue,
    tipoDrogaSeleccionada,
  ])

  const [drogasItems, setDrogasItems] = useState<any[]>([])
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

  const resolverIdOpcion = (
    valorSeleccionado: unknown,
    opciones: { id: string; value: string }[]
  ) => {
    const valor = String(valorSeleccionado ?? '')
    const idDirecto = Number(valor)
    if (Number.isFinite(idDirecto) && idDirecto > 0) return idDirecto
    const opcion = opciones.find((item) => item.value === valor)
    const idOpcion = Number(opcion?.id ?? 0)
    return Number.isFinite(idOpcion) ? idOpcion : 0
  }

  const obtenerIdDroga = (row: Record<string, unknown>) => {
    const id = Number(row.id ?? row.idDroga ?? row.id_droga ?? 0)
    return Number.isFinite(id) ? id : 0
  }

  const cargarDrogas = async () => {
    if (!idCaso) return
    setCargandoDrogas(true)
    try {
      const res = await GestionOperativoDrogasService.listar(idCaso)
      if (res?.finalizado) {
        const lista = Array.isArray(res.datos)
          ? (res.datos as DrogaCasoPayload[])
          : []
        setDrogasItems(lista)
        lista.forEach((item) => {
          const idDroga = item.id
          void cargarLogotipos(idDroga)
        })
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

  const deleteDrogaItem = (id: any) => {
    setDrogasItems((prev) => prev.filter((d) => d.id !== id))
  }

  const deleteLogotipoItem = (id: any) => {
    setLogotiposItems((prev) => prev.filter((d) => d.id !== id))
  }

  const onSubmitDrogas = async (data: Record<string, any>) => {
    if (!idCaso) return

    const idTipoDroga = resolverIdOpcion(data.idTipoDroga, opcionesTiposDroga)
    const idEstadoDroga = resolverIdOpcion(
      data.idEstadoDroga,
      opcionesEstadosDroga
    )
    const idFormaTransporte = resolverIdOpcion(
      data.idFormaTransporte,
      opcionesFormasTransporte
    )
    const idPaisProcedencia = resolverIdOpcion(
      data.idPaisProcedencia,
      opcionesPaises
    )
    const idPaisDestino = resolverIdOpcion(data.idPaisDestino, opcionesPaises)

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
        idTipoDroga,
        idEstadoDroga,
        cantidadGramos: gramos,
        cantidadUnidades: parseNumber(data.cantidadUnidades),
        idFormaTransporte,
        idPaisProcedencia,
        idPaisDestino,
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
        await agregarLogotipoLocal( respuesta.datos? respuesta.datos as LogotipoCasoPayload : [])
        await cargarLogotipos(drogaSeleccionadaId)
        resetLogos()
      }
    } finally {
      setCargandoLogotipos(false)
    }
  }
  const agregarLogotipoLocal = async (data: LogotipoCasoPayload) => {
    if (!data) return
    setCargandoLogotipos(true)
    try {
      setLogotiposItems((prev) => [...prev, data])
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
                accessor: 'tipoDroga',
                title: 'Tipo de Droga',
                render: (row) => String(row.tipoDroga ?? row.idTipoDroga ?? ''),
              },
              {
                accessor: 'estadoDroga',
                title: 'Estado de la Droga',
                render: (row) =>
                  String(row.estadoDroga ?? row.idEstadoDroga ?? ''),
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
                  String(row.formaTransporte ?? row.idFormaTransporte ?? ''),
              },
              {
                accessor: 'procedencia',
                title: 'Procedencia',
                render: (row) =>
                  String(row.procedencia ?? row.idPaisProcedencia ?? ''),
              },
              {
                accessor: 'destino',
                title: 'Destino',
                render: (row) => String(row.destino ?? row.idPaisDestino ?? ''),
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
                        const idDroga = obtenerIdDroga(row)
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
                accessor: 'tipoDroga',
                title: 'Tipo de Droga',
                render: (row) => String(row.tipoDroga ?? row.idTipoDroga ?? ''),
              },
              {
                accessor: 'pruebaCampo',
                title: 'Prueba de Campo',
                render: (row) =>
                  row.pruebaCampoUrl ? (
                    <img
                      src={row.pruebaCampoUrl}
                      alt="Prueba de Campo"
                      className="h-20 w-32 rounded object-cover shadow-sm"
                    />
                  ) : null,
              },
              {
                accessor: 'pesaje',
                title: 'Cuantificacion y Pesaje',
                render: (row) =>
                  row.pesajeUrl ? (
                    <img
                      src={row.pesajeUrl}
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
                render: (row) =>
                  String(row.descripcionLogo ?? row.descripcion ?? ''),
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
                    row.fotografiaUrl ?? row.urlFotografia ?? row.fotografia
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
