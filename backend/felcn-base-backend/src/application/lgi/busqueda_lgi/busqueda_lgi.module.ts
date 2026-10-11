import { Module } from '@nestjs/common'
import { ExportModule } from '@/application/inteligencia/reportes/export/export.module'
import { BusquedaLgiController } from './busqueda_lgi.controller'
import { BusquedaLgiService } from './busqueda_lgi.service'
import { BusquedaLgiRepository } from './busqueda-lgi.repository'
import { VariablesCruzadasLgiExportService } from './variables-cruzadas-lgi-export.service'

@Module({
  imports: [ExportModule],
  controllers: [BusquedaLgiController],
  providers: [
    BusquedaLgiRepository,
    BusquedaLgiService,
    VariablesCruzadasLgiExportService,
  ],
  exports: [BusquedaLgiService],
})
export class BusquedaLgiModule {}
