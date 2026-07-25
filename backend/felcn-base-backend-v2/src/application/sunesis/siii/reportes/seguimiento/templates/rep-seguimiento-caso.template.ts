import { ReportTemplate } from '../../interfaces/reporte-template.interface'
import { PDFOptions } from 'puppeteer'
import { SeguimientoService } from '../../../seguimiento/casos/service/seguimiento.service'
import { PersonasService } from '../../../seguimiento/personas/service/personas.service'
import { BienesService } from '../../../seguimiento/bienes/service/bienes.service'
import { formatearFechaVisualizacion } from '@/common/utils/date.util'
import { getLogoBase64 } from '../../report-logo.util'

/**
 * Reporte de Seguimiento de Caso — equivalente en S2I de RepJurCaso.aspx (SIII).
 * Cubre el seguimiento jurídico del caso: fiscales, investigadores asignados,
 * jurisdicción, control jurisdiccional, servidores policiales del operativo,
 * situación legal de las personas implicadas y situación legal de los bienes
 * secuestrados. La evidencia física del operativo (drogas, sustancias, galería)
 * ya se cubre en el Reporte General (rep-caso-general.template.ts).
 */
export class SeguimientoReportTemplate implements ReportTemplate<any> {
    pdfOptions: PDFOptions

    constructor(usuarioGenerador?: string) {
        this.pdfOptions = {
            format: 'letter',
            margin: {
                top: '40px',
                right: '40px',
                bottom: '60px',
                left: '40px',
            },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="font-size: 10px; width: 100%; display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid #e5e7eb; padding: 10px 40px 0 0; color: #3e5f8a; font-family: 'Calibri', 'Arial', sans-serif;">
                    <span style="font-weight: bold;">Fecha de impresión:</span>&nbsp;<span>${formatearFechaVisualizacion(new Date(), true)}</span>
                    ${usuarioGenerador ? `<span style="margin-left: 20px;"><span style="font-weight: bold;">Generado por:</span>&nbsp;${usuarioGenerador}</span>` : ''}
                    <span style="margin-left: 20px;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
                </div>
            `,
        }
    }

    static async fetchData(
        seguimientoService: SeguimientoService,
        personasService: PersonasService,
        bienesService: BienesService,
        idCaso: string
    ): Promise<any> {
        const detalle = await seguimientoService.obtenerDetalleSeguimiento(idCaso)
        const { cabecera, operativos, investigadores, fiscales, jurisdicciones, controles } = detalle

        const operativoPrincipal = operativos?.[0] ?? null
        const idOperativo = operativoPrincipal?.id ?? null

        const [servidoresPoliciales, personasRaw, bienesRaw] = await Promise.all([
            idOperativo ? seguimientoService.listarServidoresPoliciales(idOperativo) : Promise.resolve([]),
            idOperativo ? personasService.listarPersonasPorOperativo(idOperativo) : Promise.resolve([]),
            idOperativo ? bienesService.listarBienesPorOperativo(idOperativo) : Promise.resolve([]),
        ])

        const personas = await Promise.all(
            (personasRaw as any[]).map(async (persona) => {
                const [situaciones, etapas] = await Promise.all([
                    personasService.listarSituacionesPorPersona(String(persona.id)),
                    personasService.listarEtapasProcesoPorPersona(String(persona.id)),
                ])
                return { ...persona, situaciones, etapas }
            })
        )

        const bienes = await Promise.all(
            (bienesRaw as any[]).map(async (bien) => {
                const [secuestros, incautaciones, confiscaciones, situaciones, perdidasDominio] = await Promise.all([
                    bienesService.listarBienSecuestrado(String(bien.id)),
                    bienesService.listarBienIncautado(String(bien.id)),
                    bienesService.listarBienConfiscado(String(bien.id)),
                    bienesService.listarSituacionBien(String(bien.id)),
                    bienesService.listarPerdidaDominio(String(bien.id)),
                ])
                return { ...bien, secuestros, incautaciones, confiscaciones, situaciones, perdidasDominio }
            })
        )

        return {
            cabecera,
            operativos,
            operativoPrincipal,
            investigadores,
            fiscales,
            jurisdicciones,
            controles,
            servidoresPoliciales,
            personas,
            bienes,
        }
    }

    generateHtml(data: any): string {
        const {
            cabecera,
            operativos,
            operativoPrincipal,
            investigadores,
            fiscales,
            jurisdicciones,
            controles,
            servidoresPoliciales,
            personas,
            bienes,
        } = data

        const estadoBadge = (esActual: boolean) =>
            esActual
                ? `<span style="color: #15803d; font-weight: bold;">Actual</span>`
                : `<span style="color: #6b7280;">Histórico</span>`

        const fiscalesRows = (fiscales || [])
            .map(
                (f: any) => `
            <tr>
                <td>${f.nombreApellidos || 'N/A'}</td>
                <td>${formatearFechaVisualizacion(f.fecha)}</td>
                <td>${f.telefonoCelular || 'N/A'}</td>
                <td>${f.telefonoFijo || 'N/A'}</td>
                <td>${estadoBadge(f.esActual)}</td>
            </tr>`
            )
            .join('')

        const investigadoresRows = (investigadores || [])
            .map(
                (i: any) => `
            <tr>
                <td>${i.grado?.descripcion || 'N/A'}</td>
                <td>${i.nombreApp || 'N/A'}</td>
                <td>${formatearFechaVisualizacion(i.fecha)}</td>
                <td>${i.telefonoCelular || 'N/A'}</td>
                <td>${i.telefonoFijo || 'N/A'}</td>
                <td>${estadoBadge(i.esActual)}</td>
            </tr>`
            )
            .join('')

        const jurisdiccionesRows = (jurisdicciones || [])
            .map(
                (j: any) => `
            <tr>
                <td>${j.jurisdiccion || 'N/A'}</td>
                <td>${formatearFechaVisualizacion(j.fecha)}</td>
                <td>${j.observacion || 'N/A'}</td>
                <td>${estadoBadge(j.esActual)}</td>
            </tr>`
            )
            .join('')

        const controlesRows = (controles || [])
            .map(
                (c: any) => `
            <tr>
                <td>${c.juzgadoInstruccion || 'N/A'}</td>
                <td>${c.juzgadoPartido || 'N/A'}</td>
                <td>${c.tribunalSentencia || 'N/A'}</td>
                <td>${c.juzgadoEjecucion || 'N/A'}</td>
                <td>${formatearFechaVisualizacion(c.fecha)}</td>
                <td>${estadoBadge(c.esActual)}</td>
            </tr>`
            )
            .join('')

        const servidoresRows = (servidoresPoliciales || [])
            .map(
                (s: any) => `
            <tr>
                <td>${s.grado?.descripcion || 'N/A'}</td>
                <td>${s.nombreApellidos || 'N/A'}</td>
                <td>${formatearFechaVisualizacion(s.fechaHoraIngreso)}</td>
            </tr>`
            )
            .join('')

        const operativosRows = (operativos || [])
            .map(
                (op: any) => `
            <tr>
                <td>${op.nroInforme || 'N/A'}</td>
                <td>${formatearFechaVisualizacion(op.fechaOperativo)}</td>
                <td>${op.lugarCompleto || 'N/A'}</td>
                <td>${op.unidadDistrital || 'N/A'}</td>
            </tr>`
            )
            .join('')

        const personaBlocks = (personas || [])
            .map((persona: any) => {
                const situacionesRows = (persona.situaciones || [])
                    .map(
                        (s: any) => `
                    <tr>
                        <td>${s.situacionLegal || 'N/A'}</td>
                        <td>${s.nroResolucion || 'N/A'}</td>
                        <td>${s.lugar || 'N/A'}</td>
                        <td>${s.fecha || 'N/A'}</td>
                        <td>${s.autoridad || 'N/A'}</td>
                        <td>${s.fjt || 'N/A'}</td>
                    </tr>`
                    )
                    .join('')

                const etapasRows = (persona.etapas || [])
                    .map(
                        (e: any) => `
                    <tr>
                        <td>${e.etapa || 'N/A'}</td>
                        <td>${e.estado || 'N/A'}</td>
                        <td>${e.nroResolucion || 'N/A'}</td>
                        <td>${e.lugar || 'N/A'}</td>
                        <td>${formatearFechaVisualizacion(e.fecha)}</td>
                        <td>${e.autoridad || 'N/A'}</td>
                    </tr>`
                    )
                    .join('')

                return `
            <div class="timeline-item">
                <div class="timeline-title">${persona.nombreCompleto || 'N/A'} — ${persona.nacionalidad || 'N/A'} — ${persona.genero || 'N/A'} — ${persona.condicion || 'N/A'}</div>
                <div class="section-content" style="margin-bottom: 8px;">
                    Nac.: ${persona.fechaNacimiento || 'N/A'} &nbsp;|&nbsp; Edo. Civil: ${persona.estadoCivil || 'N/A'} &nbsp;|&nbsp; Dirección: ${persona.direccion || 'N/A'} &nbsp;|&nbsp; Tarjeta prontuario: ${persona.tarjeta || 'N/A'}
                </div>
                ${situacionesRows
                        ? `
                <div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">SITUACIÓN LEGAL</div>
                <table>
                    <thead><tr><th>Situación</th><th>Nro. Resolución</th><th>Lugar</th><th>Fecha</th><th>Autoridad</th><th>FJT</th></tr></thead>
                    <tbody>${situacionesRows}</tbody>
                </table>`
                        : ''
                    }
                ${etapasRows
                        ? `
                <div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">ETAPA DEL PROCESO</div>
                <table>
                    <thead><tr><th>Etapa</th><th>Estado</th><th>Nro. Resolución</th><th>Lugar</th><th>Fecha</th><th>Autoridad</th></tr></thead>
                    <tbody>${etapasRows}</tbody>
                </table>`
                        : ''
                    }
            </div>`
            })
            .join('')

        const bienBlocks = (bienes || [])
            .map((bien: any) => {
                const secuestrosRows = (bien.secuestros || [])
                    .map(
                        (s: any) => `<tr><td>${s.fiscal || 'N/A'}</td><td>${s.fechaActoSecuestro || 'N/A'}</td><td>${s.investigador || 'N/A'}</td></tr>`
                    )
                    .join('')
                const incautacionesRows = (bien.incautaciones || [])
                    .map(
                        (i: any) => `<tr><td>${i.numeroResolucion || 'N/A'}</td><td>${i.fechaResolucion || 'N/A'}</td><td>${i.autoridad || 'N/A'}</td></tr>`
                    )
                    .join('')
                const confiscacionesRows = (bien.confiscaciones || [])
                    .map(
                        (c: any) => `<tr><td>${c.numeroSentenciaJudicial || 'N/A'}</td><td>${c.fechaSentenciaJudicial || 'N/A'}</td><td>${c.autoridad || 'N/A'}</td></tr>`
                    )
                    .join('')
                const situacionesRows = (bien.situaciones || [])
                    .map(
                        (s: any) => `<tr><td>${s.calidadBien || 'N/A'}</td><td>${s.fechaEntrega || 'N/A'}</td><td>${s.responsableEntrega || 'N/A'}</td><td>${s.responsableRecepcion || 'N/A'}</td><td>${s.institucion || 'N/A'}</td><td>${s.ubicacion || 'N/A'}</td></tr>`
                    )
                    .join('')
                const perdidasRows = (bien.perdidasDominio || [])
                    .map(
                        (p: any) => `<tr><td>${p.fiscalia || 'N/A'}</td><td>${p.fechaResolucion || 'N/A'}</td><td>${p.autoridad || 'N/A'}</td></tr>`
                    )
                    .join('')

                const caracteristicas = (bien.caracteristicas || [])
                    .map((c: any) => `<div><strong>${c.caracteristica}:</strong> ${c.valor}</div>`)
                    .join('')

                return `
            <div class="timeline-item">
                <div class="timeline-title">${bien.bien || 'N/A'} — ${bien.clase || 'N/A'} / ${bien.tipo || 'N/A'} — Cant.: ${bien.cantidad || 0}</div>
                ${caracteristicas ? `<div class="section-content" style="margin-bottom: 8px; font-size: 10px;">${caracteristicas}</div>` : ''}
                ${secuestrosRows
                        ? `<div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">SECUESTRO</div>
                <table><thead><tr><th>Fiscal</th><th>Fecha Acto</th><th>Investigador</th></tr></thead><tbody>${secuestrosRows}</tbody></table>`
                        : ''
                    }
                ${incautacionesRows
                        ? `<div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">INCAUTACIÓN</div>
                <table><thead><tr><th>Nro. Resolución</th><th>Fecha</th><th>Autoridad</th></tr></thead><tbody>${incautacionesRows}</tbody></table>`
                        : ''
                    }
                ${confiscacionesRows
                        ? `<div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">CONFISCACIÓN</div>
                <table><thead><tr><th>Nro. Sentencia</th><th>Fecha</th><th>Autoridad</th></tr></thead><tbody>${confiscacionesRows}</tbody></table>`
                        : ''
                    }
                ${perdidasRows
                        ? `<div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">PÉRDIDA DE DOMINIO</div>
                <table><thead><tr><th>Fiscalía</th><th>Fecha</th><th>Autoridad</th></tr></thead><tbody>${perdidasRows}</tbody></table>`
                        : ''
                    }
                ${situacionesRows
                        ? `<div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin: 8px 0 4px;">SITUACIÓN / ENTREGA</div>
                <table><thead><tr><th>Calidad</th><th>Fecha Entrega</th><th>Responsable Entrega</th><th>Responsable Recepción</th><th>Institución</th><th>Ubicación</th></tr></thead><tbody>${situacionesRows}</tbody></table>`
                        : ''
                    }
            </div>`
            })
            .join('')

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Seguimiento de Caso</title>
    <style>
        body { margin: 0; padding: 20px; background: #D2D2D2; font-family: 'Calibri', 'Arial', sans-serif; }
        .document-container { width: 100%; max-width: 8.5in; background: white; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
        .document-content { padding: 0.5in; display: flex; flex-direction: column; }
        .header { background: linear-gradient(135deg, #3e5f8a 0%, #2c4a6b 50%, #1e3a5f 100%); padding: 30px 0.5in; color: white; display: flex; align-items: center; justify-content: space-between; gap: 25px; border-bottom: 4px solid #3e5f8a; min-height: 100px; }
        .header-content { flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; }
        .header-content p { margin: 2px 0; font-size: 14px; line-height: 1.2; }
        .main-content { gap: 25px; display: flex; flex-direction: column; padding-top: 25px; }
        .section-header { border-bottom: 3px solid #3e5f8a; background: linear-gradient(90deg, rgba(62, 95, 138, 0.08) 0%, transparent 100%); padding: 10px 0; margin-bottom: 15px; }
        .section-title { font-size: 18px; font-weight: bold; color: #3e5f8a; margin: 0; text-transform: uppercase; }
        .timeline-item { padding: 15px 20px; background: linear-gradient(135deg, rgba(62, 95, 138, 0.03) 0%, rgba(44, 74, 107, 0.03) 100%); border-radius: 8px; border-left: 4px solid #3e5f8a; margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid; }
        .timeline-title { font-weight: bold; color: #3e5f8a; font-size: 14px; margin-bottom: 5px; }
        .section-content { font-size: 12px; line-height: 1.6; color: #374151; text-align: justify; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
        th { background-color: #5D7B9D; color: white; padding: 8px; text-align: left; }
        td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: middle; }
        tr:nth-child(even) { background-color: #F7F6F3; }
        @media print { body { background: white; padding: 0; } .document-container { box-shadow: none; border: none; width: 100%; max-width: none; } .document-content { padding: 0; } }
    </style>
</head>
<body>
    <div class="document-container">
        <div class="header">
            <img src="data:image/png;base64,${getLogoBase64()}" width="100" height="100" style="object-fit: contain;" />
            <div class="header-content">
                <p style="font-size: 16px;"><strong>DEPARTAMENTO DE INTELIGENCIA</strong></p>
                <p>REPORTE DE SEGUIMIENTO DE CASO</p>
                <p>SISTEMA DE CONTROL Y SEGUIMIENTO</p>
            </div>
            <div style="width: 100px;"></div>
        </div>
        <div class="document-content">
            <div class="main-content">
                <div class="section">
                    <div class="section-header"><h2 class="section-title">Datos Generales</h2></div>
                    <div class="timeline-item">
                        <div class="timeline-title">Número de caso: ${cabecera?.numeroCaso || 'N/A'}</div>
                        <div class="timeline-title">Número de operativo: ${cabecera?.nroOperativo || 'N/A'}</div>
                        <div class="timeline-title">Nombre del caso: ${cabecera?.nombreCaso || 'N/A'}</div>
                        <div class="timeline-title">Número de caso de pérdida de dominio: ${cabecera?.nroCasoPerDom || 'N/A'}</div>
                        <div class="timeline-title">CUD: ${cabecera?.ianus || 'N/A'}</div>
                        <div class="timeline-title">Etapa de investigación: ${cabecera?.etapa || 'N/A'}</div>
                        <div class="timeline-title">Asignado al caso: ${cabecera?.asignadoCaso || 'N/A'}</div>
                        <div class="timeline-title">Fiscal asignado al caso: ${cabecera?.fiscalAsignadoCaso || 'N/A'}</div>
                        ${operativoPrincipal
                ? `
                        <div class="timeline-title">Fecha del operativo: ${formatearFechaVisualizacion(operativoPrincipal.fechaOperativo, true)}</div>
                        <div class="timeline-title">Lugar del operativo: ${operativoPrincipal.lugarCompleto || 'N/A'}</div>
                        <div class="timeline-title">Unidad: ${operativoPrincipal.unidadDistrital || 'N/A'}</div>
                        `
                : ''
            }
                    </div>
                    ${operativoPrincipal?.relacionHecho
                ? `
                    <div class="section-header"><h2 class="section-title">Relación del Hecho</h2></div>
                    <p class="section-content">${operativoPrincipal.relacionHecho}</p>
                    `
                : ''
            }
                </div>

                ${operativos && operativos.length > 1
                ? `
                <div class="section">
                    <div class="section-header"><h2 class="section-title">Operativos Relacionados al Caso</h2></div>
                    <table>
                        <thead><tr><th>Nro. Informe</th><th>Fecha</th><th>Lugar</th><th>Unidad</th></tr></thead>
                        <tbody>${operativosRows}</tbody>
                    </table>
                </div>
                `
                : ''
            }

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Fiscal(es) Asignado(s)</h2></div>
                    <table>
                        <thead><tr><th>Nombre y Apellidos</th><th>Fecha</th><th>Celular</th><th>Tel. Fijo</th><th>Estado</th></tr></thead>
                        <tbody>${fiscalesRows}</tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Investigador(es) Asignado(s)</h2></div>
                    <table>
                        <thead><tr><th>Grado</th><th>Nombre y Apellidos</th><th>Fecha</th><th>Celular</th><th>Tel. Fijo</th><th>Estado</th></tr></thead>
                        <tbody>${investigadoresRows}</tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Jurisdicción del Caso</h2></div>
                    <table>
                        <thead><tr><th>Jurisdicción</th><th>Fecha</th><th>Observación</th><th>Estado</th></tr></thead>
                        <tbody>${jurisdiccionesRows}</tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Control Jurisdiccional</h2></div>
                    <table>
                        <thead><tr><th>J. Instrucción</th><th>J. Partido</th><th>Tribunal Sentencia</th><th>J. Ejecución</th><th>Fecha</th><th>Estado</th></tr></thead>
                        <tbody>${controlesRows}</tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Servidores Policiales que Intervinieron</h2></div>
                    <table>
                        <thead><tr><th>Grado</th><th>Nombre y Apellidos</th><th>Fecha Registro</th></tr></thead>
                        <tbody>${servidoresRows}</tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Personas Implicadas: Situación Legal</h2></div>
                    ${personaBlocks || '<p class="section-content">Sin personas registradas.</p>'}
                </div>

                <div class="section">
                    <div class="section-header"><h2 class="section-title">Bienes Secuestrados: Situación Legal</h2></div>
                    ${bienBlocks || '<p class="section-content">Sin bienes registrados.</p>'}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
        `
    }

    generateCsv(data: any): string {
        const { cabecera, operativoPrincipal } = data
        const header = 'Numero de Caso,Numero de Operativo,Nombre del Caso,Asignado,Fiscal,Etapa,Lugar\n'
        const row = `"${cabecera?.numeroCaso || 'N/A'}","${cabecera?.nroOperativo || 'N/A'}","${cabecera?.nombreCaso || 'N/A'}","${cabecera?.asignadoCaso || 'N/A'}","${cabecera?.fiscalAsignadoCaso || 'N/A'}","${cabecera?.etapa || 'N/A'}","${operativoPrincipal?.lugarCompleto || 'N/A'}"`

        return header + row
    }
}
