import { ReportTemplate } from '../../interfaces/reporte-template.interface'
import { PDFOptions } from 'puppeteer'
import { OperativoService } from '../../../operativo/service/operativo.service'
import { PaginacionQueryDto } from '@/common/dto'
import { getLogoBase64 } from '../../report-logo.util'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp')

export class OperativeReportTemplate implements ReportTemplate<any> {
    pdfOptions: PDFOptions = {
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
                <span style="font-weight: bold;">Fecha de impresión:</span>&nbsp;<span class="date"></span>
                <span style="margin-left: 20px;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
            </div>
        `,
    }

    static async fetchData(
        operativoService: OperativoService,
        numeroOperativo: string
    ): Promise<any> {
        const operativo = await operativoService.buscarPorNumeroOperativo(decodeURIComponent(numeroOperativo))
        const idOperativo = operativo.id
        const pagination = new PaginacionQueryDto()
        const fullLimit = { ...pagination, limite: 100 } as any

        /**
         * Compresses a buffer using sharp and returns a base64 data URI.
         * Falls back gracefully if buffer is empty or sharp fails.
         */
        const bufferToBase64Compressed = async (
            buffer: Buffer,
            opts: { width?: number; height?: number; quality?: number } = {}
        ): Promise<string | null> => {
            if (!buffer || buffer.length === 0) return null
            try {
                const { width = 800, height = 600, quality = 70 } = opts
                const compressed = await sharp(buffer)
                    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality })
                    .toBuffer()
                return `data:image/jpeg;base64,${compressed.toString('base64')}`
            } catch {
                // fallback: no compression
                return `data:image/jpeg;base64,${buffer.toString('base64')}`
            }
        }

        const [
            { caso },
            [drogasRaw],
            [sustanciasSolidas],
            [sustanciasLiquidas],
            [fabricas],
            [bienesRaw],
            [personasRaw],
            [galeriasRaw],
            mapaCoords,
        ] = await Promise.all([
            operativoService.getOrInit(operativo.idCaso),
            operativoService.listarDrogas(idOperativo, fullLimit),
            operativoService.listarSustanciasSolidas(idOperativo, fullLimit),
            operativoService.listarSustanciasLiquidas(idOperativo, fullLimit),
            operativoService.listarFabricas(idOperativo, fullLimit),
            operativoService.listarBienes(idOperativo, fullLimit),
            operativoService.listarPersonasAuxiliares(idOperativo, fullLimit),
            operativoService.listarGaleria(idOperativo, fullLimit),
            (() => {
                if (operativo.coordX && operativo.coordY) {
                    console.log(`[Mapa] Coords: lat=${operativo.coordX}, lon=${operativo.coordY} — se renderizará con Leaflet en el HTML`)
                    return { lat: operativo.coordX, lon: operativo.coordY }
                }
                console.warn('[Mapa] Operativo sin coordenadas (coordX/coordY vacíos).')
                return null
            })(),
        ])

        const [drogas, personas, galerias, bienes] = await Promise.all([
            Promise.all(
                drogasRaw.map(async (d) => {
                    const [logosRaw] = await operativoService.listarLogotipos(
                        d.idOperativo,
                        d.id,
                        fullLimit
                    )
                    const [logotipos, urlFotoPruebaCampo, urlFotoPesaje] =
                        await Promise.all([
                            Promise.all(
                                logosRaw.map(async (l) => ({
                                    ...l,
                                    descripcionTipoDroga: d.descripcionTipoDroga,
                                    descripcionPaisOrigen: d.descripcionPaisProcedencia,
                                    descripcionPaisDestino: d.descripcionPaisDestino,
                                    urlFotografia: await bufferToBase64Compressed(
                                        await operativoService.obtenerFotoLogotipo(d.id, l.id),
                                        { width: 100, height: 75, quality: 75 }
                                    ),
                                }))
                            ),
                            bufferToBase64Compressed(
                                await operativoService.obtenerFotoDroga(
                                    idOperativo,
                                    d.id,
                                    'prueba-campo'
                                ),
                                { width: 155, height: 115, quality: 75 }
                            ),
                            bufferToBase64Compressed(
                                await operativoService.obtenerFotoDroga(
                                    idOperativo,
                                    d.id,
                                    'pesaje'
                                ),
                                { width: 155, height: 115, quality: 75 }
                            ),
                        ])

                    return {
                        ...d,
                        urlFotoPruebaCampo,
                        urlFotoPesaje,
                        logotipos,
                    }
                })
            ),
            Promise.all(
                personasRaw.map(async (p) => {
                    const [urlFotoFrente, urlFotoDocumento, urlFotoPerfilIzquierdo] =
                        await Promise.all([
                            bufferToBase64Compressed(
                                await operativoService.obtenerFotoDetenido(
                                    idOperativo,
                                    p.id,
                                    'frente'
                                ),
                                { width: 125, height: 165, quality: 80 }
                            ),
                            bufferToBase64Compressed(
                                await operativoService.obtenerFotoDetenido(
                                    idOperativo,
                                    p.id,
                                    'foto-documento'
                                ),
                                { width: 225, height: 165, quality: 80 }
                            ),
                            bufferToBase64Compressed(
                                await operativoService.obtenerFotoDetenido(
                                    idOperativo,
                                    p.id,
                                    'perfil-izquierdo'
                                ),
                                { width: 125, height: 165, quality: 80 }
                            ),
                        ])
                    return {
                        ...p,
                        urlFotoFrente,
                        urlFotoDocumento,
                        urlFotoPerfilIzquierdo,
                    }
                })
            ),
            Promise.all(
                galeriasRaw.map(async (g) => ({
                    ...g,
                    urlFotografia: await bufferToBase64Compressed(
                        await operativoService.obtenerFotoGaleria(idOperativo, g.id),
                        { width: 450, height: 300, quality: 75 }
                    ),
                }))
            ),
            Promise.all(
                bienesRaw.map(async (b) => {
                    const [[caracteristicasRaw], urlFotoBien] = await Promise.all([
                        operativoService.listarCaracteristicasBien(
                            idOperativo,
                            b.id,
                            fullLimit
                        ),
                        bufferToBase64Compressed(
                            await operativoService.obtenerFotoBien(idOperativo, b.id),
                            { width: 155, height: 115, quality: 75 }
                        ),
                    ])
                    return {
                        ...b,
                        urlFotoBien,
                        caracteristicas: caracteristicasRaw.map((c) => ({
                            label: c.descripcionCaracteristica,
                            value: c.descripcion,
                        })),
                    }
                })
            ),
        ])

        const logotipos = drogas.flatMap((d) => d.logotipos)

        return {
            caso,
            operativo,
            drogas,
            sustanciasSolidas,
            sustanciasLiquidas,
            fabricas,
            personas,
            bienes,
            galerias,
            logotipos,
            idOperativo,
            mapaCoords,
        }
    }

    generateHtml(data: any): string {
        const {
            caso,
            operativo,
            drogas,
            sustanciasSolidas,
            sustanciasLiquidas,
            fabricas,
            personas,
            bienes,
            galerias,
            mapaCoords,
        } = data

        const formatNumber = (num: any) => {
            const val = typeof num === 'string' ? parseFloat(num) : num
            return (val || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        }

        const drogaRows = drogas
            .map((droga) => {
                const hasLogos = droga.logotipos && droga.logotipos.length > 0
                const hasImages = droga.urlFotoPruebaCampo || droga.urlFotoPesaje
                return `
            <tr>
                <td>${droga.descripcionTipoDroga || 'N/A'}</td>
                <td>${droga.descripcionEstadoDroga || 'N/A'}</td>
                <td>${formatNumber(droga.cantidadGramos || droga.cantidad)}</td>
                <td>${formatNumber(droga.costo)}</td>
                <td>${droga.descripcionFormaTransporte || 'N/A'}</td>
                <td>${droga.descripcionPaisProcedencia || 'N/A'}</td>
                <td>${droga.descripcionPaisDestino || 'N/A'}</td>
            </tr>
            ${hasLogos || hasImages
                        ? `
            <tr>
                <td colspan="7" style="padding: 0; background-color: #f8fafc;">
                    <div style="padding: 10px 20px;">
                        ${hasImages
                            ? `
                        <div style="display: flex; gap: 20px; margin-bottom: 15px; justify-content: center; border-bottom: 0px dashed #cbd5e1; padding-bottom: 10px;">
                            ${droga.urlFotoPruebaCampo
                                ? `
                            <div style="text-align: center;">
                                <div style="font-size: 9px; font-weight: bold; color: #3e5f8a; margin-bottom: 3px; text-transform: uppercase;">Prueba de Campo</div>
                                <img src="${droga.urlFotoPruebaCampo}" class="img-standard img-droga-thumb" />
                            </div>`
                                : ''
                            }
                            ${droga.urlFotoPesaje
                                ? `
                            <div style="text-align: center;">
                                <div style="font-size: 9px; font-weight: bold; color: #3e5f8a; margin-bottom: 3px; text-transform: uppercase;">Pesaje</div>
                                <img src="${droga.urlFotoPesaje}" class="img-standard img-droga-thumb" />
                            </div>`
                                : ''
                            }
                        </div>
                        `
                            : ''
                        }

                        ${hasLogos
                            ? `
                        <div style="font-weight: bold; color: #1e3a8a; font-size: 10px; margin-bottom: 5px; text-transform: uppercase;">
                            Logotipos Detectados:
                        </div>
                        <table style="width: 100%; border: 1px solid #cbd5e1; background: white; margin: 0;">
                            <thead>
                                <tr style="background-color: #f1f5f9;">
                                    <th style="font-size: 9px; color: #475569; padding: 4px;">Logo/Imagen</th>
                                    <th style="font-size: 9px; color: #475569; padding: 4px;">Descripción</th>
                                    <th style="font-size: 9px; color: #475569; padding: 4px;">Organización</th>
                                    <th style="font-size: 9px; color: #475569; padding: 4px;">Implicados</th>
                                    <th style="font-size: 9px; color: #475569; padding: 4px; text-align: center;">Fotografía</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${droga.logotipos
                                .map(
                                    (logo) => `
                                    <tr>
                                        <td style="font-size: 9px; padding: 4px;">${logo.imagen || 'N/A'}</td>
                                        <td style="font-size: 9px; padding: 4px;">${logo.descripcionLogo || 'N/A'}</td>
                                        <td style="font-size: 9px; padding: 4px;">${logo.organizacion || 'N/A'}</td>
                                        <td style="font-size: 9px; padding: 4px;">${logo.blanco || 'N/A'}</td>
                                        <td style="text-align: center; padding: 4px;">
                                            ${logo.urlFotografia ? `<img src="${logo.urlFotografia}" class="img-standard img-logo-small" />` : 'N/A'}
                                        </td>
                                    </tr>
                                `
                                )
                                .join('')}
                            </tbody>
                        </table>
                        `
                            : ''
                        }
                    </div>
                </td>
            </tr>
            `
                        : ''
                    }
            `
            })
            .join('')

        const sustanciaSolidaRows = sustanciasSolidas
            .map(
                (sustanciaSolida) => `
            <tr>
                <td>${sustanciaSolida.descripcionSustancia || 'N/A'}</td>
                <td>${formatNumber(sustanciaSolida.cantidad)}</td>
                <td>${formatNumber(sustanciaSolida.costo)}</td>
            </tr>
        `
            )
            .join('')

        const sustanciaLiquidaRows = sustanciasLiquidas
            .map(
                (sustanciaLiquida) => `
            <tr>
                <td>${sustanciaLiquida.descripcionSustancia || 'N/A'}</td>
                <td>${formatNumber(sustanciaLiquida.cantidad)}</td>
                <td>${formatNumber(sustanciaLiquida.costo)}</td>
            </tr>
        `
            )
            .join('')

        const fabricasRows = fabricas
            .map(
                (fabrica) => `
            <tr>
                <td>${fabrica.descripcionTipoFabrica || 'N/A'}</td>
                <td>${fabrica.descripcionFabricaModelo || 'N/A'}</td>
                <td>${fabrica.cantidad || 0}</td>
            </tr>
        `
            )
            .join('')

        const personaBlocks = personas
            .map(
                (persona) => `
        <table class="personal-info-table" style="margin-bottom: 30px;">
            <thead>
                <tr>
                    <th>Fotografías de Perfil</th>
                    <th>Documento Encontrado</th>
                    <th>Datos Generales</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="photo-cell" style="padding: 20px;">
                        <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                            <div class="photo-frame horizontal-photo">
                                <img src="${persona.urlFotoFrente || ''}" class="img-standard img-persona-face" />
                            </div>
                            <div class="photo-frame horizontal-photo">
                                <img src="${persona.urlFotoPerfilIzquierdo || ''}" class="img-standard img-persona-face" />
                            </div>
                        </div>
                    </td>
                    <td class="photo-cell">
                        <div class="photo-frame vertical-photo" style="margin: 0 auto;">
                            <img src="${persona.urlFotoDocumento || ''}" class="img-standard img-persona-doc" />
                        </div>
                    </td>
                    <td class="info-value-cell" style="padding: 20px;">
                        <div class="info-label-cell" style="margin-bottom: 15px;">
                            <strong>${`${persona.nombres || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim() || 'N/A'}</strong>
                        </div>
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Nacionalidad</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px;">${persona.descripcionPais || 'N/A'}</div>
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Género</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px;">${persona.genero || 'N/A'}</div>
                    </td>
                </tr>
                <tr>
                    <td class="info-value-cell" style="padding: 20px; text-align: center;">
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Fecha de Nacimiento</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px; margin-bottom: 15px;">${persona.fechaNacimiento ? new Date(persona.fechaNacimiento).toLocaleDateString() : 'N/A'}</div>
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Estado Civil</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px;">${persona.descripcionEstadoCivil || 'N/A'}</div>
                    </td>
                    <td class="info-value-cell" style="padding: 20px; text-align: center;">
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Tipo de Documento</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px;">${persona.descripcionTipoDocumento || 'N/A'}</div>
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Numero de Documento</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px; margin-bottom: 15px;">${persona.nroDocumento || 'N/A'}</div>
                    </td>
                    <td class="info-value-cell" style="padding: 20px; text-align: center;">
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Direccion</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px; margin-bottom: 15px;">${persona.direccion || 'N/A'}</div>
                        <div class="info-label-cell" style="justify-content: center; margin-bottom: 15px;">
                            <strong>Estado</strong>
                        </div>
                        <div class="info-value-cell" style="font-size: 13px; margin-bottom: 15px;">${persona.estado || 'N/A'}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    `
            )
            .join('')

        const bienRows = bienes
            .map(
                (bien) => `
            <tr>
                <td>${bien.descripcionBien || 'N/A'}</td>
                <td>${bien.descripcionCatalogoClase || 'N/A'}</td>
                <td>${bien.descripcionCatalogoTipo || 'N/A'}</td>
                <td>${bien.cantidadBien || 0}</td>
                <td style="text-align: center;"><img src="${bien.urlFotoBien || ''}" class="img-standard img-bien-thumb" /></td>
                 <td>
                    <div style="font-size: 10px;">
                        ${bien.caracteristicas
                        .map(
                            (c) => `
                            <div><strong>${c.label}:</strong> ${c.value}</div>
                        `
                        )
                        .join('')}
                    </div>
                </td>
            </tr>
        `
            )
            .join('')

        const galeriaRows = galerias
            .map(
                (galeria) => `
            <tr>
                <td>${galeria.id}</td>
                <td>${galeria.descripcion || ''}</td>
                <td style="text-align: center;"><img src="${galeria.urlFotografia || ''}" class="img-standard img-gallery-thumb" /></td>
            </tr>
        `
            )
            .join('')

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte Operativo</title>
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
        .timeline-item { padding: 15px 20px; background: linear-gradient(135deg, rgba(62, 95, 138, 0.03) 0%, rgba(44, 74, 107, 0.03) 100%); border-radius: 8px; border-left: 4px solid #3e5f8a; margin-bottom: 20px; }
        .timeline-title { font-weight: bold; color: #3e5f8a; font-size: 14px; margin-bottom: 5px; }
        .section-content { font-size: 12px; line-height: 1.6; color: #374151; text-align: justify; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
        th { background-color: #5D7B9D; color: white; padding: 8px; text-align: left; }
        td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: middle; }
        tr:nth-child(even) { background-color: #F7F6F3; }
        .personal-info-table { border: 1px solid #3e5f8a; border-radius: 8px; overflow: hidden; }
        .personal-info-table th { background: linear-gradient(135deg, #3e5f8a 0%, #2c4a6b 50%); text-align: center; }
        .photo-frame { overflow: hidden; background: #f8fafc; }
        .horizontal-photo { width: 125px; height: 165px; }
        .vertical-photo { width: 225px; height: 165px; }
        .info-label-cell { color: #3e5f8a; font-weight: bold; margin-top: 10px; display: block; }

        /* Standardized image sizes - Strictly Enforced */
        .img-standard { 
            object-fit: contain; 
            background: #f8fafc; 
            border: 1px solid #e2e8f0;
            display: block;
            margin: 0 auto;
        }
        .img-logo-small { height: 75px; width: 100px; }
        .img-droga-thumb { height: 115px; width: 155px; }
        .img-bien-thumb { height: 115px; width: 155px; }
        .img-persona-face { height: 165px; width: 125px; object-fit: cover; }
        .img-persona-doc { height: 165px; width: 225px; }
        .img-gallery-thumb { height: 300px; width: 450px; }
        @media print { body { background: white; padding: 0; } .document-container { box-shadow: none; border: none; width: 100%; max-width: none; } .document-content { padding: 0; } }
    </style>
</head>
<body>
    <div class="document-container">
        <div class="header">
            <img src="data:image/png;base64,${getLogoBase64()}" width="100" height="100" style="object-fit: contain;" />
            <div class="header-content">
                <p style="font-size: 16px;"><strong>FORMULARIO UNICO DE REGISTRO DE OPERATIVOS ANTINARCOTICOS</strong></p>
                <p><strong>Nombre del Caso:</strong> ${caso.nombreCaso || 'N/A'}</p>
                <p><strong>Numero de Caso:</strong> ${caso.numeroOperativo || 'N/A'}</p>
            </div>
            <div style="width: 100px;"></div>
        </div>
        <div class="document-content">
            <div class="main-content">
                <div class="section">
                    <div class="section-header"><h2 class="section-title">Datos Generales</h2></div>
                    <div class="timeline-item">
                        <div class="timeline-title">Numero de Operativo: ${caso.numeroOperativo || 'N/A'}</div>
                        <div class="timeline-title">Asignado al Caso: ${caso.asignadoCaso || 'N/A'}</div>
                        <div class="timeline-title">Fiscal Asignado: ${caso.fiscalAsignadoCaso || 'N/A'}</div>
                        <div class="timeline-title">Fecha y hora del Operativo: ${operativo.fechaOperativo ? new Date(operativo.fechaOperativo).toLocaleString('es-BO') : 'N/A'}</div>
                        <div class="timeline-title">Lugar del Opeartivo: ${operativo.lugar || 'N/A'}</div>
                        <div class="timeline-title">Unidad Operativa: ${operativo.descripcionUnidad || 'N/A'}</div>
                        <div class="timeline-title">Plan de Operaciones: ${operativo.descripcionPlanOperaciones || 'N/A'}</div>
                        <div class="timeline-title">Tipo de Operativo: ${operativo.descripcionTipoOperativo || 'N/A'}</div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header"><h2 class="section-title">Breve detalle del Operativo</h2></div>
                    <p class="section-content">${operativo.breveDetalle || operativo.descripcion || ''}</p>
                </div>
                <div class="section" style="page-break-inside: avoid; break-inside: avoid;">
                    <div class="section-header"><h2 class="section-title">Mapa de Ubicación</h2></div>
                    <div class="map-container" style="text-align: center; background: #e5f3ff; border: 3px solid #3e5f8a; border-radius: 10px; height: 350px; display: flex; align-items: center; justify-content: center; overflow: hidden; page-break-inside: avoid; break-inside: avoid;">
                        ${mapaCoords
                ? `
                        <div id="map" style="width: 100%; height: 350px;"></div>
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                        <script>
                            var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${mapaCoords.lat}, ${mapaCoords.lon}], 15);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                            L.marker([${mapaCoords.lat}, ${mapaCoords.lon}]).addTo(map);
                        </script>
                        `
                : `
                            <div style="color: #1e3a8a; font-weight: bold;">
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="#dc2626" style="margin-bottom: 10px;">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <br/>
                                UBICACIÓN GEOGRÁFICA DEL OPERATIVO<br/>
                                <span style="font-size: 10px; font-weight: normal;">Coordenadas: ${operativo.lugar || 'N/A'}</span>
                            </div>
                        `
            }
                    </div>
                </div>
                <div class="section">
                    <div class="section-header"><h2 class="section-title">RESULTADOS</h2></div>
                    <div class="timeline-item">
                        <div class="timeline-title">DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES</div>
                        <table>
                            <thead><tr><th>Tipo de Droga</th><th>Estado</th><th>Cantidad (g)</th><th>Costo (Bs)</th><th>Transporte</th><th>Procedencia</th><th>Destino</th></tr></thead>
                            <tbody>${drogaRows}</tbody>
                        </table>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-title">SUSTANCIAS QUIMICAS SOLIDAS</div>
                        <table>
                            <thead><tr><th>Nombre</th><th>Kilos</th><th>Costo en Bs.</th></tr></thead>
                            <tbody>${sustanciaSolidaRows}</tbody>
                        </table>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-title">SUSTANCIAS QUIMICAS LIQUIDAS</div>
                        <table>
                            <thead><tr><th>Nombre</th><th>Litros</th><th>Costo en Bs.</th></tr></thead>
                            <tbody>${sustanciaLiquidaRows}</tbody>
                        </table>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-title">LABORATORIOS Y FABRICAS</div>
                        <table><thead><tr><th>Tipo Elaboracion</th><th>Estilo</th><th>Cantidad</th></tr></thead><tbody>${fabricasRows}</tbody></table>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">PERSONAS: PRINCIPAL IMPLICADO / APREHENDIDAS / ARRESTADAS / LGI O PERDIDA DE DOMINIO</h2>
                    </div>
                    ${personaBlocks}
                </div>
                <div class="section">
                    <div class="section-header"><h2 class="section-title">BIENES U OBJETOS SECUESTRADOS</h2></div>
                    <table>
                        <thead><tr><th>Cat. Bien</th><th>Clase</th><th>Tipo</th><th>Cant.</th><th>Foto</th><th>Caracteristicas</th></tr></thead>
                        <tbody>${bienRows}</tbody>
                    </table>
                </div>
                <div class="section">
                    <div class="section-header"><h2 class="section-title">GALERIA FOTOGRAFICA DEL OPERATIVO</h2></div>
                    <table>
                        <thead><tr><th>ID</th><th>Descripcion</th><th>Fotografia</th></tr></thead>
                        <tbody>${galeriaRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
        `
    }

    generateCsv(data: any): string {
        const { caso, operativo } = data
        const header =
            'Nombre del Caso,Numero de Caso,Numero de Operativo,Asignado,Fiscal,Fecha,Lugar,Unidad,Plan,Tipo,Resumen\n'
        const row = `"${caso.nombreCaso || 'N/A'}","${caso.numeroOperativo || 'N/A'}","${operativo.numeroOperativo || 'N/A'}","${caso.asignadoCaso || 'N/A'
            }","${caso.fiscalAsignadoCaso || 'N/A'}","${operativo.fechaOperativo || 'N/A'}","${operativo.lugar || 'N/A'}","${operativo.idUnidad || 'N/A'
            }","${operativo.idPlanOperacion || 'N/A'}","${operativo.idTipoOperacion || 'N/A'}","${(
                operativo.breveDetalle ||
                operativo.descripcion ||
                ''
            ).replace(/"/g, '""')}"`

        return header + row
    }
}
