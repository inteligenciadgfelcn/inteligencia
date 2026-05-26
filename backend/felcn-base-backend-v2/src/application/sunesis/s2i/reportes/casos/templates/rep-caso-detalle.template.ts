import { ReportTemplate } from '../../../../siii/reportes/interfaces/reporte-template.interface'
import { PDFOptions } from 'puppeteer'
import { ReporteCasosService } from '../../services/reporte-casos.service'
import { getLogoBase64 } from '../../../../siii/reportes/report-logo.util'

/**
 * Template del Reporte Detallado de Caso (RPT-MN-01).
 * Genera un PDF con: datos generales del caso, investigados (con antecedentes,
 * redes sociales y lugares de frecuencia GIS), organizaciones (con ubicación GIS)
 * y bienes/activos (con características).
 */
export class RepCasoDetalleTemplate implements ReportTemplate<any> {
  pdfOptions: PDFOptions = {
    format: 'letter',
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
    return service.obtenerDetalleCaso(idCaso)
  }

  generateHtml(data: any): string {
    const { caso, blancos, organizaciones, bienes } = data

    const formatFecha = (f: any) =>
      f ? new Date(f).toLocaleDateString('es-BO') : 'N/A'

    // ── Sección investigados ────────────────────────────────────────────────
    const blancosHtml = blancos
      .map((b: any) => {
        const antecedentesRows = b.antecedentes
          .map(
            (a: any) => `
          <tr>
            <td>${a.descripcionTipoDelito ?? 'N/A'}</td>
            <td>${a.descripcionPais ?? 'N/A'}</td>
            <td>${a.lugarHecho ?? ''}</td>
            <td>${a.nroCaso ?? ''}</td>
            <td>${formatFecha(a.fechaHecho)}</td>
            <td>${a.hecho ?? ''}</td>
          </tr>`,
          )
          .join('')

        const redesRows = b.redesSociales
          .map(
            (r: any) => `
          <tr>
            <td>${r.tipoRed ?? 'N/A'}</td>
            <td>${r.direccion ?? ''}</td>
          </tr>`,
          )
          .join('')

        const lugaresRows = b.lugares
          .map(
            (l: any) => `
          <tr>
            <td>${l.descripcion ?? ''}</td>
            <td>${l.coordenadasX ?? ''}</td>
            <td>${l.coordenadasY ?? ''}</td>
            <td>${l.contenido ?? ''}</td>
          </tr>`,
          )
          .join('')

        return `
        <div class="blanco-card">
          <table class="info-table">
            <tr><td class="label">Nombre(s)</td><td>${b.deNombres ?? ''}</td></tr>
            <tr><td class="label">Apellido Paterno</td><td>${b.dePaterno ?? ''}</td></tr>
            <tr><td class="label">Apellido Materno</td><td>${b.deMaterno ?? ''}</td></tr>
            <tr><td class="label">Apellido del Esposo</td><td>${b.deEsposo ?? ''}</td></tr>
            <tr><td class="label">Nacionalidad</td><td>${b.descripcionPais ?? 'N/A'}</td></tr>
            <tr><td class="label">Alias</td><td>${b.alias ?? ''}</td></tr>
          </table>

          <div class="sub-section">ANTECEDENTES POR DELITOS COMETIDOS</div>
          <table>
            <thead>
              <tr><th>Tipo Delito</th><th>País</th><th>Lugar</th><th>Nro. Caso</th><th>Fecha</th><th>Hecho</th></tr>
            </thead>
            <tbody>${antecedentesRows || '<tr><td colspan="6">Sin antecedentes registrados</td></tr>'}</tbody>
          </table>

          <div class="sub-section">REDES SOCIALES Y CORREO</div>
          <table>
            <thead><tr><th>Red Social / Correo</th><th>Dirección</th></tr></thead>
            <tbody>${redesRows || '<tr><td colspan="2">Sin registros</td></tr>'}</tbody>
          </table>

          <div class="sub-section">LUGARES DE FRECUENCIA</div>
          <table>
            <thead><tr><th>Descripción</th><th>Latitud</th><th>Longitud</th><th>Motivo</th></tr></thead>
            <tbody>${lugaresRows || '<tr><td colspan="4">Sin registros</td></tr>'}</tbody>
          </table>
        </div>`
      })
      .join('')

    // ── Sección organizaciones ──────────────────────────────────────────────
    const organizacionesHtml = organizaciones
      .map((o: any) => {
        const lugaresRows = o.lugares
          .map(
            (l: any) => `
          <tr>
            <td>${l.descripcion ?? ''}</td>
            <td>${l.coordenadasX ?? ''}</td>
            <td>${l.coordenadasY ?? ''}</td>
            <td>${l.contenido ?? ''}</td>
          </tr>`,
          )
          .join('')

        return `
        <div class="blanco-card">
          <table class="info-table">
            <tr><td class="label">Tipo de Organización</td><td>${o.descripcionTipoOrganizacion ?? 'N/A'}</td></tr>
            <tr><td class="label">Nombre / Razón Social</td><td>${o.nombre ?? ''}</td></tr>
            <tr><td class="label">NIT</td><td>${o.nit ?? ''}</td></tr>
            <tr><td class="label">Matrícula de Comercio</td><td>${o.matricula ?? ''}</td></tr>
            <tr><td class="label">Representante Legal</td><td>${o.representante ?? ''}</td></tr>
            <tr><td class="label">Observaciones</td><td>${o.observaciones ?? ''}</td></tr>
          </table>

          <div class="sub-section">UBICACIÓN DE LA ORGANIZACIÓN</div>
          <table>
            <thead><tr><th>Descripción</th><th>Latitud</th><th>Longitud</th><th>Motivo</th></tr></thead>
            <tbody>${lugaresRows || '<tr><td colspan="4">Sin registros</td></tr>'}</tbody>
          </table>
        </div>`
      })
      .join('')

    // ── Sección bienes ──────────────────────────────────────────────────────
    const bienesHtml = bienes
      .map((b: any) => {
        const caracRows = b.caracteristicas
          .map(
            (c: any) => `
          <tr>
            <td>${c.descripcionCaracteristica ?? 'N/A'}</td>
            <td>${c.descripcion ?? ''}</td>
          </tr>`,
          )
          .join('')

        return `
        <tr>
          <td>${b.descripcionBien ?? 'N/A'}</td>
          <td>${b.descripcionClase ?? 'N/A'}</td>
          <td>${b.descripcionTipo ?? 'N/A'}</td>
          <td>${b.descripcionTipoInvestigacion ?? 'N/A'}</td>
          <td>
            <table style="width:100%; border:none; margin:0;">
              <thead><tr><th>Característica</th><th>Descripción</th></tr></thead>
              <tbody>${caracRows || '<tr><td colspan="2">—</td></tr>'}</tbody>
            </table>
          </td>
        </tr>`
      })
      .join('')

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte de Caso — ${caso.nombreCaso}</title>
  <style>
    body { margin: 0; padding: 20px; background: #D2D2D2;
           font-family: 'Calibri', 'Arial', sans-serif; font-size: 12px; }
    .doc { width: 100%; max-width: 8.5in; background: white;
           margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,.15); }
    .header { background: linear-gradient(135deg,#3e5f8a 0%,#1e3a5f 100%);
              padding: 25px 40px; color: white;
              display: flex; align-items: center; justify-content: space-between; }
    .header-text { flex: 1; text-align: center; }
    .header-text p { margin: 3px 0; }
    .content { padding: 30px 40px; }
    .section-title { font-size: 14px; font-weight: bold; color: #3e5f8a;
                     text-transform: uppercase; border-bottom: 3px solid #3e5f8a;
                     padding-bottom: 4px; margin: 20px 0 10px; }
    .sub-section { font-weight: bold; color: #1e3a8a; font-size: 11px;
                   text-transform: uppercase; margin: 12px 0 4px; text-align: center; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8px; }
    th { background: #5D7B9D; color: white; padding: 6px 8px; text-align: left; }
    td { border: 1px solid #e5e7eb; padding: 6px 8px; vertical-align: top; }
    tr:nth-child(even) { background: #f7f6f3; }
    .info-table td { border: none; padding: 4px 8px; }
    .info-table .label { color: #3e5f8a; font-weight: bold; width: 200px; }
    .blanco-card { border: 1px solid #3e5f8a; border-radius: 6px;
                   padding: 12px; margin-bottom: 16px; page-break-inside: avoid; }
    @media print { body { background: white; padding: 0; }
                   .doc { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="doc">
    <!-- Encabezado institucional -->
    <div class="header">
      <img src="data:image/png;base64,${getLogoBase64()}" width="80" height="80"
           style="object-fit:contain;" />
      <div class="header-text">
        <p style="font-size:15px;"><strong>DEPARTAMENTO DE INTELIGENCIA</strong></p>
        <p>REPORTE DE CASO</p>
        <p>ALIANZA LATINOAMERICANA ANTINARCÓTICOS</p>
        <p style="font-size:14px; font-weight:bold;">CASO: ${caso.nombreCaso ?? ''}</p>
      </div>
      <div style="width:80px;"></div>
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
            <th>Fecha Inicio Investigación</th>
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

      <!-- Investigados -->
      <div class="section-title">Investigados</div>
      ${blancosHtml || '<p style="color:#6b7280;">Sin investigados registrados.</p>'}

      <!-- Organizaciones -->
      <div class="section-title">Organizaciones</div>
      ${organizacionesHtml || '<p style="color:#6b7280;">Sin organizaciones registradas.</p>'}

      <!-- Bienes y/o Activos -->
      <div class="section-title">Bienes y/o Activos en Investigación</div>
      <table>
        <thead>
          <tr>
            <th>Catálogo Bien</th>
            <th>Clase</th>
            <th>Tipo</th>
            <th>Tipo de Investigación</th>
            <th>Características</th>
          </tr>
        </thead>
        <tbody>
          ${bienesHtml || '<tr><td colspan="5">Sin bienes registrados.</td></tr>'}
        </tbody>
      </table>

    </div>
  </div>
</body>
</html>`
  }

  // Los reportes de caso no tienen exportación CSV; se deja vacío por contrato de la interfaz
  generateCsv(_data: any): string {
    return ''
  }
}
