import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'

import * as fs from 'fs'
import * as path from 'path'
import * as Handlebars from 'handlebars'

import puppeteer, {
  Browser,
  PDFOptions,
} from 'puppeteer'

import {
  pdfImages,
} from '../../images'

import {
  TemplatePaths,
} from '../../template-paths'

@Injectable()
export class PdfService
  implements
    OnModuleInit,
    OnModuleDestroy
{
  private browser!: Browser

  private institucional!: string

  private escudo!: string

  /*
   * Caché de templates compilados.
   *
   * Evita leer y compilar nuevamente
   * el mismo archivo Handlebars.
   */
  private readonly templates =
    new Map<
      string,
      HandlebarsTemplateDelegate
    >()

  // =====================================================
  // INICIAR PUPPETEER
  // =====================================================

  async onModuleInit() {
    console.time(
      'PUPPETEER INIT',
    )

    this.browser =
      await puppeteer.launch({
        headless: true,

        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      })

    /*
     * Los logos se convierten una sola vez
     * cuando inicia la aplicación.
     */
    this.institucional =
      this.imageToBase64(
        pdfImages.institucional,
      )

    this.escudo =
      this.imageToBase64(
        pdfImages.escudo,
      )

    console.timeEnd(
      'PUPPETEER INIT',
    )
  }

  // =====================================================
  // CERRAR PUPPETEER
  // =====================================================

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  // =====================================================
  // GENERAR PDF
  //
  // Configuración predeterminada:
  // - Formato Carta
  // - Orientación vertical
  // - Márgenes de 12 mm
  //
  // Puede recibir opciones diferentes
  // desde ExportService.
  // =====================================================

 async generate(
  type: string,
  data: any,
  options: PDFOptions = {},
): Promise<Buffer> {
  const templateData = {
    ...data,

    institucional:
      this.institucional,

    escudo:
      this.escudo,
  }

  const template =
    this.obtenerTemplate(
      type,
    )

  const html =
    template(
      templateData,
    )

  const page =
    await this.browser.newPage()

  try {
    await page.setContent(
      html,
      {
        waitUntil:
          'domcontentloaded',

        timeout:
          15000,
      },
    )

    /*
     * Carta vertical por defecto.
     */
    const opcionesPredeterminadas:
      PDFOptions = {
        format:
          'Letter',

        landscape:
          false,

        printBackground:
          true,

        margin: {
          top:
            '12mm',

          bottom:
            '12mm',

          left:
            '12mm',

          right:
            '12mm',
        },
      }

    const tieneTamanoEspecial =
      Boolean(
        options.format ||
        options.width ||
        options.height,
      )

    const opcionesFinales:
      PDFOptions = {
        ...opcionesPredeterminadas,
        ...options,

        margin: {
          ...opcionesPredeterminadas
            .margin,

          ...(options.margin || {}),
        },
      }
     
    if (
      tieneTamanoEspecial &&
      !options.format
    ) {
      delete opcionesFinales.format
    }

    const pdfBuffer =
      await page.pdf(
        opcionesFinales,
      )

    return Buffer.from(
      pdfBuffer,
    )
  } finally {
    await page.close()
  }
}

  // =====================================================
  // CONFIGURACIÓN GENERAL
  //
  // Si el controlador no envía:
  // - format
  // - width
  // - height
  //
  // Se utiliza Letter automáticamente.
  // =====================================================

  private construirOpcionesPDF(
    options: PDFOptions,
  ): PDFOptions {
    const tieneTamanoPersonalizado =
      Boolean(
        options.format ||
        options.width ||
        options.height,
      )

    const margenPredeterminado = {
      top:
        '12mm',

      bottom:
        '12mm',

      left:
        '12mm',

      right:
        '12mm',
    }

    const opcionesPDF:
      PDFOptions = {
        landscape:
          false,

        printBackground:
          true,

        preferCSSPageSize:
          false,

        ...options,

        /*
         * Permite modificar uno o varios
         * márgenes sin perder los demás.
         */
        margin: {
          ...margenPredeterminado,
          ...(options.margin || {}),
        },
      }

    /*
     * Carta vertical por defecto.
     */
    if (
      !tieneTamanoPersonalizado
    ) {
      opcionesPDF.format =
        'Letter'
    }

    return opcionesPDF
  }

  // =====================================================
  // OBTENER Y CACHEAR TEMPLATE
  // =====================================================

  private obtenerTemplate(
    type: string,
  ): HandlebarsTemplateDelegate {
    const templateCache =
      this.templates.get(
        type,
      )

    if (templateCache) {
      return templateCache
    }

    const templatePath =
      path.join(
        TemplatePaths.pdfTemplates,
        `${type}.template.hbs`,
      )

    if (
      !fs.existsSync(
        templatePath,
      )
    ) {
      throw new Error(
        `No se encontró el template PDF: ${templatePath}`,
      )
    }

    const templateString =
      fs.readFileSync(
        templatePath,
        'utf8',
      )

    const template =
      Handlebars.compile(
        templateString,
      )

    this.templates.set(
      type,
      template,
    )

    return template
  }

  // =====================================================
  // CONVERTIR LOGO A BASE64
  // =====================================================

  private imageToBase64(
    filePath: string,
  ): string {
    try {
      if (
        !filePath ||
        !fs.existsSync(
          filePath,
        )
      ) {
        return ''
      }

      const file =
        fs.readFileSync(
          filePath,
        )

      const extension =
        path.extname(
          filePath,
        )
          .substring(1)
          .toLowerCase()

      const mime =
        this.obtenerMimePorExtension(
          extension,
        )

      return (
        `data:${mime};base64,` +
        file.toString(
          'base64',
        )
      )
    } catch (error) {
      console.error(
        `ERROR CONVIRTIENDO LOGO: ${filePath}`,
        error,
      )

      return ''
    }
  }

  // =====================================================
  // CONVERTIR BUFFER A BASE64
  // =====================================================

  public bufferToBase64(
    buffer: any,
  ): string {
    try {
      if (!buffer) {
        return ''
      }

      /*
       * Si ya viene como data URI,
       * se devuelve directamente.
       */
      if (
        typeof buffer ===
          'string' &&
        buffer.startsWith(
          'data:image',
        )
      ) {
        return buffer
      }

      const buf =
        Buffer.isBuffer(
          buffer,
        )
          ? buffer
          : Buffer.from(
              buffer,
            )

      if (
        buf.length < 2
      ) {
        return ''
      }

      let mime =
        'image/jpeg'

      const esPNG =
        buf.length >= 4 &&
        buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47

      const esBMP =
        buf[0] === 0x42 &&
        buf[1] === 0x4d

      const esJPEG =
        buf[0] === 0xff &&
        buf[1] === 0xd8

      const esWEBP =
        buf.length >= 12 &&
        buf.toString(
          'ascii',
          0,
          4,
        ) === 'RIFF' &&
        buf.toString(
          'ascii',
          8,
          12,
        ) === 'WEBP'

      if (esPNG) {
        mime =
          'image/png'
      } else if (esBMP) {
        mime =
          'image/bmp'
      } else if (esJPEG) {
        mime =
          'image/jpeg'
      } else if (esWEBP) {
        mime =
          'image/webp'
      }

      return (
        `data:${mime};base64,` +
        buf.toString(
          'base64',
        )
      )
    } catch (error) {
      console.error(
        'ERROR BUFFER BASE64',
        error,
      )

      return ''
    }
  }

  // =====================================================
  // CONVERTIR ARCHIVO A BASE64
  // =====================================================

  public async fileToBase64(
    filePath: string,
  ): Promise<string> {
    try {
      if (!filePath) {
        return ''
      }

      const rutaAbsoluta =
        path.isAbsolute(
          filePath,
        )
          ? filePath
          : path.resolve(
              process.cwd(),
              filePath,
            )

      if (
        !fs.existsSync(
          rutaAbsoluta,
        )
      ) {
        console.error(
          `NO EXISTE EL ARCHIVO: ${rutaAbsoluta}`,
        )

        return ''
      }

      const file =
        await fs.promises.readFile(
          rutaAbsoluta,
        )

      const extension =
        path.extname(
          rutaAbsoluta,
        )
          .substring(1)
          .toLowerCase()

      const mime =
        this.obtenerMimePorExtension(
          extension,
        )

      return (
        `data:${mime};base64,` +
        file.toString(
          'base64',
        )
      )
    } catch (error) {
      console.error(
        `ERROR FILE BASE64: ${filePath}`,
        error,
      )

      return ''
    }
  }

  // =====================================================
  // OBTENER MIME SEGÚN EXTENSIÓN
  // =====================================================

  private obtenerMimePorExtension(
    extension: string,
  ): string {
    switch (
      extension.toLowerCase()
    ) {
      case 'png':
        return 'image/png'

      case 'bmp':
        return 'image/bmp'

      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'

      case 'webp':
        return 'image/webp'

      case 'gif':
        return 'image/gif'

      case 'svg':
        return 'image/svg+xml'

      default:
        return 'application/octet-stream'
    }
  }
}