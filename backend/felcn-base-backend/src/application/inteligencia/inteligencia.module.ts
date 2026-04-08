
import { UsuarioModule } from './usuario/usuario.module'
import { Module } from '@nestjs/common'
import { GrupoModule } from './felcn_asignacion_caso/grupo/grupo.module'
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
import { DatosFamiliaresModule } from './felcn_sii/datos_familiares/datos_familiares.module';
import { ParentezcoModule } from './felcn_sii/parametricas/parentezco/parentezco.module'
import { ScannerModule } from './felcn_sii/scanner/scanner.module'
import { TipoDocumentoModule } from './felcn_sii/parametricas/tipo_documento/tipo_documento.module'
import { NombresSupuestosModule } from './felcn_sii/nombres_supuestos/nombres_supuestos.module';
import { LetraModule } from './felcn_asignacion_caso/letra/letra.module'
import { AsignacionesModule } from './felcn_asignacion_caso/asignaciones/asignaciones.module'
import { UnidadModule } from './felcn_asignacion_caso/unidad/unidad.module'
import { DistritalModule } from './felcn_asignacion_caso/distrital/distrital.module'
import { ContinenteModule } from './felcn_sii/parametricas/continente/continente.module'
import { PaisModule } from './felcn_sii/parametricas/pais/pais.module'
import { DepartamentoModule } from './felcn_sii/parametricas/departamento/departamento.module'
import { OperativoModule } from './felcn_sospechoso/operativo/operativo.module';

@Module({
  imports: [
    UsuarioModule,
    UnidadModule,
    DistritalModule,
    GrupoModule,
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
    ParentezcoModule,
    NombresSupuestosModule,
    OperativoModule
  ],
})
export class InteligenciaModule {}