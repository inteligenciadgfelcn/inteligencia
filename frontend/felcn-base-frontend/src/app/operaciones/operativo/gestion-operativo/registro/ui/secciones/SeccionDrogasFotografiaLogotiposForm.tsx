'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDropdown, FormInputText } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import { SiiiLookupsService } from '@/services/parametricas'
import {
  GestionOperativoCatalogosService,
  GestionOperativoDrogasService,
  GestionOperativoLogotiposService,
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
      tipoDroga: 'marihuana',
      estadoDroga: 'seco',
      cocainaLiquida: '',
      cantidadTn: '',
      cantidadKg: '',
      cantidadG: '',
      cantidadMg: '',
      nroPastillas: '',
      formaTransporte: 'terrestre',
      procedencia: 'bolivia',
      destino: 'bolivia',
      fotoPruebaCampo: [],
      fotoCuantificacion: [],
    },
  })

  const {
    control: controlLogos,
    handleSubmit: handleSubmitLogos,
    reset: resetLogos,
  } = useForm({
    defaultValues: {
      logoImagen: '',
      logoDescripcion: '',
      logoOrganizacion: '',
      logoBlancos: '',
      logoObservacion: '',
      fotoLogo: [],
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
  const tipoDrogaSeleccionada = watchDrogas('tipoDroga')

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
          const tipoActual = String(getDrogasValues('tipoDroga') ?? '')
          if (!opciones.some((opcion) => opcion.value === tipoActual)) {
            setDrogasValue('tipoDroga', opciones[0].value)
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
          const procedenciaActual = String(getDrogasValues('procedencia') ?? '')
          const destinoActual = String(getDrogasValues('destino') ?? '')

          if (
            procedenciaActual.length === 0 ||
            !opciones.some((opcion) => opcion.value === procedenciaActual)
          ) {
            setDrogasValue('procedencia', opcionBolivia.value)
          }

          if (
            destinoActual.length === 0 ||
            !opciones.some((opcion) => opcion.value === destinoActual)
          ) {
            setDrogasValue('destino', opcionBolivia.value)
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
          const formaActual = String(getDrogasValues('formaTransporte') ?? '')
          if (!opciones.some((opcion) => opcion.value === formaActual)) {
            setDrogasValue('formaTransporte', opciones[0].value)
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
          const estadoActual = String(getDrogasValues('estadoDroga') ?? '')
          if (!opciones.some((opcion) => opcion.value === estadoActual)) {
            setDrogasValue('estadoDroga', opciones[0].value)
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
  }, [getDrogasValues, opcionesTiposDroga, setDrogasValue, tipoDrogaSeleccionada])

  const [drogasItems, setDrogasItems] = useState<any[]>([])
  const [logotiposItems, setLogotiposItems] = useState<any[]>([])
  const [cargandoDrogas, setCargandoDrogas] = useState(false)
  const [cargandoLogotipos, setCargandoLogotipos] = useState(false)
  const [drogaSeleccionadaId, setDrogaSeleccionadaId] = useState<number | null>(
    null
  )

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
        const lista = Array.isArray(res.datos) ? res.datos : []
        setDrogasItems(lista)
        const primerId = lista.length > 0 ? obtenerIdDroga(lista[0]) : 0
        if (primerId > 0) {
          setDrogaSeleccionadaId((actual) => actual ?? primerId)
        }
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
        setLogotiposItems(Array.isArray(res.datos) ? res.datos : [])
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

    const idTipoDroga = resolverIdOpcion(data.tipoDroga, opcionesTiposDroga)
    const idEstadoDroga = resolverIdOpcion(data.estadoDroga, opcionesEstadosDroga)
    const idFormaTransporte = resolverIdOpcion(
      data.formaTransporte,
      opcionesFormasTransporte
    )
    const idPaisProcedencia = resolverIdOpcion(data.procedencia, opcionesPaises)
    const idPaisDestino = resolverIdOpcion(data.destino, opcionesPaises)

    const gramos =
      parseNumber(data.cantidadTn) * 1_000_000 +
      parseNumber(data.cantidadKg) * 1_000 +
      parseNumber(data.cantidadG) +
      parseNumber(data.cantidadMg) / 1000

    const pruebaCampoFile =
      data.fotoPruebaCampo && data.fotoPruebaCampo.length > 0
        ? data.fotoPruebaCampo[0]
        : undefined
    const cuantificacionFile =
      data.fotoCuantificacion && data.fotoCuantificacion.length > 0
        ? data.fotoCuantificacion[0]
        : undefined

    setCargandoDrogas(true)
    try {
      await GestionOperativoDrogasService.crear(idCaso, {
        idTipoDroga,
        idEstadoDroga,
        cantidadGramos: gramos,
        cantidadUnidades: parseNumber(data.nroPastillas),
        idFormaTransporte,
        idPaisProcedencia,
        idPaisDestino,
        observaciones: data.cocainaLiquida
          ? `Cocaina liquida (lt): ${data.cocainaLiquida}`
          : undefined,
        pruebaCampo: pruebaCampoFile,
        pesaje: cuantificacionFile,
      })
      await cargarDrogas()
      resetDrogas()
    } finally {
      setCargandoDrogas(false)
    }
  }

  const onSubmitLogotipos = async (data: Record<string, any>) => {
    if (!idCaso || !drogaSeleccionadaId) return

    const fotoLogoFile =
      data.fotoLogo && data.fotoLogo.length > 0 ? data.fotoLogo[0] : undefined

    setCargandoLogotipos(true)
    try {
      await GestionOperativoLogotiposService.crear(idCaso, drogaSeleccionadaId, {
        imagen: String(data.logoImagen ?? ''),
        descripcionLogo: String(data.logoDescripcion ?? ''),
        organizacion: String(data.logoOrganizacion ?? ''),
        blanco: data.logoBlancos ? String(data.logoBlancos) : undefined,
        observacion: data.logoObservacion ? String(data.logoObservacion) : undefined,
        fotografia: fotoLogoFile,
      })
      await cargarLogotipos(drogaSeleccionadaId)
      resetLogos()
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
              id="tipoDroga"
              name="tipoDroga"
              label="Tipo de Droga"
              control={controlDrogas}
              options={opcionesTiposDroga}
            />
            <FormInputDropdown
              id="estadoDroga"
              name="estadoDroga"
              label="Estado de la Droga"
              control={controlDrogas}
              options={opcionesEstadosDroga}
            />
            <FormInputText
              id="cocainaLiquida"
              name="cocainaLiquida"
              label="Cocaina Liquida en Litros"
              control={controlDrogas}
            />

            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Cantidad
              </label>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">Tn</span>
                  <FormInputText
                    id="cantidadTn"
                    name="cantidadTn"
                    label=""
                    control={controlDrogas}
                    size="small"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">Kg</span>
                  <FormInputText
                    id="cantidadKg"
                    name="cantidadKg"
                    label=""
                    control={controlDrogas}
                    size="small"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">g</span>
                  <FormInputText
                    id="cantidadG"
                    name="cantidadG"
                    label=""
                    control={controlDrogas}
                    size="small"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">Mg</span>
                  <FormInputText
                    id="cantidadMg"
                    name="cantidadMg"
                    label=""
                    control={controlDrogas}
                    size="small"
                  />
                </div>
              </div>
            </div>
            <FormInputText
              id="nroPastillas"
              name="nroPastillas"
              label="Nro. Pastillas o Capsulas (Tragones)"
              control={controlDrogas}
            />

            <FormInputDropdown
              id="formaTransporte"
              name="formaTransporte"
              label="Forma de Transporte"
              control={controlDrogas}
              options={opcionesFormasTransporte}
            />
            <FormInputDropdown
              id="procedencia"
              name="procedencia"
              label="Procedencia"
              control={controlDrogas}
              options={opcionesPaises}
            />
            <FormInputDropdown
              id="destino"
              name="destino"
              label="Destino"
              control={controlDrogas}
              options={opcionesPaises}
            />

            <div className="col-span-1 lg:col-span-3">
              <FormInputFile
                id="fotoPruebaCampo"
                name="fotoPruebaCampo"
                label="Fotografia Prueba de Campo"
                control={controlDrogas}
                limite={1}
                tiposPermitidos={['image/*']}
              />
            </div>

            <div className="col-span-1 lg:col-span-3">
              <FormInputFile
                id="fotoCuantificacion"
                name="fotoCuantificacion"
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
                render: (row) => String(row.estadoDroga ?? row.idEstadoDroga ?? ''),
              },
              {
                accessor: 'cantidad',
                title: 'Cantidad (gramos) / Litros',
                render: (row) => String(row.cantidad ?? row.cantidadGramos ?? ''),
              },
              {
                accessor: 'nroPastillas',
                title: 'Nro. de Capsulas',
                render: (row) => String(row.nroPastillas ?? row.cantidadUnidades ?? ''),
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
                accessor: 'cuantificacion',
                title: 'Cuantificacion y Pesaje',
                render: (row) =>
                  row.cuantificacionUrl ? (
                    <img
                      src={row.cuantificacionUrl}
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
              id="logoImagen"
              name="logoImagen"
              label="Imagen"
              control={controlLogos}
            />
            <FormInputText
              id="logoDescripcion"
              name="logoDescripcion"
              label="Descripcion del Logo"
              control={controlLogos}
            />
            <FormInputText
              id="logoOrganizacion"
              name="logoOrganizacion"
              label="Organizacion Criminal"
              control={controlLogos}
            />

            <FormInputText
              id="logoBlancos"
              name="logoBlancos"
              label="Posibles Blancos"
              control={controlLogos}
            />
            <FormInputText
              id="logoObservacion"
              name="logoObservacion"
              label="Observacion"
              control={controlLogos}
            />
            <div className="hidden lg:block" />

            <div className="col-span-1 lg:col-span-3">
              <FormInputFile
                id="fotoLogo"
                name="fotoLogo"
                label="Fotografia"
                control={controlLogos}
                limite={1}
                tiposPermitidos={['image/*']}
              />
            </div>

            <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
              <Button variant="primary" type="submit" disabled={cargandoLogotipos}>
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
                render: (row) => String(row.descripcionLogo ?? row.descripcion ?? ''),
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
