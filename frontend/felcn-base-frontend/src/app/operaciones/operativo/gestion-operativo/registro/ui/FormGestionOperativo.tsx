'use client'

import { useState, useEffect, useCallback } from 'react'

import { DatosGeneralesForm } from './secciones/DatosGeneralesForm'
import { SeccionDrogasFotografiaLogotiposForm } from './secciones/SeccionDrogasFotografiaLogotiposForm'
import { SustanciasSolidas } from './secciones/SustanciasSolidas'
import { SustanciasLiquidas } from './secciones/SustanciasLiquidas'
import { Laboratorio } from './secciones/Laboratorio'
import { Seccion6Form } from './secciones/Seccion6Form'
import { SeccionBienesForm } from './secciones/SeccionBienesForm'
import { Seccion8Form } from './secciones/Seccion8Form'
import { useGestionOperativoForm, type SeccionKey } from '../hooks/useGestionOperativoForm'
import {
    useSeccion1,
    useSeccion2,
    useSeccion3,
    useSeccion4,
    useSeccion5,
    useSeccion6,
    useSeccion8,
} from '../hooks/useGestionOperativoSecciones'
import { GestionOperativosDatosGeneralesService } from '@/services/operativos'

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

    const [tieneOperativo, setTieneOperativo] = useState<boolean | null>(null)
    const [idOperativo, setIdOperativo] = useState<number>(0)

    const [seccionesVisitadas, setSeccionesVisitadas] = useState<Set<SeccionKey>>(
        new Set(['seccion-1'])
    )

    const handleSetSeccionActiva = useCallback((key: SeccionKey) => {
        setSeccionActiva(key)
        setSeccionesVisitadas((prev) => {
            if (prev.has(key)) return prev
            const siguiente = new Set(prev)
            siguiente.add(key)
            return siguiente
        })
    }, [setSeccionActiva])

    const verificarOperativo = useCallback(async () => {
        if (id <= 0) return
        try {
            const resp = await GestionOperativosDatosGeneralesService.obtenerPorUsuario(id)
            const operativoExiste = resp?.datos?.operativos && resp.datos.operativos.length > 0
            setTieneOperativo(operativoExiste)
            setIdOperativo(operativoExiste ? resp.datos.operativos[0].id : 0)
        } catch {
            setTieneOperativo(false)
            setIdOperativo(0)
        }
    }, [id])

    useEffect(() => {
        void verificarOperativo()
    }, [verificarOperativo])

    const seccion1 = useSeccion1(id, seccionesVisitadas.has('seccion-1'))
    const seccion2 = useSeccion2(idOperativo, seccionesVisitadas.has('seccion-2'))

    const [pageS3, setPageS3] = useState(1)
    const [limitS3, setLimitS3] = useState(10)
    const seccion3 = useSeccion3(idOperativo, pageS3, limitS3, seccionesVisitadas.has('seccion-3'))

    const [pageS4, setPageS4] = useState(1)
    const [limitS4, setLimitS4] = useState(10)
    const seccion4 = useSeccion4(idOperativo, pageS4, limitS4, seccionesVisitadas.has('seccion-4'))

    const [pageS5, setPageS5] = useState(1)
    const [limitS5, setLimitS5] = useState(10)
    const seccion5 = useSeccion5(idOperativo, pageS5, limitS5, seccionesVisitadas.has('seccion-5'))
    const seccion6 = useSeccion6(idOperativo, seccionesVisitadas.has('seccion-6'))
    const seccion8 = useSeccion8(idOperativo, seccionesVisitadas.has('seccion-8'))

    const renderSeccion = (key: SeccionKey) => {
        if (key === 'seccion-1') {
            return (
                <DatosGeneralesForm
                    titulo="DATOS GENERALES"
                    onGuardar={seccion1.mutation.mutateAsync}
                    onOperativoGuardado={verificarOperativo}
                    cargando={seccion1.mutation.isPending || seccion1.query.isFetching}
                    datosCaso={seccion1.query.data?.datos ?? null}
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
                    idoperativo={idOperativo}
                />
            )
        }

        if (key === 'seccion-3') {
            return (
                <SustanciasSolidas
                    titulo="SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS"
                    onGuardar={seccion3.mutation.mutateAsync}
                    onEliminar={seccion3.deleteMutation.mutateAsync}
                    onRecuperar={() => seccion3.query.refetch()}
                    datos={
                        (seccion3.query.data?.datos as any)?.filas ?? []
                    }
                    totalRegistros={(seccion3.query.data?.datos as any)?.page?.totalElements ?? 0}
                    pagina={pageS3}
                    limite={limitS3}
                    onCambioPagina={setPageS3}
                    onCambioLimite={(l: number) => { setLimitS3(l); setPageS3(1); }}
                    cargando={seccion3.mutation.isPending || seccion3.query.isFetching || seccion3.deleteMutation.isPending}
                />
            )
        }

        if (key === 'seccion-4') {
            return (
                <SustanciasLiquidas
                    titulo="SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS"
                    onGuardar={seccion4.mutation.mutateAsync}
                    onEliminar={seccion4.deleteMutation.mutateAsync}
                    onRecuperar={() => seccion4.query.refetch()}
                    datos={
                        (seccion4.query.data?.datos as any)?.filas ?? []
                    }
                    totalRegistros={(seccion4.query.data?.datos as any)?.page?.totalElements ?? 0}
                    pagina={pageS4}
                    limite={limitS4}
                    onCambioPagina={setPageS4}
                    onCambioLimite={(l: number) => { setLimitS4(l); setPageS4(1); }}
                    cargando={seccion4.mutation.isPending || seccion4.query.isFetching || seccion4.deleteMutation.isPending}
                />
            )
        }

        if (key === 'seccion-5') {
            return (
                <Laboratorio
                    titulo="LABORATORIOS Y FABRICAS"
                    onGuardar={seccion5.mutation.mutateAsync}
                    onEliminar={seccion5.deleteMutation.mutateAsync}
                    onRecuperar={() => seccion5.query.refetch()}
                    datos={
                        (seccion5.query.data?.datos as any)?.filas ?? []
                    }
                    totalRegistros={(seccion5.query.data?.datos as any)?.page?.totalElements ?? 0}
                    pagina={pageS5}
                    limite={limitS5}
                    onCambioPagina={setPageS5}
                    onCambioLimite={(l: number) => { setLimitS5(l); setPageS5(1); }}
                    cargando={seccion5.mutation.isPending || seccion5.query.isFetching || seccion5.deleteMutation.isPending}
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
                <SeccionBienesForm
                    titulo="BIENES U OBJETOS SECUESTRADOS"
                    idoperativo={idOperativo}
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
                    {SECCIONES.map((seccion) => {
                        const deshabilitada = seccion.key !== 'seccion-1' && !tieneOperativo
                        return (
                            <button
                                key={seccion.key}
                                type="button"
                                disabled={deshabilitada}
                                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    deshabilitada
                                        ? 'cursor-not-allowed border-transparent text-gray-300'
                                        : seccionActiva === seccion.key
                                          ? 'border-primary text-primary'
                                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                onClick={() => !deshabilitada && handleSetSeccionActiva(seccion.key)}
                            >
                                {seccion.label}
                            </button>
                        )
                    })}
                </div>

                <div className="p-4">
                    {renderSeccion(seccionActiva)}
                </div>
            </div>
        </div>
    )
}
