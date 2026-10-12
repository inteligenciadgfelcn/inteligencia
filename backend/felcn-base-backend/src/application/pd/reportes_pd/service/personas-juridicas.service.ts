import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'

import { ActuacionLgiService } from './actuacion.service'

import {
  formatearFechaReporte,
  formatearMoneda,
  convertirMontoLiteral,
} from '@/common/utils/reporte.util'

import { generarMapaBien } from '@/common/utils/mapa-bien.util'
import { PersonasJuridicasReporteRepository } from '../repository/personas-juridica.repository'

@Injectable()
export class PersonasJuridicasReporteService {
  constructor(
    private readonly repository: PersonasJuridicasReporteRepository,
    private readonly actuacionService: ActuacionLgiService
  ) {}

  async GenerarPDFEmpresa(idEmpresa: number) {
    if (!Number.isSafeInteger(idEmpresa) || idEmpresa <= 0) {
      throw new BadRequestException(
        'El identificador de la empresa debe ser un entero positivo'
      )
    }

    const empresa = await this.repository.obtenerEmpresa(idEmpresa)

    if (!empresa) {
      throw new NotFoundException(`No existe la empresa con ID ${idEmpresa}`)
    }

    const opId = Number(empresa.opId)

    if (!Number.isSafeInteger(opId) || opId <= 0) {
      throw new BadRequestException(
        'La empresa no tiene una actuación válida asociada'
      )
    }

    const [base, implicados] = await Promise.all([
      this.actuacionService.GenerarPDFActuacion(opId),
      this.repository.obtenerImplicados(idEmpresa),
    ])

    const mapa = await generarMapaBien(empresa.latitud, empresa.longitud)

    const aproximado = this.obtenerMonto(empresa.costoAprox)

    const cuantificado = this.obtenerMonto(empresa.costoCuant)

    const capitalSocial = this.obtenerMonto(empresa.capitalSocial)

    const capitalSocialFormateado =
      capitalSocial === null
        ? 'Sin especificar'
        : formatearMoneda(capitalSocial)

    const campos: Array<[string, string]> = [
      ['nombre', 'Nombre o razón social'],
      ['nit', 'NIT'],
      ['matricula', 'Matrícula'],
      ['representante', 'Representante'],
      ['capitalSocial', 'Capital social'],
      ['direccion', 'Dirección'],
      ['observaciones', 'Observaciones'],
      ['pericia', 'Pericia'],
      ['resultado', 'Resultado de pericia'],
    ]

    return {
      ...base,

      novedad: {
        ...base.novedad,

        tipo: this.texto(empresa.vinculoDescripcion, 'Sin vínculo registrado'),

        numero: base.novedad?.numero ?? 'Sin registro',
        fecha: base.novedad?.fecha ?? 'Sin fecha registrada',

        capitalSocialNumero: capitalSocialFormateado,

        capitalSocialLiteral:
          capitalSocial === null ? '' : convertirMontoLiteral(capitalSocial),
      },

      empresa: {
        nombre: this.texto(empresa.nombre, 'Sin nombre registrado'),

        vinculo: this.texto(
          empresa.vinculoDescripcion,
          'Sin vínculo registrado'
        ),

        datos: campos.map(([campo, etiqueta]) => ({
          etiqueta,
          valor:
            campo === 'capitalSocial'
              ? capitalSocialFormateado
              : typeof empresa[campo] === 'boolean'
                ? empresa[campo]
                  ? 'Sí'
                  : 'No'
                : this.texto(empresa[campo], 'Sin información registrada'),
        })),

        fechaRegistro: this.fecha(empresa.fechaHoraIngreso),

        tieneDocumento: empresa.tieneDocumento,

        implicados: (implicados ?? []).map(
          (implicado: any, indice: number) => ({
            numero: indice + 1,

            nombre: this.texto(implicado.nombre, 'Sin nombre registrado'),

            tipoImplicado: this.texto(implicado.tipoImplicado),

            tipoDocumento: this.texto(implicado.tipoDocumento),

            numeroDocumento: this.texto(
              implicado.numeroDocumento,
              'Sin registro'
            ),
          })
        ),

        imagen: this.imagenDataUrl(empresa.imagen),

        direccion: empresa.direccion ?? null,
        latitud: empresa.latitud ?? null,
        longitud: empresa.longitud ?? null,

        ...mapa,
      },
    }
  }

  private obtenerMonto(valor: unknown): number | null {
    if (valor === null || valor === undefined || String(valor).trim() === '') {
      return null
    }

    const numero = Number(valor)

    return Number.isFinite(numero) ? numero : null
  }

  private texto(valor: unknown, defecto = 'Sin especificar'): string {
    if (valor === null || valor === undefined) {
      return defecto
    }

    return String(valor).trim() || defecto
  }

  private fecha(valor: string | Date | null | undefined): string {
    if (!valor) {
      return 'Sin fecha registrada'
    }

    const fecha = valor instanceof Date ? valor : new Date(valor)

    if (Number.isNaN(fecha.getTime())) {
      return 'Sin fecha válida registrada'
    }

    return formatearFechaReporte(fecha)
  }

  private imagenDataUrl(imagen: Buffer | null): string | null {
    if (!imagen?.length) {
      return null
    }

    const buffer = Buffer.from(imagen)
    let mime: string | null = null

    if (
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ) {
      mime = 'image/png'
    } else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
      mime = 'image/jpeg'
    } else if (
      buffer.subarray(0, 4).toString() === 'RIFF' &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    ) {
      mime = 'image/webp'
    }

    return mime ? `data:${mime};base64,${buffer.toString('base64')}` : null
  }
}
