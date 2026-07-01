import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { ContenidoCasoLgiController } from './contenido-caso.controller'
import { ContenidoCasoLgiRepository } from './repository/contenido-caso.repository'
import { ContenidoCasoLgiService } from './contenido-caso.service'
import { ContenidoCasoLgi } from './entities/contenido-caso.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ContenidoCasoLgi], DB_LGI)],
  controllers: [ContenidoCasoLgiController],
  providers: [ContenidoCasoLgiService, ContenidoCasoLgiRepository],
  exports: [ContenidoCasoLgiService],
})
export class ContenidoCasoModule {}
