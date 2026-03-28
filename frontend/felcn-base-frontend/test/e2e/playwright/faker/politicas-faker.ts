import { faker } from '@faker-js/faker/locale/es_MX'

interface PoliticaType {
  objecto: string
}

export const PoliticaFaker = (): PoliticaType => {
  return {
    objecto: `admin/${faker.word.adjective()}/${faker.word.adverb()}`,
  }
}
