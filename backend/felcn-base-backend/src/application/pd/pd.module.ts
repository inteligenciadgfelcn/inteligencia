import { Module } from '@nestjs/common'
import { ActuacionesPdModule } from './actuaciones/actuaciones.module'
import { AsignacionPdModule } from './asignacion_pd/asignacion_pd.module'
import { PersonasIdentificadasModule } from './personas_identificadas/personas_identificadas.module';
import { BienesIdentificadosPdModule } from './bienes_identificados_pd/bienes_identificados_pd.module';

@Module({
  imports: [AsignacionPdModule, ActuacionesPdModule, PersonasIdentificadasModule, BienesIdentificadosPdModule],
  controllers: [],
})
export class PdModule {}
