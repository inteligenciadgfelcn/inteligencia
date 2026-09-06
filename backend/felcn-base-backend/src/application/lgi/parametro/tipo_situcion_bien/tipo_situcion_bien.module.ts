import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipoSituacionLegalBien } from './entities/tipo_situcion_bien.entity'
import { TipoSituacionLegalBienLgiRepository } from './repository/tipo_situcion_bien.repository'
import { TipoSituacionLegalBienLgiService } from './tipo_situcion_bien.service'
import { TipoSituacionLegalBienController } from './tipo_situcion_bien.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TipoSituacionLegalBien], DB_LGI)],
  controllers: [TipoSituacionLegalBienController],
  providers: [
    TipoSituacionLegalBienLgiService,
    TipoSituacionLegalBienLgiRepository,
  ],
  exports: [
    TipoSituacionLegalBienLgiService,
    TipoSituacionLegalBienLgiRepository,
  ],
})
export class TipoSituacionLegalBienLgiModule {}
