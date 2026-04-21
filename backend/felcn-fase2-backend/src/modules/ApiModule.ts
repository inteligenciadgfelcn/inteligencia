import { Module } from "@nestjs/common";
import { AsignacionesModule } from "./operaciones/asignaciones/asignaciones.module";
import { ContinentesModule } from "./parametros/continentes/continentes.module";
import { PaisesModule } from "./parametros/paises/paises.module";
import { DepartamentosModule } from "./parametros/departamentos/departamentos.module";
import { ProvinciasModule } from "./parametros/provincias/provincias.module";
import { GruposModule } from "./usuario/grupos/grupos.module";
import { LetrasModule } from "./parametros/letras/letras.module";
import { UnidadesModule } from "./usuario/unidades/unidades.module";
import { DistritalesModule } from "./usuario/distritales/distritales.module";
import { GradosModule } from "./usuario/grados/grados.module";

@Module({
  imports: [
    ContinentesModule,
    PaisesModule,
    DepartamentosModule,
    ProvinciasModule,
    UnidadesModule,
    DistritalesModule,
    GruposModule,
    LetrasModule,
    AsignacionesModule,
    GradosModule,
  ],
})
export class ApiModule {}
