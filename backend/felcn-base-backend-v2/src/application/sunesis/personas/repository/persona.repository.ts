import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_PERSONAS } from '../../shared/constants'
import { PersonasPersona } from '../entity/persona.entity'

@Injectable()
export class PersonaRepository {
  constructor(
    @InjectDataSource(DB_PERSONAS)
    private dataSource: DataSource
  ) {}

  async buscarPorDocumento(documento: string): Promise<PersonasPersona | null> {
    return this.dataSource
      .getRepository(PersonasPersona)
      .findOne({ where: { documento } })
  }

  async crear(persona: PersonasPersona): Promise<PersonasPersona> {
    return this.dataSource.getRepository(PersonasPersona).save(persona)
  }
}
