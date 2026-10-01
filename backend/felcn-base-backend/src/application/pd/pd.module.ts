import { Module } from '@nestjs/common'
import { ActuacionesPdModule } from './actuaciones/actuaciones.module'
import { AsignacionPdModule } from './asignacion_pd/asignacion_pd.module'
import { PersonasIdentificadasModule } from './personas_identificadas/personas_identificadas.module';
import { PersonasJuridicasPdModule } from './personas_juridicas_pd/personas_juridicas_pd.module';
import { PersonasImplicadasPdModule } from './personas_implicadas_pd/personas_implicadas_pd.module';

@Module({
  imports: [AsignacionPdModule, ActuacionesPdModule, PersonasIdentificadasModule, PersonasJuridicasPdModule, PersonasImplicadasPdModule],
  controllers: [],
})
export class PdModule {}
