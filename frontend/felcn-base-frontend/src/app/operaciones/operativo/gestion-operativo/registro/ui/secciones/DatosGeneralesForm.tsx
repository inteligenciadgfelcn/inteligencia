'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Marker } from 'react-leaflet'
import { icon } from 'leaflet'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormInputDate, FormInputDropdown, FormInputText } from '@/components/form'
import type { optionType } from '@/components/form/FormInputDropdown'
import Mapa from '@/components/mapas/Mapa'
import { useParametricas } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import {
    GestionOperativoCatalogosService,
    GestionOperativosDatosGeneralesService,
} from '@/services/operativos'
import { SiiiLookupsService } from '@/services/parametricas'
import type { CasoOperativoDetalle } from '@/services/operativos'
import type { OperativoPayload } from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface DatosGeneralesFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    cargando?: boolean
}

interface DatosLectura {
    numeroInforme: string
    nombreCaso: string
    unidad: string
    distrital: string
    grupo: string
    quienRealiza: string
    celularRealiza: string
    asignado: string
    celularAsignado: string
    fiscal: string
    celularFiscal: string
}


const ICON = icon({
    iconRetinaUrl: '/leaflet/marker-icon.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconAnchor: [12.5, 41],
})

const DEFAULT_VALUES: OperativoPayload = {
    numeroOperativo: 'CB-UM-363/25',
    idTipoRelevancia: 0,
    idTipoDenuncia: 0,
    idTipoPenal: 0,
    fechaOperativo: new Date('2025-11-27T04:00:00').toISOString(),
    idDepartamento: 0,
    idProvincia: 0,
    idLocalidad: 0,
    lugar: 'CENTRAL VILLA 14 DE SEPTIEMBRE SINDICATO VILLA POR VENIR',
    idCategoriaOperativo: 0,
    idItemOperativo: 0,
    idUnidad: 0,
    idDistrital: 0,
    idGrupo: 0,
    mando: 'CAP. OSCAR DANIEL CHOQUE ALARCON',
    idPlanOperacion: 0,
    breveDetalle: '',
    descripcion: '',
    idTipoOperacion: 0,
    organizacion: '',
    coordX: -17.78507,
    coordY: -63.1761788,
    clanFamiliar: '',
}

const toStringOrEmpty = (value: unknown) =>
    value == null ? '' : String(value)

const toNumberOrZero = (value: unknown): number => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

const toIsoDate = (value: unknown): string => {
    if (value instanceof Date) {
        return value.toISOString()
    }
    const parsed = new Date(String(value ?? ''))
    if (Number.isNaN(parsed.getTime())) {
        return new Date().toISOString()
    }
    return parsed.toISOString()
}

const mapCasoOperativoToForm = (
    data: CasoOperativoDetalle
): Partial<OperativoPayload> => ({
    numeroOperativo:
        data.operativo?.numeroOperativo ??
        data.caso?.numeroOperativo ??
        DEFAULT_VALUES.numeroOperativo,
    idTipoRelevancia: toNumberOrZero(data.operativo?.idTipoRelevancia),
    idTipoDenuncia: toNumberOrZero(data.operativo?.idTipoDenuncia),
    idTipoPenal: toNumberOrZero(data.operativo?.idTipoPenal),
    fechaOperativo: data.operativo?.fechaOperativo
        ? new Date(data.operativo.fechaOperativo)
            .toISOString()
        : DEFAULT_VALUES.fechaOperativo,
    idDepartamento: toNumberOrZero(data.operativo?.idDepartamento),
    idProvincia: toNumberOrZero(data.operativo?.idProvincia),
    idLocalidad: toNumberOrZero(data.operativo?.idLocalidad),
    lugar: data.operativo?.lugar ?? '',
    idUnidad: toNumberOrZero(data.operativo?.idUnidad),
    idDistrital: toNumberOrZero(data.operativo?.idDistrital),
    idGrupo: toNumberOrZero(data.operativo?.idGrupo),
    mando: data.operativo?.mando ?? '',
    idPlanOperacion: toNumberOrZero(data.operativo?.idPlanOperacion),
    idTipoOperacion: toNumberOrZero(data.operativo?.idTipoOperacion),
    clanFamiliar: data.operativo?.clanFamiliar ?? '',
    organizacion: data.operativo?.organizacion ?? '',
    coordX: data.operativo?.coordX ?? DEFAULT_VALUES.coordX,
    coordY: data.operativo?.coordY ?? DEFAULT_VALUES.coordY,
    breveDetalle: data.operativo?.breveDetalle ?? data.operativo?.descripcion ?? '',
    descripcion: data.operativo?.descripcion ?? data.operativo?.breveDetalle ?? '',
})

