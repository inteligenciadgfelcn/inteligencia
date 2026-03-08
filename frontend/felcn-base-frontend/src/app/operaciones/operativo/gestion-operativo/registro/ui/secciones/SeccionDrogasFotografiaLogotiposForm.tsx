'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDropdown, FormInputText } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'
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
    const { control, getValues } = useForm({
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
                        options={[
                            { id: 'marihuana', label: 'Marihuana', value: 'marihuana' },
                            { id: 'cocaina', label: 'Cocaina', value: 'cocaina' },
                        ]}
                    />
                    <FormInputDropdown
                        id="estadoDroga"
                        name="estadoDroga"
                        label="Estado de la Droga"
                        control={control}
                        options={[
                            { id: 'seco', label: 'Seco', value: 'seco' },
                            { id: 'humedo', label: 'Humedo', value: 'humedo' },
                        ]}
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
                        options={[
                            { id: 'terrestre', label: 'Terrestre', value: 'terrestre' },
                            { id: 'aereo', label: 'Aereo', value: 'aereo' },
                            { id: 'fluvial', label: 'Fluvial', value: 'fluvial' },
                        ]}
                    />
                    <FormInputDropdown
                        id="procedencia"
                        name="procedencia"
                        label="Procedencia"
                        control={control}
                        options={[{ id: 'bolivia', label: 'Bolivia', value: 'bolivia' }]}
                    />
                    <FormInputDropdown
                        id="destino"
                        name="destino"
                        label="Destino"
                        control={control}
                        options={[{ id: 'bolivia', label: 'Bolivia', value: 'bolivia' }]}
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
