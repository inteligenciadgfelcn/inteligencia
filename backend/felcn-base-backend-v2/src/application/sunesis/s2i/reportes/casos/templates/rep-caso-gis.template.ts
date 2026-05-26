import { ReportTemplate } from '../../../../siii/reportes/interfaces/reporte-template.interface'
import { PDFOptions } from 'puppeteer'
import { ReporteCasosService } from '../../services/reporte-casos.service'
import { getLogoBase64 } from '../../../../siii/reportes/report-logo.util'

/**
 * Template del Reporte GIS de Caso (RPT-MN-02).
 * Genera un PDF con los datos generales del caso y un mapa Leaflet
 * que muestra los marcadores de blancos (personas), organizaciones y bienes,
 * diferenciados por color e ícono.
 *
 * Requiere acceso a internet desde Puppeteer para cargar los tiles de OpenStreetMap.
 */
export class RepCasoGisTemplate implements ReportTemplate<any> {
  pdfOptions: PDFOptions = {
    format: 'letter',
    landscape: true,
    margin: { top: '40px', right: '40px', bottom: '60px', left: '40px' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 10px; width: 100%; display: flex; justify-content: flex-end;
                  align-items: center; border-top: 1px solid #e5e7eb; padding: 10px 40px 0 0;
                  color: #3e5f8a; font-family: 'Calibri', 'Arial', sans-serif;">
        <span style="font-weight: bold;">Fecha de impresión:</span>&nbsp;<span class="date"></span>
        <span style="margin-left: 20px;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`,
  }

  static async fetchData(
    service: ReporteCasosService,
    idCaso: string,
  ): Promise<any> {
    return service.obtenerGisCaso(idCaso)
  }

  generateHtml(data: any): string {
    const { caso, marcadores } = data

    const formatFecha = (f: any) =>
      f ? new Date(f).toLocaleDateString('es-BO') : 'N/A'

    // Centro del mapa: promedio de coordenadas o Bolivia por defecto
    const marcadoresValidos = marcadores.filter(
      (m: any) => m.lat && m.lon && !isNaN(m.lat) && !isNaN(m.lon),
    )
    const centroLat =
      marcadoresValidos.length > 0
        ? marcadoresValidos.reduce((s: number, m: any) => s + m.lat, 0) /
          marcadoresValidos.length
        : -16.5
    const centroLon =
      marcadoresValidos.length > 0
        ? marcadoresValidos.reduce((s: number, m: any) => s + m.lon, 0) /
          marcadoresValidos.length
        : -68.1

    // Colores por tipo de marcador para la leyenda y los círculos del mapa
    const colorPorTipo: Record<string, string> = {
      blanco: '#dc2626',       // rojo — personas investigadas
      organizacion: '#2563eb', // azul — organizaciones
      bien: '#16a34a',         // verde — bienes
    }

    // Generar el bloque de JavaScript para añadir marcadores al mapa Leaflet
    const marcadoresJs = marcadoresValidos
      .map((m: any) => {
        const color = colorPorTipo[m.tipo] ?? '#6b7280'
        const desc = m.descripcion.replace(/'/g, "\\'").replace(/\n/g, ' ')
        return `
        L.circleMarker([${m.lat}, ${m.lon}], {
          radius: 8, color: '${color}', fillColor: '${color}', fillOpacity: 0.85, weight: 2
        }).addTo(map).bindPopup('<strong>${desc}</strong>');`
      })
      .join('\n')

    // Tabla de leyenda de marcadores para el PDF
    const leyendaHtml = [
      { tipo: 'blanco', label: 'Personas Investigadas', color: '#dc2626' },
      { tipo: 'organizacion', label: 'Organizaciones', color: '#2563eb' },
      { tipo: 'bien', label: 'Bienes / Activos', color: '#16a34a' },
    ]
      .map(
        (l) => `
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
        <div style="width:14px; height:14px; border-radius:50%;
                    background:${l.color}; flex-shrink:0;"></div>
        <span>${l.label} (${marcadores.filter((m: any) => m.tipo === l.tipo).length})</span>
      </div>`,
      )
      .join('')

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte GIS — ${caso.nombreCaso}</title>
  <!-- Leaflet CSS para el mapa -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    body { margin: 0; padding: 20px; background: #D2D2D2;
           font-family: 'Calibri', 'Arial', sans-serif; font-size: 12px; }
    .doc { width: 100%; background: white; margin: 0 auto;
           box-shadow: 0 4px 20px rgba(0,0,0,.15); }
    .header { background: linear-gradient(135deg,#3e5f8a 0%,#1e3a5f 100%);
              padding: 20px 40px; color: white;
              display: flex; align-items: center; justify-content: space-between; }
    .header-text { flex: 1; text-align: center; }
    .header-text p { margin: 3px 0; }
    .content { padding: 20px 40px; }
    .section-title { font-size: 14px; font-weight: bold; color: #3e5f8a;
                     text-transform: uppercase; border-bottom: 3px solid #3e5f8a;
                     padding-bottom: 4px; margin: 16px 0 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #5D7B9D; color: white; padding: 6px 8px; text-align: left; }
    td { border: 1px solid #e5e7eb; padding: 6px 8px; }
    #map { width: 100%; height: 480px; border: 3px solid #3e5f8a; border-radius: 6px; }
    @media print { body { background: white; padding: 0; }
                   .doc { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="doc">

    <!-- Encabezado institucional -->
    <div class="header">
      <img src="data:image/png;base64,${getLogoBase64()}" width="70" height="70"
           style="object-fit:contain;" />
      <div class="header-text">
        <p style="font-size:14px;"><strong>DEPARTAMENTO DE INTELIGENCIA</strong></p>
        <p>REPORTE GIS — ACTIVIDAD DELICTUAL</p>
        <p>CASO: ${caso.nombreCaso ?? ''}</p>
      </div>
      <div style="width:70px;"></div>
    </div>

    <div class="content">

      <!-- Datos Generales del Caso -->
      <div class="section-title">Datos Generales del Caso</div>
      <table>
        <thead>
          <tr>
            <th>Registro Nro.</th>
            <th>País de Investigación</th>
            <th>Lugar</th>
            <th>Estado</th>
            <th>Etapa</th>
            <th>Fecha Inicio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${caso.nroCasoCer ?? 'N/A'}</td>
            <td>${caso.pais ?? 'N/A'}</td>
            <td>${caso.lugar ?? 'N/A'}</td>
            <td>${caso.estadoCaso ?? 'N/A'}</td>
            <td>${caso.etapaInvestigacion ?? 'N/A'}</td>
            <td>${formatFecha(caso.fechaInicio)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Leyenda -->
      <div class="section-title">GIS de Actividad Delictual</div>
      <div style="display:flex; gap:20px; margin-bottom:10px; font-size:11px;">
        ${leyendaHtml}
      </div>

      <!-- Mapa Leaflet -->
      <div id="map"></div>

    </div>
  </div>

  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: true, attributionControl: false })
               .setView([${centroLat}, ${centroLon}], ${marcadoresValidos.length > 0 ? 12 : 6});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    ${marcadoresJs}

    // Ajustar zoom para mostrar todos los marcadores
    ${
      marcadoresValidos.length > 0
        ? `var bounds = L.latLngBounds([${marcadoresValidos
            .map((m: any) => `[${m.lat},${m.lon}]`)
            .join(',')}]);
           map.fitBounds(bounds, { padding: [30, 30] });`
        : ''
    }
  </script>
</body>
</html>`
  }

  generateCsv(_data: any): string {
    return ''
  }
}
