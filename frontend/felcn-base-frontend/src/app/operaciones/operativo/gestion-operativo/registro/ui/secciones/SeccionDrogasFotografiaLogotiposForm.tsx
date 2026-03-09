'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDropdown, FormInputText } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import { SiiiLookupsService } from '@/services/parametricas'
import { GestionOperativoCatalogosService } from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'

interface SeccionFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    cargando?: boolean
}

export function SeccionDrogasFotografiaLogotiposForm({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
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
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            actualizarCantidades(unidad, event.target.value)
        }

    const normalizarValorPais = (valor: string) =>
        valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')

    const { control, getValues, setValue, watch } = useForm({
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
    const tipoDrogaSeleccionada = watch('tipoDroga')

    useEffect(() => {
        let activo = true

        const cargarTiposDroga = async () => {
            try {
                const res = await SiiiLookupsService.obtenerTiposDroga()
                if (!activo || !res?.finalizado) return

                const opciones = (res.datos ?? [])
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

                if (opciones.length > 0) {
                    setOpcionesTiposDroga(opciones)
                    const tipoActual = String(getValues('tipoDroga') ?? '')
                    if (!opciones.some((opcion) => opcion.value === tipoActual)) {
                        setValue('tipoDroga', opciones[0].value)
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
    }, [getValues, setValue])

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

    useEffect(() => {
        let activo = true

        const cargarFormasTransporte = async () => {
            try {
                const res = await SiiiLookupsService.obtenerFormasTransporte()
                if (!activo || !res?.finalizado) return

                const opciones = (res.datos ?? [])
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

                if (opciones.length > 0) {
                    setOpcionesFormasTransporte(opciones)
                    const formaActual = String(getValues('formaTransporte') ?? '')
                    if (!opciones.some((opcion) => opcion.value === formaActual)) {
                        setValue('formaTransporte', opciones[0].value)
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
    }, [getValues, setValue])

    useEffect(() => {
        let activo = true

        const cargarEstadosDroga = async () => {
            const tipoSeleccionado = String(tipoDrogaSeleccionada ?? '')
            const idDesdeValor = Number(tipoSeleccionado)
            const idDesdeOpcion = Number(
                opcionesTiposDroga.find((opcion) => opcion.value === tipoSeleccionado)?.id
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
                const res = await GestionOperativoCatalogosService.obtenerEstadosDroga(
                    idTipoDroga
                )
                if (!activo || !res?.finalizado) return

                const opciones = (res.datos ?? [])
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

                if (opciones.length > 0) {
                    setOpcionesEstadosDroga(opciones)
                    const estadoActual = String(getValues('estadoDroga') ?? '')
                    if (!opciones.some((opcion) => opcion.value === estadoActual)) {
                        setValue('estadoDroga', opciones[0].value)
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
    }, [getValues, opcionesTiposDroga, setValue, tipoDrogaSeleccionada])

    const [items, setItems] = useState<any[]>([])

    const deleteItem = (id: any) => {
        setItems(items.filter((d) => d.id !== id))
    }

    const addItem = () => {
        const data: any = getValues()
        const pruebaCampoFile =
            data.fotoPruebaCampo && data.fotoPruebaCampo.length > 0
                ? data.fotoPruebaCampo[0]
                : null
        const cuantificacionFile =
            data.fotoCuantificacion && data.fotoCuantificacion.length > 0
                ? data.fotoCuantificacion[0]
                : null

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
            cuantificacionUrl: cuantificacionFile
                ? URL.createObjectURL(cuantificacionFile)
                : null,
        }
        setItems([...items, newItem])
    }

    return (
        <div className="panel space-y-3">
            <h3 className="text-base font-semibold">{titulo}</h3>

            {/* DRUGS SECTION */}
            <Card title="DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormInputDropdown
                        id="tipoDroga"
                        name="tipoDroga"
                        label="Tipo de Droga"
                        control={control}
                        options={opcionesTiposDroga}
                    />
                    <FormInputDropdown
                        id="estadoDroga"
                        name="estadoDroga"
                        label="Estado de la Droga"
                        control={control}
                        options={opcionesEstadosDroga}
                    />
                    <FormInputText
                        id="cocainaLiquida"
                        name="cocainaLiquida"
                        label="Cocaina Liquida en Litros"
                        control={control}
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
                                    control={control}
                                    size="small"
                                    onChange={onCambioCantidad('tn')}
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">Kg</span>
                                <FormInputText
                                    id="cantidadKg"
                                    name="cantidadKg"
                                    label=""
                                    control={control}
                                    size="small"
                                    onChange={onCambioCantidad('kg')}
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">g</span>
                                <FormInputText
                                    id="cantidadG"
                                    name="cantidadG"
                                    label=""
                                    control={control}
                                    size="small"
                                    onChange={onCambioCantidad('g')}
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-500">Mg</span>
                                <FormInputText
                                    id="cantidadMg"
                                    name="cantidadMg"
                                    label=""
                                    control={control}
                                    size="small"
                                    onChange={onCambioCantidad('mg')}
                                />
                            </div>
                        </div>
                    </div>
                    <FormInputText
                        id="nroPastillas"
                        name="nroPastillas"
                        label="Nro. Pastillas o Capsulas (Tragones)"
                        control={control}
                    />

                    <FormInputDropdown
                        id="formaTransporte"
                        name="formaTransporte"
                        label="Forma de Transporte"
                        control={control}
                        options={opcionesFormasTransporte}
                    />
                    <FormInputDropdown
                        id="procedencia"
                        name="procedencia"
                        label="Procedencia"
                        control={control}
                        options={opcionesPaises}
                    />
                    <FormInputDropdown
                        id="destino"
                        name="destino"
                        label="Destino"
                        control={control}
                        options={opcionesPaises}
                    />

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

                    <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
                        <Button variant="primary" type="button" onClick={addItem}>
                            Guardar
                        </Button>
                    </div>

                    <div className="col-span-1 mt-5 lg:col-span-3">
                        <div className="datatables">
                            <DataTable
                                withTableBorder={false}
                                className="table-hover whitespace-nowrap"
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
                                                <button
                                                    type="button"
                                                    className="text-danger"
                                                    onClick={() => deleteItem(row.id)}
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
                    </div>
                </div>
            </Card>

            {/* FOTO DATA SECTION */}
            <Card
                title="FOTOGRAFIA DE LA PRUEBA DE CAMPO Y LA CUANTIFICACION, PESAJE DE LA SUSTANCIA SECUESTRADA"
                className="mt-5"
            >
                <div className="datatables">
                    <DataTable
                        withTableBorder={false}
                        className="table-hover whitespace-nowrap"
                        records={items}
                        columns={[
                            { accessor: 'id', title: 'Id' },
                            { accessor: 'tipoDroga', title: 'Tipo de Droga' },
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

            {/* LOGOTIPOS SECTION */}
            <Card title="LOGOTIPOS" className="mt-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormInputText id="logoImagen" name="logoImagen" label="Imagen" control={control} />
                    <FormInputText
                        id="logoDescripcion"
                        name="logoDescripcion"
                        label="Descripcion del Logo"
                        control={control}
                    />
                    <FormInputText
                        id="logoOrganizacion"
                        name="logoOrganizacion"
                        label="Organizacion Criminal"
                        control={control}
                    />

                    <FormInputText
                        id="logoBlancos"
                        name="logoBlancos"
                        label="Posibles Blancos"
                        control={control}
                    />
                    <FormInputText
                        id="logoObservacion"
                        name="logoObservacion"
                        label="Observacion"
                        control={control}
                    />
                    <div className="hidden lg:block" />

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

                    <div className="col-span-1 mt-4 lg:col-span-3">
                        <Button variant="primary" type="button">
                            Añadir Logo
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="flex gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => void onRecuperar()}
                    disabled={cargando}
                >
                    Recuperar
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => void onGuardar(getValues() as SeccionPayloadBase)}
                    disabled={cargando}
                >
                    Guardar Seccion 2
                </button>
            </div>
        </div>
    )
}
