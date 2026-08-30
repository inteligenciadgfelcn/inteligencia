import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as Handlebars from 'handlebars'
import puppeteer, { Browser } from 'puppeteer'
import { pdfImages } from '../../images'
import { TemplatePaths } from '../../template-paths'

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser!: Browser
  private institucional!: string
  private escudo!: string
  private templates = new Map<string, HandlebarsTemplateDelegate>()

  async onModuleInit() {
    console.time('PUPPETEER INIT')

    this.browser = await puppeteer.launch({
      headless: true,

      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    })

    // cache logos
    this.institucional = this.imageToBase64(pdfImages.institucional)

    this.escudo = this.imageToBase64(pdfImages.escudo)

    console.timeEnd('PUPPETEER INIT')
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async generate(type: string, data: any): Promise<Buffer> {
    data.institucional = this.institucional
    data.escudo = this.escudo
    let template = this.templates.get(type)

    if (!template) {
      const templatePath = path.join(
        TemplatePaths.pdfTemplates,
        `${type}.template.hbs`
      )

      const templateString = fs.readFileSync(templatePath, 'utf8')

      template = Handlebars.compile(templateString)

      this.templates.set(type, template)
    }

    const html = template(data)

    const page = await this.browser.newPage()

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    })
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
    await page.close()
    return Buffer.from(pdfBuffer)
  }

  private imageToBase64(filePath: string): string {
    const file = fs.readFileSync(filePath)

    const ext = path.extname(filePath).substring(1)

    return `data:image/${ext};base64,${file.toString('base64')}`
  }

  public bufferToBase64(buffer: any): string {
    try {
      if (!buffer) {
        return ''
      }

      // ya viene como data:image
      if (typeof buffer === 'string' && buffer.startsWith('data:image')) {
        return buffer
      }

      const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)

      let mime = 'image/jpeg'

      // PNG
      if (
        buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47
      ) {
        mime = 'image/png'
      }

      // BMP
      else if (buf[0] === 0x42 && buf[1] === 0x4d) {
        mime = 'image/bmp'
      }

      // JPEG
      else if (buf[0] === 0xff && buf[1] === 0xd8) {
        mime = 'image/jpeg'
      }

      return `data:${mime};base64,${buf.toString('base64')}`
    } catch (error) {
      console.error('ERROR BUFFER BASE64', error)

      return ''
    }
  }

  public async fileToBase64(filePath: string): Promise<string> {
    try {
      if (!filePath) {
        return ''
      }

      if (!fs.existsSync(filePath)) {
        return ''
      }

      const file = await fs.promises.readFile(filePath)

      const ext = path.extname(filePath).toLowerCase()

      let mime = 'image/jpeg'

      if (ext === '.png') {
        mime = 'image/png'
      }

      if (ext === '.bmp') {
        mime = 'image/bmp'
      }

      if (ext === '.jpg' || ext === '.jpeg') {
        mime = 'image/jpeg'
      }

      return `data:${mime};base64,${file.toString('base64')}`
    } catch (error) {
      console.error('ERROR FILE BASE64', error)

      return ''
    }
  }
}
