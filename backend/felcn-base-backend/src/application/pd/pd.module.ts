import { Module } from "@nestjs/common";
import { ActuacionesPdModule } from "./actuaciones/actuaciones.module";
import { AsignacionPdModule } from "./asignacion_pd/asignacion_pd.module";


@Module({
  imports: [
    ActuacionesPdModule,
    AsignacionPdModule
 
  ],
  controllers: [],
})
export class PdModule {}
