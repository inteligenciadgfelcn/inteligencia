import { faker } from '@faker-js/faker/locale/es_MX'

interface ParametroType {
  codigo: string
  nombre: string
  grupo: string
  descripcion: string
}

export const ParametroFaker = (): ParametroType => {
  const grupo = faker.string.alpha({ length: 4, casing: 'upper' })
  const nombre = faker.lorem.word()
  const codigo = `${grupo}-${faker.string.alpha({ length: 2, casing: 'upper' })}`
  const descripcion = faker.lorem.sentence()

  return {
    codigo,
    nombre,
    grupo,
    descripcion,
  }
}
