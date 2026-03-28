import { Injectable } from '@nestjs/common'

@Injectable()
export class PruebaService {
  async GenerarPDF() {
    return this.generarContexto()
  }

  async GenerarExcel() {
    return this.generarContexto()
  }

  async generarContexto(): Promise<any[]> {
    const contenido = [
      {
        datos: 'ACT-contenidp',
      },
    ]

    return contenido
  }
}
