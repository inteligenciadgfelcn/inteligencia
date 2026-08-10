import { Module } from '@nestjs/common'
import { ParametricasLgiService } from './parametricas_lgi.service'
import { ParametricasLgiController } from './parametricas_lgi.controller'
import { DistritalLgiRepository } from './repository/distrito.repository'
import { GrupoLgiRepository } from './repository/grupo.repository'
import { DepartamentoLgiRepository } from './repository/departamento.repository'

@Module({
  controllers: [ParametricasLgiController],
  providers: [
    ParametricasLgiService,
    DistritalLgiRepository,
    GrupoLgiRepository,
    DepartamentoLgiRepository,
  ],
  exports: [
    ParametricasLgiService,
    DistritalLgiRepository,
    GrupoLgiRepository,
    DepartamentoLgiRepository,
  ],
})
export class ParametricasLgiModule {}
