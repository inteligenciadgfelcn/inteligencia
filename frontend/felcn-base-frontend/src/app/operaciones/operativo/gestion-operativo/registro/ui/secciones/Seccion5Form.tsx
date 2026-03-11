'use client'

import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDropdown, FormInputText } from '@/components/form'
import type { SeccionPayloadBase } from '../../../types'

interface SeccionFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    cargando?: boolean
}

export function Seccion5Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const { control, getValues } = useForm({
        defaultValues: {
            laboratorioTipo: '',
            laboratorioSubtipo: '',
            laboratorioCantidad: '',
        },
    })

    const guardarSeccion = () => {
        const values = getValues()
        const payload: SeccionPayloadBase = {
            laboratorioTipo: values.laboratorioTipo,
            laboratorioSubtipo: values.laboratorioSubtipo,
            laboratorioCantidad: values.laboratorioCantidad,
        }

        void onGuardar(payload)
    }

    return (
        <div >

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

           
        </div>
    )
}
