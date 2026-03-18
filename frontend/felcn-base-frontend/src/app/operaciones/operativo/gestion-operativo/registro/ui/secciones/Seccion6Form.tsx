'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDate, FormInputDropdown, FormInputText } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import type { SeccionPayloadBase } from '../../../types'

interface SeccionFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    cargando?: boolean
}

export function Seccion6Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const { control, getValues } = useForm({
        defaultValues: {
            personaNombres: '',
            personaApPaterno: '',
            personaApMaterno: '',
            personaApEsposo: '',
            personaNacionalidad: 'bolivia',
            personaGenero: '',
            personaTipoDocumento: '',
            personaNumeroDocumento: '',
            personaFechaNacimiento: '',
            personaDireccion: '',
            personaEstado: '',
            personaFotoFrente: [],
            personaFotoPerfilIzq: [],
            personaFotoTarjetaSEGIP: [],
        },
    })
    const [items, setItems] = useState<Record<string, unknown>[]>([])

    const deleteItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const agregarPersona = () => {
        const data = getValues()
        const fotoFrenteFile =
            data.personaFotoFrente && data.personaFotoFrente.length > 0
                ? data.personaFotoFrente[0]
                : null
        const fotoPerfilFile =
            data.personaFotoPerfilIzq && data.personaFotoPerfilIzq.length > 0
                ? data.personaFotoPerfilIzq[0]
                : null
        const fotoTarjetaFile =
            data.personaFotoTarjetaSEGIP && data.personaFotoTarjetaSEGIP.length > 0
                ? data.personaFotoTarjetaSEGIP[0]
                : null

        const nuevaPersona = {
            id: Math.floor(Math.random() * 100000),
            nombres: `${data.personaNombres ?? ''} ${data.personaApPaterno ?? ''} ${data.personaApMaterno ?? ''} ${data.personaApEsposo ?? ''}`.trim(),
            nacionalidad: data.personaNacionalidad,
            genero: data.personaGenero,
            tipoDocumento: data.personaTipoDocumento,
            numeroDocumento: data.personaNumeroDocumento,
            fechaNacimiento: data.personaFechaNacimiento,
            direccion: data.personaDireccion,
            estado: data.personaEstado,
            fotoFrenteUrl: fotoFrenteFile ? URL.createObjectURL(fotoFrenteFile) : null,
            fotoPerfilUrl: fotoPerfilFile ? URL.createObjectURL(fotoPerfilFile) : null,
            fotoTarjetaUrl: fotoTarjetaFile ? URL.createObjectURL(fotoTarjetaFile) : null,
        }

        setItems((prev) => [...prev, nuevaPersona])
    }

    const guardarSeccion = () => {
        const data = getValues()
        const payload: SeccionPayloadBase = {
            personaNombres: data.personaNombres,
            personaApPaterno: data.personaApPaterno,
            personaApMaterno: data.personaApMaterno,
            personaApEsposo: data.personaApEsposo,
            personaNacionalidad: data.personaNacionalidad,
            personaGenero: data.personaGenero,
            personaTipoDocumento: data.personaTipoDocumento,
            personaNumeroDocumento: data.personaNumeroDocumento,
            personaFechaNacimiento: data.personaFechaNacimiento,
            personaDireccion: data.personaDireccion,
            personaEstado: data.personaEstado,
            personas: items,
        }

        void onGuardar(payload)
    }

    return (
        <div >

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
                        <Button variant="danger" type="button" onClick={agregarPersona}>Agregar Personas</Button>
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
                                                <img src={String(row.fotoFrenteUrl)} alt="Frente" className="w-20 h-24 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'fotoPerfil',
                                        title: 'Perfil Izquierdo',
                                        render: (row) => (
                                            row.fotoPerfilUrl ? (
                                                <img src={String(row.fotoPerfilUrl)} alt="Perfil" className="w-20 h-24 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'fotoTarjeta',
                                        title: 'FOTO: Tarjeta SEGIP o Documento',
                                        render: (row) => (
                                            row.fotoTarjetaUrl ? (
                                                <img src={String(row.fotoTarjetaUrl)} alt="Tarjeta SEGIP" className="w-32 h-20 object-cover rounded shadow-sm" />
                                            ) : null
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: '',
                                        render: (row) => (
                                            <button type="button" className="text-danger" onClick={() => deleteItem(Number(row.id))}>
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
