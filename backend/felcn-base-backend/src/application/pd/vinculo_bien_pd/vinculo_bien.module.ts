import { Module } from '@nestjs/common'
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VinculoBienRepository } from './repository/vinculo_bien.repository'
import { VinculoBienLgi } from '@/application/lgi/vinculo_bien_lgi/entities/vinculo_bien_lgi.entity'
import { VinculoBienController } from './vinculo_bien.controller'
import { VinculoBienService } from './vinculo_bien.service'
import { PersonasImplicada } from '@/application/lgi/personas_implicadas/entities/personas_implicada.entity'
import { TipoDocumentoLgi } from '@/application/lgi/parametro/parametricas_lgi/entity/tipo-documento.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [VinculoBienLgi, PersonasImplicada, TipoDocumentoLgi],
      DB_LGI
    ),
  ],
  controllers: [VinculoBienController],
  providers: [VinculoBienService, VinculoBienRepository],
  exports: [VinculoBienService],
})
export class VinculoBienModule {}
