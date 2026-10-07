import { DB_LGI } from "@/core/config/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConclusionPdController } from "./conclusion_caso.controller";
import { ConclusionPdService } from "./conclusion_caso.service";
import { CasoBienSujetoPd } from "./entities/caso-bien-sujeto-pd.entity";
import { CasoSentencia } from "./entities/caso-sentencia.entity";
import { ConclusionPdRepository } from "./repository/conclusion_caso.repository";
import { Module } from "@nestjs/common";


@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        CasoBienSujetoPd,
        CasoSentencia,
      ],
      DB_LGI
    ),
  ],
  controllers: [
    ConclusionPdController,
  ],
  providers: [
    ConclusionPdRepository,
    ConclusionPdService,
  ],
  exports: [
    ConclusionPdService,
    ConclusionPdRepository,
  ],
})
export class ConclusionPdModule {}