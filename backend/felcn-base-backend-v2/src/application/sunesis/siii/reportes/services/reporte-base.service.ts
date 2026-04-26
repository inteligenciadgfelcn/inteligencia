import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ReportTemplate } from '../interfaces/reporte-template.interface';

@Injectable()
export class ReportBaseService implements OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;

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
