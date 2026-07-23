import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { S2iModule } from '../s2i.module'
import { ReportBaseService } from '../../siii/reportes/services/reporte-base.service'
import { ReporteCasosService } from './services/reporte-casos.service'
import { ReporteFlujoTransporteService } from './services/reporte-flujo-transporte.service'
import { CasosReportController } from './casos/casos-report.controller'
import { FlujoTransporteReportController } from './flujo-transporte/flujo-transporte-report.controller'

/**
 * Módulo de reportes del sistema S2I (Casos de Investigación y Flujo de Transporte).
 * Importa S2iModule para acceder a los servicios existentes de Caso, Blanco,
 * Organizacion, Bien y FlujoTransporte, y registra los servicios de agregación de reportes.
 *
 * Rutas expuestas:
 *   GET /s2i/reportes/casos                    → lista JSON (FRM-RP-01 / FRM-RP-02)
 *   GET /s2i/reportes/casos/:id/pdf             → PDF detallado (RPT-MN-01)
 *   GET /s2i/reportes/casos/:id/sig/pdf         → PDF SIG con Leaflet (RPT-MN-02)
 *   GET /s2i/reportes/flujo-transporte          → lista JSON filtrable (documento/placa/fechas)
 *   GET /s2i/reportes/flujo-transporte/pdf      → PDF con los mismos filtros
 */
@Module({
  imports: [S2iModule, HttpModule],
  controllers: [CasosReportController, FlujoTransporteReportController],
  providers: [
    ReportBaseService,   // servicio Puppeteer compartido con SIII
    ReporteCasosService, // agrega datos de Caso + Blanco + Organizacion + Bien
    ReporteFlujoTransporteService, // agrega datos de Flujo de Transporte
  ],
})
export class ReportesS2iModule {}
