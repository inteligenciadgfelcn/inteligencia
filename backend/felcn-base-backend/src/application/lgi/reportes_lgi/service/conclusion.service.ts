import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'

import { ActuacionLgiService } from './actuacion.service'

import {
  formatearMoneda,
  convertirMontoLiteral,
} from '@/common/utils/reporte.util'

import { ConclusionReporteRepository } from '../repository/lgi-conclusion.repository'

@Injectable()
export class ConclusionReporteService {
  constructor(
    private readonly repository: ConclusionReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

  async GenerarPDFConclusion(casosId: number) {
    if (!Number.isSafeInteger(casosId) || casosId <= 0) {
      throw new BadRequestException(
        'El identificador del caso debe ser un entero positivo',
      )
    }

    const registros =
      await this.repository.obtenerActuacionesPorCaso(casosId)

    if (!registros.length) {
      throw new NotFoundException(
        `El caso ${casosId} no tiene actuaciones activas`,
      )
    }

    const [categorias, bienes, empresas, selecciones] =
      await Promise.all([
        this.repository.obtenerResumenBienes(casosId),
        this.repository.obtenerBienesConFotos(casosId),
        this.repository.obtenerEmpresas(casosId),
        this.repository.obtenerSelecciones(casosId),
      ])

    // Procesar cada actuación conserva sus datos y su síntesis.
    const actuaciones: any[] = []

    for (const registro of registros) {
      const opId = Number(registro.opId)

      const reporte =
        await this.actuacionService.GenerarPDFActuacion(opId)

      actuaciones.push({
        ...reporte,
        opId,
        numeroSeccion: actuaciones.length + 1,
      })
    }

    // Los registros vienen ordenados por op_id.
    // Se utiliza la última actuación como base del encabezado.
    const base = actuaciones[actuaciones.length - 1]

    const totalCentavos = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + Math.round(this.numero(categoria.total) * 100),
      0,
    )

    if (!Number.isSafeInteger(totalCentavos)) {
      throw new BadRequestException(
        'El total de bienes supera la precisión numérica permitida',
      )
    }

    const total = totalCentavos / 100

    const cantidad = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + this.numero(categoria.cantidad),
      0,
    )

    const faltantes = categorias.reduce(
      (suma: number, categoria: any) =>
        suma +
        this.numero(categoria.registros) -
        this.numero(categoria.conValor),
      0,
    )

    const numeroPorOperativo = new Map<number, string>(
      actuaciones.map((actuacion) => [
        actuacion.opId,
        this.numeroInforme(actuacion),
      ]),
    )

    const fotografiasBienes: any[] = []

    for (const bien of bienes) {
      for (const foto of bien.fotografias ?? []) {
        const imagen =
          foto.fotografiaDataUrl ??
          this.imagenDataUrl(foto.imagen)

        fotografiasBienes.push({
          numero: fotografiasBienes.length + 1,
          opId: bien.opId,
          numeroActuacion: numeroPorOperativo.get(bien.opId),
          itemBienSecId: bien.itembiensecId,
          categoria:
            bien.categoriaTipo?.descripcion ??
            'Bien sin categoría',
          descripcion: foto.descripcion ?? '',
          imagen,
        })
      }
    }

    return {
      ...base,

      casosId,
      titulo: 'CONCLUSIÓN DEL CASO LGI',

      // Datos individuales disponibles para el template.
      actuaciones: actuaciones.map((actuacion) => ({
        ...actuacion,
        numeroInforme: this.numeroInforme(actuacion),
        sintesis: actuacion.novedad?.sintesis ?? '',
      })),

      novedad: {
        ...base.novedad,

        // Síntesis identificadas por actuación.
        // No se inventa una conclusión narrativa del caso.
        sintesis: actuaciones
          .map((actuacion) => {
            const sintesis =
              actuacion.novedad?.sintesis?.trim()

            return [
              `Actuación: ${this.numeroInforme(actuacion)}`,
              sintesis || 'Sin síntesis registrada.',
            ].join('\n')
          })
          .join('\n\n'),

        afectacionEstimadaNumero: formatearMoneda(total),
        afectacionEstimadaLiteral:
          convertirMontoLiteral(total),
      },

      conclusion: {
        ciclos: selecciones.ciclos ?? [],
        verbosRectores: selecciones.verbosRectores ?? [],
        tipologias: selecciones.tipologias ?? [],
      },

      resumen: {
        cantidadActuaciones: actuaciones.length,
        cantidadEmpresas: empresas.length,
        registrosBienes: categorias.reduce(
          (suma: number, categoria: any) =>
            suma + this.numero(categoria.registros),
          0,
        ),
        cantidad,
        total: formatearMoneda(total),
        faltantes,

        categorias: categorias.map((categoria: any) => ({
          categoria: categoria.categoria,
          cantidad: categoria.cantidad,
          total:
            categoria.total === null
              ? 'Sin valoración registrada'
              : formatearMoneda(
                  this.numero(categoria.total),
                ),
          faltantes:
            this.numero(categoria.registros) -
            this.numero(categoria.conValor),
        })),
      },

      fotografiasBienes,

      empresas: empresas.map((empresa: any, indice: number) => ({
        numero: indice + 1,
        empId: empresa.empId,
        opId: Number(empresa.opId),
        numeroActuacion: numeroPorOperativo.get(
          Number(empresa.opId),
        ),
        nombre: empresa.nombre ?? 'Sin nombre',
        nit: empresa.nit ?? 'Sin registro',
        matricula: empresa.matricula ?? 'Sin registro',
        representante:
          empresa.representante ?? 'Sin registro',
        capitalSocial:
          empresa.capitalSocial === null ||
          empresa.capitalSocial === undefined
            ? 'Sin registro'
            : formatearMoneda(
                this.numero(empresa.capitalSocial),
              ),
        direccion: empresa.direccion ?? 'Sin registro',
        vinculo: empresa.vinculo ?? 'Sin vínculo registrado',
        observaciones: empresa.observaciones ?? '',
        imagen: this.imagenDataUrl(empresa.imagen),
      })),
    }
  }

  private numeroInforme(actuacion: any): string {
    const numero =
      actuacion.novedad?.numero ??
      actuacion.opId

    return String(numero)
  }

  private numero(valor: unknown): number {
    if (valor === null || valor === undefined || valor === '') {
      return 0
    }

    const numero = Number(valor)

    if (!Number.isFinite(numero)) {
      throw new BadRequestException(
        'Se recibió un valor numérico inválido en el reporte',
      )
    }

    return numero
  }

  private imagenDataUrl(
    imagen: Buffer | null | undefined,
  ): string | null {
    if (!imagen?.length) return null

    const b = Buffer.from(imagen)

    let mime: string | null = null

    if (
      b.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      )
    ) {
      mime = 'image/png'
    } else if (
      b[0] === 255 &&
      b[1] === 216 &&
      b[2] === 255
    ) {
      mime = 'image/jpeg'
    } else if (
      b.subarray(0, 4).toString() === 'RIFF' &&
      b.subarray(8, 12).toString() === 'WEBP'
    ) {
      mime = 'image/webp'
    }

    return mime
      ? `data:${mime};base64,${b.toString('base64')}`
      : null
  }
}