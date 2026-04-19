import { Module } from '@nestjs/common'
import { SunesisModule } from './sunesis/sunesis.module'
import { InteligenciaModule } from './inteligencia/inteligencia.module'
import { InteroperabilidadModule } from './interoperabilidad/interoperabilidad.module'

@Module({
  imports: [SunesisModule, InteligenciaModule, InteroperabilidadModule],
})
export class ApplicationModule {}
