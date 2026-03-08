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
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import { GestionOperativosDatosGeneralesService } from '@/services/operativos'
import type { CasoOperativoDetalle } from '@/services/operativos'
import type { OperativoPayload } from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'

interface DatosGeneralesFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    cargando?: boolean
}

interface DatosGeneralesPayload {
    numeroOperativo: string
    relevancia: string
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
    tipoDenuncia: string
    tipoPenal: string
    fechaHora: Date
    departamento: string
    provincia: string
    municipio: string
    localidad: string
    operativoEn: string
    tipoLugar: string
    mando: string
    plan: string
    tipoOperativo: string
    clan: string
    organizacion: string
    latitud: number
    longitud: number
    detalleOperativo: string
}

const ICON = icon({
    iconRetinaUrl: '/leaflet/marker-icon.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconAnchor: [12.5, 41],
})

const DEFAULT_VALUES: DatosGeneralesPayload = {
    numeroOperativo: 'CB-UM-363/25',
    relevancia: '',
    numeroInforme: '',
    nombreCaso: '',
    unidad: '',
    distrital: '',
    grupo: '',
    quienRealiza: 'TTE. SERGIO DALMAR CLAROS ROMERO',
    celularRealiza: '70377797',
    asignado: 'TTE. SERGIO DALMAR CLAROS ROMERO',
    celularAsignado: '70377797',
    fiscal: 'DRA. MARIANA ALBORNOZ DURAN',
    celularFiscal: '78456883',
    tipoDenuncia: 'de_oficio',
    tipoPenal: '',
    fechaHora: new Date('2025-11-27T04:00:00'),
    departamento: '',
    provincia: '',
    municipio: '',
    localidad: 'CENTRAL VILLA 14 DE SEPTIEMBRE SINDICATO VILLA POR VENIR',
    operativoEn: 'centros',
    tipoLugar: 'rural',
    mando: 'CAP. OSCAR DANIEL CHOQUE ALARCON',
    plan: '',
    tipoOperativo: '',
    clan: '',
    organizacion: '',
    latitud: 16.48,
    longitud: -65.31936111111111,
    detalleOperativo: '',
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

const toDms = (coordinate: number) => {
    const abs = Math.abs(coordinate)
    const grados = Math.trunc(abs)
    const minFloat = (abs - grados) * 60
    const min = Math.trunc(minFloat)
    const seg = (minFloat - min) * 60

    return { grados, min, seg }
}

const mapCasoOperativoToForm = (
    data: CasoOperativoDetalle
): Partial<DatosGeneralesPayload> => ({
    numeroOperativo:
        data.operativo?.numeroOperativo ??
        data.caso?.numeroOperativo ??
        DEFAULT_VALUES.numeroOperativo,
    nombreCaso: data.caso?.nombreCaso ?? '',
    quienRealiza: data.caso?.fiscalSolicitud ?? '',
    celularRealiza: data.caso?.telefonoSolicitud ?? '',
    asignado: data.caso?.asignadoCaso ?? '',
    celularAsignado: data.caso?.telefonoAsignado ?? '',
    fiscal: data.caso?.fiscalAsignadoCaso ?? '',
    celularFiscal: data.caso?.telefonoFiscal ?? '',
    relevancia: toStringOrEmpty(data.operativo?.idTipoRelevancia),
    tipoDenuncia: toStringOrEmpty(data.operativo?.idTipoDenuncia),
    tipoPenal: toStringOrEmpty(data.operativo?.idTipoPenal),
    fechaHora: data.operativo?.fechaOperativo
        ? new Date(data.operativo.fechaOperativo)
        : DEFAULT_VALUES.fechaHora,
    departamento: toStringOrEmpty(data.operativo?.idDepartamento),
    provincia: toStringOrEmpty(data.operativo?.idProvincia),
    municipio: toStringOrEmpty(data.operativo?.idLocalidad),
    localidad: data.operativo?.lugar ?? '',
    unidad: toStringOrEmpty(data.operativo?.idUnidad),
    distrital: toStringOrEmpty(data.operativo?.idDistrital),
    grupo: toStringOrEmpty(data.operativo?.idGrupo),
    mando: data.operativo?.mando ?? '',
    plan: toStringOrEmpty(data.operativo?.idPlanOperacion),
    tipoOperativo: toStringOrEmpty(data.operativo?.idTipoOperacion),
    clan: data.operativo?.clanFamiliar ?? '',
    organizacion: data.operativo?.organizacion ?? '',
    latitud: data.operativo?.coordX ?? DEFAULT_VALUES.latitud,
    longitud: data.operativo?.coordY ?? DEFAULT_VALUES.longitud,
    detalleOperativo:
        data.operativo?.breveDetalle ?? data.operativo?.descripcion ?? '',
})

export function DatosGeneralesForm({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: DatosGeneralesFormProps) {
    const searchParams = useSearchParams()
    const [parametricasBaseListas, setParametricasBaseListas] = useState(false)
    const autoRecuperadoRef = useRef(false)
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

    const { control, watch, setValue, getValues, reset } = useForm<DatosGeneralesPayload>({
        defaultValues: DEFAULT_VALUES,
    })

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

    const opcionesOperativoEn: optionType[] = planesOperaciones.map((p) => ({
        id: String(p.id),
        value: String(p.id),
        label: String(p.nombre ?? ''),
    }))

    const opcionesTipoLugar: optionType[] = tiposOperacion.map((t) => ({
        id: String(t.id),
        value: String(t.id),
        label: String(t.descripcion ?? ''),
    }))

    const latitud = watch('latitud')
    const longitud = watch('longitud')
    const departamentoSeleccionado = watch('departamento')
    const provinciaSeleccionada = watch('provincia')
    const unidadSeleccionada = watch('unidad')
    const distritalSeleccionado = watch('distrital')
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
        const id = Number(departamentoSeleccionado)
        if (id > 0) {
            setValue('provincia', '')
            setValue('municipio', '')
            void cargarProvincias(id)
        }
    }, [departamentoSeleccionado, setValue, cargarProvincias])

    useEffect(() => {
        const id = Number(provinciaSeleccionada)
        if (id > 0) {
            setValue('municipio', '')
            void cargarLocalidades(id)
        }
    }, [provinciaSeleccionada, setValue, cargarLocalidades])

    useEffect(() => {
        const id = Number(unidadSeleccionada)
        if (id > 0) {
            setValue('distrital', '')
            setValue('grupo', '')
            void cargarDistritales(id)
        }
    }, [unidadSeleccionada, setValue, cargarDistritales])

    useEffect(() => {
        const id = Number(distritalSeleccionado)
        if (id > 0) {
            setValue('grupo', '')
            void cargarGrupos(id)
        }
    }, [distritalSeleccionado, setValue, cargarGrupos])

    const handleMapClick = (center: [number, number]) => {
        setValue('latitud', center[0])
        setValue('longitud', center[1])
    }

    const handleGuardar = async () => {
        const payload = getValues()
        const idCaso = Number(searchParams.get('id') ?? 0)

        if (idCaso > 0) {
            const latitud = Number(payload.latitud) || 0
            const longitud = Number(payload.longitud) || 0
            const dmsX = toDms(latitud)
            const dmsY = toDms(longitud)

            const payloadOperativo: OperativoPayload = {
                numeroOperativo: payload.numeroOperativo,
                idTipoRelevancia: toNumberOrZero(payload.relevancia),
                idTipoDenuncia: toNumberOrZero(payload.tipoDenuncia),
                idTipoPenal: toNumberOrZero(payload.tipoPenal),
                fechaOperativo: toIsoDate(payload.fechaHora),
                idDepartamento: toNumberOrZero(payload.departamento),
                idProvincia: toNumberOrZero(payload.provincia),
                idLocalidad: toNumberOrZero(payload.municipio),
                lugar: payload.localidad,
                idCategoriaOperativo: toNumberOrZero(payload.tipoLugar),
                idItemOperativo: toNumberOrZero(payload.operativoEn),
                idUnidad: toNumberOrZero(payload.unidad),
                idDistrital: toNumberOrZero(payload.distrital),
                idGrupo: toNumberOrZero(payload.grupo),
                mando: payload.mando,
                gradosX: dmsX.grados,
                minX: dmsX.min,
                segX: dmsX.seg,
                gradosY: dmsY.grados,
                minY: dmsY.min,
                segY: dmsY.seg,
                idPlanOperacion: toNumberOrZero(payload.plan),
                breveDetalle: payload.detalleOperativo,
                descripcion: payload.detalleOperativo,
                idTipoOperacion: toNumberOrZero(payload.tipoOperativo),
                organizacion: payload.organizacion,
                clanFamiliar: payload.clan,
            }

            await GestionOperativosDatosGeneralesService.crearOperativo(
                idCaso,
                payloadOperativo
            )
            return
        }

        await onGuardar(payload as unknown as SeccionPayloadBase)
    }

    const handleRecuperar = useCallback(async () => {
        let datosCasoOperativo: Partial<DatosGeneralesPayload> = {}
        const idCaso = Number(searchParams.get('id') ?? 0)

        if (idCaso > 0) {
            const respuestaCaso =
                await GestionOperativosDatosGeneralesService.obtenerPorUsuario(
                    idCaso
                )

            if (respuestaCaso?.datos) {
                datosCasoOperativo = mapCasoOperativoToForm(respuestaCaso.datos)
            }
        }

        const respuestaSeccion = await onRecuperar()
        const datosSeccion =
            (respuestaSeccion as { data?: { datos?: Partial<DatosGeneralesPayload> } })?.data
                ?.datos ??
            (respuestaSeccion as { datos?: Partial<DatosGeneralesPayload> })?.datos

        const datos =
            Object.keys(datosCasoOperativo).length > 0
                ? {
                    ...datosCasoOperativo,
                    ...datosSeccion,
                }
                : datosSeccion

        if (datos && typeof datos === 'object') {
            const payload = { ...datos }
            const fechaHoraRaw = (payload as { fechaHora?: unknown }).fechaHora
            if (typeof fechaHoraRaw === 'string') {
                const payloadMutable = payload as { fechaHora?: Date }
                payloadMutable.fechaHora = new Date(fechaHoraRaw)
            }

            reset({
                ...DEFAULT_VALUES,
                ...payload,
            })
        } else if (Object.keys(datosCasoOperativo).length > 0) {
            reset({
                ...DEFAULT_VALUES,
                ...datosCasoOperativo,
            })
        }
    }, [onRecuperar, reset, searchParams])

    useEffect(() => {
        if (!parametricasBaseListas || autoRecuperadoRef.current) {
            return
        }

        autoRecuperadoRef.current = true
        void handleRecuperar()
    }, [parametricasBaseListas, handleRecuperar])

    if (!parametricasBaseListas) {
        return <FullScreenLoading mensaje="Cargando parámetros del formulario..." />
    }

    return (
        <Card title="DATOS GENERALES">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1 lg:col-span-3">
                    <h3 className="text-base font-semibold">{titulo}</h3>
                </div>

                <FormInputText id="numeroOperativo" name="numeroOperativo" label="Numero de Operativo" control={control} />
                <FormInputDropdown id="relevancia" name="relevancia" label="Relevancia" control={control} options={opcionesRelevancia} />
                <div className="hidden lg:block"></div>

                <FormInputText id="numeroInforme" name="numeroInforme" label="Numero de Informe" control={control} />
                <FormInputText id="nombreCaso" name="nombreCaso" label="Nombre del Caso" control={control} />
                <div className="hidden lg:block"></div>

                <FormInputDropdown id="unidad" name="unidad" label="Unidad" control={control} options={opcionesUnidadEst} />
                <FormInputDropdown id="distrital" name="distrital" label="Distrital" control={control} options={opcionesDistritalEst} disabled={opcionesDistritalEst.length === 0} />
                <FormInputDropdown id="grupo" name="grupo" label="Grupo" control={control} options={opcionesGrupoEst} disabled={opcionesGrupoEst.length === 0} />

                <FormInputText id="quienRealiza" name="quienRealiza" label="Quien Realiza la Solicitud" control={control} />
                <FormInputText id="celularRealiza" name="celularRealiza" label="Nro. Celular" control={control} />
                <div className="hidden lg:block"></div>

                <FormInputText id="asignado" name="asignado" label="Asignado al Caso" control={control} />
                <FormInputText id="celularAsignado" name="celularAsignado" label="Nro. Celular" control={control} />
                <div className="hidden lg:block"></div>

                <FormInputText id="fiscal" name="fiscal" label="Fiscal Asignado" control={control} />
                <FormInputText id="celularFiscal" name="celularFiscal" label="Nro. Celular" control={control} />
                <div className="hidden lg:block"></div>

                <FormInputDropdown id="tipoDenuncia" name="tipoDenuncia" label="Tipo de la Denuncia" control={control} options={opcionesTipoDenuncia} />
                <FormInputDropdown id="tipoPenal" name="tipoPenal" label="Tipo Penal" control={control} options={opcionesTipoPenal} />
                <FormInputDate id="fechaHora" name="fechaHora" label="Fecha y Hora del Operativo" control={control} />

                <FormInputDropdown id="departamento" name="departamento" label="Departamento" control={control} options={opcionesDepartamento} />
                <FormInputDropdown id="provincia" name="provincia" label="Provincia" control={control} options={opcionesProvicia} disabled={opcionesProvicia.length === 0} />
                <FormInputDropdown id="municipio" name="municipio" label="Municipio" control={control} options={opcionesMunicipio} disabled={opcionesMunicipio.length === 0} />

                <div className="col-span-1 lg:col-span-3">
                    <FormInputText
                        id="localidad"
                        name="localidad"
                        label="En la localidad, comunidad, direccion (Zona, Calle, Avenida, Barrio)"
                        control={control}
                    />
                </div>

                <FormInputDropdown id="operativoEn" name="operativoEn" label="Operativo Realizado en" control={control} options={opcionesOperativoEn} />
                <FormInputDropdown id="tipoLugar" name="tipoLugar" label="Categoria Operativo" control={control} options={opcionesTipoLugar} />
                <FormInputText id="mando" name="mando" label="Al Mando de" control={control} />

                <FormInputDropdown id="plan" name="plan" label="Plan de Operaciones" control={control} options={opcionesPlan} />
                <FormInputDropdown id="tipoOperativo" name="tipoOperativo" label="El Operativo es de Tipo" control={control} options={opcionesTipoOperativo} />
                <div className="hidden lg:block"></div>

                <FormInputText id="clan" name="clan" label="Clan Familiar" control={control} />
                <FormInputText id="organizacion" name="organizacion" label="Organizacion Criminal" control={control} />
                <div className="hidden lg:block"></div>

                <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInputText id="latitud" name="latitud" label="Latitud" control={control} />
                    <FormInputText id="longitud" name="longitud" label="Longitud" control={control} />
                </div>

                <div className="col-span-1 lg:col-span-3 mt-4">
                    <Mapa
                        id="mapa-operativo-seccion-1"
                        mapRef={mapRef}
                        centro={[Number(latitud) || -17.4, Number(longitud) || -66.15]}
                        zoom={15}
                        height={400}
                        onClick={handleMapClick}
                        markers={
                            latitud && longitud ? (
                                <Marker position={[Number(latitud), Number(longitud)]} icon={ICON} />
                            ) : null
                        }
                    />
                </div>

                <div className="col-span-1 lg:col-span-3 mt-4">
                    <FormInputText
                        id="detalleOperativo"
                        name="detalleOperativo"
                        label="Breve Detalle del Operativo"
                        control={control}
                        multiline={true}
                        rows={6}
                    />
                </div>

                <div className="col-span-1 lg:col-span-3 flex gap-2 justify-end mt-4">
                    <Button variant="outline-secondary" type="button" onClick={() => void handleRecuperar()} disabled={cargando}>
                        Recuperar
                    </Button>
                    <Button variant="primary" type="button" onClick={() => void handleGuardar()} disabled={cargando}>
                        Guardar Seccion 1
                    </Button>
                </div>
            </div>
        </Card>
    )
}
