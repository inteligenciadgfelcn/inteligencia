import { Module } from "@nestjs/common";
import { PruebaController } from "./prueba.controller";
import { PruebaService } from "./prueba.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExportModule } from "../export/export.module";

@Module({
    imports: [
    TypeOrmModule.forFeature(), 
    ExportModule,
  ],
  controllers: [PruebaController],
  providers: [PruebaService],
})
export class PruebaModule {}