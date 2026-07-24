import { jsPDF } from 'jspdf'

// Mismo estilo institucional que el Formulario de Operativo (backend, Puppeteer):
// franja de cabecera en azul FELCN con logo + título centrado, y pie de página con
// fecha de generación. Ver form-operativo.template.ts para la referencia original.
const COLOR_HEADER = '#3e5f8a'
const COLOR_HEADER_BORDE = '#1e3a5f'
const COLOR_TEXTO_PIE = '#3e5f8a'
const COLOR_BORDE_PIE = '#e5e7eb'
const COLOR_TEXTO_LEYENDA = '#64748b'

const MARGEN_PT = 40
const ALTO_HEADER_PT = 64
const ALTO_FOOTER_PT = 34
const LOGO_TAMANO_PT = 36
const ALTO_LINEA_PIE_TEXTO_PT = 12
const ESPACIO_ANTES_PIE_TEXTO_PT = 16

const LOGO_URL = '/assets/felcnlogo.png'

interface OpcionesPdfConImagen {
  /** Título principal, escrito en blanco sobre la franja de cabecera azul. */
  titulo: string
  /** Línea secundaria bajo el título dentro de la cabecera, ej. nombre del caso. */
  subtitulo?: string
  /** Imagen ya capturada (PNG/JPEG en base64) a insertar en el PDF. */
  imagenDataUrl: string
  /** Dimensiones en píxeles de la imagen capturada, usadas para calcular la orientación y el aspecto. */
  anchoPx: number
  altoPx: number
  /** Nombre de archivo con el que se descargará el PDF (incluir extensión .pdf). */
  nombreArchivo: string
  /** Párrafos de texto adicionales a incluir debajo de la imagen (ej. leyenda de colores). */
  textoPie?: string[]
  /** Fuerza una orientación de página en vez de deducirla del aspecto de la imagen. */
  orientacion?: 'portrait' | 'landscape'
  /** "Abreviatura: Nombre Completo" (o el login) de quien genera el PDF, ej. "Sgto: Juan Pérez". */
  generadoPor?: string
}

interface UsuarioGenerador {
  usuario?: string | null
  nombreApp?: string | null
  grado?: { abreviatura?: string | null } | null
  persona?: {
    nombres?: string | null
    primerApellido?: string | null
    segundoApellido?: string | null
  } | null
}

/**
 * Arma el "Generado por" para el pie de los reportes, con la misma prioridad que usa el
 * backend (`ReportBaseService.obtenerUsuarioGenerador`): abreviatura de grado + nombre
 * completo si están disponibles, si no el nombre para mostrar precomputado, si no el login.
 */
