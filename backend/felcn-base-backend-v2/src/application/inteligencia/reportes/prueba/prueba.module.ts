import { Module } from "@nestjs/common";
import { PruebaController } from "./prueba.controller";
import { PruebaService } from "./prueba.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExportModule } from "../export/export.module";
import { Detenido } from "../../felcn_sii/filiacion/detenido/entities/detenido.entity";
import { DB_SII } from "@/core/config/database/database.module";
import { Huella } from "../../felcn_sii/huella/entities/huella.entity";

@Module({
    imports: [
    TypeOrmModule.forFeature([Detenido, Huella],DB_SII), 
    ExportModule,
  ],
  controllers: [PruebaController],
  providers: [PruebaService],
})
export class PruebaModule {}