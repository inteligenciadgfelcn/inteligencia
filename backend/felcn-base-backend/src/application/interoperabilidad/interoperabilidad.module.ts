import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { InteroperabilidadController } from './controller/interoperabilidad.controller'
import { InteroperabilidadService } from './service/interoperabilidad.service'

@Module({
  imports: [HttpModule],
  controllers: [InteroperabilidadController],
  providers: [InteroperabilidadService],
})
export class InteroperabilidadModule {}
