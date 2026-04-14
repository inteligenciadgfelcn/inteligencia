import { Injectable } from '@nestjs/common'

@Injectable()
export class CodigoRegistroService {
  generarCodigo(
    codigoDepartamento: string,
    abreviaturaUnidad: string,
    correlativo: number
  ): string {
    const yearShort = new Date().getFullYear().toString().slice(-2)

    return `${codigoDepartamento}-${abreviaturaUnidad}-${correlativo}/${yearShort}`
  }
}
