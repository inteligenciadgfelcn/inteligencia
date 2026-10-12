import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'

import { ActuacionLgiService } from './actuacion.service'

import {
  formatearMoneda,
  convertirMontoLiteral,
  formatearFechaReporte,
} from '@/common/utils/reporte.util'
import { ConclusionReporteRepository } from '../repository/conclusion-caso.repository'


@Injectable()
export class ConclusionReporteService {
  constructor(
    private readonly repository: ConclusionReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

  async GenerarPDFConclusion(casosId: number) {
    if (
      !Number.isSafeInteger(casosId) ||
      casosId <= 0 ||
      casosId > 2147483647
    ) {
      throw new BadRequestException(
        'El identificador del caso debe ser un entero positivo válido',
      )
    }

    const caso = await this.repository.obtenerCaso(casosId)

    if (!caso) {
      throw new NotFoundException(
        `No existe un caso activo con ID ${casosId}`,
      )
    }

    const [
      actuaciones,
      categorias,
      bienes,
      empresas,
      selecciones,
    ] = await Promise.all([
      this.repository.obtenerActuaciones(casosId),
      this.repository.obtenerResumenBienes(casosId),
      this.repository.obtenerBienesConFotos(casosId),
      this.repository.obtenerEmpresas(casosId),
      this.repository.obtenerSelecciones(casosId),
    ])

    // Reutiliza el lateral existente cuando hay actuaciones.
    // La ausencia de actuaciones no impide generar el reporte.
    const base = actuaciones.length > 0
      ? await this.actuacionService.GenerarPDFActuacion(
          Number(actuaciones[0].opId),
        )
      : {
          reporte: {},
          accion: {
            nombreCaso: this.texto(caso.nombrecaso),
            fechaInicio: this.fecha(caso.fechainicio),
            numeroCasoFiscalia: this.texto(caso.nrocasofis),
            numeroCasoGiaef: this.texto(caso.nrocasogiaef),
            lugarInvestigacion: 'Sin actuación registrada',
            investigadores: [],
          },
          personasAfectadas: [],
          delitoPrecedente: [],
          novedad: {},
        }

    const cantidad = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + Number(categoria.cantidad ?? 0),
      0,
    )

    const registros = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + Number(categoria.registros ?? 0),
      0,
    )

