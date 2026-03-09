import { Module } from '@nestjs/common';
import { FiliacionService } from './filiacion.service';
import { FiliacionController } from './filiacion.controller';
import { Filiacion } from './entities/filiacion.entity';
import { DB_SIII } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasRepository } from './repository/personas.repository';
import { Pais } from '../../parametricas/pais/entities/pais.entity';
import { TipoDocumento } from '../../parametricas/tipo_documento/entities/tipo_documento.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([Filiacion,Pais,TipoDocumento], DB_SIII),
    ],
  controllers: [FiliacionController],
  providers: [FiliacionService,PersonasRepository],
  exports:[FiliacionService]
})
export class FiliacionModule {}
