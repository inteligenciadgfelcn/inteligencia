import { faker } from '@faker-js/faker/locale/es_MX'

interface UsuarioType {
  email: string
  password: string
  phone: string
}

export const UsuarioFaker = (): UsuarioType => {
  return {
    email: faker.internet.email(),
    password: faker.string.alphanumeric(15),
    phone: String(faker.number.int({ min: 60000000, max: 79999999 })),
  }
}
