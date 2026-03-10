import { Module } from '@nestjs/common';
import { ProfesionDetenidoService } from './profesion_detenido.service';
import { ProfesionDetenidoController } from './profesion_detenido.controller';

@Module({
  controllers: [ProfesionDetenidoController],
  providers: [ProfesionDetenidoService],
})
export class ProfesionDetenidoModule {}
