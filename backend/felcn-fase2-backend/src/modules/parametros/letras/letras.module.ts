import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LetrasController } from "./letras.controller";
import { LetrasService } from "./letras.service";
import { Letra } from "./entities/letra.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Letra])],
  controllers: [LetrasController],
  providers: [LetrasService],
  exports: [TypeOrmModule]
})
export class LetrasModule {}
