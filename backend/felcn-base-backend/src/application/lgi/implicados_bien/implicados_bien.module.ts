import { Module } from '@nestjs/common'
import { ImplicadosBienService } from './implicados_bien.service'
import { ImplicadosBienController } from './implicados_bien.controller'
import { ImplicadosBien } from './entities/implicados_bien.entity'
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImplicadosBienLgiRepository } from './repository/implicado-bien-lgi.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ImplicadosBien], DB_LGI)],
  controllers: [ImplicadosBienController],
  providers: [ImplicadosBienService, ImplicadosBienLgiRepository],
  exports: [ImplicadosBienService, ImplicadosBienLgiRepository],
})
export class ImplicadosBienModule {}
