import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CalidadBienLgiController } from './calidad-bien.controller'
import { CalidadBienLgiRepository } from './repository/calidad-bien.repository'
import { CalidadBienLgiService } from './calidad-bien.service'
import { CalidadBienLgi } from './entities/calidad-bien.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CalidadBienLgi], DB_LGI)],
  controllers: [CalidadBienLgiController],
  providers: [CalidadBienLgiService, CalidadBienLgiRepository],
  exports: [CalidadBienLgiService],
})
export class CalidadBienModule {}
