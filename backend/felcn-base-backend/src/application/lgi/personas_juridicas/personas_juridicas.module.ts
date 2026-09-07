import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { PersonasJuridica } from './entities/personas_juridica.entity'
import { PersonasJuridicasController } from './personas_juridicas.controller'
import { PersonasJuridicasService } from './personas_juridicas.service'
import { PersonasJuridicasRepository } from './repository/personas_juridicas.repository'

@Module({
  imports: [TypeOrmModule.forFeature([PersonasJuridica], DB_LGI)],

  controllers: [PersonasJuridicasController],

  providers: [PersonasJuridicasService, PersonasJuridicasRepository],

  exports: [PersonasJuridicasService, PersonasJuridicasRepository],
})
export class PersonasJuridicasModule {}
