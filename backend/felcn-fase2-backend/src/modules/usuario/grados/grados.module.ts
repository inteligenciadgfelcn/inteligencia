import { Module } from '@nestjs/common';
import { GradosService } from './grados.service';
import { GradosController } from './grados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from './entities/grado.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Grado])],
  controllers: [GradosController],
  providers: [GradosService],
  exports: [GradosService],
})
export class GradosModule {}
