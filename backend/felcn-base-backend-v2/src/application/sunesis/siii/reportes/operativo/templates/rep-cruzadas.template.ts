import { ReportTemplate } from '../../interfaces/reporte-template.interface'
import { PDFOptions } from 'puppeteer'
import { ResultadoConsultaAvanzada } from '../../cruzados/interfaces/consulta-avanzada-filtro.interface'
import { getLogoBase64 } from '../../report-logo.util'

export class CruzadasReportTemplate implements ReportTemplate<ResultadoConsultaAvanzada[]> {
  pdfOptions: PDFOptions = {
    format: 'Legal',
    landscape: true,
    margin: {
      top: '50px',
      right: '30px',
      bottom: '60px',
      left: '30px',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 9px; width: 100%; display: flex; justify-content: space-between; align-items: center;
                  border-top: 1px solid #e5e7eb; padding: 8px 30px 0; color: #3e5f8a;
                  font-family: 'Calibri', 'Arial', sans-serif; box-sizing: border-box;">
        <span>FELCN — Departamento de Inteligencia</span>
        <span><strong>Fecha de impresión:</strong>&nbsp;<span class="date"></span></span>
        <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>
    `,
  }

  generateHtml(data: ResultadoConsultaAvanzada[]): string {
    const filas = data.map((row) => {
      const raw = row.colorRelevancia?.trim()
      const bg = raw ? (raw.startsWith('#') ? raw : `#${raw}`) : 'transparent'
      const fg = this.contrasteColor(bg)
      return `
        <tr style="background-color:${bg}; color:${fg};">
          <td>${row.fechaOperativo || ''}</td>
          <td>${row.numeroCaso || ''}</td>
          <td>${row.ubicacionInstitucional || ''}</td>
          <td>${row.ubicacionGeografica || ''}</td>
          <td>${row.asignado || ''}</td>
          <td class="pre">${row.personasImplicadas || ''}</td>
          <td class="pre">${row.drogas || ''}</td>
          <td class="pre">${row.sustanciasSolidas || ''}</td>
          <td class="pre">${row.sustanciasLiquidas || ''}</td>
          <td class="pre">${row.laboratoriosFabricas || ''}</td>
          <td class="pre">${row.bienesIncautados || ''}</td>
          <td><strong>${row.tipoRelevancia || ''}</strong></td>
          <td style="text-align:right;">${row.totalCosto || '0.00'}</td>
        </tr>
      `
    }).join('')

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reporte Cruzadas</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 10px; background: #D2D2D2; font-family: 'Calibri', 'Arial', sans-serif; font-size: 9px; }
    .doc { background: white; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .header {
      background: linear-gradient(135deg, #3e5f8a 0%, #1e3a5f 100%);
      padding: 16px 30px; color: white;
      display: flex; align-items: center; justify-content: space-between; gap: 20px;
      border-bottom: 4px solid #3e5f8a;
    }
    .header-text { flex: 1; text-align: center; }
    .header-text p { margin: 2px 0; font-size: 12px; line-height: 1.3; }
    .content { padding: 16px 30px; }
    .section-title {
      font-size: 13px; font-weight: bold; color: #3e5f8a; text-transform: uppercase;
      border-bottom: 3px solid #3e5f8a; padding-bottom: 6px; margin-bottom: 12px;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    thead tr { background-color: #3e5f8a; color: white; }
    th { padding: 6px 5px; text-align: left; font-size: 8px; text-transform: uppercase; white-space: nowrap; border: 1px solid #2c4a6b; }
    td { border: 1px solid #d1d5db; padding: 5px; vertical-align: top; font-size: 8px; }
    .pre { white-space: pre-wrap; word-break: break-word; }
    .badge-count {
      display: inline-block; background: #3e5f8a; color: white;
      padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-bottom: 10px;
    }
    @media print {
      body { background: white; padding: 0; }
      .doc { box-shadow: none; }
    }
    .fecha { width: 5%; }
    .caso { width: 5%; }
    .institucional { width: 8%; }
    .geografica { width: 8%; }
    .asignado { width: 10%; }
    .personas { width: 10%; }
    .drogas { width: 10%; }
    .solidas { width: 10%; }
    .liquidas { width: 9%; }
    .fabricas { width: 8%; }
    .bienes { width: 7%; }
    .relevancia { width: 5%; }
    .costo { width: 5%; text-align:right; }
  </style>
</head>
<body>
  <div class="doc">
    <div class="header">
      <img src="data:image/png;base64,${getLogoBase64()}" width="80" height="80" style="object-fit:contain;" />
      <div class="header-text">
        <p><strong>DEPARTAMENTO NACIONAL DE INTELIGENCIA</strong></p>
        <p><strong>REGISTRO DE OPERACIONES CON RESULTADOS A NIVEL NACIONAL</strong></p>
      </div>
      <div style="width:80px;"></div>
    </div>
    <div class="content">
      <div class="section-title">Resultados de la consulta</div>
      <div class="badge-count">${data.length} operativo(s) encontrado(s)</div>
      <table>
        <thead>
          <tr>
            <th class="fecha">Fecha y Hora</th>
            <th class="caso">Nro. Caso</th>
            <th class="institucional">Unidad</th>
            <th class="geografica">Lugar del Operativo</th>
            <th class="asignado">Asignados al Caso</th>
            <th class="personas">Personas — Estado</th>
            <th class="drogas">Droga</th>
            <th class="solidas">Sust. Sólidas</th>
            <th class="liquidas">Sust. Líquidas</th>
            <th class="fabricas">Lab. y Fábricas</th>
            <th class="bienes">Bienes Secuestrados</th>
            <th class="relevancia">Relevancia</th>
            <th class="costo">Costos Bs.</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
    `
  }

  generateCsv(data: ResultadoConsultaAvanzada[]): string {
    const escape = (v: string | null | undefined) =>
      `"${(v || '').replace(/"/g, '""').replace(/\r?\n/g, ' | ')}"`

    const header = [
      'Fecha y Hora', 'Nro. Caso', 'Unidad', 'Lugar del Operativo',
      'Asignados al Caso', 'Personas — Estado', 'Droga',
      'Sust. Sólidas', 'Sust. Líquidas', 'Lab. y Fábricas',
      'Bienes Secuestrados', 'Relevancia', 'Costos Bs.',
    ].join(',')

    const rows = data.map((r) => [
      escape(r.fechaOperativo),
      escape(r.numeroCaso),
      escape(r.ubicacionInstitucional),
      escape(r.ubicacionGeografica),
      escape(r.asignado),
      escape(r.personasImplicadas),
      escape(r.drogas),
      escape(r.sustanciasSolidas),
      escape(r.sustanciasLiquidas),
      escape(r.laboratoriosFabricas),
      escape(r.bienesIncautados),
      escape(r.tipoRelevancia),
      escape(r.totalCosto),
    ].join(','))

    return [header, ...rows].join('\n')
  }

  /** Devuelve '#000' o '#fff' según la luminancia relativa del hex de fondo. */
  private contrasteColor(color: string): string {
    if (!color || color === 'transparent') return '#000'
    let hex = color.trim().replace(/^#/, '')
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) return '#000'
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.55 ? '#000' : '#fff'
  }
}
