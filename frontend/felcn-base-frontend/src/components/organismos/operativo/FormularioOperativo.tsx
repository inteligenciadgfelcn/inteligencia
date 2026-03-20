'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { FormInputText, FormInputDropdown, FormInputDate } from '@/components/form';
import { optionType } from '@/components/form/FormInputDropdown';
import FormInputFile from '@/components/form/FormInputFile';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';

const MapaConMarcador = dynamic(
    () => import('@/components/mapas/MapaConMarcador'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[400px] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ),
    }
)
import { DataTable } from 'mantine-datatable';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import { useParametricas } from '@/hooks';
import { SiiiLookupsService } from '@/services/parametricas';


export const FormularioOperativo = () => {
    const formatearCantidad = (valor: number) => {
        if (!Number.isFinite(valor)) return ''
        if (Number.isInteger(valor)) return String(valor)
        return valor.toFixed(12).replace(/\.?0+$/, '')
    }

    const parsearNumero = (valor: string) => {
        const normalizado = valor
            .trim()
            .replace(/\s+/g, '')
            .replace(',', '.')
            .replace(/[^0-9.-]/g, '')

        if (!normalizado) return null
        const numero = Number(normalizado)
        return Number.isFinite(numero) ? numero : null
    }

    const actualizarCantidades = (unidad: 'tn' | 'kg' | 'g' | 'mg', valor: string) => {
        if (valor.trim().length === 0) {
            setValue('cantidadTn', '')
            setValue('cantidadKg', '')
            setValue('cantidadG', '')
            setValue('cantidadMg', '')
            return
        }

        const numero = parsearNumero(valor)
        if (numero === null) return

        const kilos =
            unidad === 'tn'
                ? numero * 1000
                : unidad === 'kg'
                    ? numero
                    : unidad === 'g'
                        ? numero / 1000
                        : numero / 1_000_000

        const toneladas = kilos / 1000
        const gramos = kilos * 1000
        const miligramos = gramos * 1000

        if (unidad !== 'tn') setValue('cantidadTn', formatearCantidad(toneladas))
        if (unidad !== 'kg') setValue('cantidadKg', formatearCantidad(kilos))
        if (unidad !== 'g') setValue('cantidadG', formatearCantidad(gramos))
        if (unidad !== 'mg') setValue('cantidadMg', formatearCantidad(miligramos))
    }

    const onCambioCantidad =
        (unidad: 'tn' | 'kg' | 'g' | 'mg') =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                actualizarCantidades(unidad, event.target.value)
            }

    const normalizarValorPais = (valor: string) =>
        valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')

    // ── Servicios paramétricos ────────────────────────────────────────────────
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
        // estructura
        distritales,
        grupos,
        cargarDistritales,
        cargarGrupos,
    } = useParametricas()

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

    // ── Estructura (Unidad → Distrital → Grupo) ───────────────────────────────
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

    const [opcionesPaises, setOpcionesPaises] = useState<optionType[]>([
        { id: 'bolivia', label: 'Bolivia', value: 'bolivia' },
    ])

    const { control, watch, setValue, getValues } = useForm({
        defaultValues: {
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
            fechaHora: new Date('2025-11-27T04:00:00'), // Example date
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
            logoImagen: '',
            logoDescripcion: '',
            logoOrganizacion: '',
            logoBlancos: '',
            logoObservacion: '',
            fotoLogo: [],
            sustanciaQuimicaSolidaTipo: '',
            sustanciaQuimicaSolidaCantidad: '',
            sustanciaQuimicaSolidaKilos: '',
            sustanciaQuimicaSolidaGramos: '',
            sustanciaQuimicaLiquidaTipo: '',
            sustanciaQuimicaLiquidaCantidad: '',
            sustanciaQuimicaLitros: '',
            sustanciaQuimicaMililitros: '',
            laboratorioTipo: '',
            laboratorioSubtipo: '',
            laboratorioCantidad: '',
            personaNombres: '',
            personaApPaterno: '',
            personaApMaterno: '',
            personaApEsposo: '',
            personaNacionalidad: '',
            personaGenero: '',
            personaTipoDocumento: '',
            personaNumeroDocumento: '',
            personaFechaNacimiento: new Date(),
            personaDireccion: '',
            personaEstado: '',
            personaFotoFrente: [],
            personaFotoPerfilIzq: [],
            personaFotoTarjetaSEGIP: [],
            bienTipo: '',
            bienManiobreros: '',
            bienClase: '',
            bienMunicionArmaCorta: '',
            bienTipoMunicion: '',
            bienMunicionPistola: '',
            bienCantidad: '',
            bienEnInvestigacion: '',
            bienFotografia: [],
            galeriaDescripcion: '',
            galeriaTamanoFoto: '',
            galeriaArchivo: []
        }
    });

    const [items, setItems] = useState<any[]>([
        {
            id: 14169,
            tipoDroga: 'COCAINA BASE',
            estadoDroga: 'HUMEDO',
            cantidad: '49.400,00',
            nroPastillas: 0,
            formaTransporte: 'frasco',
            procedencia: 'Bolivia',
            destino: 'Bolivia'
        }
    ]);

    const [bienesItems, setBienesItems] = useState<any[]>([]);

    const [galeriaItems, setGaleriaItems] = useState<any[]>([]);

    const deleteItem = (id: any) => {
        setItems(items.filter((d) => d.id !== id));
    };

    const deleteBienItem = (id: any) => {
        setBienesItems(bienesItems.filter((d) => d.id !== id));
    };

    const addItem = () => {
        const data = getValues();
        // Basic implementation to add current form values to table
        const pruebaCampoFile = data.fotoPruebaCampo && data.fotoPruebaCampo.length > 0 ? data.fotoPruebaCampo[0] : null;
        const cuantificacionFile = data.fotoCuantificacion && data.fotoCuantificacion.length > 0 ? data.fotoCuantificacion[0] : null;

        const newItem = {
            id: Math.floor(Math.random() * 100000),
            tipoDroga: data.tipoDroga,
            estadoDroga: data.estadoDroga,
            cantidad: `${data.cantidadTn || 0} Tn ${data.cantidadKg || 0} Kg`,
            nroPastillas: data.nroPastillas,
            formaTransporte: data.formaTransporte,
            procedencia: data.procedencia,
            destino: data.destino,
            pruebaCampoUrl: pruebaCampoFile ? URL.createObjectURL(pruebaCampoFile) : null,
            cuantificacionUrl: cuantificacionFile ? URL.createObjectURL(cuantificacionFile) : null
        };
        setItems([...items, newItem]);
    };

    const addBienItem = () => {
        const data = getValues();
        const fotografiaFile = data.bienFotografia && data.bienFotografia.length > 0 ? data.bienFotografia[0] : null;

        const newBien = {
            id: Math.floor(Math.random() * 100000),
            tipo: data.bienTipo,
            clase: data.bienClase,
            cantidad: data.bienCantidad,
            enInvestigacion: data.bienEnInvestigacion,
            fotografiaUrl: fotografiaFile ? URL.createObjectURL(fotografiaFile) : null
        };
        setBienesItems([...bienesItems, newBien]);
    };

    const deleteGaleriaItem = (id: any) => {
        setGaleriaItems(galeriaItems.filter((d) => d.id !== id));
    };

    const addGaleriaItem = () => {
        const data = getValues();
        const archivoFile = data.galeriaArchivo && data.galeriaArchivo.length > 0 ? data.galeriaArchivo[0] : null;

        const newFoto = {
            id: Math.floor(Math.random() * 100000),
            descripcion: data.galeriaDescripcion,
            tamanoFoto: data.galeriaTamanoFoto,
            fotografiaUrl: archivoFile ? URL.createObjectURL(archivoFile) : null
        };
        setGaleriaItems([...galeriaItems, newFoto]);
    };



    // ── Opciones por campo ────────────────────────────────────────────────────
    const opcionesOperativoEn = [
        { id: 'op-centros', label: 'Centros', value: 'centros' },
        { id: 'op-via-publica', label: 'Via Pública', value: 'via_publica' },
        { id: 'op-domicilio', label: 'Domicilio', value: 'domicilio' },
        { id: 'op-vehiculo', label: 'Vehículo', value: 'vehiculo' },
        { id: 'op-aeropuerto', label: 'Aeropuerto / Terminal', value: 'aeropuerto' },
    ]

    const opcionesTipoLugar = [
        { id: 'lug-rural', label: 'Rural', value: 'rural' },
        { id: 'lug-urbano', label: 'Urbano', value: 'urbano' },
    ]


    const latitud = watch('latitud');
    const longitud = watch('longitud');
    const departamentoSeleccionado = watch('departamento');
    const provinciaSeleccionada = watch('provincia');
    const unidadSeleccionada = watch('unidad');
    const distritalSeleccionado = watch('distrital');
    const mapRef = useRef(null);

    // ── Efectos en cascada: Geografía ────────────────────────────────────────
    useEffect(() => {
        cargarDepartamentos()
        cargarTiposRelevancia()
        cargarTiposDenuncia()
        cargarTiposPenal()
        cargarTiposOperacion()
        cargarPlanesOperaciones()
        cargarUnidadesSiii()
    }, [])

    useEffect(() => {
        const id = Number(departamentoSeleccionado)
        if (id > 0) {
            setValue('provincia', '')
            setValue('municipio', '')
            cargarProvincias(id)
        }
    }, [departamentoSeleccionado])

    useEffect(() => {
        const id = Number(provinciaSeleccionada)
        if (id > 0) {
            setValue('municipio', '')
            cargarLocalidades(id)
        }
    }, [provinciaSeleccionada])

    // ── Efectos en cascada: Estructura ───────────────────────────────────────
    useEffect(() => {
        const id = Number(unidadSeleccionada)
        if (id > 0) {
            setValue('distrital', '')
            setValue('grupo', '')
            cargarDistritales(id)
        }
    }, [unidadSeleccionada])

    useEffect(() => {
        const id = Number(distritalSeleccionado)
        if (id > 0) {
            setValue('grupo', '')
            cargarGrupos(id)
        }
    }, [distritalSeleccionado])

    useEffect(() => {
        let activo = true

        const cargarPaises = async () => {
            try {
                const res = await SiiiLookupsService.obtenerPaises()
                if (!activo || !res?.finalizado) return

                const opciones: optionType[] = (res.datos ?? [])
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
                        opciones.find((opcion) => opcion.value === 'bolivia') ??
                        opciones[0]
                    const procedenciaActual = String(getValues('procedencia') ?? '')
                    const destinoActual = String(getValues('destino') ?? '')

                    if (
                        procedenciaActual.length === 0 ||
                        !opciones.some((opcion) => opcion.value === procedenciaActual)
                    ) {
                        setValue('procedencia', opcionBolivia.value)
                    }

                    if (
                        destinoActual.length === 0 ||
                        !opciones.some((opcion) => opcion.value === destinoActual)
                    ) {
                        setValue('destino', opcionBolivia.value)
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
    }, [getValues, setValue])

    const handleMapClick = (center: [number, number]) => {
        setValue('latitud', center[0]);
        setValue('longitud', center[1]);
    };

    return (
        <>
            <Card title="DATOS GENERALES">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Row 1 */}
                    <FormInputText id="numeroOperativo" name="numeroOperativo" label="Numero de Operativo" control={control} />
                    <FormInputDropdown id="relevancia" name="relevancia" label="Relevancia" control={control} options={opcionesRelevancia} />
                    <div className="hidden lg:block"></div>

                    {/* Row 2 */}
                    <FormInputText id="numeroInforme" name="numeroInforme" label="Numero de Informe" control={control} />
                    <FormInputText id="nombreCaso" name="nombreCaso" label="Nombre del Caso" control={control} />
                    <div className="hidden lg:block"></div>

                    {/* Row 3 */}
                    <FormInputDropdown id="unidad" name="unidad" label="Unidad" control={control} options={opcionesUnidadEst} />
                    <FormInputDropdown id="distrital" name="distrital" label="Distrital" control={control} options={opcionesDistritalEst} disabled={opcionesDistritalEst.length === 0} />
                    <FormInputDropdown id="grupo" name="grupo" label="Grupo" control={control} options={opcionesGrupoEst} disabled={opcionesGrupoEst.length === 0} />

                    {/* Row 4 */}
                    <FormInputText id="quienRealiza" name="quienRealiza" label="Quien Realiza la Solicitud" control={control} />
                    <FormInputText id="celularRealiza" name="celularRealiza" label="Nro. Celular" control={control} />
                    <div className="hidden lg:block"></div>

                    {/* Row 5 */}
                    <FormInputText id="asignado" name="asignado" label="Asignado al Caso" control={control} />
                    <FormInputText id="celularAsignado" name="celularAsignado" label="Nro. Celular" control={control} />
                    <div className="hidden lg:block"></div>

                    {/* Row 6 */}
                    <FormInputText id="fiscal" name="fiscal" label="Fiscal Asignado" control={control} />
                    <FormInputText id="celularFiscal" name="celularFiscal" label="Nro. Celular" control={control} />
                    <div className="hidden lg:block"></div>

                    {/* Row 7 */}
                    <FormInputDropdown id="tipoDenuncia" name="tipoDenuncia" label="Tipo de la Denuncia" control={control} options={opcionesTipoDenuncia} />
                    <FormInputDropdown id="tipoPenal" name="tipoPenal" label="Tipo Penal" control={control} options={opcionesTipoPenal} />
                    <FormInputDate id="fechaHora" name="fechaHora" label="Fecha y Hora del Operativo" control={control} />

                    {/* Row 8 */}
                    <FormInputDropdown
                        id="departamento"
                        name="departamento"
                        label="Departamento"
                        control={control}
                        options={opcionesDepartamento}
                    />
                    <FormInputDropdown
                        id="provincia"
                        name="provincia"
                        label="Provincia"
                        control={control}
                        options={opcionesProvicia}
                        disabled={opcionesProvicia.length === 0}
                    />
                    <FormInputDropdown
                        id="municipio"
                        name="municipio"
                        label="Municipio"
                        control={control}
                        options={opcionesMunicipio}
                        disabled={opcionesMunicipio.length === 0}
                    />

                    {/* Row 9 */}
                    <div className="col-span-1 lg:col-span-3">
                        <FormInputText id="localidad" name="localidad" label="En la localidad, comunidad, direccion (Zona, Calle, Avenida, Barrio)" control={control} />
                    </div>

                    {/* Row 10 */}
                    <FormInputDropdown id="operativoEn" name="operativoEn" label="Operativo Realizado en" control={control} options={opcionesOperativoEn} />
                    <FormInputDropdown id="tipoLugar" name="tipoLugar" label="Tipo Lugar" control={control} options={opcionesTipoLugar} />
                    <FormInputText id="mando" name="mando" label="Al Mando de" control={control} />

                    {/* Row 11 */}
                    <FormInputDropdown id="plan" name="plan" label="Plan de Operaciones" control={control} options={opcionesPlan} />
                    <FormInputDropdown id="tipoOperativo" name="tipoOperativo" label="El Operativo es de Tipo" control={control} options={opcionesTipoOperativo} />
                    <div className="hidden lg:block"></div>

                    {/* Row 12 */}
                    <FormInputText id="clan" name="clan" label="Clan Familiar" control={control} />
                    <FormInputText id="organizacion" name="organizacion" label="Organizacion Criminal" control={control} />
                    <div className="hidden lg:block"></div>

                    {/* Row 13 - Coordinates */}
                    <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInputText id="latitud" name="latitud" label="Latitud" control={control} />
                        <FormInputText id="longitud" name="longitud" label="Longitud" control={control} />
                    </div>

                    {/* Map Section */}
                    <div className="col-span-1 lg:col-span-3 mt-4">
                        <MapaConMarcador
                            id="mapa-operativo"
                            mapRef={mapRef}
                            centro={[Number(latitud) || -17.40, Number(longitud) || -66.15]}
                            zoom={15}
                            height={400}
                            onClick={handleMapClick}
                            coordenadas={
                                latitud && longitud
                                    ? [Number(latitud), Number(longitud)]
                                    : null
                            }
                        />
                    </div>

                    {/* TextArea Section */}
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

                    <div className="col-span-1 lg:col-span-3 flex justify-end mt-4">
                        <Button variant="primary" type="submit">Guardar</Button>
                    </div>
                </div>
            </Card>

            {/* DRUGS SECTION */}
            <Card title="DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Row 1 */}
                    <FormInputDropdown id="tipoDroga" name="tipoDroga" label="Tipo de Droga" control={control} options={[{ id: 'marihuana', label: 'Marihuana', value: 'marihuana' }, { id: 'cocaina', label: 'Cocaina', value: 'cocaina' }]} />
                    <FormInputDropdown id="estadoDroga" name="estadoDroga" label="Estado de la Droga" control={control} options={[{ id: 'seco', label: 'Seco', value: 'seco' }, { id: 'humedo', label: 'Humedo', value: 'humedo' }]} />
                    <FormInputText id="cocainaLiquida" name="cocainaLiquida" label="Cocaina Liquida en Litros" control={control} />

                    {/* Row 2 - Cantidad Group */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Cantidad</label>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">Tn</span>
                                <FormInputText id="cantidadTn" name="cantidadTn" label="" control={control} size="small" onChange={onCambioCantidad('tn')} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">Kg</span>
                                <FormInputText id="cantidadKg" name="cantidadKg" label="" control={control} size="small" onChange={onCambioCantidad('kg')} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">g</span>
                                <FormInputText id="cantidadG" name="cantidadG" label="" control={control} size="small" onChange={onCambioCantidad('g')} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">Mg</span>
                                <FormInputText id="cantidadMg" name="cantidadMg" label="" control={control} size="small" onChange={onCambioCantidad('mg')} />
                            </div>
                        </div>
                    </div>
                    <FormInputText id="nroPastillas" name="nroPastillas" label="Nro. Pastillas o Capsulas (Tragones)" control={control} />


                    {/* Row 3 */}
                    <FormInputDropdown id="formaTransporte" name="formaTransporte" label="Forma de Transporte" control={control} options={[{ id: 'terrestre', label: 'Terrestre', value: 'terrestre' }, { id: 'aereo', label: 'Aereo', value: 'aereo' }, { id: 'fluvial', label: 'Fluvial', value: 'fluvial' }]} />
                    <FormInputDropdown id="procedencia" name="procedencia" label="Procedencia" control={control} options={opcionesPaises} />
                    <FormInputDropdown id="destino" name="destino" label="Destino" control={control} options={opcionesPaises} />

                    {/* Row 4 - File Upload 1 */}
                    <div className="col-span-1 lg:col-span-3">
                        <FormInputFile
                            id="fotoPruebaCampo"
                            name="fotoPruebaCampo"
                            label="Fotografia Prueba de Campo"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    {/* Row 5 - File Upload 2 */}
                    <div className="col-span-1 lg:col-span-3">
                        <FormInputFile
                            id="fotoCuantificacion"
                            name="fotoCuantificacion"
                            label="Fotografia Cuantificacion y Pesaje"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-3 flex justify-end mt-4">
                        <Button variant="primary" type="button" onClick={addItem}>Guardar</Button>
                    </div>

                    <div className="col-span-1 lg:col-span-3 mt-5">
                        <div className="datatables">
                            <DataTable
                                withTableBorder={false}
                                className="whitespace-nowrap table-hover"
                                records={items}
                                columns={[
                                    { accessor: 'id', title: 'Id' },
                                    { accessor: 'tipoDroga', title: 'Tipo de Droga' },
                                    { accessor: 'estadoDroga', title: 'Estado de la Droga' },
                                    { accessor: 'cantidad', title: 'Cantidad (gramos) / Litros' },
                                    { accessor: 'nroPastillas', title: 'Nro. de Capsulas' },
                                    { accessor: 'formaTransporte', title: 'Forma de Transporte' },
                                    { accessor: 'procedencia', title: 'Procedencia' },
                                    { accessor: 'destino', title: 'Destino' },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <div className="flex items-center gap-2">
                                                <button type="button" className="btn btn-primary btn-sm">Añadir Logo</button>
                                                <button type="button" className="text-danger" onClick={() => deleteItem(row.id)}>
                                                    <IconTrashLines />
                                                </button>
                                            </div>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* FOTO DATA SECTION */}
            <Card title="FOTOGRAFIA DE LA PRUEBA DE CAMPO Y LA CUANTIFICACION, PESAJE DE LA SUSTANCIA SECUESTRADA" className="mt-5">
                <div className="datatables">
                    <DataTable
                        withTableBorder={false}
                        className="whitespace-nowrap table-hover"
                        records={items}
                        columns={[
                            { accessor: 'id', title: 'Id' },
                            { accessor: 'tipoDroga', title: 'Tipo de Droga' },
                            {
                                accessor: 'pruebaCampo',
                                title: 'Prueba de Campo',
                                render: (row) => (
                                    row.pruebaCampoUrl ? (
                                        <img src={row.pruebaCampoUrl} alt="Prueba de Campo" className="w-32 h-20 object-cover rounded shadow-sm" />
                                    ) : null
                                ),
                            },
                            {
                                accessor: 'cuantificacion',
                                title: 'Cuantificacion y Pesaje',
                                render: (row) => (
                                    row.cuantificacionUrl ? (
                                        <img src={row.cuantificacionUrl} alt="Cuantificacion" className="w-32 h-20 object-cover rounded shadow-sm" />
                                    ) : null
                                ),
                            },
                        ]}
                        highlightOnHover
                    />
                </div>
            </Card>

            {/* LOGOTIPOS SECTION */}
            <Card title="LOGOTIPOS" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Row 1 */}
                    <FormInputText id="logoImagen" name="logoImagen" label="Imagen" control={control} />
                    <FormInputText id="logoDescripcion" name="logoDescripcion" label="Descripcion del Logo" control={control} />
                    <FormInputText id="logoOrganizacion" name="logoOrganizacion" label="Organizacion Criminal" control={control} />

                    {/* Row 2 */}
                    <FormInputText id="logoBlancos" name="logoBlancos" label="Posibles Blancos" control={control} />
                    <FormInputText id="logoObservacion" name="logoObservacion" label="Observacion" control={control} />
                    <div className="hidden lg:block"></div>

                    {/* Row 3 - File Upload */}
                    <div className="col-span-1 lg:col-span-3">
                        <FormInputFile
                            id="fotoLogo"
                            name="fotoLogo"
                            label="Fotografia"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-3 mt-4">
                        <Button variant="primary" type="button">Añadir Logo</Button>
                    </div>
                </div>
            </Card>

            {/* SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS */}
            <Card title="SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormInputDropdown
                        id="sustanciaQuimicaSolidaTipo"
                        name="sustanciaQuimicaSolidaTipo"
                        label="Tipo de Sustancia"
                        control={control}
                        options={[{ id: 'sustancia1', label: 'Seleccione un Dato', value: '' }]}
                    />
                    <FormInputText id="sustanciaQuimicaSolidaCantidad" name="sustanciaQuimicaSolidaCantidad" label="Cantidad" control={control} />
                    <FormInputText id="sustanciaQuimicaSolidaKilos" name="sustanciaQuimicaSolidaKilos" label="Kilos" control={control} />
                    <FormInputText id="sustanciaQuimicaSolidaGramos" name="sustanciaQuimicaSolidaGramos" label="Gramos" control={control} />

                    <div className="col-span-1 lg:col-span-4 mt-4">
                        <Button variant="success" type="button">Agregar Sustancia</Button>
                    </div>
                </div>
            </Card>

            {/* SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS */}
            <Card title="SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormInputDropdown
                        id="sustanciaQuimicaLiquidaTipo"
                        name="sustanciaQuimicaLiquidaTipo"
                        label="Tipo de Sustancia"
                        control={control}
                        options={[{ id: 'sustancia1', label: 'Seleccione un Dato', value: '' }]}
                    />
                    <FormInputText id="sustanciaQuimicaLiquidaCantidad" name="sustanciaQuimicaLiquidaCantidad" label="Cantidad" control={control} />
                    <FormInputText id="sustanciaQuimicaLitros" name="sustanciaQuimicaLitros" label="Litros" control={control} />
                    <FormInputText id="sustanciaQuimicaMililitros" name="sustanciaQuimicaMililitros" label="Mililitros" control={control} />

                    <div className="col-span-1 lg:col-span-4 mt-4">
                        <Button variant="warning" type="button">Agregar Sustancia</Button>
                    </div>
                </div>
            </Card>

            {/* LABORATORIOS Y FABRICAS */}
            <Card title="LABORATORIOS Y FABRICAS" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormInputDropdown
                        id="laboratorioTipo"
                        name="laboratorioTipo"
                        label="Tipo"
                        control={control}
                        options={[{ id: 'lab1', label: 'Seleccione un Dato', value: '' }]}
                    />
                    <FormInputDropdown
                        id="laboratorioSubtipo"
                        name="laboratorioSubtipo"
                        label=""
                        control={control}
                        options={[{ id: 'lab2', label: 'Seleccione un Dato', value: '' }]}
                    />
                    <FormInputText id="laboratorioCantidad" name="laboratorioCantidad" label="Cantidad" control={control} />

                    <div className="col-span-1 lg:col-span-3 mt-4">
                        <Button variant="danger" type="button">Agregar tipo</Button>
                    </div>
                </div>
            </Card>

            {/* PERSONAS SECTION */}
            <Card title="PERSONAS: PRINCIPAL IMPLICADO / APREHENDIDAS / ARRESTADAS / LGI O PERDIDA DE DOMINIO" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Row 1 */}
                    <FormInputText id="personaNombres" name="personaNombres" label="Nombre(s)" control={control} />
                    <FormInputText id="personaApPaterno" name="personaApPaterno" label="Ap. Paterno" control={control} />
                    <FormInputText id="personaApMaterno" name="personaApMaterno" label="Ap. Materno" control={control} />
                    <FormInputText id="personaApEsposo" name="personaApEsposo" label="Ap. Esposo" control={control} />

                    {/* Row 2 */}
                    <FormInputDropdown
                        id="personaNacionalidad"
                        name="personaNacionalidad"
                        label="Nacionalidad"
                        control={control}
                        options={[{ id: 'bolivia', label: 'Bolivia', value: 'bolivia' }]}
                    />
                    <FormInputDropdown
                        id="personaGenero"
                        name="personaGenero"
                        label="Genero"
                        control={control}
                        options={[{ id: 'masculino', label: 'Masculino', value: 'masculino' }, { id: 'femenino', label: 'Femenino', value: 'femenino' }]}
                    />
                    <FormInputDropdown
                        id="personaTipoDocumento"
                        name="personaTipoDocumento"
                        label="Tipo de Documento"
                        control={control}
                        options={[{ id: 'ninguno', label: 'Ninguno', value: '' }]}
                    />
                    <FormInputText id="personaNumeroDocumento" name="personaNumeroDocumento" label="Numero de Documento" control={control} />

                    {/* Row 3 */}
                    <FormInputDate id="personaFechaNacimiento" name="personaFechaNacimiento" label="Fecha de Nacimiento" control={control} />
                    <div className="col-span-1 lg:col-span-2">
                        <FormInputText id="personaDireccion" name="personaDireccion" label="Direccion" control={control} />
                    </div>
                    <FormInputDropdown
                        id="personaEstado"
                        name="personaEstado"
                        label="Estado de la Persona"
                        control={control}
                        options={[{ id: 'principal', label: 'Principal Aprehendido', value: 'principal' }]}
                    />

                    {/* File Uploads */}
                    <div className="col-span-1 lg:col-span-4">
                        <FormInputFile
                            id="personaFotoFrente"
                            name="personaFotoFrente"
                            label="Foto Frente"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-4">
                        <FormInputFile
                            id="personaFotoPerfilIzq"
                            name="personaFotoPerfilIzq"
                            label="Foto Perfil Izquierdo"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-4">
                        <FormInputFile
                            id="personaFotoTarjetaSEGIP"
                            name="personaFotoTarjetaSEGIP"
                            label="Foto. Tarjeta SEGIP o Documento"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-4 mt-4">
                        <Button variant="danger" type="button">Agregar Personas</Button>
                    </div>

                    {/* Personas Table */}
                    <div className="col-span-1 lg:col-span-4 mt-5">
                        <div className="datatables">
                            <DataTable
                                withTableBorder={false}
                                className="whitespace-nowrap table-hover"
                                records={items}
                                columns={[
                                    { accessor: 'id', title: 'Cod. Id' },
                                    { accessor: 'nombres', title: 'Nombres y Apellidos' },
                                    { accessor: 'nacionalidad', title: 'Nacionalidad' },
                                    { accessor: 'genero', title: 'Genero' },
                                    { accessor: 'tipoDocumento', title: 'Tipo de Documento' },
                                    { accessor: 'numeroDocumento', title: 'Numero de Documento' },
                                    { accessor: 'fechaNacimiento', title: 'Fecha Nac.' },
                                    { accessor: 'direccion', title: 'Direccion' },
                                    { accessor: 'estado', title: 'Estado' },
                                    {
                                        accessor: 'fotoFrente',
                                        title: 'Frente',
                                        render: (row) => (
                                            row.fotoFrenteUrl ? (
                                                <img src={row.fotoFrenteUrl} alt="Frente" className="w-20 h-24 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'fotoPerfil',
                                        title: 'Perfil Izquierdo',
                                        render: (row) => (
                                            row.fotoPerfilUrl ? (
                                                <img src={row.fotoPerfilUrl} alt="Perfil" className="w-20 h-24 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'fotoTarjeta',
                                        title: 'FOTO: Tarjeta SEGIP o Documento',
                                        render: (row) => (
                                            row.fotoTarjetaUrl ? (
                                                <img src={row.fotoTarjetaUrl} alt="Tarjeta SEGIP" className="w-32 h-20 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <button type="button" className="text-danger" onClick={() => deleteItem(row.id)}>
                                                <IconTrashLines />
                                            </button>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* BIENES U OBJETOS SECUESTRADOS SECTION */}
            <Card title="BIENES U OBJETOS SECUESTRADOS" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Row 1 */}
                    <FormInputDropdown
                        id="bienTipo"
                        name="bienTipo"
                        label="Bien"
                        control={control}
                        options={[
                            { id: 'maniobreros', label: 'Maniobreros', value: 'maniobreros' },
                            { id: 'armas', label: 'Armas', value: 'armas' },
                            { id: 'vehiculos', label: 'Vehiculos', value: 'vehiculos' }
                        ]}
                    />
                    <FormInputDropdown
                        id="bienManiobreros"
                        name="bienManiobreros"
                        label="Maniobreros"
                        control={control}
                        options={[
                            { id: 'ninguno', label: 'Seleccione un Dato', value: '' }
                        ]}
                    />
                    <FormInputDropdown
                        id="bienClase"
                        name="bienClase"
                        label="Clase"
                        control={control}
                        options={[
                            { id: 'municion-arma-corta', label: 'Municion Arma Corta', value: 'municion_arma_corta' },
                            { id: 'otros', label: 'Otros', value: 'otros' }
                        ]}
                    />

                    {/* Row 2 */}
                    <FormInputDropdown
                        id="bienMunicionArmaCorta"
                        name="bienMunicionArmaCorta"
                        label="Municion Arma Corta"
                        control={control}
                        options={[
                            { id: 'ninguno', label: 'Seleccione un Dato', value: '' }
                        ]}
                    />
                    <FormInputDropdown
                        id="bienTipoMunicion"
                        name="bienTipoMunicion"
                        label="Tipo"
                        control={control}
                        options={[
                            { id: 'municion-pistola', label: 'Municion Pistola', value: 'municion_pistola' },
                            { id: 'otros', label: 'Otros', value: 'otros' }
                        ]}
                    />
                    <FormInputDropdown
                        id="bienMunicionPistola"
                        name="bienMunicionPistola"
                        label="Municion Pistola"
                        control={control}
                        options={[
                            { id: 'ninguno', label: 'Seleccione un Dato', value: '' }
                        ]}
                    />

                    {/* Row 3 */}
                    <FormInputText
                        id="bienCantidad"
                        name="bienCantidad"
                        label="Cantidad"
                        control={control}
                    />
                    <FormInputDropdown
                        id="bienEnInvestigacion"
                        name="bienEnInvestigacion"
                        label="En Investigacion?"
                        control={control}
                        options={[
                            { id: 'si', label: 'SI', value: 'si' },
                            { id: 'no', label: 'NO', value: 'no' }
                        ]}
                    />
                    <div className="hidden lg:block"></div>

                    {/* File Upload */}
                    <div className="col-span-1 lg:col-span-3">
                        <FormInputFile
                            id="bienFotografia"
                            name="bienFotografia"
                            label="Fotografia"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-3 flex justify-end mt-4">
                        <Button variant="danger" type="button" onClick={addBienItem}>Agregar Bien</Button>
                    </div>

                    {/* Bienes Table */}
                    <div className="col-span-1 lg:col-span-3 mt-5">
                        <div className="datatables">
                            <DataTable
                                withTableBorder={false}
                                className="whitespace-nowrap table-hover"
                                records={bienesItems}
                                columns={[
                                    { accessor: 'id', title: 'Cod. Id' },
                                    { accessor: 'tipo', title: 'Tipo de Bien' },
                                    { accessor: 'clase', title: 'Clase' },
                                    { accessor: 'cantidad', title: 'Cantidad' },
                                    { accessor: 'enInvestigacion', title: 'En Investigacion?' },
                                    {
                                        accessor: 'fotografia',
                                        title: 'Fotografia',
                                        render: (row) => (
                                            row.fotografiaUrl ? (
                                                <img src={row.fotografiaUrl} alt="Bien" className="w-32 h-20 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <button type="button" className="text-danger" onClick={() => deleteBienItem(row.id)}>
                                                <IconTrashLines />
                                            </button>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* GALERIA FOTOGRAFICA DEL OPERATIVO SECTION */}
            <Card title="GALERIA FOTOGRAFICA DEL OPERATIVO" className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Row 1 */}
                    <FormInputText
                        id="galeriaDescripcion"
                        name="galeriaDescripcion"
                        label="Descripcion"
                        control={control}
                    />
                    <FormInputDropdown
                        id="galeriaTamanoFoto"
                        name="galeriaTamanoFoto"
                        label="Tamaño de Foto"
                        control={control}
                        options={[
                            { id: 'horizontal', label: 'Fotografia Horizontal', value: 'horizontal' },
                            { id: 'vertical', label: 'Fotografia Vertical', value: 'vertical' },
                            { id: 'cuadrada', label: 'Fotografia Cuadrada', value: 'cuadrada' }
                        ]}
                    />
                    <div className="hidden lg:block"></div>

                    {/* File Upload */}
                    <div className="col-span-1 lg:col-span-3">
                        <FormInputFile
                            id="galeriaArchivo"
                            name="galeriaArchivo"
                            label="Archivo"
                            control={control}
                            limite={1}
                            tiposPermitidos={['image/*']}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-3 flex justify-end mt-4">
                        <Button variant="danger" type="button" onClick={addGaleriaItem}>Agregar a Galeria</Button>
                    </div>

                    {/* Photo Gallery Table */}
                    <div className="col-span-1 lg:col-span-3 mt-5">
                        <div className="datatables">
                            <DataTable
                                withTableBorder={false}
                                className="whitespace-nowrap table-hover"
                                records={galeriaItems}
                                columns={[
                                    { accessor: 'id', title: 'Cod. Id' },
                                    { accessor: 'descripcion', title: 'Descripcion' },
                                    {
                                        accessor: 'fotografia',
                                        title: 'Fotografia',
                                        render: (row) => (
                                            row.fotografiaUrl ? (
                                                <img src={row.fotografiaUrl} alt={row.descripcion || 'Foto'} className="w-40 h-32 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <button type="button" className="text-danger" onClick={() => deleteGaleriaItem(row.id)}>
                                                <IconTrashLines />
                                            </button>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};
