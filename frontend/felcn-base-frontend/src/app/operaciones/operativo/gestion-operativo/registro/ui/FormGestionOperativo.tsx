'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { DatosGeneralesForm } from './secciones/DatosGeneralesForm'
import { SeccionDrogasFotografiaLogotiposForm } from './secciones/SeccionDrogasFotografiaLogotiposForm'
import { Seccion3Form } from './secciones/Seccion3Form'
import { Seccion4Form } from './secciones/Seccion4Form'
import { Seccion5Form } from './secciones/Seccion5Form'
import { Seccion6Form } from './secciones/Seccion6Form'
import { Seccion7Form } from './secciones/Seccion7Form'
import { Seccion8Form } from './secciones/Seccion8Form'
import { useGestionOperativoForm, type SeccionKey } from '../hooks/useGestionOperativoForm'
import {
    useSeccion1,
    useSeccion2,
    useSeccion3,
    useSeccion4,
    useSeccion5,
    useSeccion6,
    useSeccion7,
    useSeccion8,
} from '../hooks/useGestionOperativoSecciones'

interface FormGestionOperativoProps {
    idGestionOperativo?: string
}

const SECCIONES: { key: SeccionKey; label: string }[] = [
    { key: 'seccion-1', label: 'Seccion 1' },
    { key: 'seccion-2', label: 'Seccion 2' },
    { key: 'seccion-3', label: 'Seccion 3' },
    { key: 'seccion-4', label: 'Seccion 4' },
    { key: 'seccion-5', label: 'Seccion 5' },
    { key: 'seccion-6', label: 'Seccion 6' },
    { key: 'seccion-7', label: 'Seccion 7' },
    { key: 'seccion-8', label: 'Seccion 8' },
]

export function FormGestionOperativo({
    idGestionOperativo,
}: FormGestionOperativoProps) {
    const [mostrarTodasLasSecciones, setMostrarTodasLasSecciones] = useState(false)

    const {
        idGestionOperativo: id,
        esEdicion,
        seccionActiva,
        setSeccionActiva,
        guardandoCabecera,
    } = useGestionOperativoForm(idGestionOperativo)

    const seccion1 = useSeccion1(id)
    const seccion2 = useSeccion2(id)
    const seccion3 = useSeccion3(id)
    const seccion4 = useSeccion4(id)
    const seccion5 = useSeccion5(id)
    const seccion6 = useSeccion6(id)
    const seccion7 = useSeccion7(id)
    const seccion8 = useSeccion8(id)

    const toggleSeccion = (key: SeccionKey) => {
        setSeccionActiva(key)
    }

    const renderSeccion = (key: SeccionKey) => {
        if (key === 'seccion-1') {
            return (
                <DatosGeneralesForm
                    titulo="DATOS GENERALES"
                    onGuardar={seccion1.mutation.mutateAsync}
                    cargando={seccion1.mutation.isPending || seccion1.query.isFetching}
                />
            )
        }

        if (key === 'seccion-2') {
            return (
                <SeccionDrogasFotografiaLogotiposForm
                    titulo="DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES"
                    onGuardar={seccion2.mutation.mutateAsync}
                    onRecuperar={() => seccion2.query.refetch()}
                    cargando={seccion2.mutation.isPending || seccion2.query.isFetching}
                    idCaso={id}
                />
            )
        }

        if (key === 'seccion-3') {
            return (
                <Seccion3Form
                    titulo="SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS"
                    onGuardar={seccion3.mutation.mutateAsync}
                    onRecuperar={() => seccion3.query.refetch()}
                    cargando={seccion3.mutation.isPending || seccion3.query.isFetching}
                />
            )
        }

        if (key === 'seccion-4') {
            return (
                <Seccion4Form
                    titulo="SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS"
                    onGuardar={seccion4.mutation.mutateAsync}
                    onRecuperar={() => seccion4.query.refetch()}
                    cargando={seccion4.mutation.isPending || seccion4.query.isFetching}
                />
            )
        }

        if (key === 'seccion-5') {
            return (
                <Seccion5Form
                    titulo="LABORATORIOS Y FABRICAS"
                    onGuardar={seccion5.mutation.mutateAsync}
                    onRecuperar={() => seccion5.query.refetch()}
                    cargando={seccion5.mutation.isPending || seccion5.query.isFetching}
                />
            )
        }

        if (key === 'seccion-6') {
            return (
                <Seccion6Form
                    titulo="PERSONAS: PRINCIPAL IMPLICADO / APREHENDIDAS / ARRESTADAS / LGI O PERDIDA DE DOMINIO"
                    onGuardar={seccion6.mutation.mutateAsync}
                    onRecuperar={() => seccion6.query.refetch()}
                    cargando={seccion6.mutation.isPending || seccion6.query.isFetching}
                />
            )
        }

        if (key === 'seccion-7') {
            return (
                <Seccion7Form
                    titulo="BIENES U OBJETOS SECUESTRADOS"
                    onGuardar={seccion7.mutation.mutateAsync}
                    onRecuperar={() => seccion7.query.refetch()}
                    cargando={seccion7.mutation.isPending || seccion7.query.isFetching}
                />
            )
        }

        if (key === 'seccion-8') {
            return (
                <Seccion8Form
                    titulo="GALERIA FOTOGRAFICA DEL OPERATIVO"
                    onGuardar={seccion8.mutation.mutateAsync}
                    onRecuperar={() => seccion8.query.refetch()}
                    cargando={seccion8.mutation.isPending || seccion8.query.isFetching}
                />
            )
        }

        return (
            <Seccion8Form
                titulo="Seccion 8"
                onGuardar={seccion8.mutation.mutateAsync}
                onRecuperar={() => seccion8.query.refetch()}
                cargando={seccion8.mutation.isPending || seccion8.query.isFetching}
            />
        )
    }

    return (
        <div className="space-y-4">
            <div className="panel">
                <h2 className="text-lg font-semibold">Gestion Operativo</h2>
                <p className="text-sm text-gray-500">
                    {esEdicion
                        ? `Editando registro #${id}`
                        : 'Nuevo registro (debe crearse cabecera para habilitar guardado de secciones)'}
                </p>
                {guardandoCabecera && (
                    <p className="text-xs text-primary mt-2">Guardando cabecera...</p>
                )}
                <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={mostrarTodasLasSecciones}
                        onChange={(event) => setMostrarTodasLasSecciones(event.target.checked)}
                    />
                    Mostrar todas las secciones
                </label>
            </div>

            <div className="space-y-3">
                {SECCIONES.map((seccion) => {
                    const abierta = mostrarTodasLasSecciones || seccionActiva === seccion.key

                    return (
                        <div key={seccion.key} className="panel p-3">
                            <Button
                                type="button"
                                variant={abierta ? 'primary' : 'outline-primary'}
                                size="sm"
                                className="w-full justify-between"
                                onClick={() => toggleSeccion(seccion.key)}
                            >
                                <span>{seccion.label}</span>
                                <span className="text-xs">{abierta ? 'Ocultar' : 'Mostrar'}</span>
                            </Button>
                            {abierta && <div className="mt-3">{renderSeccion(seccion.key)}</div>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
