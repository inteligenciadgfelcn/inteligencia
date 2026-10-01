import { Module } from '@nestjs/common'
import { ActuacionesPdModule } from './actuaciones/actuaciones.module'
import { AsignacionPdModule } from './asignacion_pd/asignacion_pd.module'
import { PersonasIdentificadasModule } from './personas_identificadas/personas_identificadas.module';

@Module({
  imports: [AsignacionPdModule, ActuacionesPdModule, PersonasIdentificadasModule],
  controllers: [],
})
export class PdModule {}
