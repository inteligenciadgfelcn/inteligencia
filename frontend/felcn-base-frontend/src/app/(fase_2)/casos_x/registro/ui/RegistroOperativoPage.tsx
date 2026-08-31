'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { CasoSearchCard } from './CasoSearchCard'
import { OperativoFormCard } from './OperativoFormCard'
import { DetenidosDataTable } from './DetenidosDataTable'
import { PersonaFormCard } from './PersonaFormCard'
import {
  OperativoFormValues,
  operativoSchema,
  personaSchema,
  PersonaFormValues,
} from './schemas'
import { useRegistroData } from '../hooks/useRegistroData'
import { CasoResumen } from '../types/registro.types'
import { formatDateToBackend, nowDateToString } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import { Constantes } from '@/config/Constantes'

export const RegistroOperativoPage = () => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const queryClient = useQueryClient()

  const { loadingCatalogos, loadingBusqueda, loadingGuardado, buscarCaso } =
    useRegistroData()

  const [msgSearch, setMsgSearch] = useState<string | null>()
  const [idOperativo, setIdOperativo] = useState<number | null>()
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
      setMsgSearch(casoResumen.mensaje)
      return
    }

    setCasoActual(casoResumen)
    setMsgSearch('success')
  }

  const handleClear = () => {
    setMsgSearch(null)
    setCasoActual(null)
    operativoForm.reset()
    personaForm.reset()
  }

  const handleSaveOperativo = async () => {
    const operativoValido = await operativoForm.trigger()

    if (!operativoValido) {
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
    const payload = {
      numeroCaso: casoActual.numeroCaso,
      numeroOperativo: operativo.codigoRadiograma,
      fechaOperativo: formatDateToBackend(operativo.fechaHoraOperativo),
      idDepartamento: operativo.departamento?.original?.abreviatura,
      idProvincia: operativo.provincia?.value,
      idLocalidad: operativo.municipio?.value,
      lugar: operativo.localidadODireccion,
      idCategoriaOperativo: operativo.categoria.value,
      idItemOperativo: operativo.itemOperativo.value,
      idUnidad: operativo.unidad.value,
      idDistrital: operativo.distrito.value,
      idGrupo: operativo.grupo.value,
      mando: operativo.alMandoDe,
    }

    imprimir('payload operativo', payload)

    try {
      const response = await sesionPeticion({
        url: `${Constantes.baseUrl}/operativo`,
        method: 'post',
        body: payload,
      })

      setIdOperativo(response.idOperativo)

      Alerta({
        mensaje: InterpreteMensajes({ mensaje: 'Guardado con exito' }),
        variant: 'success',
      })

      // operativoForm.reset()
      // personaForm.reset()
    } catch (error) {
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    }
  }

  const handleSavePersona = async () => {
    const personaValido = await personaForm.trigger()

    if (!personaValido) {
      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Completa todos los campos obligatorios antes de guardar',
        }),
        variant: 'error',
      })
      return
    }

    if (!idOperativo) {
      Alerta({
        mensaje: InterpreteMensajes({ mensaje: 'No existe operativo' }),
        variant: 'error',
      })
      return
    }

    const payload = {
      idOperativo: idOperativo,
      nombres: personaForm.getValues().nombres,
      apellidoPaterno: personaForm.getValues().paterno,
      apellidoMaterno: personaForm.getValues().materno,
      apellidoEsposo: personaForm.getValues().apEsposo,
      idPais: personaForm.getValues().pais?.value,
      genero: personaForm.getValues().sexo?.value == 1,
      direccion: personaForm.getValues().direccion,
      idTipoDocumento: personaForm.getValues().tipoDocumento?.value,
      numeroDocumento: personaForm.getValues().numeroDocumento,
      idEstado: personaForm.getValues().estado?.value,
    }

    imprimir('payload persona', payload)

    try {
      await sesionPeticion({
        url: `${Constantes.baseUrl}/detenido`,
        method: 'post',
        body: payload,
      })

      await queryClient.invalidateQueries({ queryKey: ['detenidos'] })

      Alerta({
        mensaje: InterpreteMensajes({ mensaje: 'Guardado con exito' }),
        variant: 'success',
      })

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
      {/* Breadcumb */}
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Inicio
            </button>
          </li>
          <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
              Registro Operativo
            </button>
          </li>
        </ol>
      </div>
      {/* End breadcum */}
      <CasoSearchCard
        loading={loadingBusqueda}
        onSearch={handleSearch}
        onClear={handleClear}
        msgSearch={msgSearch}
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

      {msgSearch == 'success' && (
        <>
          <OperativoFormCard
            form={operativoForm}
            loading={loadingGuardado}
            onSave={handleSaveOperativo}
          />

          {idOperativo && (
            <PersonaFormCard
              form={personaForm}
              loading={loadingGuardado}
              onSave={handleSavePersona}
            />
          )}

          {idOperativo && <DetenidosDataTable />}
        </>
      )}
    </div>
  )
}
