
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
import { ProfesionModule } from './felcn_sii/parametricas/profesion/profesion.module';
import { EstadoCivilModule } from './felcn_sii/parametricas/estado_civil/estado_civil.module';
import { TipoNarizModule } from './felcn_sii/parametricas/tipo_nariz/tipo_nariz.module';
import { ColorPielModule } from './felcn_sii/parametricas/color_piel/color_piel.module';
import { ColorCabelloModule } from './felcn_sii/parametricas/color_cabello/color_cabello.module';
import { ColorOjosModule } from './felcn_sii/parametricas/color_ojos/color_ojos.module';
import { TipoOjosModule } from './felcn_sii/parametricas/tipo_ojos/tipo_ojos.module';
import { TipoCabelloModule } from './felcn_sii/parametricas/tipo_cabello/tipo_cabello.module';
import { ConstitucionCorporalModule } from './felcn_sii/parametricas/constitucion_corporal/constitucion_corporal.module'
import { FiliacionModule } from './felcn_sii/filiacion/filiacion.module'
import { LetraModule } from './felcn_siii/parametricas/letra/letra.module';
import { DatosFamiliaresModule } from './felcn_sii/datos_familiares/datos_familiares.module';
import { ParentezcoModule } from './felcn_sii/parametricas/parentezco/parentezco.module'
import { ScannerModule } from './felcn_sii/scanner/scanner.module'
import { TipoDocumentoModule } from './felcn_sii/parametricas/tipo_documento/tipo_documento.module'

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
    LetraModule,
    ScannerModule,
    DatosFamiliaresModule,
    ParentezcoModule
  ],
})
export class InteligenciaModule {}