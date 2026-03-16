'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormInputDropdown, FormInputText } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import {
    BienResponse,
    CatalogoBien,
    CatalogoClaseBien,
    CatalogoTipoBien,
    GestionOperativoBienesService,
    GestionOperativoCatalogosService,
} from '@/services/operativos'
import { LookupBasico, SiiiLookupsService } from '@/services/parametricas'

interface SeccionFormProps {
    titulo: string
    idoperativo?: number
}

export function SeccionBienesForm({ idoperativo = 0 }: SeccionFormProps) {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            idBien: '',
            idCatalogoClase: '',
            idCatalogoTipo: '',
            cantidadBien: '',
            costoAproximado: '',
            costoCuantificado: '',
            enInvestigacion: '',
            fotoBien: [],
        },
    })

    const [items, setItems] = useState<BienResponse[]>([])
    const [cargando, setCargando] = useState(false)
    const [bienes, setBienes] = useState<LookupBasico[]>([])
    const [clases, setClases] = useState<CatalogoClaseBien[]>([])
    const [tipos, setTipos] = useState<CatalogoTipoBien[]>([])

    const cargarBienes = useCallback(async () => {
        if (!idoperativo) return
        setCargando(true)
        try {
            const res = await GestionOperativoBienesService.listar(idoperativo)
            if (res?.finalizado) {
                setItems(res.datos?.filas ?? [])
            }
        } finally {
            setCargando(false)
        }
    }, [idoperativo])

    useEffect(() => {
        void cargarBienes()
    }, [cargarBienes])

    useEffect(() => {
        SiiiLookupsService.obtenerBienes().then((res) => {
            if (res?.finalizado) setBienes(res.datos ?? [])
        })
    }, [])

    const onChangeBien = async (idBien: string) => {
        setValue('idCatalogoClase', '')
        setValue('idCatalogoTipo', '')
        setClases([])
        setTipos([])
        if (!idBien) return
        const res = await GestionOperativoCatalogosService.obtenerClasesBien(Number(idBien))
        if (res?.finalizado) setClases(res.datos ?? [])
    }

    const onChangeClase = async (idCatalogoClase: string) => {
        setValue('idCatalogoTipo', '')
        setTipos([])
        if (!idCatalogoClase) return
        const res = await GestionOperativoCatalogosService.obtenerTiposBien(Number(idCatalogoClase))
        if (res?.finalizado) setTipos(res.datos ?? [])
    }

    const onSubmit = async (data: Record<string, any>) => {
        if (!idoperativo) return
        const fotoBienFile =
            data.fotoBien && data.fotoBien.length > 0 ? data.fotoBien[0] : undefined

        setCargando(true)
        try {
            const res = await GestionOperativoBienesService.crear(idoperativo, {
                idCatalogoTipo: Number(data.idCatalogoTipo),
                cantidadBien: Number(data.cantidadBien),
                costoAproximado: Number(data.costoAproximado),
                costoCuantificado: Number(data.costoCuantificado),
                enInvestigacion: data.enInvestigacion === 'true',
                fotoBien: fotoBienFile,
            })
            if (res?.finalizado) {
                await cargarBienes()
                reset()
                setClases([])
                setTipos([])
            }
        } finally {
            setCargando(false)
        }
    }

    const deleteBien = async (id: string) => {
        if (!idoperativo) return
        await GestionOperativoBienesService.eliminar(idoperativo, Number(id))
        await cargarBienes()
    }

    return (
        <div className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card title="BIENES U OBJETOS SECUESTRADOS">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <FormInputDropdown
                            id="idBien"
                            name="idBien"
                            label="Bien"
                            control={control}
                            options={bienes.map((b) => ({
                                id: String(b.id),
                                value: String(b.id),
                                label: b.descripcion,
                            }))}
                            onChange={(e) => void onChangeBien(e.target.value)}
                        />
                        <FormInputDropdown
                            id="idCatalogoClase"
                            name="idCatalogoClase"
                            label="Clase"
                            control={control}
                            disabled={clases.length === 0}
                            options={clases.map((c) => ({
                                id: String(c.id),
                                value: String(c.id),
                                label: c.descripcion,
                            }))}
                            onChange={(e) => void onChangeClase(e.target.value)}
                        />
                        <FormInputDropdown
                            id="idCatalogoTipo"
                            name="idCatalogoTipo"
                            label="Tipo"
                            control={control}
                            disabled={tipos.length === 0}
                            options={tipos.map((t) => ({
                                id: String(t.id),
                                value: String(t.id),
                                label: t.descripcion,
                            }))}
                        />
                        <FormInputText
                            id="cantidadBien"
                            name="cantidadBien"
                            label="Cantidad"
                            control={control}
                        />
                        <FormInputText
                            id="costoAproximado"
                            name="costoAproximado"
                            label="Costo Aproximado (Bs.)"
                            control={control}
                        />
                        <FormInputText
                            id="costoCuantificado"
                            name="costoCuantificado"
                            label="Costo Cuantificado (Bs.)"
                            control={control}
                        />
                        <FormInputDropdown
                            id="enInvestigacion"
                            name="enInvestigacion"
                            label="En Investigacion?"
                            control={control}
                            options={[
                                { id: 'si', label: 'SI', value: 'true' },
                                { id: 'no', label: 'NO', value: 'false' },
                            ]}
                        />
                        <div className="col-span-1 lg:col-span-3">
                            <FormInputFile
                                id="fotoBien"
                                name="fotoBien"
                                label="Fotografia del Bien"
                                control={control}
                                limite={1}
                                tiposPermitidos={['image/*']}
                            />
                        </div>

                        <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
                            <Button variant="primary" type="submit" disabled={cargando}>
                                Agregar Bien
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>

            <Card title="BIENES REGISTRADOS">
                <div className="datatables">
                    <DataTable
                        withTableBorder={false}
                        className="table-hover whitespace-nowrap"
                        records={items}
                        columns={[
                            { accessor: 'id', title: '#' },
                            { accessor: 'descripcionBien', title: 'Bien' },
                            { accessor: 'descripcionCatalogoTipo', title: 'Tipo' },
                            { accessor: 'descripcionCatalogoClase', title: 'Clase' },
                            { accessor: 'cantidadBien', title: 'Cantidad' },
                            {
                                accessor: 'costoAproximado',
                                title: 'Costo Aprox. (Bs.)',
                                render: (row) => String(row.costoAproximado ?? ''),
                            },
                            {
                                accessor: 'costoCuantificado',
                                title: 'Costo Cuant. (Bs.)',
                                render: (row) => String(row.costoCuantificado ?? ''),
                            },
                            {
                                accessor: 'enInvestigacion',
                                title: 'En Investigacion?',
                                render: (row) => (row.enInvestigacion ? 'SI' : 'NO'),
                            },
                            {
                                accessor: 'urlFotoBien',
                                title: 'Foto',
                                render: (row) =>
                                    row.urlFotoBien ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={row.urlFotoBien}
                                            alt="Bien"
                                            className="h-14 w-20 rounded object-cover shadow-sm"
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    ),
                            },
                            {
                                accessor: 'actions',
                                title: '',
                                render: (row) => (
                                    <button
                                        type="button"
                                        className="text-danger"
                                        onClick={() => void deleteBien(row.id)}
                                    >
                                        <IconTrashLines />
                                    </button>
                                ),
                            },
                        ]}
                        highlightOnHover
                    />
                </div>
            </Card>
        </div>
    )
}
