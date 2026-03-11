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

export function Seccion7Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const { control, getValues } = useForm({
        defaultValues: {
            bienTipo: '',
            bienManiobreros: '',
            bienClase: '',
            bienMunicionArmaCorta: '',
            bienTipoMunicion: '',
            bienMunicionPistola: '',
            bienCantidad: '',
            bienEnInvestigacion: '',
            bienFotografia: [],
        },
    })
    const [bienesItems, setBienesItems] = useState<Record<string, unknown>[]>([])

    const deleteBienItem = (id: number) => {
        setBienesItems((prev) => prev.filter((item) => item.id !== id))
    }

    const addBienItem = () => {
        const data = getValues()
        const fotografiaFile =
            data.bienFotografia && data.bienFotografia.length > 0
                ? data.bienFotografia[0]
                : null

        const newBien = {
            id: Math.floor(Math.random() * 100000),
            tipo: data.bienTipo,
            clase: data.bienClase,
            cantidad: data.bienCantidad,
            enInvestigacion: data.bienEnInvestigacion,
            fotografiaUrl: fotografiaFile ? URL.createObjectURL(fotografiaFile) : null,
        }
        setBienesItems((prev) => [...prev, newBien])
    }

    const guardarSeccion = () => {
        const data = getValues()
        const payload: SeccionPayloadBase = {
            bienTipo: data.bienTipo,
            bienManiobreros: data.bienManiobreros,
            bienClase: data.bienClase,
            bienMunicionArmaCorta: data.bienMunicionArmaCorta,
            bienTipoMunicion: data.bienTipoMunicion,
            bienMunicionPistola: data.bienMunicionPistola,
            bienCantidad: data.bienCantidad,
            bienEnInvestigacion: data.bienEnInvestigacion,
            bienes: bienesItems,
        }

        void onGuardar(payload)
    }

    return (
        <div >

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
                            { id: 'vehiculos', label: 'Vehiculos', value: 'vehiculos' },
                        ]}
                    />
                    <FormInputDropdown
                        id="bienManiobreros"
                        name="bienManiobreros"
                        label="Maniobreros"
                        control={control}
                        options={[
                            { id: 'ninguno', label: 'Seleccione un Dato', value: '' },
                        ]}
                    />
                    <FormInputDropdown
                        id="bienClase"
                        name="bienClase"
                        label="Clase"
                        control={control}
                        options={[
                            { id: 'municion-arma-corta', label: 'Municion Arma Corta', value: 'municion_arma_corta' },
                            { id: 'otros', label: 'Otros', value: 'otros' },
                        ]}
                    />

                    {/* Row 2 */}
                    <FormInputDropdown
                        id="bienMunicionArmaCorta"
                        name="bienMunicionArmaCorta"
                        label="Municion Arma Corta"
                        control={control}
                        options={[
                            { id: 'ninguno', label: 'Seleccione un Dato', value: '' },
                        ]}
                    />
                    <FormInputDropdown
                        id="bienTipoMunicion"
                        name="bienTipoMunicion"
                        label="Tipo"
                        control={control}
                        options={[
                            { id: 'municion-pistola', label: 'Municion Pistola', value: 'municion_pistola' },
                            { id: 'otros', label: 'Otros', value: 'otros' },
                        ]}
                    />
                    <FormInputDropdown
                        id="bienMunicionPistola"
                        name="bienMunicionPistola"
                        label="Municion Pistola"
                        control={control}
                        options={[
                            { id: 'ninguno', label: 'Seleccione un Dato', value: '' },
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
                            { id: 'no', label: 'NO', value: 'no' },
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
                                                <img src={String(row.fotografiaUrl)} alt="Bien" className="w-32 h-20 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <button type="button" className="text-danger" onClick={() => deleteBienItem(Number(row.id))}>
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

          
        </div>
    )
}
