import { Module } from '@nestjs/common';
import { FiliacionService } from './filiacion.service';
import { FiliacionController } from './filiacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detenido } from './detenido/entities/detenido.entity';
import { DocumentoDetenido } from './documento_detenido/entities/documento_detenido.entity';
import { AliasDetenido } from './alias_detenido/entities/alias_detenido.entity';
import { ProfesionDetenido } from './profesion_detenido/entities/profesion_detenido.entity';
import { FenotipoDetenido } from './fenotipo_detenido/entities/fenotipo_detenido.entity';
import { DB_SII} from '@/core/config/database/database.module';
import { PersonasRepository } from './repository/personas.repository';
import { Profesion } from '../parametricas/profesion/entities/profesion.entity';
import { FiliacionRepository } from './repository/filiacion.repository';
import { HuellaModule } from '../huella/huella.module';
import { ArrestadoAuxiliar } from './arrestado_auxiliar/entities/arrestado_auxiliar.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([
      Detenido,
      AliasDetenido,
      ProfesionDetenido,
      DocumentoDetenido,
      FenotipoDetenido,
      ArrestadoAuxiliar,
      Profesion
    ],DB_SII),
    HuellaModule,
  ],
  controllers: [FiliacionController],
  providers: [FiliacionService, PersonasRepository, FiliacionRepository],
})
export class FiliacionModule {}
