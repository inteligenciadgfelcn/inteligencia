import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as Handlebars from 'handlebars'
import puppeteer from 'puppeteer'

import { pdfImages } from '../../images'
import { TemplatePaths } from '../../template-paths'

@Injectable()
export class PdfService {
  async generate(type: string, data: any): Promise<Buffer> {
    // convertir imagen institucional a base64
    const institucionalPath = pdfImages.institucional
    const institucional = this.imageToBase64(institucionalPath)
    const escudo = this.imageToBase64(pdfImages.escudo)

    // agregar imagen al contexto
    data.institucional = institucional
    data.escudo = escudo

    // ruta del template
    const templatePath = path.join(
      TemplatePaths.pdfTemplates,
      `${type}.template.hbs`
    )

    // leer template
    const templateString = fs.readFileSync(templatePath, 'utf8')

    // compilar handlebars
    const template = Handlebars.compile(templateString)

    // generar html final
    const html = template(data)

    // lanzar navegador
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // cargar html
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // generar pdf
    const pdfBuffer = await page.pdf({
  format: 'Letter',
  printBackground: true,
  margin: {
    top: '12mm',
    bottom: '12mm',
    left: '12mm',
    right: '12mm',
  },
})

    await browser.close()

    return Buffer.from(pdfBuffer)
  }

  private imageToBase64(filePath: string): string {
    const file = fs.readFileSync(filePath)
    const ext = path.extname(filePath).substring(1)
    return `data:image/${ext};base64,${file.toString('base64')}`
  }
}