export function DatosGeneralesForm({
    titulo,
    onGuardar,
    cargando = false,
}: DatosGeneralesFormProps) {
    const searchParams = useSearchParams()
    const { Alerta } = useAlerts()
    const [parametricasBaseListas, setParametricasBaseListas] = useState(false)
    const [tieneOperativo, setTieneOperativo] = useState(false)
    const [opcionesOperativoEn, setOpcionesOperativoEn] = useState<optionType[]>([])
    const [opcionesCategoriaOperativo, setOpcionesCategoriaOperativo] = useState<optionType[]>([])
    const [datosLectura, setDatosLectura] = useState<DatosLectura>({
        numeroInforme: '',
        nombreCaso: '',
        unidad: '',
        distrital: '',
        grupo: '',
        quienRealiza: '',
        celularRealiza: '',
        asignado: '',
        celularAsignado: '',
        fiscal: '',
        celularFiscal: '',
    })
    const {
        departamentos,
        provincias,
        localidades,
        tiposRelevancia,
        tiposDenuncia,
        tiposPenal,
        tiposOperacion,
        planesOperaciones,
        unidadesSiii,
        cargarDepartamentos,
        cargarProvincias,
        cargarLocalidades,
        cargarTiposRelevancia,
        cargarTiposDenuncia,
        cargarTiposPenal,
        cargarTiposOperacion,
        cargarPlanesOperaciones,
        cargarUnidadesSiii,
        distritales,
        grupos,
        cargarDistritales,
        cargarGrupos,
    } = useParametricas()

    const { control, watch, setValue, getValues, reset, trigger } = useForm<OperativoPayload>({
        defaultValues: DEFAULT_VALUES,
    })
    const reglaObligatorio = { required: 'Campo obligatorio' }

    const opcionesDepartamento: optionType[] = departamentos.map((d) => ({
        id: String(d.id),
        value: String(d.id),
        label: d.descripcion,
    }))

    const opcionesProvicia: optionType[] = provincias.map((p) => ({
        id: String(p.id),
        value: String(p.id),
        label: p.descripcion,
    }))

    const opcionesMunicipio: optionType[] = localidades.map((l) => ({
        id: String(l.id),
        value: String(l.id),
        label: l.descripcion,
    }))

    const opcionesUnidadEst: optionType[] = unidadesSiii.map((u) => ({
        id: String(u.id),
        value: String(u.id),
        label: u.descripcion,
    }))

    const opcionesDistritalEst: optionType[] = distritales.map((d) => ({
        id: String(d.id),
        value: String(d.id),
        label: d.descripcion,
    }))

    const opcionesGrupoEst: optionType[] = grupos.map((g) => ({
        id: String(g.id),
        value: String(g.id),
        label: g.descripcion,
    }))

    const opcionesRelevancia: optionType[] = tiposRelevancia.map((r) => ({
        id: String(r.id),
        value: String(r.id),
        label: String(r.descripcion ?? ''),
    }))

    const opcionesTipoDenuncia: optionType[] = tiposDenuncia.map((t) => ({
        id: String(t.id),
        value: String(t.id),
        label: String(t.descripcion ?? ''),
    }))

    const opcionesTipoPenal: optionType[] = tiposPenal.map((t) => ({
        id: String(t.id),
        value: String(t.id),
        label: String(t.descripcion ?? ''),
    }))

    const opcionesTipoOperativo: optionType[] = tiposOperacion.map((t) => ({
        id: String(t.id),
        value: String(t.id),
        label: String(t.descripcion ?? ''),
    }))

    const opcionesPlan: optionType[] = planesOperaciones.map((p) => ({
        id: String(p.id),
        value: String(p.id),
        label: String(p.nombre ?? ''),
    }))
    const obtenerLabel = (options: optionType[], value: string) =>
        options.find((option) => option.value === value)?.label ?? value

    const coordX = watch('coordX')
    const coordY = watch('coordY')
    const categoriaOperativoSeleccionada = watch('idCategoriaOperativo')
    const departamentoSeleccionado = watch('idDepartamento')
    const provinciaSeleccionada = watch('idProvincia')
    const unidadSeleccionada = watch('idUnidad')
    const distritalSeleccionado = watch('idDistrital')
    const mapRef = useRef(null)

    useEffect(() => {
        let activo = true
        const cargarParametricasBase = async () => {
            await Promise.all([
                cargarDepartamentos(),
                cargarTiposRelevancia(),
                cargarTiposDenuncia(),
                cargarTiposPenal(),
                cargarTiposOperacion(),
                cargarPlanesOperaciones(),
                cargarUnidadesSiii(),
            ])

            if (activo) {
                setParametricasBaseListas(true)
            }
        }

        void cargarParametricasBase()
        return () => {
            activo = false
        }
    }, [
        cargarDepartamentos,
        cargarTiposRelevancia,
        cargarTiposDenuncia,
        cargarTiposPenal,
        cargarTiposOperacion,
        cargarPlanesOperaciones,
        cargarUnidadesSiii,
    ])

    useEffect(() => {
        let activo = true

        const cargarCategoriasOperativo = async () => {
            try {
                const respuesta = await SiiiLookupsService.obtenerCategoriasOperativo()
                if (!activo || !respuesta?.finalizado) return

                const opciones = (respuesta.datos ?? [])
                    .map((item: Record<string, unknown>, index: number) => {
                        const idRaw = item.id ?? item.codigo ?? item.valor ?? item.value ?? index
                        const valueRaw = item.valor ?? item.value ?? item.codigo ?? item.id ?? ''
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

                setOpcionesCategoriaOperativo(opciones)
            } catch {
                setOpcionesCategoriaOperativo([])
            }
        }

        void cargarCategoriasOperativo()

        return () => {
            activo = false
        }
    }, [])

    useEffect(() => {
        let activo = true

        const cargarItemsOperativo = async () => {
            const idCategoria = Number(categoriaOperativoSeleccionada)
            if (idCategoria <= 0) {
                setOpcionesOperativoEn([])
                setValue('idItemOperativo', 0)
                return
            }

            try {
                const respuesta =
                    await GestionOperativoCatalogosService.obtenerItemsOperativo(
                        idCategoria
                    )
                if (!activo || !respuesta?.finalizado) return

                const opciones = (respuesta.datos ?? [])
                    .map((item: Record<string, unknown>, index: number) => {
                        const idRaw = item.id ?? item.codigo ?? item.valor ?? item.value ?? index
                        const valueRaw = item.valor ?? item.value ?? item.codigo ?? item.id ?? ''
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

                setOpcionesOperativoEn(opciones)
                const idItemActual = Number(getValues('idItemOperativo'))
                const existeItemActual = opciones.some(
                    (opcion) => Number(opcion.value) === idItemActual
                )
                if (!existeItemActual) {
                    setValue('idItemOperativo', 0)
                }
            } catch {
                setOpcionesOperativoEn([])
                setValue('idItemOperativo', 0)
            }
        }

        void cargarItemsOperativo()

        return () => {
            activo = false
        }
    }, [categoriaOperativoSeleccionada, getValues, setValue])

    useEffect(() => {
        const id = Number(departamentoSeleccionado)
        if (id > 0) {
            setValue('idProvincia', 0)
            setValue('idLocalidad', 0)
            void cargarProvincias(id)
        }
    }, [departamentoSeleccionado, setValue, cargarProvincias])

    useEffect(() => {
        const id = Number(provinciaSeleccionada)
        if (id > 0) {
            setValue('idLocalidad', 0)
            void cargarLocalidades(id)
        }
    }, [provinciaSeleccionada, setValue, cargarLocalidades])

    useEffect(() => {
        const id = Number(unidadSeleccionada)
        if (id > 0) {
            setValue('idDistrital', 0)
            setValue('idGrupo', 0)
            void cargarDistritales(id)
        }
    }, [unidadSeleccionada, setValue, cargarDistritales])

    useEffect(() => {
        const id = Number(distritalSeleccionado)
        if (id > 0) {
            setValue('idGrupo', 0)
            void cargarGrupos(id)
        }
    }, [distritalSeleccionado, setValue, cargarGrupos])

    const handleMapClick = (center: [number, number]) => {
        setValue('coordX', center[0])
        setValue('coordY', center[1])
    }

    const handleGuardar = async () => {
        const esValido = await trigger()
        if (!esValido) {
            return
        }

        const payload = getValues()
        const idCaso = Number(searchParams.get('id') ?? 0)

        try {
            if (idCaso > 0) {
                const payloadOperativo: OperativoPayload = {
                    numeroOperativo: payload.numeroOperativo,
                    idTipoRelevancia: toNumberOrZero(payload.idTipoRelevancia),
                    idTipoDenuncia: toNumberOrZero(payload.idTipoDenuncia),
                    idTipoPenal: toNumberOrZero(payload.idTipoPenal),
                    fechaOperativo: toIsoDate(payload.fechaOperativo),
                    idDepartamento: toNumberOrZero(payload.idDepartamento),
                    idProvincia: toNumberOrZero(payload.idProvincia),
                    idLocalidad: toNumberOrZero(payload.idLocalidad),
                    lugar: payload.lugar,
                    idCategoriaOperativo: toNumberOrZero(payload.idCategoriaOperativo),
                    idItemOperativo: toNumberOrZero(payload.idItemOperativo),
                    idUnidad: toNumberOrZero(payload.idUnidad),
                    idDistrital: toNumberOrZero(payload.idDistrital),
                    idGrupo: toNumberOrZero(payload.idGrupo),
                    mando: payload.mando,
                    coordX: toNumberOrZero(payload.coordX),
                    coordY: toNumberOrZero(payload.coordY),
                    idPlanOperacion: toNumberOrZero(payload.idPlanOperacion),
                    breveDetalle: payload.breveDetalle,
                    descripcion: payload.descripcion || payload.breveDetalle,
                    idTipoOperacion: toNumberOrZero(payload.idTipoOperacion),
                    organizacion: payload.organizacion,
                    clanFamiliar: payload.clanFamiliar,
                }

                if (tieneOperativo) {
                    await GestionOperativosDatosGeneralesService.actualizarOperativo(
                        idCaso,
                        payloadOperativo
                    )
                    Alerta({ mensaje: 'Operativo actualizado correctamente', variant: 'success' })
                } else {
                    await GestionOperativosDatosGeneralesService.crearOperativo(
                        idCaso,
                        payloadOperativo
                    )
                    Alerta({ mensaje: 'Operativo guardado correctamente', variant: 'success' })
                }
                return
            }

            await onGuardar(payload as unknown as SeccionPayloadBase)
            Alerta({ mensaje: 'Datos guardados correctamente', variant: 'success' })
        } catch (e) {
            Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
        }
    }

    const cargarDatosCaso = useCallback(async () => {
        let datosCasoOperativo: Partial<OperativoPayload> = {}
        const idCaso = Number(searchParams.get('id') ?? 0)
        setTieneOperativo(false)

        if (idCaso > 0) {
            const respuestaCaso =
                await GestionOperativosDatosGeneralesService.obtenerPorUsuario(
                    idCaso
                )

            if (respuestaCaso?.datos) {
                setTieneOperativo(Boolean(respuestaCaso.datos.operativo))
                datosCasoOperativo = mapCasoOperativoToForm(respuestaCaso.datos)
                setDatosLectura({
                    numeroInforme: '',
                    nombreCaso: respuestaCaso.datos.caso?.nombreCaso ?? '',
                    unidad: toStringOrEmpty(respuestaCaso.datos.operativo?.idUnidad),
                    distrital: toStringOrEmpty(respuestaCaso.datos.operativo?.idDistrital),
                    grupo: toStringOrEmpty(respuestaCaso.datos.operativo?.idGrupo),
                    quienRealiza: respuestaCaso.datos.caso?.fiscalSolicitud ?? '',
                    celularRealiza: respuestaCaso.datos.caso?.telefonoSolicitud ?? '',
                    asignado: respuestaCaso.datos.caso?.asignadoCaso ?? '',
                    celularAsignado: respuestaCaso.datos.caso?.telefonoAsignado ?? '',
                    fiscal: respuestaCaso.datos.caso?.fiscalAsignadoCaso ?? '',
                    celularFiscal: respuestaCaso.datos.caso?.telefonoFiscal ?? '',
                })
            }
        }

        if (Object.keys(datosCasoOperativo).length > 0) {
            reset({
                ...DEFAULT_VALUES,
                ...datosCasoOperativo,
            })
        }
    }, [reset, searchParams])

    useEffect(() => {
        if (!parametricasBaseListas) {
            return
        }
        void cargarDatosCaso()
    }, [cargarDatosCaso, parametricasBaseListas])

    if (!parametricasBaseListas) {
        return <FullScreenLoading mensaje="Cargando parámetros del formulario..." />
    }

    return (
        <Card title="DATOS GENERALES">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1 lg:col-span-3">
                    <h3 className="text-base font-semibold">{titulo}</h3>
                </div>

                <FormInputText id="numeroOperativo" name="numeroOperativo" label="Numero de Operativo" control={control} rules={reglaObligatorio} />
                <FormInputDropdown id="idTipoRelevancia" name="idTipoRelevancia" label="Relevancia" control={control} options={opcionesRelevancia} rules={reglaObligatorio} />
                <div className="hidden lg:block"></div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Numero de Informe</label>
                    <input className="form-input w-full" value={datosLectura.numeroInforme} disabled readOnly />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombre del Caso</label>
                    <input className="form-input w-full" value={datosLectura.nombreCaso} disabled readOnly />
                </div>
                <div className="hidden lg:block"></div>

                     <FormInputDropdown id="idUnidad" name="idUnidad" label="Unidad" control={control} options={opcionesUnidadEst} rules={reglaObligatorio} />
                <FormInputDropdown id="idDistrital" name="idDistrital" label="Distrital" control={control} options={opcionesDistritalEst} disabled={opcionesDistritalEst.length === 0} rules={reglaObligatorio} />
                <FormInputDropdown id="idGrupo" name="idGrupo" label="Grupo" control={control} options={opcionesGrupoEst} disabled={opcionesGrupoEst.length === 0} rules={reglaObligatorio} />

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Quien Realiza la Solicitud</label>
                    <input className="form-input w-full" value={datosLectura.quienRealiza} disabled readOnly />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Nro. Celular</label>
                    <input className="form-input w-full" value={datosLectura.celularRealiza} disabled readOnly />
                </div>
                <div className="hidden lg:block"></div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Asignado al Caso</label>
                    <input className="form-input w-full" value={datosLectura.asignado} disabled readOnly />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Nro. Celular</label>
                    <input className="form-input w-full" value={datosLectura.celularAsignado} disabled readOnly />
                </div>
                <div className="hidden lg:block"></div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Fiscal Asignado</label>
                    <input className="form-input w-full" value={datosLectura.fiscal} disabled readOnly />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">Nro. Celular</label>
                    <input className="form-input w-full" value={datosLectura.celularFiscal} disabled readOnly />
                </div>
                <div className="hidden lg:block"></div>

                <FormInputDropdown id="idTipoDenuncia" name="idTipoDenuncia" label="Tipo de la Denuncia" control={control} options={opcionesTipoDenuncia} rules={reglaObligatorio} />
                <FormInputDropdown id="idTipoPenal" name="idTipoPenal" label="Tipo Penal" control={control} options={opcionesTipoPenal} rules={reglaObligatorio} />
                <FormInputDate id="fechaOperativo" name="fechaOperativo" label="Fecha y Hora del Operativo" control={control} rules={reglaObligatorio} />

                <FormInputDropdown id="idDepartamento" name="idDepartamento" label="Departamento" control={control} options={opcionesDepartamento} rules={reglaObligatorio} />
                <FormInputDropdown id="idProvincia" name="idProvincia" label="Provincia" control={control} options={opcionesProvicia} disabled={opcionesProvicia.length === 0} rules={reglaObligatorio} />
                <FormInputDropdown id="idLocalidad" name="idLocalidad" label="Municipio" control={control} options={opcionesMunicipio} disabled={opcionesMunicipio.length === 0} rules={reglaObligatorio} />

                <div className="col-span-1 lg:col-span-3">
                    <FormInputText
                        id="lugar"
                        name="lugar"
                        label="En la localidad, comunidad, direccion (Zona, Calle, Avenida, Barrio)"
                        control={control}
                        rules={reglaObligatorio}
                    />
                </div>

                <FormInputDropdown id="idCategoriaOperativo" name="idCategoriaOperativo" label="Categoria Operativo" control={control} options={opcionesCategoriaOperativo} rules={reglaObligatorio} />
                <FormInputDropdown id="idItemOperativo" name="idItemOperativo" label="Operativo Realizado en" control={control} options={opcionesOperativoEn} disabled={opcionesOperativoEn.length === 0} rules={reglaObligatorio} />
                <FormInputText id="mando" name="mando" label="Al Mando de" control={control} rules={reglaObligatorio} />

                <FormInputDropdown id="idPlanOperacion" name="idPlanOperacion" label="Plan de Operaciones" control={control} options={opcionesPlan} rules={reglaObligatorio} />
                <FormInputDropdown id="idTipoOperacion" name="idTipoOperacion" label="El Operativo es de Tipo" control={control} options={opcionesTipoOperativo} rules={reglaObligatorio} />
                <div className="hidden lg:block"></div>

                <FormInputText id="clanFamiliar" name="clanFamiliar" label="Clan Familiar" control={control} rules={reglaObligatorio} />
                <FormInputText id="organizacion" name="organizacion" label="Organizacion Criminal" control={control} rules={reglaObligatorio} />
                <div className="hidden lg:block"></div>

                <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInputText id="coordX" name="coordX" label="Latitud" control={control} rules={reglaObligatorio} />
                    <FormInputText id="coordY" name="coordY" label="Longitud" control={control} rules={reglaObligatorio} />
                </div>

                <div className="col-span-1 lg:col-span-3 mt-4">
                    <Mapa
                        id="mapa-operativo-seccion-1"
                        mapRef={mapRef}
                        centro={[Number(coordX) || -17.78507, Number(coordY) || -63.1761788]}
                        zoom={15.63}
                        height={400}
                        onClick={handleMapClick}
                        markers={
                            coordX && coordY ? (
                                <Marker position={[Number(coordX), Number(coordY)]} icon={ICON} />
                            ) : null
                        }
                    />
                </div>

                <div className="col-span-1 lg:col-span-3 mt-4">
                    <FormInputText
                        id="breveDetalle"
                        name="breveDetalle"
                        label="Breve Detalle del Operativo"
                        control={control}
                        rules={reglaObligatorio}
                        multiline={true}
                        rows={6}
                    />
                </div>

                <div className="col-span-1 lg:col-span-3 flex justify-end mt-4">
                    <Button variant="primary" type="button" onClick={() => void handleGuardar()} disabled={cargando}>
                        {tieneOperativo ? 'Actualizar' : 'Guardar'}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
