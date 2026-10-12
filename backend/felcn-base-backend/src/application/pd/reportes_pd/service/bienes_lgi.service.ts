import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'

import {
  formatearMoneda,
  convertirMontoLiteral,
  formatearFechaReporte,
} from '@/common/utils/reporte.util'

import { BienesLgiReporteRepository } from '../repository/bienes-lgi.repository'
import { ActuacionLgiService } from './actuacion.service'
import { generarMapaBien } from '@/common/utils/mapa-bien.util'

@Injectable()
export class BienesLgiService {
  constructor(
    private readonly bienesRepository: BienesLgiReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

  async GenerarPDFBienes(idBien: number) {
    if (!Number.isSafeInteger(idBien) || idBien <= 0) {
      throw new BadRequestException(
        'El identificador del bien debe ser un entero positivo',
      )
    }

    const registro =
      await this.bienesRepository.obtenerBien(idBien)

    if (!registro) {
      throw new NotFoundException(
        `No existe el bien con ID ${idBien}`,
      )
    }

    const opId = Number(registro.opId)

    if (!Number.isSafeInteger(opId) || opId <= 0) {
      throw new BadRequestException(
        'El bien no tiene un operativo válido asociado',
      )
    }

    const base =
      await this.actuacionService.GenerarPDFActuacion(opId)

    const [
      situacionesBien,
      datosBien,
      caracteristicas,
      implicados,
    ] = await Promise.all([
      this.bienesRepository.obtenerHistorialSituacionBien(
        idBien,
      ),
      this.bienesRepository.obtenerDatosBien(idBien),
      this.bienesRepository.obtenerCaracteristicas(idBien),
      this.bienesRepository.obtenerImplicadosBien(idBien),
    ])

    const ultimaSituacion = situacionesBien[0] ?? null

    const ultimaSituacionTexto = ultimaSituacion
      ? this.texto(
          ultimaSituacion.medidaCautelar,
          'Sin medida cautelar especificada',
        )
      : 'Sin situación del bien registrada'

    const aprox = this.obtenerMonto(
      datosBien?.costoaprox ?? registro.costoAprox,
    )

    const cuant = this.obtenerMonto(
      datosBien?.costocuant ?? registro.costoCuant,
    )

    const latitud =
      datosBien?.latitud ?? registro.latitud ?? null

    const longitud =
      datosBien?.longitud ?? registro.longitud ?? null

    const mapa = await generarMapaBien(
      latitud,
      longitud,
    )

    const datosParaDetalle = {
      ...(datosBien ?? {}),
      cantidadbien:
        datosBien?.cantidadbien ?? registro.cantidadBien,
      inves: datosBien?.inves ?? registro.inves,
      lugar_secuestro:
        datosBien?.lugar_secuestro ?? registro.lugarSecuestro,
      pericia: datosBien?.pericia ?? registro.pericia,
      resultado_pericia:
        datosBien?.resultado_pericia ?? registro.resultadoPericia,
      fechahoraing:
        datosBien?.fechahoraing ?? registro.fechaHoraIngreso,
      usuario: datosBien?.usuario ?? registro.usuario,
      estado: datosBien?.estado ?? registro.estado,
    }

    return {
      reporte: base.reporte ?? {},
      accion: base.accion ?? {},
      personasAfectadas: base.personasAfectadas ?? [],
      delitoPrecedente: base.delitoPrecedente ?? [],

      novedad: {
        tipo: ultimaSituacionTexto,

        numero: ultimaSituacion
          ? ultimaSituacion.idSituacion
          : 'Sin registro',

        fecha: this.fecha(
          ultimaSituacion?.fechaResolucion,
        ),

        afectacionEstimadaNumero:
          aprox === null
            ? 'Sin especificar'
            : formatearMoneda(aprox),

        afectacionEstimadaLiteral:
          aprox === null
            ? ''
            : convertirMontoLiteral(aprox),
      },

      bien: {
        ...mapa,

        idBien: registro.itembiensecId,

        latitud,
        longitud,

        tipoBien: this.texto(
          datosBien?.tipoDescripcion ??
            registro.categoriaTipo?.descripcion,
        ),

        cantidad:
          datosBien?.cantidadbien ??
          registro.cantidadBien ??
          'Sin especificar',

        fechaRegistro: this.fecha(
          registro.fechaHoraIngreso,
        ),

        lugarSecuestro:
          datosBien?.lugar_secuestro ??
          registro.lugarSecuestro ??
          null,

        valorAproximado:
          aprox === null
            ? 'Sin especificar'
            : formatearMoneda(aprox),

        valorCuantificado:
          cuant === null
            ? 'Sin especificar'
            : formatearMoneda(cuant),

        datos: this.mapearDatosBien(datosParaDetalle),

        caracteristicas: caracteristicas.map(
          (caracteristica: any) => ({
            etiqueta: this.texto(
              caracteristica.etiqueta,
              'Característica sin nombre',
            ),
            valor: this.texto(
              caracteristica.valor,
              'Sin valor registrado',
            ),
          }),
        ),

        ultimaSituacionBien: ultimaSituacionTexto,

        historialSituacionBien: situacionesBien.map(
          (situacion, indice) => ({
            ...situacion,
            esUltima: indice === 0,

            medidaCautelar: this.texto(
              situacion.medidaCautelar,
              'Sin medida cautelar especificada',
            ),

            fecha: this.fecha(
              situacion.fechaResolucion,
            ),

            fiscalia: this.texto(situacion.fiscalia),
            autoridad: this.texto(situacion.autoridad),

            fechaRegistro: this.fecha(
              situacion.fechaHoraIngreso,
            ),
          }),
        ),

        // El repositorio actual devuelve IDs.
        // Los nombres requieren unir detenidosaux y sus catálogos.
        implicados: implicados.map((implicado) => ({
          ...implicado,
          fechaRegistro: this.fecha(
            implicado.fechaHoraIngreso,
          ),
        })),

        fotografias: (registro.fotografias ?? []).map(
          (foto: any, indice: number) => ({
            numero: indice + 1,
            descripcion: foto.descripcion ?? '',
            imagen: foto.fotografiaDataUrl ?? null,
          }),
        ),
      },
    }
  }

  private mapearDatosBien(datos: any) {
    const campos: Array<[string, string]> = [
      ['claseDescripcion', 'Clase'],
      ['tipoDescripcion', 'Tipo'],
      ['cantidadbien', 'Cantidad'],
      ['inves', 'En investigación'],
      ['lugar_secuestro', 'Lugar de secuestro'],
      ['pericia', 'Pericia'],
      ['resultado_pericia', 'Resultado de pericia'],
      ['fechahoraing', 'Fecha de registro'],
      ['usuario', 'Usuario de registro'],
      ['estado', 'Estado del registro'],
    ]

    return campos.map(([campo, etiqueta]) => {
      const valor = datos[campo]

      if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ''
      ) {
        return {
          etiqueta,
          valor: 'Sin información registrada',
        }
      }

      return {
        etiqueta,
        valor:
          typeof valor === 'boolean'
            ? valor
              ? 'Sí'
              : 'No'
            : campo === 'fechahoraing'
              ? this.fecha(valor)
              : String(valor),
      }
    })
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
    defecto = 'Sin especificar',
  ): string {
    if (valor === null || valor === undefined) {
      return defecto
    }

    const texto = String(valor).trim()

    return texto || defecto
  }

  private fecha(
    valor: string | Date | null | undefined,
  ): string {
    if (!valor) {
      return 'Sin fecha registrada'
    }

    const fecha =
      valor instanceof Date ? valor : new Date(valor)

    if (Number.isNaN(fecha.getTime())) {
      return 'Sin fecha válida registrada'
    }

    return formatearFechaReporte(fecha)
  }
}