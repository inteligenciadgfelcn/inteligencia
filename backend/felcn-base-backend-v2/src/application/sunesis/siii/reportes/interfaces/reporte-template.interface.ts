import { PDFOptions } from 'puppeteer';

export interface ReportTemplate<T> {
    generateHtml(data: T): string;
    generateCsv(data: T): string;
    pdfOptions?: PDFOptions;
}
