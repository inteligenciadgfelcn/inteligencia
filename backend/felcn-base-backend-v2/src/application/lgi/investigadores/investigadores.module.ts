import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestigadorLgi } from './entities/investigadore.entity'
import { InvestigadorLgiController } from './investigadores.controller'
import { InvestigadorLgiService } from './investigadores.service'
import { InvestigadorLgiRepository } from './repository/investigador.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [InvestigadorLgi],
      'DB_LGI'
    ),
  ],
  controllers: [InvestigadorLgiController],
  providers: [
    InvestigadorLgiService,
    InvestigadorLgiRepository,
  ],
  exports: [
    InvestigadorLgiService,
    InvestigadorLgiRepository,
  ],
})
export class InvestigadoresModule {}