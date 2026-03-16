
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
import { TipoDocumentoModule } from './felcn_siii/parametricas/tipo_documento/tipo_documento.module';
import { ProfesionModule } from './felcn_siii/parametricas/profesion/profesion.module';
import { EstadoCivilModule } from './felcn_siii/parametricas/estado_civil/estado_civil.module';
import { TipoNarizModule } from './felcn_siii/parametricas/tipo_nariz/tipo_nariz.module';
import { ColorPielModule } from './felcn_siii/parametricas/color_piel/color_piel.module';
import { ColorCabelloModule } from './felcn_siii/parametricas/color_cabello/color_cabello.module';
import { ColorOjosModule } from './felcn_siii/parametricas/color_ojos/color_ojos.module';
import { TipoOjosModule } from './felcn_siii/parametricas/tipo_ojos/tipo_ojos.module';
import { TipoCabelloModule } from './felcn_siii/parametricas/tipo_cabello/tipo_cabello.module';
import { ConstitucionCorporalModule } from './felcn_siii/parametricas/constitucion_corporal/constitucion_corporal.module'
import { FiliacionModule } from './felcn_siii/operaciones/filiacion/filiacion.module'
import { ArrestadoAuxiliarModule } from './felcn_siii/operaciones/filiacion/arrestado_auxiliar/arrestado_auxiliar.module';

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
    TipoDocumentoModule,
    ProfesionModule,
    EstadoCivilModule,
    TipoNarizModule,
    ColorPielModule,
    ColorCabelloModule,
    ColorOjosModule,
    TipoOjosModule,
    ConstitucionCorporalModule,
    TipoCabelloModule,
    FiliacionModule,
  ],
})
export class InteligenciaModule {}