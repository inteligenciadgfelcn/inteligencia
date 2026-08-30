import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExportModule } from "../export/export.module";
import { Detenido } from "../../felcn_sii/filiacion/detenido/entities/detenido.entity";
import { DB_SII } from "@/core/config/database/database.module";
import { Huella } from "../../felcn_sii/huella/entities/huella.entity";
import { ReporteController } from "./reporte.controller";
import { ReporteService } from "./reporte.service";

@Module({
    imports: [
    TypeOrmModule.forFeature([Detenido, Huella],DB_SII), 
    ExportModule,
  ],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}