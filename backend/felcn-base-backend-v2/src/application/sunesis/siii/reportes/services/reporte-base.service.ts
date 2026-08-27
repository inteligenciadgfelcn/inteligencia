import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as puppeteer from 'puppeteer';
import { DB_AUTH } from '@/core/config/database/database.module';
import { ReportTemplate } from '../interfaces/reporte-template.interface';

@Injectable()
export class ReportBaseService implements OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;
  private readonly logger = new Logger(ReportBaseService.name);

  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dsAuth: DataSource,
  ) { }

  /**
   * Arma "GRADO: Nombre" para el pie de los reportes, consultando directamente la
   * base de datos de autenticación (felcn_auth): usuario.usuario ⋈ usuario.persona
   * (nombres/apellidos) ⋈ parametro.grado (abreviatura). Mismo join que usa
   * `UsuarioService.findOne`, pero por login/CI en vez de número de pase.
   *
   * Se reemplazó la llamada HTTP anterior a `/usuarios/cuenta/perfil` de
   * felcn-auth-backend porque ese endpoint no siempre trae `nombreApp` cargado,
   * lo que hacía caer al login/CI crudo combinado con el grado — ej. mostrar
   * "Sbtte.: 3256478" como si el CI fuera un nombre. La tabla `usuario.persona`
   * sí tiene el nombre de todos los usuarios.
   */
  async obtenerUsuarioGenerador(usuarioLogin: string): Promise<string> {
    if (!usuarioLogin) return usuarioLogin

    try {
      const rows = await this.dsAuth.query(
        `
        SELECT
          gr.abreviatura AS "abreviatura",
          TRIM(CONCAT(
            p.nombres, ' ',
            p.primer_apellido, ' ',
            COALESCE(p.segundo_apellido, '')
          )) AS "nombreCompleto"
        FROM usuario.usuario u
        LEFT JOIN usuario.persona p ON u.id_persona = p.id
        LEFT JOIN parametro.grado gr ON u.id_grado = gr.id
        WHERE u.usuario = $1
        `,
        [usuarioLogin],
      )

      const abreviatura: string | undefined = rows[0]?.abreviatura?.trim() || undefined
      const nombreCompleto: string | undefined = rows[0]?.nombreCompleto?.trim() || undefined

      if (abreviatura && nombreCompleto) return `${abreviatura} ${nombreCompleto}`
      if (nombreCompleto) return nombreCompleto
      return usuarioLogin
    } catch (error) {
      this.logger.warn(`No se pudo obtener el nombre del usuario para el pie del reporte: ${error.message}`)
      return usuarioLogin
    }
  }

  private async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-background-networking',
          '--headless=new',
        ],
      });
    }
    return this.browser;
  }

  async generatePdf<T>(template: ReportTemplate<T>, data: T): Promise<Uint8Array> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const html = template.generateHtml(data);

      // domcontentloaded is faster than networkidle0 because images are
      // already embedded as base64 in the HTML — no external network requests.
      await page.setContent(html, {
        timeout: 30000,
        waitUntil: 'networkidle2',
      });

      // Delay to allow Leaflet map tiles and base64 images to fully render.
      await new Promise((resolve) => setTimeout(resolve, 2500));

      await page.emulateMediaType('print');

      const defaultPdfOptions: puppeteer.PDFOptions = {
        format: 'letter' as puppeteer.PaperFormat,
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
        displayHeaderFooter: false,
      };

      const pdfOptions = { ...defaultPdfOptions, ...template.pdfOptions };
      const pdfBuffer = await page.pdf(pdfOptions);

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  async generateCsv<T>(template: ReportTemplate<T>, data: T): Promise<string> {
    return template.generateCsv(data);
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
