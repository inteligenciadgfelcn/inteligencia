import { Module } from '@nestjs/common'
import { S2iModule } from '../s2i.module'
import { ReportBaseService } from '../../siii/reportes/services/reporte-base.service'
import { ReporteCasosService } from './services/reporte-casos.service'
import { CasosReportController } from './casos/casos-report.controller'

/**
 * Módulo de reportes del sistema S2I (Casos de Investigación).
 * Importa S2iModule para acceder a los servicios existentes de Caso, Blanco,
 * Organizacion y Bien, y registra el servicio de agregación de reportes.
 *
 * Rutas expuestas:
 *   GET /s2i/reportes/casos            → lista JSON (FRM-RP-01 / FRM-RP-02)
 *   GET /s2i/reportes/casos/:id/pdf    → PDF detallado (RPT-MN-01)
 *   GET /s2i/reportes/casos/:id/gis/pdf → PDF GIS con Leaflet (RPT-MN-02)
 */
@Module({
  imports: [S2iModule],
  controllers: [CasosReportController],
  providers: [
    ReportBaseService,   // servicio Puppeteer compartido con SIII
    ReporteCasosService, // agrega datos de Caso + Blanco + Organizacion + Bien
  ],
})
export class ReportesS2iModule {}
