'use client'

import { useState, useEffect, useCallback } from 'react'

import { DatosGeneralesForm } from './secciones/DatosGeneralesForm'
import { SeccionDrogasFotografiaLogotiposForm } from './secciones/SeccionDrogasFotografiaLogotiposForm'
import { SustanciasSolidas } from './secciones/SustanciasSolidas'
import { SustanciasLiquidas } from './secciones/SustanciasLiquidas'
import { Laboratorio } from './secciones/Laboratorio'
import { Persona } from './secciones/Persona'
import { SeccionBienesForm } from './secciones/SeccionBienesForm'
import { Galeria } from './secciones/Galeria'
import {
  useGestionOperativoForm,
  type SeccionKey,
} from '../hooks/useGestionOperativoForm'
import {
  useSeccion1,
  useSeccion2,
  useSeccion3,
  useSeccion4,
  useSeccion5,
} from '../hooks/useGestionOperativoSecciones'
import { GestionOperativosDatosGeneralesService } from '@/services/operativos'
import { Icono } from '@/components/Icono'

import { BackButton } from '@/components/ui/BackButton'

interface FormGestionOperativoProps {
  idGestionOperativo?: string
}

interface SeccionDef {
  key: SeccionKey
  label: string
  icon: string
}

const SECCIONES: SeccionDef[] = [
  { key: 'seccion-1', label: 'Datos Generales', icon: 'description' },
  { key: 'seccion-2', label: 'Drogas', icon: 'science' },
  { key: 'seccion-3', label: 'Sust. Sólidas', icon: 'grain' },
  { key: 'seccion-4', label: 'Sust. Líquidas', icon: 'water_drop' },
  { key: 'seccion-5', label: 'Laboratorios', icon: 'biotech' },
  { key: 'seccion-6', label: 'Personas', icon: 'people' },
  { key: 'seccion-7', label: 'Bienes', icon: 'inventory_2' },
  { key: 'seccion-8', label: 'Galería', icon: 'photo_library' },
]

export function FormGestionOperativo({
  idGestionOperativo,
}: FormGestionOperativoProps) {
  const {
    idGestionOperativo: id,
    esEdicion,
    seccionActiva,
    setSeccionActiva,
  } = useGestionOperativoForm(idGestionOperativo)

  const [tieneOperativo, setTieneOperativo] = useState<boolean | null>(null)
  const [idOperativo, setIdOperativo] = useState<number>(0)

  const [seccionesVisitadas, setSeccionesVisitadas] = useState<Set<SeccionKey>>(
    new Set(['seccion-1'])
  )

  const handleSetSeccionActiva = useCallback(
    (key: SeccionKey) => {
      setSeccionActiva(key)
      setSeccionesVisitadas((prev) => {
        if (prev.has(key)) return prev
        const siguiente = new Set(prev)
        siguiente.add(key)
        return siguiente
      })
    },
    [setSeccionActiva]
  )

  const verificarOperativo = useCallback(async () => {
    if (id <= 0) return
    try {
      const resp =
        await GestionOperativosDatosGeneralesService.obtenerPorUsuario(id)
      const operativoExiste =
        resp?.datos?.operativos && resp.datos.operativos.length > 0
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
  const seccion3 = useSeccion3(
    idOperativo,
    pageS3,
    limitS3,
    seccionesVisitadas.has('seccion-3')
  )

  const [pageS4, setPageS4] = useState(1)
  const [limitS4, setLimitS4] = useState(10)
  const seccion4 = useSeccion4(
    idOperativo,
    pageS4,
    limitS4,
    seccionesVisitadas.has('seccion-4')
  )

  const [pageS5, setPageS5] = useState(1)
  const [limitS5, setLimitS5] = useState(10)
  const seccion5 = useSeccion5(
    idOperativo,
    pageS5,
    limitS5,
    seccionesVisitadas.has('seccion-5')
  )

  const renderSeccion = (key: SeccionKey) => {
    if (key === 'seccion-1') {
      return (
        <DatosGeneralesForm
          titulo="DATOS GENERALES"
          onGuardar={seccion1.mutation.mutateAsync}
          onOperativoGuardado={async () => {
            await verificarOperativo()
            void seccion1.query.refetch()
          }}
          cargando={seccion1.mutation.isPending || seccion1.query.isFetching}
          datosCaso={seccion1.query.data?.datos ?? null}
          tieneOperativo={tieneOperativo ?? undefined}
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
          datos={(seccion3.query.data?.datos as any)?.filas ?? []}
          totalRegistros={
            (seccion3.query.data?.datos as any)?.page?.totalElements ?? 0
          }
          pagina={pageS3}
          limite={limitS3}
          onCambioPagina={setPageS3}
          onCambioLimite={(l: number) => {
            setLimitS3(l)
            setPageS3(1)
          }}
          cargando={
            seccion3.mutation.isPending ||
            seccion3.query.isFetching ||
            seccion3.deleteMutation.isPending
          }
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
          datos={(seccion4.query.data?.datos as any)?.filas ?? []}
          totalRegistros={
            (seccion4.query.data?.datos as any)?.page?.totalElements ?? 0
          }
          pagina={pageS4}
          limite={limitS4}
          onCambioPagina={setPageS4}
          onCambioLimite={(l: number) => {
            setLimitS4(l)
            setPageS4(1)
          }}
          cargando={
            seccion4.mutation.isPending ||
            seccion4.query.isFetching ||
            seccion4.deleteMutation.isPending
          }
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
          datos={(seccion5.query.data?.datos as any)?.filas ?? []}
          totalRegistros={
            (seccion5.query.data?.datos as any)?.page?.totalElements ?? 0
          }
          pagina={pageS5}
          limite={limitS5}
          onCambioPagina={setPageS5}
          onCambioLimite={(l: number) => {
            setLimitS5(l)
            setPageS5(1)
          }}
          cargando={
            seccion5.mutation.isPending ||
            seccion5.query.isFetching ||
            seccion5.deleteMutation.isPending
          }
        />
      )
    }

    if (key === 'seccion-6') {
      return (
        <Persona
          titulo="PERSONAS: PRINCIPAL IMPLICADO / APREHENDIDAS / ARRESTADAS / LGI O PERDIDA DE DOMINIO"
          idoperativo={idOperativo}
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
        <Galeria
          titulo="GALERIA FOTOGRAFICA DEL OPERATIVO"
          idoperativo={idOperativo}
        />
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h2 className="text-lg font-semibold">Gestion Operativo</h2>
        </div>
      </div>

      <div className="panel p-0">
        <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
          {SECCIONES.map((seccion) => {
            const deshabilitada = seccion.key !== 'seccion-1' && !tieneOperativo
            const activa = seccionActiva === seccion.key
            return (
              <button
                key={seccion.key}
                type="button"
                disabled={deshabilitada}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-all ${deshabilitada
                  ? 'cursor-not-allowed border-transparent text-gray-300 dark:text-gray-600'
                  : activa
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                onClick={() =>
                  !deshabilitada && handleSetSeccionActiva(seccion.key)
                }
              >
                <Icono className={`w-4 h-4 ${activa ? 'text-primary' : ''}`}>
                  {seccion.icon}
                </Icono>
                {seccion.label}
              </button>
            )
          })}
        </div>

        <div className="p-4">{renderSeccion(seccionActiva)}</div>
      </div>
    </div>
  )
}
