import {
  BadRequestException,
  Injectable,
} from '@nestjs/common'

import * as ExcelJS from 'exceljs'

@Injectable()
export class ExcelService {
  async generate(
    type: string,
    data: Record<string, any>[]
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const nombre =
      type
        .replace(/[\\/*?:[\]]/g, ' ')
        .replace(/^'+|'+$/g, '')
        .trim()
        .slice(0, 31) || 'Reporte'

    const worksheet = workbook.addWorksheet(
      nombre.toUpperCase()
    )

    if (!data.length) {
      worksheet.addRow(['Sin datos'])

      return Buffer.from(
        await workbook.xlsx.writeBuffer()
      )
    }

    const encabezados = [
      ...new Set(data.flatMap((fila) => Object.keys(fila))),
    ]

    if (
      data.length > 1048575 ||
      encabezados.length > 16384
    ) {
      throw new BadRequestException(
        'El reporte supera los límites de Excel'
      )
    }

    const cabecera = worksheet.addRow(encabezados)

    cabecera.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
    }

    cabecera.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    }

    cabecera.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    }

    cabecera.height = 35

    for (const item of data) {
      const valores = encabezados.map((campo) => {
        const valor = item[campo]

        if (valor === null || valor === undefined) {
          return ''
        }

        if (
          typeof valor === 'number' ||
          typeof valor === 'boolean'
        ) {
          return valor
        }

        const texto =
          valor instanceof Date
            ? valor.toISOString()
            : typeof valor === 'object'
              ? JSON.stringify(valor)
              : String(valor)

        if (texto.length > 32767) {
          throw new BadRequestException(
            `El campo "${campo}" supera el límite de caracteres por celda. Reduzca los filtros o exporte JSON.`
          )
        }

        return texto
      })

      const fila = worksheet.addRow(valores)

      fila.alignment = {
        vertical: 'top',
        wrapText: true,
      }

      const lineas = Math.max(
        ...valores.map((valor) =>
          typeof valor === 'string'
            ? valor.split('\n').length
            : 1
        )
      )

      fila.height = Math.min(
        Math.max(lineas * 15 + 10, 30),
        409
      )

      if (fila.number % 2 === 0) {
        fila.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEAF2F8' },
        }
      }
    }

    const columnasTexto = new Set([
      'Personas',
      'Actuaciones',
      'Bienes',
      'Empresas',
    ])

    encabezados.forEach((campo, indice) => {
      const columna = worksheet.getColumn(indice + 1)

      columna.width = columnasTexto.has(campo)
        ? 65
        : Math.min(Math.max(campo.length + 3, 18), 35)

      if (
        campo.startsWith('Total aproximado') ||
        campo.startsWith('Total cuantificado') ||
        campo.startsWith('Total capital')
      ) {
        columna.numFmt = '#,##0.00'
      }
    })

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
        xSplit: 3,
      },
    ]

    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: {
        row: data.length + 1,
        column: encabezados.length,
      },
    }

    return Buffer.from(
      await workbook.xlsx.writeBuffer()
    )
  }
}