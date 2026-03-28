
import { UsuarioModule } from './felcn_siii/parametricas/usuario/usuario.module'
import { ContinenteModule } from './felcn_siii/parametricas/continente/continente.module'
import { DepartamentoModule } from './felcn_siii/parametricas/departamento/departamento.module'
import { Module } from '@nestjs/common'
import { PaisModule } from './felcn_siii/parametricas/pais/pais.module'
import { AsignacionesModule } from './felcn_siii/operaciones/asignaciones/asignaciones.module'
import { UnidadModule } from './felcn_siii/parametricas/unidad/unidad.module'
import { DistritalModule } from './felcn_siii/parametricas/distrital/distrital.module'
import { GrupoModule } from './felcn_siii/parametricas/grupo/grupo.module'
import { GradoModule } from './felcn_siii/parametricas/grado/grado.module'
import { ServicioModule } from './felcn_asignacion_caso/servicio/servicio.module'
import { PruebaModule } from './reportes/prueba/prueba.module'

@Module({
  imports: [
    UsuarioModule,
    UnidadModule,
    DistritalModule,
    GrupoModule,
    GradoModule,
    ContinenteModule,
    PaisModule,
    DepartamentoModule,
    AsignacionesModule,
    ServicioModule,
    PruebaModule,
  ],
})
export class InteligenciaModule {}