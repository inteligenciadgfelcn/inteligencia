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
   * Arma "GRADO: Nombre" para el pie de los reportes, consultando el perfil del
   * usuario en felcn-auth-backend (el grado no viaja en el JWT). El endpoint
   * `/usuarios/cuenta/perfil` no expone una relación `persona` con nombres/apellidos
   * separados, así que el nombre a mostrar sale de `nombreApp` (que en algunos
   * usuarios ya viene precargado como "grado + nombre completo" — de ahí la
   * verificación para no duplicar el grado). Si la consulta falla o el perfil no
   * trae grado/nombreApp, cae de vuelta al login/CI para no romper el PDF.
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
      const abreviatura: string | undefined = perfil?.grado?.abreviatura?.trim() || undefined
      const nombreMostrar: string | undefined = perfil?.nombreApp?.trim() || undefined

      if (abreviatura && nombreMostrar) {
        return nombreMostrar.toLowerCase().startsWith(abreviatura.toLowerCase())
          ? nombreMostrar
          : `${abreviatura}: ${nombreMostrar}`
      }
      if (nombreMostrar) return nombreMostrar
      if (abreviatura) return `${abreviatura}: ${fallback}`
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