export function obtenerNombreGenerador(usuario: UsuarioGenerador | null | undefined): string {
  if (!usuario) return ''
  const abreviatura = usuario.grado?.abreviatura
  const nombreCompleto = [
    usuario.persona?.nombres,
    usuario.persona?.primerApellido,
    usuario.persona?.segundoApellido,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()

  if (abreviatura && nombreCompleto) return `${abreviatura}: ${nombreCompleto}`
  if (usuario.nombreApp) return usuario.nombreApp
  return usuario.usuario ?? ''
}

/** Formatea `dd/mm/yyyy HH:mm`, igual que `formatearFechaVisualizacion` en el backend. */
function formatearFecha(fecha: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`
}

let logoDataUrlPromise: Promise<string | null> | null = null

/**
 * Carga una sola vez el logo institucional (public/assets/felcnlogo.png) y lo reescala a
 * un tamaño chico antes de cachearlo: el archivo fuente pesa ~500KB y en el PDF solo se
 * dibuja a 36pt, así que embeberlo tal cual infla el PDF sin ninguna ganancia visual.
 */
function cargarLogoDataUrl(): Promise<string | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (!logoDataUrlPromise) {
    const basePath = process.env.NEXT_PUBLIC_PATH ? `/${process.env.NEXT_PUBLIC_PATH}` : ''
    const TAMANO_RASTER_PX = 120
    logoDataUrlPromise = new Promise<string | null>((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = TAMANO_RASTER_PX
        canvas.height = TAMANO_RASTER_PX
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }
        ctx.drawImage(img, 0, 0, TAMANO_RASTER_PX, TAMANO_RASTER_PX)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => resolve(null)
      img.src = `${basePath}${LOGO_URL}`
    })
  }
  return logoDataUrlPromise
}

/**
 * Arma un PDF de una sola imagen (mapa, mapa de calor, diagrama de vínculos) con la misma
 * cabecera/pie institucional que el Formulario de Operativo: franja azul con logo y título,
 * y pie de página con fecha de generación. La orientación se decide según el aspecto de la
 * imagen capturada, salvo que se fuerce explícitamente.
 */
export async function generarPdfConImagen({
  titulo,
  subtitulo,
  imagenDataUrl,
  anchoPx,
  altoPx,
  nombreArchivo,
  textoPie,
  orientacion,
  generadoPor,
}: OpcionesPdfConImagen) {
  const logo = await cargarLogoDataUrl()

  const orientacionFinal = orientacion ?? (anchoPx >= altoPx ? 'landscape' : 'portrait')
  const doc = new jsPDF({ orientation: orientacionFinal, unit: 'pt', format: 'a4' })

  const anchoPagina = doc.internal.pageSize.getWidth()
  const altoPagina = doc.internal.pageSize.getHeight()
  const anchoContenido = anchoPagina - MARGEN_PT * 2

  // ── Cabecera ──
  doc.setFillColor(COLOR_HEADER)
  doc.rect(0, 0, anchoPagina, ALTO_HEADER_PT, 'F')
  doc.setDrawColor(COLOR_HEADER_BORDE)
  doc.setLineWidth(3)
  doc.line(0, ALTO_HEADER_PT, anchoPagina, ALTO_HEADER_PT)

  if (logo) {
    const y = (ALTO_HEADER_PT - LOGO_TAMANO_PT) / 2
    doc.addImage(logo, 'PNG', MARGEN_PT, y, LOGO_TAMANO_PT, LOGO_TAMANO_PT)
  }

  doc.setTextColor('#ffffff')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(titulo, anchoPagina / 2, subtitulo ? ALTO_HEADER_PT / 2 - 4 : ALTO_HEADER_PT / 2 + 4, {
    align: 'center',
  })

  if (subtitulo) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(subtitulo, anchoPagina / 2, ALTO_HEADER_PT / 2 + 14, { align: 'center' })
  }

  let cursorY = ALTO_HEADER_PT + 28

  // ── Imagen ──
  const formato = imagenDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
  const relacionAspecto = altoPx / anchoPx
  let anchoImagen = anchoContenido
  let altoImagen = anchoImagen * relacionAspecto

  const altoDisponiblePie = ALTO_FOOTER_PT + (textoPie?.length ? ESPACIO_ANTES_PIE_TEXTO_PT + textoPie.length * ALTO_LINEA_PIE_TEXTO_PT : 0)
  const altoMaximoImagen = altoPagina - cursorY - MARGEN_PT - altoDisponiblePie
  if (altoImagen > altoMaximoImagen) {
    altoImagen = altoMaximoImagen
    anchoImagen = altoImagen / relacionAspecto
  }

  const xImagen = MARGEN_PT + (anchoContenido - anchoImagen) / 2
  doc.addImage(imagenDataUrl, formato, xImagen, cursorY, anchoImagen, altoImagen)
  cursorY += altoImagen

  if (textoPie?.length) {
    cursorY += ESPACIO_ANTES_PIE_TEXTO_PT
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(COLOR_TEXTO_LEYENDA)
    textoPie.forEach((parrafo) => {
      const lineas = doc.splitTextToSize(parrafo, anchoContenido)
      doc.text(lineas, MARGEN_PT, cursorY)
      cursorY += lineas.length * ALTO_LINEA_PIE_TEXTO_PT
    })
  }

  // ── Pie de página ──
  const yLineaPie = altoPagina - ALTO_FOOTER_PT
  doc.setDrawColor(COLOR_BORDE_PIE)
  doc.setLineWidth(1)
  doc.line(MARGEN_PT, yLineaPie, anchoPagina - MARGEN_PT, yLineaPie)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(COLOR_TEXTO_PIE)
  const textoPiePagina = generadoPor
    ? `Fecha de generación: ${formatearFecha(new Date())}      Generado por: ${generadoPor}`
    : `Fecha de generación: ${formatearFecha(new Date())}`
  doc.text(textoPiePagina, anchoPagina - MARGEN_PT, yLineaPie + 16, { align: 'right' })

  doc.save(nombreArchivo)
}
