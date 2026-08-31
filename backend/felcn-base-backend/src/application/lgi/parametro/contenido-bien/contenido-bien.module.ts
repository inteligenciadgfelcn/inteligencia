import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { ContenidoBienLgiController } from './contenido-bien.controller'
import { ContenidoBienLgiRepository } from './repository/contenido-bien.repository'
import { ContenidoBienLgiService } from './contenido-bien.service'
import { ContenidoBienLgi } from './entities/contenido-bien.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ContenidoBienLgi], DB_LGI)],
  controllers: [ContenidoBienLgiController],
  providers: [ContenidoBienLgiService, ContenidoBienLgiRepository],
  exports: [ContenidoBienLgiService],
})
export class ContenidoBienModule {}
