import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ReportTemplate } from '../interfaces/reporte-template.interface';

@Injectable()
export class ReportBaseService implements OnModuleDestroy {
    private browser: puppeteer.Browser | null = null;

    private async getBrowser(): Promise<puppeteer.Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'shell',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }
        return this.browser;
    }

    async generatePdf<T>(template: ReportTemplate<T>, data: T): Promise<Uint8Array> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        try {
            const html = template.generateHtml(data);
            await page.setContent(html, {
                timeout: 0,
                waitUntil: 'networkidle0',
            });

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
