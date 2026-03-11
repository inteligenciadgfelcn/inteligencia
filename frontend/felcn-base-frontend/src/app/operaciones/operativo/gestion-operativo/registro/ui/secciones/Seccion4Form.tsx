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

export function Seccion4Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const { control, getValues } = useForm({
        defaultValues: {
            sustanciaQuimicaSolidaTipo: '',
            sustanciaQuimicaSolidaCantidad: '',
            sustanciaQuimicaSolidaKilos: '',
            sustanciaQuimicaSolidaGramos: '',
            sustanciaQuimicaLiquidaTipo: '',
            sustanciaQuimicaLiquidaCantidad: '',
            sustanciaQuimicaLitros: '',
            sustanciaQuimicaMililitros: '',
        },
    })

    const guardarSeccion = () => {
        const values = getValues()
        const payload: SeccionPayloadBase = {
            sustanciaQuimicaSolidaTipo: values.sustanciaQuimicaSolidaTipo,
            sustanciaQuimicaSolidaCantidad: values.sustanciaQuimicaSolidaCantidad,
            sustanciaQuimicaSolidaKilos: values.sustanciaQuimicaSolidaKilos,
            sustanciaQuimicaSolidaGramos: values.sustanciaQuimicaSolidaGramos,
            sustanciaQuimicaLiquidaTipo: values.sustanciaQuimicaLiquidaTipo,
            sustanciaQuimicaLiquidaCantidad: values.sustanciaQuimicaLiquidaCantidad,
            sustanciaQuimicaLitros: values.sustanciaQuimicaLitros,
            sustanciaQuimicaMililitros: values.sustanciaQuimicaMililitros,
        }

        void onGuardar(payload)
    }

    return (
        <div >
            
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

          
        </div>
    )
}
