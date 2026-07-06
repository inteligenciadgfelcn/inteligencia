import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipoPersonaLgiController } from './tipo-persona.controller'
import { TipoPersonaLgiRepository } from './repository/tipo-persona.repository'
import { TipoPersonaLgiService } from './tipo-persona.service'
import { TipoPersonaLgi } from './entities/tipo-persona.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TipoPersonaLgi], DB_LGI)],
  controllers: [TipoPersonaLgiController],
  providers: [TipoPersonaLgiService, TipoPersonaLgiRepository],
  exports: [TipoPersonaLgiService],
})
export class TipoPersonaModule {}
