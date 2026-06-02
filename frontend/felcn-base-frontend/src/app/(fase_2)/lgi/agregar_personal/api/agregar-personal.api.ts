import type {
  DistritalCatalogItem,
  GradoCatalogItem,
  GrupoCatalogItem,
  UnidadCatalogItem,
} from '../types/agregar-personal.types'

const delay = async (ms = 180) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const GRADOS: GradoCatalogItem[] = [
  { id: 'gen', nombre: 'General', abreviatura: 'Gral.' },
  { id: 'cor', nombre: 'Coronel', abreviatura: 'Cnl.' },
  { id: 'my', nombre: 'Mayor', abreviatura: 'My.' },
  { id: 'cap', nombre: 'Capitán', abreviatura: 'Cap.' },
  { id: 'sgt', nombre: 'Sargento', abreviatura: 'Sgto.' },
]

const UNIDADES: UnidadCatalogItem[] = [
  {
    id: 'unidad-dptal-lp',
    nombre: 'Unidad Departamental La Paz',
    sigla: 'UD LP',
  },
  {
    id: 'unidad-dptal-cbba',
    nombre: 'Unidad Departamental Cochabamba',
    sigla: 'UD CBBA',
  },
  {
    id: 'unidad-dptal-sc',
    nombre: 'Unidad Departamental Santa Cruz',
    sigla: 'UD SC',
  },
]

const DISTRITALES: DistritalCatalogItem[] = [
  {
    id: 'distrital-centro-lp',
    unidadId: 'unidad-dptal-lp',
    nombre: 'Distrital Centro',
    sigla: 'DIST CEN',
  },
  {
    id: 'distrital-sur-lp',
    unidadId: 'unidad-dptal-lp',
    nombre: 'Distrital Sur',
    sigla: 'DIST SUR',
  },
  {
    id: 'distrital-norte-cbba',
    unidadId: 'unidad-dptal-cbba',
    nombre: 'Distrital Norte',
    sigla: 'DIST NOR',
  },
  {
    id: 'distrital-centro-sc',
    unidadId: 'unidad-dptal-sc',
    nombre: 'Distrital Centro',
    sigla: 'DIST CEN',
  },
]

const GRUPOS: GrupoCatalogItem[] = [
  {
    id: 'grupo-investigacion-cen-lp',
    distritalId: 'distrital-centro-lp',
    nombre: 'Grupo de Investigación',
    sigla: 'GI',
  },
  {
    id: 'grupo-analisis-cen-lp',
    distritalId: 'distrital-centro-lp',
    nombre: 'Grupo de Análisis',
    sigla: 'GA',
  },
  {
    id: 'grupo-operaciones-sur-lp',
    distritalId: 'distrital-sur-lp',
    nombre: 'Grupo de Operaciones',
    sigla: 'GO',
  },
  {
    id: 'grupo-investigacion-norte-cbba',
    distritalId: 'distrital-norte-cbba',
    nombre: 'Grupo de Investigación',
    sigla: 'GI',
  },
  {
    id: 'grupo-operaciones-centro-sc',
    distritalId: 'distrital-centro-sc',
    nombre: 'Grupo de Operaciones',
    sigla: 'GO',
  },
]

export const AgregarPersonalApi = {
  async listarGrados() {
    await delay()
    return GRADOS
  },

  async listarUnidades() {
    await delay()
    return UNIDADES
  },

  async listarDistritalesPorUnidad(unidadId: string) {
    await delay()
    return DISTRITALES.filter((item) => item.unidadId === unidadId)
  },

  async listarGruposPorDistrital(distritalId: string) {
    await delay()
    return GRUPOS.filter((item) => item.distritalId === distritalId)
  },
}
