import { Module } from '@nestjs/common'
import { ArrestadoAuxiliarService } from './arrestado_auxiliar.service'
import { ArrestadoAuxiliarController } from './arrestado_auxiliar.controller'

@Module({
  controllers: [ArrestadoAuxiliarController],
  providers: [ArrestadoAuxiliarService],
})
export class ArrestadoAuxiliarModule {}
