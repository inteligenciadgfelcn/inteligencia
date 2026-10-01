import { Module } from '@nestjs/common'
import { DB_LGI } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImplicadoLgi } from './entities/implicado.entity'
import { ImplicadoLgiService } from './implicados.service'
import { ImplicadoLgiRepository } from './repository/implicado-lgi.repository'
import { ImplicadoLgiController } from './implicados.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([ImplicadoLgi], DB_LGI),
  ],
  controllers: [ImplicadoLgiController],
  providers: [
    ImplicadoLgiRepository,
    ImplicadoLgiService,
  ],
  exports: [ImplicadoLgiService],
})
export class ImplicadosModule {}
