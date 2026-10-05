import { Module } from '@nestjs/common'
import { ActuacionesPdModule } from './actuaciones/actuaciones.module'
import { AsignacionPdModule } from './asignacion_pd/asignacion_pd.module'
import { PersonasIdentificadasModule } from './personas_identificadas/personas_identificadas.module'
import { PersonasJuridicasPdModule } from './personas_juridicas_pd/personas_juridicas_pd.module'
import { PersonasImplicadasPdModule } from './personas_implicadas_pd/personas_implicadas_pd.module'
import { BienesIdentificadosPdModule } from './bienes_identificados_pd/bienes_identificados_pd.module'
import { VinculoBienModule } from './vinculo_bien_pd/vinculo_bien.module'
import { SituacionJuridicaPdModule } from './situacion_juridica_pd/situacion_juridica_pd.module';

@Module({
  imports: [
    AsignacionPdModule,
    ActuacionesPdModule,
    PersonasIdentificadasModule,
    BienesIdentificadosPdModule,
    VinculoBienModule,
    PersonasJuridicasPdModule,
    PersonasImplicadasPdModule,
    SituacionJuridicaPdModule,
  ],
  controllers: [],
})
export class PdModule {}
