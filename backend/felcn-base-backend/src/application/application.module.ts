import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { HealthModule } from './health/health.module'
// import { SunesisModule } from './sunesis/sunesis.module'
import { InteligenciaModule } from './inteligencia/inteligencia.module'
import { InteroperabilidadModule } from './interoperabilidad/interoperabilidad.module'

@Module({
  imports: [
    ParametroModule,
    HealthModule,
    InteligenciaModule,
    InteroperabilidadModule,
  ],
})
export class ApplicationModule { }