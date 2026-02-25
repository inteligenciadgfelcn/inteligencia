import { faker } from '@faker-js/faker/locale/es_MX'

interface ModuloType {
  nombre: string
  label: string
  url: string
  orden: string
  descripcion: string
}

export const ModuloFaker = (): ModuloType => {
  return {
    nombre: faker.word.noun(),
    label: faker.commerce.department() + '-' + faker.word.noun(),
    url: 'admin/' + faker.word.adjective() + '/' + faker.word.adverb(),
    orden: faker.number.int({ min: 2, max: 99 }).toString(),
    descripcion: faker.lorem.sentence(),
  }
}
