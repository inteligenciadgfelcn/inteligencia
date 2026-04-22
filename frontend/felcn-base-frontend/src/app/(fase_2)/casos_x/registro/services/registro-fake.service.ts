import {
  CasoResumen,
  Departamento,
  EstadoPersona,
  Municipio,
  Pais,
  Provincia,
  RegistroCompletoPayload,
  RegistroResponse,
  TipoDocumento,
} from '../types/registro.types'
import { peticionFormatoMetodo } from '@/services/Servicios'

type Fetcher = (params: peticionFormatoMetodo) => Promise<unknown>

const USE_FAKE_DATA = true

const casosFake: CasoResumen[] = [
  {
    nroCaso: 'CASO-1001',
    nombreCaso: 'OPERATIVO AMAZONAS',
    asignadoAlCaso: 'SGTO. LUIS VARGAS',
    fiscalAsignado: 'DRA. ANA RIVERA',
    operativoRegistrado: false,
  },
  {
    nroCaso: 'CASO-1002',
    nombreCaso: 'OPERATIVO LITORAL',
    asignadoAlCaso: 'CAP. JORGE MAMANI',
    fiscalAsignado: 'DR. CARLOS QUISPE',
    operativoRegistrado: true,
  },
]

const departamentosFake: Departamento[] = [
  { id: 1, descripcion: 'LA PAZ' },
  { id: 2, descripcion: 'COCHABAMBA' },
  { id: 3, descripcion: 'SANTA CRUZ' },
]

const provinciasFake: Provincia[] = [
  { id: 11, idDepartamento: 1, descripcion: 'MURILLO' },
  { id: 12, idDepartamento: 1, descripcion: 'OMASUYOS' },
  { id: 21, idDepartamento: 2, descripcion: 'CERCADO' },
  { id: 22, idDepartamento: 2, descripcion: 'CHAPARE' },
  { id: 31, idDepartamento: 3, descripcion: 'ANDRES IBANEZ' },
  { id: 32, idDepartamento: 3, descripcion: 'OBISPO SANTISTEVAN' },
]

const municipiosFake: Municipio[] = [
  { id: 101, idProvincia: 11, descripcion: 'LA PAZ' },
  { id: 102, idProvincia: 11, descripcion: 'EL ALTO' },
  { id: 201, idProvincia: 21, descripcion: 'COCHABAMBA' },
  { id: 202, idProvincia: 22, descripcion: 'SACABA' },
  { id: 301, idProvincia: 31, descripcion: 'SANTA CRUZ DE LA SIERRA' },
  { id: 302, idProvincia: 32, descripcion: 'MONTERO' },
]

const paisesFake: Pais[] = [
  { id: 1, descripcion: 'BOLIVIA' },
  { id: 2, descripcion: 'PERU' },
  { id: 3, descripcion: 'ARGENTINA' },
]

const tiposDocumentoFake: TipoDocumento[] = [
  { id: 1, descripcion: 'CEDULA DE IDENTIDAD' },
  { id: 2, descripcion: 'PASAPORTE' },
  { id: 3, descripcion: 'LICENCIA DE CONDUCIR' },
]

const estadosFake: EstadoPersona[] = [
  { id: 1, descripcion: 'APREHENDIDO' },
  { id: 2, descripcion: 'INVESTIGADO' },
  { id: 3, descripcion: 'LIBERADO' },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const buscarCasoPorNumero = async (
  nroCaso: string,
  sesionPeticion?: Fetcher
): Promise<CasoResumen | null> => {
  if (USE_FAKE_DATA || !sesionPeticion) {
    await sleep(300)
    const normalized = nroCaso.trim().toUpperCase()
    return casosFake.find((item) => item.nroCaso === normalized) ?? null
  }

  const response = await sesionPeticion({
    url: `/api/casos/${encodeURIComponent(nroCaso)}`,
    method: 'get',
  })
  return response as CasoResumen
}

export const obtenerCatalogoGeografico = async (sesionPeticion?: Fetcher) => {
  if (USE_FAKE_DATA || !sesionPeticion) {
    await sleep(200)
    return {
      departamentos: departamentosFake,
      provincias: provinciasFake,
      municipios: municipiosFake,
    }
  }

  const response = await sesionPeticion({
    url: '/api/catalogos/geografico',
    method: 'get',
  })
  return response as {
    departamentos: Departamento[]
    provincias: Provincia[]
    municipios: Municipio[]
  }
}

export const obtenerCatalogoPersona = async (sesionPeticion?: Fetcher) => {
  if (USE_FAKE_DATA || !sesionPeticion) {
    await sleep(200)
    return {
      paises: paisesFake,
      tiposDocumento: tiposDocumentoFake,
      estados: estadosFake,
    }
  }

  const response = await sesionPeticion({
    url: '/api/catalogos/persona',
    method: 'get',
  })

  return response as {
    paises: Pais[]
    tiposDocumento: TipoDocumento[]
    estados: EstadoPersona[]
  }
}

export const guardarRegistroOperativo = async (
  payload: RegistroCompletoPayload,
  sesionPeticion?: Fetcher
): Promise<RegistroResponse> => {
  if (USE_FAKE_DATA || !sesionPeticion) {
    await sleep(350)
    return {
      idRegistro: `REG-${Date.now()}`,
      mensaje: `Registro guardado para ${payload.nroCaso}`,
    }
  }

  const response = await sesionPeticion({
    url: '/api/registro-operativo',
    method: 'post',
    body: payload,
  })

  return response as RegistroResponse
}
