'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { nowDateToString } from '@/utils/fechas'

type SearchStatus =
  | 'idle'
  | 'success-enabled'
  | 'success-disabled'
  | 'not-found'

export const RegistroOperativoPage = () => {
  const { Alerta } = useAlerts()

  const {
    paises,
    tiposDocumento,
    estados,
    loadingCatalogos,
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
      fechaHoraOperativo: nowDateToString(),
      localidadODireccion: '',
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

  const handleSearch = async (nroCaso: string) => {
    const casoResumen = await buscarCaso(nroCaso)

    if (casoResumen.mensaje) {
      setCasoActual(null)
      setSearchStatus('not-found')
      return
    }

    setCasoActual(casoResumen)
    if (casoResumen.nombreCaso) {
      setSearchStatus('success-enabled')
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
      // const response = await guardarRegistro({
      //   nroCaso: casoActual.numeroCaso || '',
      //   operativo: {
      //     codigoRadiograma: operativo.codigoRadiograma,
      //     fechaHoraOperativo: operativo.fechaHoraOperativo,
      //     idDepartamento: operativo.departamento.value,
      //     idProvincia: operativo.provincia.value,
      //     idMunicipio: operativo.municipio.value,
      //     localidadODireccion: operativo.localidadODireccion,
      //     operativoRealizadoEn: operativo.operativoRealizadoEn,
      //     unidadOperativa: operativo.unidadOperativa,
      //     alMandoDe: operativo.alMandoDe,
      //     resumen: operativo.resumen,
      //   },
      //   persona: {
      //     nombres: persona.nombres,
      //     paterno: persona.paterno,
      //     materno: persona.materno,
      //     apEsposo: persona.apEsposo,
      //     idPais: persona.pais.value,
      //     sexo: persona.sexo.original.value,
      //     direccion: persona.direccion,
      //     idTipoDocumento: persona.tipoDocumento.value,
      //     numeroDocumento: persona.numeroDocumento,
      //     idEstado: persona.estado.value,
      //   },
      // })

      Alerta({
        // mensaje: InterpreteMensajes({ mensaje: response.mensaje }),
        mensaje: InterpreteMensajes({ mensaje: '' }),
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
                nombreCaso: casoActual.nombreCaso ?? '',
                asignadoAlCaso: casoActual.asignado ?? '',
                fiscalAsignado: casoActual.fiscalAsignado ?? '',
              }
            : null
        }
      />

      {loadingCatalogos && (
        <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          Cargando catalogos...
        </div>
      )}

      {searchStatus === 'success-enabled' && !loadingCatalogos && (
        <>
          <OperativoFormCard
            form={operativoForm}
            loading={loadingGuardado}
            onSave={handleSave}
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
