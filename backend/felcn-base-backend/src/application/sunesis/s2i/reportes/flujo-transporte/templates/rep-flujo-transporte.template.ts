import { PDFOptions } from 'puppeteer'
import { ReportTemplate } from '../../../../siii/reportes/interfaces/reporte-template.interface'
import { getLogoBase64 } from '../../../../siii/reportes/report-logo.util'
import { formatearFechaVisualizacion } from '@/common/utils/date.util'
import type {
  FiltroFlujoTransporte,
  FlujoTransporteReporteRow,
} from '../../../flujo-transporte/repository/flujo-transporte.repository'

export interface DatosReporteFlujoTransporte {
  filas: FlujoTransporteReporteRow[]
  filtro: FiltroFlujoTransporte
}

/** Agrega alfa (~25%) al hexadecimal del color para pintar la fila sin tapar el texto. */
const fondoFila = (hex: string | null) => (hex ? `${hex}40` : 'transparent')

/**
 * Template del Reporte de Flujo de Transporte.
 * Lista los viajes registrados (conductor, transporte, lugar, origen/destino/carga)
 * pintando cada fila con el color (hexadecimal) de la regla correspondiente.
 */
export class RepFlujoTransporteTemplate
  implements ReportTemplate<DatosReporteFlujoTransporte>
{
  pdfOptions: PDFOptions

  constructor(usuarioGenerador?: string) {
    this.pdfOptions = {
      format: 'letter',
      landscape: true,
      margin: { top: '40px', right: '30px', bottom: '60px', left: '30px' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 10px; width: 100%; display: flex; justify-content: flex-end;
                    align-items: center; border-top: 1px solid #e5e7eb; padding: 10px 30px 0 0;
                    color: #3e5f8a; font-family: 'Calibri', 'Arial', sans-serif;">
          <span style="font-weight: bold;">Fecha de impresión:</span>&nbsp;<span>${formatearFechaVisualizacion(new Date(), true)}</span>
          ${usuarioGenerador ? `<span style="margin-left: 20px;"><span style="font-weight: bold;">Generado por:</span>&nbsp;${usuarioGenerador}</span>` : ''}
          <span style="margin-left: 20px;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
    }
  }

  generateHtml(data: DatosReporteFlujoTransporte): string {
    const { filas, filtro } = data

    const formatFechaHora = (f: string) =>
      f
        ? new Date(f).toLocaleString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A'

    const filasHtml = filas
      .map(
        (f) => `
      <tr style="background:${fondoFila(f.colorHex)};">
        <td>${formatFechaHora(f.fechaHora)}</td>
        <td>${f.numeroDocumento}<br/><span class="sub">${f.conductorNombreCompleto ?? ''}</span></td>
        <td>${f.codigoTransporte}<br/><span class="sub">${[f.transporteMarca, f.transporteModelo].filter(Boolean).join(' ')}</span></td>
        <td>${f.lugarDescripcion ?? ''}</td>
        <td>${f.origen}</td>
        <td>${f.destino}</td>
        <td>${f.carga}</td>
        <td>${f.latitud}, ${f.longitud}</td>
      </tr>`
      )
      .join('')

    const filtrosDescripcion =
      [
        filtro.documento ? `Documento: ${filtro.documento}` : null,
        filtro.placa ? `Placa: ${filtro.placa}` : null,
        filtro.fechaDesde ? `Desde: ${filtro.fechaDesde}` : null,
        filtro.fechaHasta ? `Hasta: ${filtro.fechaHasta}` : null,
      ]
        .filter(Boolean)
        .join(' · ') || 'Sin filtros — todos los registros'

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte de Flujo de Transporte</title>
  <style>
    body { margin: 0; padding: 20px; background: #D2D2D2;
           font-family: 'Calibri', 'Arial', sans-serif; font-size: 12px; }
    .doc { width: 100%; background: white; margin: 0 auto;
           box-shadow: 0 4px 20px rgba(0,0,0,.15); }
    .header { background: linear-gradient(135deg,#3e5f8a 0%,#1e3a5f 100%);
              padding: 20px 30px; color: white;
              display: flex; align-items: center; justify-content: space-between; }
    .header-text { flex: 1; text-align: center; }
    .header-text p { margin: 3px 0; }
    .content { padding: 20px 30px; }
    .filtros { font-size: 11px; color: #3e5f8a; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #5D7B9D; color: white; padding: 6px 8px; text-align: left; }
    td { border: 1px solid #e5e7eb; padding: 6px 8px; vertical-align: top; }
    .sub { color: #6b7280; font-size: 10px; }
    @media print { body { background: white; padding: 0; } .doc { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="doc">
    <div class="header">
      <img src="data:image/png;base64,${getLogoBase64()}" width="65" height="65"
           style="object-fit:contain;" />
      <div class="header-text">
        <p style="font-size:15px;"><strong>DEPARTAMENTO DE INTELIGENCIA</strong></p>
        <p>REPORTE DE FLUJO DE TRANSPORTE</p>
        <p>ALIANZA LATINOAMERICANA ANTINARCÓTICOS</p>
      </div>
      <div style="width:65px;"></div>
    </div>

    <div class="content">
      <div class="filtros">
        <strong>Filtros aplicados:</strong> ${filtrosDescripcion} — ${filas.length} registro(s)
      </div>
      <table>
        <thead>
          <tr>
            <th>Fecha y hora</th>
            <th>Conductor</th>
            <th>Transporte</th>
            <th>Lugar</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Carga</th>
            <th>Coordenadas</th>
          </tr>
        </thead>
        <tbody>
          ${filasHtml || '<tr><td colspan="8">Sin registros para los filtros seleccionados.</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`
  }

  // El reporte de Flujo de Transporte no tiene exportación CSV; se deja vacío por contrato de la interfaz
  generateCsv(_data: DatosReporteFlujoTransporte): string {
    return ''
  }
}
