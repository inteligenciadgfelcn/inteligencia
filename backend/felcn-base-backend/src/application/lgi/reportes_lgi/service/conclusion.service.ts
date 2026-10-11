import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { ActuacionLgiService } from './actuacion.service'
import { formatearMoneda, convertirMontoLiteral } from '@/common/utils/reporte.util'
import { ConclusionReporteRepository } from '../repository/lgi-conclusion.repository'

@Injectable()
export class ConclusionReporteService {
  constructor(
    private readonly repository: ConclusionReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

  async GenerarPDFConclusion(opId: number) {
    if (!Number.isSafeInteger(opId) || opId <= 0) {
      throw new BadRequestException('El identificador de actuación debe ser un entero positivo')
    }
    const actuacion = await this.repository.obtenerActuacion(opId)
    if (!actuacion) throw new NotFoundException(`No existe una actuación activa con ID ${opId}`)
    const [base, categorias, bienes, empresas, selecciones] = await Promise.all([
      this.actuacionService.GenerarPDFActuacion(opId),
      this.repository.obtenerResumenBienes(opId),
      this.repository.obtenerBienesConFotos(opId),
      this.repository.obtenerEmpresas(opId),
      this.repository.obtenerSelecciones(actuacion.casoId),
    ])
    const total = categorias.reduce((s: number, c: any) => s + Number(c.total ?? 0), 0)
    const faltantes = categorias.reduce((s: number, c: any) => s + c.registros - c.conValor, 0)
    const cantidad = categorias.reduce((s: number, c: any) => s + Number(c.cantidad), 0)
    const fotografiasBienes: any[] = []
    for (const bien of bienes) {
      for (const foto of bien.fotografias ?? []) {
        fotografiasBienes.push({
          numero: fotografiasBienes.length + 1,
          categoria: bien.categoriaTipo?.descripcion ?? 'Bien sin categoría',
          descripcion: foto.descripcion ?? '', imagen: foto.fotografiaDataUrl ?? null,
        })
      }
    }
    return {
      ...base,
      novedad: {
        ...base.novedad,
        afectacionEstimadaNumero: formatearMoneda(total),
        afectacionEstimadaLiteral: convertirMontoLiteral(total),
      },
      conclusion: {
        ciclos: selecciones.ciclos, verbosRectores: selecciones.verbosRectores,
        tipologias: selecciones.tipologias,
      },
      resumen: {
        cantidad, total: formatearMoneda(total), faltantes,
        categorias: categorias.map((c: any) => ({
          categoria: c.categoria, cantidad: c.cantidad,
          total: c.total === null ? 'Sin valoración registrada' : formatearMoneda(Number(c.total)),
          faltantes: c.registros - c.conValor,
        })),
      },
      fotografiasBienes,
      empresas: empresas.map((e: any, indice: number) => ({
        numero: indice + 1, nombre: e.nombre ?? 'Sin nombre',
        nit: e.nit ?? 'Sin registro', matricula: e.matricula ?? 'Sin registro',
        representante: e.representante ?? 'Sin registro',
        capitalSocial: e.capitalSocial ?? 'Sin registro',
        direccion: e.direccion ?? 'Sin registro',
        vinculo: e.vinculo ?? 'Sin vínculo registrado',
        observaciones: e.observaciones, imagen: this.imagenDataUrl(e.imagen),
      })),
    }
  }

  private imagenDataUrl(imagen: Buffer | null): string | null {
    if (!imagen?.length) return null
    const b = Buffer.from(imagen)
    let mime: string | null = null
    if (b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) mime = 'image/png'
    else if (b[0] === 255 && b[1] === 216 && b[2] === 255) mime = 'image/jpeg'
    else if (b.subarray(0,4).toString() === 'RIFF' && b.subarray(8,12).toString() === 'WEBP') mime = 'image/webp'
    return mime ? `data:${mime};base64,${b.toString('base64')}` : null
  }
}
