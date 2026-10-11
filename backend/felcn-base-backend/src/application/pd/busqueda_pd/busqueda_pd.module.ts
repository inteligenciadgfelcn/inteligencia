import { Module } from '@nestjs/common'
import { ExportModule } from '@/application/inteligencia/reportes/export/export.module'
import { BusquedaPdRepository } from './busqueda-pd.repository'
import { BusquedaPdController } from './busqueda_pd.controller'
import { BusquedaPdService } from './busqueda_pd.service'
import { VariablesCruzadasPdExportService } from './variables-cruzadas-pd-export.service'

@Module({
  imports: [ExportModule],
  controllers: [BusquedaPdController],
  providers: [
    BusquedaPdRepository,
    BusquedaPdService,
    VariablesCruzadasPdExportService,
  ],
  exports: [BusquedaPdService],
})
export class BusquedaPdModule {}
