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
import { GestionOperativosDatosGeneralesService } from '@/services/operativos'
import type { CasoOperativoDetalle } from '@/services/operativos'
import type { OperativoPayload } from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface DatosGeneralesFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    cargando?: boolean
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
    coordX: -17.78507,
    coordY: -63.1761788,
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

const mapCasoOperativoToForm = (
    data: CasoOperativoDetalle
): Partial<OperativoPayload> => ({
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
    coordX: data.operativo?.coordX ?? DEFAULT_VALUES.coordX,
    coordY: data.operativo?.coordY ?? DEFAULT_VALUES.coordY,
    detalleOperativo:
        data.operativo?.breveDetalle ?? data.operativo?.descripcion ?? '',
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

    const coordX = watch('coordX')
    const coordY = watch('coordY')
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
        const id = Number(departamentoSeleccionado)
        if (id > 0) {
            setValue('idProvincia', '')
            setValue('idMunicipio', '')
            void cargarProvincias(id)
        }
    }, [departamentoSeleccionado, setValue, cargarProvincias])

    useEffect(() => {
        const id = Number(provinciaSeleccionada)
        if (id > 0) {
            setValue('idMunicipio', '')
            void cargarLocalidades(id)
        }
    }, [provinciaSeleccionada, setValue, cargarLocalidades])

    useEffect(() => {
        const id = Number(unidadSeleccionada)
        if (id > 0) {
            setValue('idDistrital', '')
            setValue('idGrupo', '')
            void cargarDistritales(id)
        }
    }, [unidadSeleccionada, setValue, cargarDistritales])

    useEffect(() => {
        const id = Number(distritalSeleccionado)
        if (id > 0) {
            setValue('idGrupo', '')
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
                    descripcion: payload.descripcion,
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
        let datosCasoOperativo: Partial<DatosGeneralesPayload> = {}
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

                <FormInputText id="numeroInforme" name="numeroInforme" label="Numero de Informe" control={control} rules={reglaObligatorio} />
                <FormInputText id="nombreCaso" name="nombreCaso" label="Nombre del Caso" control={control} rules={reglaObligatorio} />
                <div className="hidden lg:block"></div>

                <FormInputDropdown id="idUnidad" name="idUnidad" label="Unidad" control={control} options={opcionesUnidadEst} rules={reglaObligatorio} />
                <FormInputDropdown id="idDistrital" name="idDistrital" label="Distrital" control={control} options={opcionesDistritalEst} disabled={opcionesDistritalEst.length === 0} rules={reglaObligatorio} />
                <FormInputDropdown id="idGrupo" name="idGrupo" label="Grupo" control={control} options={opcionesGrupoEst} disabled={opcionesGrupoEst.length === 0} rules={reglaObligatorio} />

                <FormInputText id="quienRealiza" name="quienRealiza" label="Quien Realiza la Solicitud" control={control} rules={reglaObligatorio} />
                <FormInputText id="celularRealiza" name="celularRealiza" label="Nro. Celular" control={control} rules={reglaObligatorio} />
                <div className="hidden lg:block"></div>

                <FormInputText id="asignado" name="asignado" label="Asignado al Caso" control={control} rules={reglaObligatorio} />
                <FormInputText id="celularAsignado" name="celularAsignado" label="Nro. Celular" control={control} rules={reglaObligatorio} />
                <div className="hidden lg:block"></div>

                <FormInputText id="fiscal" name="fiscal" label="Fiscal Asignado" control={control} rules={reglaObligatorio} />
                <FormInputText id="celularFiscal" name="celularFiscal" label="Nro. Celular" control={control} rules={reglaObligatorio} />
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

                <FormInputDropdown id="idItemOperativo" name="idItemOperativo" label="Operativo Realizado en" control={control} options={opcionesOperativoEn} rules={reglaObligatorio} />
                <FormInputDropdown id="idCategoriaOperativo" name="idCategoriaOperativo" label="Categoria Operativo" control={control} options={opcionesTipoLugar} rules={reglaObligatorio} />
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
