import { Module } from '@nestjs/common';
import { ContinentesService } from './continentes.service';
import { ContinentesController } from './continentes.controller';
import { Continente } from './entities/continente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Continente]),  
  ],
  controllers: [ContinentesController],
  providers: [ContinentesService],
  exports: [TypeOrmModule],
})
export class ContinentesModule {}
