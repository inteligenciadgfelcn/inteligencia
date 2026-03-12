'use client'

import { DatosGeneralesForm } from './secciones/DatosGeneralesForm'
import { SeccionDrogasFotografiaLogotiposForm } from './secciones/SeccionDrogasFotografiaLogotiposForm'
import { SustanciasSolidas } from './secciones/SustanciasSolidas'
import { SustanciasLiquidas } from './secciones/SustanciasLiquidas'
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
    { key: 'seccion-1', label: 'Datos Generales' },
    { key: 'seccion-2', label: 'Drogas' },
    { key: 'seccion-3', label: 'Sust. Sólidas' },
    { key: 'seccion-4', label: 'Sust. Líquidas' },
    { key: 'seccion-5', label: 'Laboratorios' },
    { key: 'seccion-6', label: 'Personas' },
    { key: 'seccion-7', label: 'Bienes' },
    { key: 'seccion-8', label: 'Galería' },
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
    const seccion6 = useSeccion6(id)
    const seccion7 = useSeccion7(id)
    const seccion8 = useSeccion8(id)

    const renderSeccion = (key: SeccionKey) => {
        switch (key) {
            case 'seccion-1':
                return (
                    <DatosGeneralesForm
                        titulo="DATOS GENERALES"
                        onGuardar={seccion1.mutation.mutateAsync}
                        cargando={seccion1.mutation.isPending || seccion1.query.isFetching}
                    />
                )
            case 'seccion-2':
                return (
                    <SeccionDrogasFotografiaLogotiposForm
                        titulo="DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES"
                        onGuardar={seccion2.mutation.mutateAsync}
                        onRecuperar={() => seccion2.query.refetch()}
                        cargando={seccion2.mutation.isPending || seccion2.query.isFetching}
                        idCaso={id}
                    />
                )
            case 'seccion-3':
                return (
                    <SustanciasSolidas
                        titulo="SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS"
                        onGuardar={seccion3.mutation.mutateAsync}
                        onEliminar={seccion3.deleteMutation.mutateAsync}
                        onRecuperar={() => seccion3.query.refetch()}
                        datos={seccion3.query.data?.datos ?? []}
                        cargando={seccion3.mutation.isPending || seccion3.query.isFetching || seccion3.deleteMutation.isPending}
                    />
                )
            case 'seccion-4':
                return (
                    <SustanciasLiquidas
                        titulo="SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS"
                        onGuardar={seccion4.mutation.mutateAsync}
                        onEliminar={seccion4.deleteMutation.mutateAsync}
                        onRecuperar={() => seccion4.query.refetch()}
                        datos={seccion4.query.data?.datos ?? []}
                        cargando={seccion4.mutation.isPending || seccion4.query.isFetching || seccion4.deleteMutation.isPending}
                    />
                )
            case 'seccion-5':
                return (
                    <Seccion5Form
                        titulo="LABORATORIOS Y FABRICAS"
                        onGuardar={seccion5.mutation.mutateAsync}
                        onRecuperar={() => seccion5.query.refetch()}
                        cargando={seccion5.mutation.isPending || seccion5.query.isFetching}
                    />
                )
            case 'seccion-6':
                return (
                    <Seccion6Form
                        titulo="PERSONAS: PRINCIPAL IMPLICADO / APREHENDIDAS / ARRESTADAS / LGI O PERDIDA DE DOMINIO"
                        onGuardar={seccion6.mutation.mutateAsync}
                        onRecuperar={() => seccion6.query.refetch()}
                        cargando={seccion6.mutation.isPending || seccion6.query.isFetching}
                    />
                )
            case 'seccion-7':
                return (
                    <Seccion7Form
                        titulo="BIENES U OBJETOS SECUESTRADOS"
                        onGuardar={seccion7.mutation.mutateAsync}
                        onRecuperar={() => seccion7.query.refetch()}
                        cargando={seccion7.mutation.isPending || seccion7.query.isFetching}
                    />
                )
            case 'seccion-8':
                return (
                    <Seccion8Form
                        titulo="GALERIA FOTOGRAFICA DEL OPERATIVO"
                        onGuardar={seccion8.mutation.mutateAsync}
                        onRecuperar={() => seccion8.query.refetch()}
                        cargando={seccion8.mutation.isPending || seccion8.query.isFetching}
                    />
                )
        }
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
            </div>

            <div className="panel p-0">
                <div className="flex overflow-x-auto border-b border-gray-200">
                    {SECCIONES.map((seccion) => (
                        <button
                            key={seccion.key}
                            type="button"
                            className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                seccionActiva === seccion.key
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setSeccionActiva(seccion.key)}
                        >
                            {seccion.label}
                        </button>
                    ))}
                </div>

                <div className="p-4">
                    {renderSeccion(seccionActiva)}
                </div>
            </div>
        </div>
    )
}
