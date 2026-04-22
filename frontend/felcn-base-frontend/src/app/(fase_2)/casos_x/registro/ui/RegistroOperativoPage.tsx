'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useAlerts } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { CasoSearchCard } from './CasoSearchCard'
import { OperativoFormCard } from './OperativoFormCard'
import { PersonaFormCard } from './PersonaFormCard'
import {
  OperativoFormValues,
  operativoSchema,
  personaSchema,
  PersonaFormValues,
} from './schemas'
import { useRegistroData } from '../hooks/useRegistroData'
import { CasoResumen } from '../types/registro.types'

type SearchStatus =
  | 'idle'
  | 'success-enabled'
  | 'success-disabled'
  | 'not-found'

export const RegistroOperativoPage = () => {
  const { Alerta } = useAlerts()

  const {
    departamentos,
    provincias,
    municipios,
    paises,
    tiposDocumento,
    estados,
    loadingCatalogos,
    catalogosError,
    loadingBusqueda,
    loadingGuardado,
    buscarCaso,
    guardarRegistro,
  } = useRegistroData()

  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [casoActual, setCasoActual] = useState<CasoResumen | null>(null)

  const operativoForm = useForm<OperativoFormValues>({
    resolver: zodResolver(operativoSchema),
    defaultValues: {
      codigoRadiograma: '',
      fechaHoraOperativo: '',
      localidadODireccion: '',
      operativoRealizadoEn: '',
      unidadOperativa: '',
      alMandoDe: '',
      resumen: '',
    },
  })

  const personaForm = useForm<PersonaFormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      nombres: '',
      paterno: '',
      materno: '',
      apEsposo: '',
      direccion: '',
      numeroDocumento: '',
    },
  })

  const departamentoSeleccionado = useWatch({
    control: operativoForm.control,
    name: 'departamento',
  })

  const provinciaSeleccionada = useWatch({
    control: operativoForm.control,
    name: 'provincia',
  })

  useEffect(() => {
    operativoForm.resetField('provincia')
    operativoForm.resetField('municipio')
  }, [departamentoSeleccionado?.value, operativoForm])

  useEffect(() => {
    operativoForm.resetField('municipio')
  }, [provinciaSeleccionada?.value, operativoForm])

  const provinciasFiltradas = useMemo(
    () =>
      provincias.filter(
        (provincia) =>
          provincia.idDepartamento === departamentoSeleccionado?.value
      ),
    [provincias, departamentoSeleccionado?.value]
  )

  const municipiosFiltrados = useMemo(
    () =>
      municipios.filter(
        (municipio) => municipio.idProvincia === provinciaSeleccionada?.value
      ),
    [municipios, provinciaSeleccionada?.value]
  )

  const handleSearch = async (nroCaso: string) => {
    const found = await buscarCaso(nroCaso)

    if (!found) {
      setCasoActual(null)
      setSearchStatus('not-found')
      return
    }

    setCasoActual(found)
    if (found.operativoRegistrado) {
      setSearchStatus('success-disabled')
      return
    }

    setSearchStatus('success-enabled')
  }

  const handleClear = () => {
    setSearchStatus('idle')
    setCasoActual(null)
    operativoForm.reset()
    personaForm.reset()
  }

  const handleSave = async () => {
    const [operativoValido, personaValido] = await Promise.all([
      operativoForm.trigger(),
      personaForm.trigger(),
    ])

    if (!operativoValido || !personaValido) {
      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Completa todos los campos obligatorios antes de guardar',
        }),
        variant: 'error',
      })
      return
    }

    if (!casoActual) {
      Alerta({
        mensaje: InterpreteMensajes({ mensaje: 'No existe caso seleccionado' }),
        variant: 'error',
      })
      return
    }

    const operativo = operativoForm.getValues()
    const persona = personaForm.getValues()

    try {
      const response = await guardarRegistro({
        nroCaso: casoActual.nroCaso,
        operativo: {
          codigoRadiograma: operativo.codigoRadiograma,
          fechaHoraOperativo: operativo.fechaHoraOperativo,
          idDepartamento: operativo.departamento.value,
          idProvincia: operativo.provincia.value,
          idMunicipio: operativo.municipio.value,
          localidadODireccion: operativo.localidadODireccion,
          operativoRealizadoEn: operativo.operativoRealizadoEn,
          unidadOperativa: operativo.unidadOperativa,
          alMandoDe: operativo.alMandoDe,
          resumen: operativo.resumen,
        },
        persona: {
          nombres: persona.nombres,
          paterno: persona.paterno,
          materno: persona.materno,
          apEsposo: persona.apEsposo,
          idPais: persona.pais.value,
          sexo: persona.sexo.original.value,
          direccion: persona.direccion,
          idTipoDocumento: persona.tipoDocumento.value,
          numeroDocumento: persona.numeroDocumento,
          idEstado: persona.estado.value,
        },
      })

      Alerta({
        mensaje: InterpreteMensajes({ mensaje: response.mensaje }),
        variant: 'success',
      })

      operativoForm.reset()
      personaForm.reset()
    } catch (error) {
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    }
  }

  return (
    <div className="space-y-4">
      <CasoSearchCard
        loading={loadingBusqueda}
        onSearch={handleSearch}
        onClear={handleClear}
        status={searchStatus}
        casoInfo={
          casoActual
            ? {
                nombreCaso: casoActual.nombreCaso,
                asignadoAlCaso: casoActual.asignadoAlCaso,
                fiscalAsignado: casoActual.fiscalAsignado,
              }
            : null
        }
      />

      {catalogosError && (
        <div className="rounded-md border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger">
          {catalogosError}
        </div>
      )}

      {loadingCatalogos && (
        <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          Cargando catalogos...
        </div>
      )}

      {searchStatus === 'success-enabled' &&
        !loadingCatalogos &&
        !catalogosError && (
          <>
            <OperativoFormCard
              form={operativoForm}
              departamentos={departamentos}
              provincias={provinciasFiltradas}
              municipios={municipiosFiltrados}
            />

            <PersonaFormCard
              form={personaForm}
              paises={paises}
              tiposDocumento={tiposDocumento}
              estados={estados}
              loading={loadingGuardado}
              onSave={handleSave}
            />
          </>
        )}
    </div>
  )
}
