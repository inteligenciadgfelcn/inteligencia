import { Module } from '@nestjs/common'
import { TamanoDocLgiService } from './tamano-doc.service'
import { TamanoDocLgiController } from './tamano-doc.controller'
import { UnidadLgi } from './entities/tamano-doc.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TamanoDocLgiRepository } from './repository/tamano-doc.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UnidadLgi], DB_LGI)],
  controllers: [TamanoDocLgiController],
  providers: [TamanoDocLgiService,TamanoDocLgiRepository],
  exports: [TamanoDocLgiService],
})
export class TamanoDocModule {}
