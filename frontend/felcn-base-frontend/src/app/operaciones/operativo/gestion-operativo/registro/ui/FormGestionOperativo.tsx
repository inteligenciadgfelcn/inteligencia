'use client'

import { DatosGeneralesForm } from './secciones/DatosGeneralesForm'
import { Seccion2Form } from './secciones/Seccion2Form'
import { Seccion3Form } from './secciones/Seccion3Form'
import { Seccion4Form } from './secciones/Seccion4Form'
import { Seccion5Form } from './secciones/Seccion5Form'
import { useGestionOperativoForm, type SeccionKey } from '../hooks/useGestionOperativoForm'
import {
    useSeccion1,
    useSeccion2,
    useSeccion3,
    useSeccion4,
    useSeccion5,
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
]

export function FormGestionOperativo({
    idGestionOperativo,
}: FormGestionOperativoProps) {
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
            </div>

            <div className="panel">
                <div className="flex flex-wrap gap-2">
                    {SECCIONES.map((seccion) => (
                        <button
                            key={seccion.key}
                            type="button"
                            className={`btn btn-sm ${seccionActiva === seccion.key
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                                }`}
                            onClick={() => setSeccionActiva(seccion.key)}
                        >
                            {seccion.label}
                        </button>
                    ))}
                </div>
            </div>

            {seccionActiva === 'seccion-1' && (
                <DatosGeneralesForm
                    titulo="Seccion 1"
                    onGuardar={seccion1.mutation.mutateAsync}
                    onRecuperar={async () => seccion1.query.refetch()}
                    cargando={seccion1.mutation.isPending || seccion1.query.isFetching}
                />
            )}
            {seccionActiva === 'seccion-2' && (
                <Seccion2Form
                    titulo="Seccion 2"
                    onGuardar={seccion2.mutation.mutateAsync}
                    onRecuperar={async () => seccion2.query.refetch()}
                    cargando={seccion2.mutation.isPending || seccion2.query.isFetching}
                />
            )}
            {seccionActiva === 'seccion-3' && (
                <Seccion3Form
                    titulo="Seccion 3"
                    onGuardar={seccion3.mutation.mutateAsync}
                    onRecuperar={async () => seccion3.query.refetch()}
                    cargando={seccion3.mutation.isPending || seccion3.query.isFetching}
                />
            )}
            {seccionActiva === 'seccion-4' && (
                <Seccion4Form
                    titulo="Seccion 4"
                    onGuardar={seccion4.mutation.mutateAsync}
                    onRecuperar={async () => seccion4.query.refetch()}
                    cargando={seccion4.mutation.isPending || seccion4.query.isFetching}
                />
            )}
            {seccionActiva === 'seccion-5' && (
                <Seccion5Form
                    titulo="Seccion 5"
                    onGuardar={seccion5.mutation.mutateAsync}
                    onRecuperar={async () => seccion5.query.refetch()}
                    cargando={seccion5.mutation.isPending || seccion5.query.isFetching}
                />
            )}
        </div>
    )
}
