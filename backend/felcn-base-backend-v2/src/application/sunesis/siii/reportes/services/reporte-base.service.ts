import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as puppeteer from 'puppeteer';
import { ReportTemplate } from '../interfaces/reporte-template.interface';

@Injectable()
export class ReportBaseService implements OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;
  private readonly logger = new Logger(ReportBaseService.name);
  private readonly authBackendUrl = process.env.AUTH_BACKEND_INTERNAL_URL || '';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Arma "GRADO: Nombre Completo" para el pie de los reportes, consultando el
   * perfil del usuario en felcn-auth-backend (grado y persona no viajan en el
   * JWT). Si la consulta falla o el perfil no trae grado/persona, cae de
   * vuelta al login/CI para no romper la generación del PDF.
   */
  async obtenerUsuarioGenerador(accessToken: string | undefined, fallback: string): Promise<string> {
    if (!accessToken || !this.authBackendUrl) return fallback

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authBackendUrl.replace(/\/$/, '')}/api/usuarios/cuenta/perfil`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )

      const perfil = response.data?.datos
      const abreviatura = perfil?.grado?.abreviatura
      const nombreCompleto = [perfil?.persona?.nombres, perfil?.persona?.primerApellido, perfil?.persona?.segundoApellido]
        .filter(Boolean)
        .join(' ')
        .trim()

      if (abreviatura && nombreCompleto) return `${abreviatura}: ${nombreCompleto}`
      if (perfil?.nombreApp) return perfil.nombreApp
      return fallback
    } catch (error) {
      this.logger.warn(`No se pudo obtener el perfil del usuario para el pie del reporte: ${error.message}`)
      return fallback
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
