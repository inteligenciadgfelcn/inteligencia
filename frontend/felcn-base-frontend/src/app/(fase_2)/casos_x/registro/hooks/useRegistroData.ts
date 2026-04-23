'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePeticion } from '@/hooks'
import {
  buscarCasoPorNumero,
  guardarRegistroOperativo,
  obtenerCatalogoGeografico,
  obtenerCatalogoPersona,
} from '../services/registro.service'
import {
  CasoResumen,
  Departamento,
  EstadoPersona,
  Municipio,
  Pais,
  Provincia,
  RegistroCompletoPayload,
  TipoDocumento,
} from '../types/registro.types'

export const useRegistroData = () => {
  const { sesionPeticion } = usePeticion()

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])

  const [paises, setPaises] = useState<Pais[]>([])
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
  const [estados, setEstados] = useState<EstadoPersona[]>([])

  const [loadingCatalogos, setLoadingCatalogos] = useState(false)
  const [catalogosError, setCatalogosError] = useState<string | null>(null)

  const [loadingBusqueda, setLoadingBusqueda] = useState(false)
  const [loadingGuardado, setLoadingGuardado] = useState(false)

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoadingCatalogos(true)
        setCatalogosError(null)

        const [geo, persona] = await Promise.all([
          obtenerCatalogoGeografico(sesionPeticion),
          obtenerCatalogoPersona(sesionPeticion),
        ])

        setDepartamentos(geo.departamentos)
        setProvincias(geo.provincias)
        setMunicipios(geo.municipios)
        setPaises(persona.paises)
        setTiposDocumento(persona.tiposDocumento)
        setEstados(persona.estados)
      } catch (error) {
        setCatalogosError('No se pudieron cargar los catálogos')
      } finally {
        setLoadingCatalogos(false)
      }
    }

    cargarCatalogos()
  }, [])

  const buscarCaso = async (nroCaso: string): Promise<CasoResumen> => {
    setLoadingBusqueda(true)
    try {
      return await buscarCasoPorNumero(nroCaso)
    } finally {
      setLoadingBusqueda(false)
    }
  }

  const guardarRegistro = async (payload: RegistroCompletoPayload) => {
    setLoadingGuardado(true)
    try {
      return await guardarRegistroOperativo(payload, sesionPeticion)
    } finally {
      setLoadingGuardado(false)
    }
  }

  return {
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
  }
}
