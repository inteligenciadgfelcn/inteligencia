import { Module } from '@nestjs/common'
import { SunesisModule } from './sunesis/sunesis.module'
import { InteligenciaModule } from './inteligencia/inteligencia.module'
import { InteroperabilidadModule } from './interoperabilidad/interoperabilidad.module'
import { LgiModule } from './lgi/lgi.module'
import { FiscaliaModule } from './fiscalia/fiscalia.module'

@Module({
  imports: [
    SunesisModule,
    InteligenciaModule,
    InteroperabilidadModule,
    LgiModule,
    FiscaliaModule,
  ],
})
export class ApplicationModule {}
