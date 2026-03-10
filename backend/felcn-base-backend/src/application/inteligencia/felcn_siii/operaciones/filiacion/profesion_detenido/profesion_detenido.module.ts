import { Module } from '@nestjs/common';
import { ProfesionDetenidoService } from './profesion_detenido.service';
import { ProfesionDetenidoController } from './profesion_detenido.controller';
import { DB_SIII } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionDetenido } from './entities/profesion_detenido.entity';
import { Profesion } from '../../../parametricas/profesion/entities/profesion.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([ProfesionDetenido, Profesion], DB_SIII),
      ],
  controllers: [ProfesionDetenidoController],
  providers: [ProfesionDetenidoService],
})
export class ProfesionDetenidoModule {}
