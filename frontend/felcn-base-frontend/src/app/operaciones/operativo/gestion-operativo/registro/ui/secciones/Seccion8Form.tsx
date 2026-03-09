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

export function Seccion8Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const { control, getValues } = useForm({
        defaultValues: {
            galeriaDescripcion: '',
            galeriaTamanoFoto: '',
            galeriaArchivo: [],
        },
    })
    const [galeriaItems, setGaleriaItems] = useState<Record<string, unknown>[]>([])

    const deleteGaleriaItem = (id: number) => {
        setGaleriaItems((prev) => prev.filter((item) => item.id !== id))
    }

    const addGaleriaItem = () => {
        const data = getValues()
        const archivoFile =
            data.galeriaArchivo && data.galeriaArchivo.length > 0
                ? data.galeriaArchivo[0]
                : null

        const newFoto = {
            id: Math.floor(Math.random() * 100000),
            descripcion: data.galeriaDescripcion,
            tamanoFoto: data.galeriaTamanoFoto,
            fotografiaUrl: archivoFile ? URL.createObjectURL(archivoFile) : null,
        }
        setGaleriaItems((prev) => [...prev, newFoto])
    }

    const guardarSeccion = () => {
        const data = getValues()
        const payload: SeccionPayloadBase = {
            galeriaDescripcion: data.galeriaDescripcion,
            galeriaTamanoFoto: data.galeriaTamanoFoto,
            galeria: galeriaItems,
        }

        void onGuardar(payload)
    }

    return (
        <div >

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
                            { id: 'cuadrada', label: 'Fotografia Cuadrada', value: 'cuadrada' },
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
                                                <img
                                                    src={String(row.fotografiaUrl)}
                                                    alt={String(row.descripcion ?? 'Foto')}
                                                    className="w-40 h-32 object-cover rounded shadow-sm"
                                                />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <button type="button" className="text-danger" onClick={() => deleteGaleriaItem(Number(row.id))}>
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
