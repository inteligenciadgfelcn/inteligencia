import { Module } from '@nestjs/common'
import { SunesisModule } from './sunesis/sunesis.module'
import { InteligenciaModule } from './inteligencia/inteligencia.module'
import { InteroperabilidadModule } from './interoperabilidad/interoperabilidad.module'
import { LgiModule } from './lgi/lgi.module'
import { FiscaliaModule } from './fiscalia/fiscalia.module'
import { AsignacionPdModule } from './pd/asignacion_pd/asignacion_pd.module';
import { PdModule } from './pd/pd.module'

@Module({
  imports: [
    SunesisModule,
    InteligenciaModule,
    InteroperabilidadModule,
    LgiModule,
    FiscaliaModule,
    AsignacionPdModule,
    PdModule,
  ],
})
export class ApplicationModule {}
