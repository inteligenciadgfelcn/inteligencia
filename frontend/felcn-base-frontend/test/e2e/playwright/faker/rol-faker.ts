import { faker } from '@faker-js/faker/locale/es_MX'

interface RolType {
  rol: string
  nombre: string
  descripcion: string
}

export const RolFaker = (): RolType => {
  const job = faker.person.jobType()
  const rol = `${job.toUpperCase().replace(/ /g, '_')}${faker.number.int({ min: 10, max: 99 })}`
  const nombre = job
  const descripcion = faker.company.buzzPhrase()

  return {
    rol,
    nombre,
    descripcion,
  }
}
