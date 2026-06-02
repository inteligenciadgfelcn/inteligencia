import type {
  FuncionarioCatalogItem,
  GrupoCatalogItem,
  RegionalCatalogItem,
  RegistroCasosAsignacionResponse,
  RegistroCasosFormValues,
  SimpleCatalogItem,
} from '../types/registro-casos.types'
import { generarCodigoCaso } from '../utils/registro-casos.utils'

const delay = async (ms = 180) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const REGIONALS: RegionalCatalogItem[] = [
  { id: 'oriente', nombre: 'Oriente' },
  { id: 'occidente', nombre: 'Occidente' },
  { id: 'valle', nombre: 'Valle' },
]

const GRUPOS: GrupoCatalogItem[] = [
  {
    id: 'grupo-investigadores-oriente',
    regionalId: 'oriente',
    nombre: 'Investigadores',
  },
  {
    id: 'grupo-poligrafistas-oriente',
    regionalId: 'oriente',
    nombre: 'Poligrafistas',
  },
  {
    id: 'grupo-investigadores-occidente',
    regionalId: 'occidente',
    nombre: 'Investigadores',
  },
  {
    id: 'grupo-poligrafistas-occidente',
    regionalId: 'occidente',
    nombre: 'Poligrafistas',
  },
  {
    id: 'grupo-investigadores-valle',
    regionalId: 'valle',
    nombre: 'Investigadores',
  },
  {
    id: 'grupo-poligrafistas-valle',
    regionalId: 'valle',
    nombre: 'Poligrafistas',
  },
]

const FUNCIONARIOS: FuncionarioCatalogItem[] = [
  {
    id: 'f-101',
    grupoId: 'grupo-investigadores-oriente',
    nroPase: '101',
    grado: 'Sgto.',
    nombre: 'Carlos',
    paterno: 'Perez',
    materno: 'Lopez',
  },
  {
    id: 'f-102',
    grupoId: 'grupo-investigadores-oriente',
    nroPase: '102',
    grado: 'Tte.',
    nombre: 'Ana',
    paterno: 'Mendoza',
    materno: 'Rojas',
  },
  {
    id: 'f-201',
    grupoId: 'grupo-poligrafistas-oriente',
    nroPase: '201',
    grado: 'Cap.',
    nombre: 'Mario',
    paterno: 'Vargas',
    materno: 'Soto',
  },
  {
    id: 'f-301',
    grupoId: 'grupo-investigadores-occidente',
    nroPase: '301',
    grado: 'Sgto.',
    nombre: 'Laura',
    paterno: 'Calle',
    materno: 'Flores',
  },
  {
    id: 'f-401',
    grupoId: 'grupo-investigadores-valle',
    nroPase: '401',
    grado: 'Tte.',
    nombre: 'Pedro',
    paterno: 'Arias',
    materno: 'Mamani',
  },
]

const DEPARTAMENTOS: SimpleCatalogItem[] = [
  { id: 'lapaz', nombre: 'La Paz' },
  { id: 'cochabamba', nombre: 'Cochabamba' },
  { id: 'santa-cruz', nombre: 'Santa Cruz' },
  { id: 'oruro', nombre: 'Oruro' },
]

const TIPOS_CASO: SimpleCatalogItem[] = [
  { id: 'caso-operativo', nombre: 'Caso Operativo' },
  { id: 'caso-inteligencia', nombre: 'Caso de Inteligencia' },
  { id: 'caso-apoyo', nombre: 'Caso de Apoyo' },
]

const TIPOS_DELITO: SimpleCatalogItem[] = [
  {
    id: 'legitimacion-ganancias',
    nombre: 'Legitimación de ganancias ilícitas',
  },
  { id: 'trafico-sustancias', nombre: 'Tráfico de sustancias controladas' },
  { id: 'asociacion-delictuosa', nombre: 'Asociación delictuosa' },
]

const INICIO_CASO_LGI: SimpleCatalogItem[] = [
  { id: 'recepcion-denuncia', nombre: 'Recepción de denuncia' },
  { id: 'informe-inteligencia', nombre: 'Informe de inteligencia' },
  { id: 'notificacion-fiscal', nombre: 'Notificación fiscal' },
]

export const RegistroCasosApi = {
  async listarRegionales() {
    await delay()
    return REGIONALS
  },

  async listarGruposPorRegional(regionalId: string) {
    await delay()
    return GRUPOS.filter((grupo) => grupo.regionalId === regionalId)
  },

  async listarFuncionariosPorGrupo(grupoId: string) {
    await delay()
    return FUNCIONARIOS.filter((funcionario) => funcionario.grupoId === grupoId)
  },

  async listarDepartamentos() {
    await delay()
    return DEPARTAMENTOS
  },

  async listarTiposCaso() {
    await delay()
    return TIPOS_CASO
  },

  async listarTiposDelito() {
    await delay()
    return TIPOS_DELITO
  },

  async listarInicioCasoLgi() {
    await delay()
    return INICIO_CASO_LGI
  },

  async asignarCaso(
    values: RegistroCasosFormValues
  ): Promise<RegistroCasosAsignacionResponse> {
    await delay(350)

    return {
      codigoGenerado: generarCodigoCaso({
        regional: values.regional,
        grupo: values.grupo,
        gestion: values.gestion,
      }),
    }
  },
}