    const conValor = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + Number(categoria.conValor ?? 0),
      0,
    )

    const conValorCuantificado = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + Number(categoria.conValorCuantificado ?? 0),
      0,
    )

    const totalAproximado = categorias.reduce(
      (suma: number, categoria: any) =>
        suma + (this.obtenerMonto(categoria.total) ?? 0),
      0,
    )

    const totalCuantificado = categorias.reduce(
      (suma: number, categoria: any) =>
        suma +
        (this.obtenerMonto(categoria.totalCuantificado) ?? 0),
      0,
    )

    const fotografiasBienes: any[] = []

    for (const bien of bienes) {
      for (const foto of bien.fotografias ?? []) {
        fotografiasBienes.push({
          numero: fotografiasBienes.length + 1,
          idBien: bien.itembiensecId,

          categoria:
            bien.categoriaTipo?.descripcion ??
            'Bien sin categoría',

          descripcion: foto.descripcion ?? '',
          imagen: foto.fotografiaDataUrl ?? null,
        })
      }
    }

    const totalAproximadoTexto =
      conValor === 0
        ? 'Sin valoración registrada'
        : formatearMoneda(totalAproximado)

    const totalCuantificadoTexto =
      conValorCuantificado === 0
        ? 'Sin valoración registrada'
        : formatearMoneda(totalCuantificado)

    return {
      ...base,

      casosId,

      novedad: {
        ...base.novedad,

        tipo: 'Conclusión del caso',

        // No utiliza el correlativo de una actuación como
        // número de conclusión.
        numero: String(casosId),

        fecha: formatearFechaReporte(new Date()),

        afectacionEstimadaNumero:
          totalAproximadoTexto,

        afectacionEstimadaLiteral:
          conValor === 0
            ? ''
            : convertirMontoLiteral(totalAproximado),

        afectacionCuantificadaNumero:
          totalCuantificadoTexto,

        afectacionCuantificadaLiteral:
          conValorCuantificado === 0
            ? ''
            : convertirMontoLiteral(totalCuantificado),
      },

      conclusion: {
        bienesSujetosPd: selecciones.bienesSujetosPd,
        sentencias: selecciones.sentencias,
      },

      actuaciones: actuaciones.map(
        (actuacion: any, indice: number) => ({
          numero: indice + 1,
          opId: actuacion.opId,
          numeroInforme: this.texto(
            actuacion.numeroInforme,
          ),
          fecha: this.fecha(actuacion.fechaInforme),
          lugar: this.texto(actuacion.lugar),
          sintesis: this.texto(
            actuacion.sintesis,
            'Sin síntesis registrada',
          ),
        }),
      ),

      resumen: {
        cantidad,
        cantidadActuaciones: actuaciones.length,
        cantidadEmpresas: empresas.length,

        total: totalAproximadoTexto,
        totalAproximado: totalAproximadoTexto,
        totalCuantificado: totalCuantificadoTexto,

        faltantes: registros - conValor,

        faltantesCuantificados:
          registros - conValorCuantificado,

        categorias: categorias.map((categoria: any) => {
          const aproximado = this.obtenerMonto(
            categoria.total,
          )

          const cuantificado = this.obtenerMonto(
            categoria.totalCuantificado,
          )

          return {
            categoria: categoria.categoria,
            cantidad: Number(categoria.cantidad ?? 0),

            total:
              aproximado === null
                ? 'Sin valoración registrada'
                : formatearMoneda(aproximado),

            totalCuantificado:
              cuantificado === null
                ? 'Sin valoración registrada'
                : formatearMoneda(cuantificado),

            faltantes:
              Number(categoria.registros ?? 0) -
              Number(categoria.conValor ?? 0),

            faltantesCuantificados:
              Number(categoria.registros ?? 0) -
              Number(categoria.conValorCuantificado ?? 0),
          }
        }),
      },

      fotografiasBienes,

      empresas: empresas.map(
        (empresa: any, indice: number) => ({
          numero: indice + 1,
          empId: empresa.empId,
          nombre: this.texto(empresa.nombre),
          nit: this.texto(empresa.nit),
          matricula: this.texto(empresa.matricula),
          representante: this.texto(
            empresa.representante,
          ),

          // Capital social separado del total de bienes.
          capitalSocial: this.texto(
            empresa.capitalSocial,
            'Sin capital social registrado',
          ),

          direccion: this.texto(empresa.direccion),

          vinculo: this.texto(
            empresa.vinculo,
            'Sin vínculo registrado',
          ),

          observaciones: this.texto(
            empresa.observaciones,
            'Sin observaciones registradas',
          ),

          imagen: this.imagenDataUrl(empresa.imagen),
        }),
      ),
    }
  }

  private obtenerMonto(valor: unknown): number | null {
    if (
      valor === null ||
      valor === undefined ||
      String(valor).trim() === ''
    ) {
      return null
    }

    const numero = Number(valor)

    return Number.isFinite(numero) ? numero : null
  }

  private texto(
    valor: unknown,
    defecto = 'Sin registro',
  ): string {
    if (valor === null || valor === undefined) {
      return defecto
    }

    return String(valor).trim() || defecto
  }

  private fecha(
    valor: string | Date | null | undefined,
  ): string {
    if (!valor) {
      return 'Sin fecha registrada'
    }

    const fecha =
      valor instanceof Date ? valor : new Date(valor)

    return Number.isNaN(fecha.getTime())
      ? 'Sin fecha válida registrada'
      : formatearFechaReporte(fecha)
  }

  private imagenDataUrl(
    imagen: Buffer | null,
  ): string | null {
    if (!imagen?.length) {
      return null
    }

    const buffer = Buffer.from(imagen)
    let mime: string | null = null

    if (
      buffer.subarray(0, 8).equals(
        Buffer.from([
          137, 80, 78, 71, 13, 10, 26, 10,
        ]),
      )
    ) {
      mime = 'image/png'
    } else if (
      buffer[0] === 255 &&
      buffer[1] === 216 &&
      buffer[2] === 255
    ) {
      mime = 'image/jpeg'
    } else if (
      buffer.subarray(0, 4).toString() === 'RIFF' &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    ) {
      mime = 'image/webp'
    }

    return mime
      ? `data:${mime};base64,${buffer.toString('base64')}`
      : null
  }
}