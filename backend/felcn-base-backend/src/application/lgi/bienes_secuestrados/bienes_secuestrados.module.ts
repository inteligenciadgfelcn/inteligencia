import { Module } from '@nestjs/common'
import { BienesSecuestradosController } from './bienes_secuestrados.controller'
import { BieneSecuestradoLgiService } from './bienes_secuestrados.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BieneSecuestradoLgi } from './entities/bienes_secuestrado.entity'
import { BienSecuestradoLgiRepository } from './repository/bien_secuestrado_lgi.repository'
import { DB_LGI } from '@/core/config/database/database.module'
import { FotoBienLgi } from '../foto_bienes/entities/foto_biene.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BieneSecuestradoLgi,FotoBienLgi], DB_LGI)],
  controllers: [BienesSecuestradosController],
  providers: [BieneSecuestradoLgiService, BienSecuestradoLgiRepository],
  exports: [BieneSecuestradoLgiService, BienSecuestradoLgiRepository],
})
export class BienesSecuestradosModule {}
