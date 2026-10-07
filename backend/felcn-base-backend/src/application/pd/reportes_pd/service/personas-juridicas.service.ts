import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { ActuacionLgiService } from './actuacion.service'
import { formatearFechaReporte } from '@/common/utils/reporte.util'
import { generarMapaBien } from '@/common/utils/mapa-bien.util'
import { PersonasJuridicasReporteRepository } from '../repository/personas-juridica.repository'

@Injectable()
export class PersonasJuridicasReporteService {
  constructor(
    private readonly repository: PersonasJuridicasReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

  async GenerarPDFEmpresa(idEmpresa: number) {
    if (!Number.isSafeInteger(idEmpresa) || idEmpresa <= 0) {
      throw new BadRequestException('El identificador de la empresa debe ser un entero positivo')
    }
    const empresa = await this.repository.obtenerEmpresa(idEmpresa)
    if (!empresa) throw new NotFoundException(`No existe la empresa con ID ${idEmpresa}`)
    const opId = Number(empresa.opId)
    if (!Number.isSafeInteger(opId) || opId <= 0) {
      throw new BadRequestException('La empresa no tiene una actuación válida asociada')
    }
    const [base, historial, implicados] = await Promise.all([
      this.actuacionService.GenerarPDFActuacion(opId),
      this.repository.obtenerHistorialJuridico(idEmpresa),
      this.repository.obtenerImplicados(idEmpresa),
    ])
    const mapa = await generarMapaBien(empresa.latitud, empresa.longitud)
    const fecha = (valor: any) => valor ? formatearFechaReporte(valor) : 'Sin fecha registrada'
    const campos = [
      ['nombre', 'Nombre o razón social'], ['nit', 'NIT'], ['matricula', 'Matrícula'],
      ['representante', 'Representante'], ['capitalSocial', 'Capital social'],
      ['direccion', 'Dirección'], ['observaciones', 'Observaciones'],
      ['pericia', 'Pericia'], ['resultado', 'Resultado de pericia'],
    ]
    return {
      ...base,
      novedad: {
        ...base.novedad,
        tipo: empresa.vinculoDescripcion ?? 'Sin vínculo registrado',
        numero: base.novedad.numero,
        fecha: base.novedad.fecha,
      },
      empresa: {
        nombre: empresa.nombre,
        vinculo: empresa.vinculoDescripcion ?? 'Sin vínculo registrado',
        datos: campos.map(([campo, etiqueta]) => ({
          etiqueta,
          valor: typeof empresa[campo] === 'boolean'
            ? (empresa[campo] ? 'Sí' : 'No')
            : (empresa[campo] ?? 'Sin información registrada'),
        })),
        fechaRegistro: fecha(empresa.fechaHoraIngreso),
        tieneDocumento: empresa.tieneDocumento,
        ultimaSituacionJuridica: historial[0]?.descripcionTipo ?? 'Sin situación jurídica registrada',
        historialJuridico: historial.map((s: any, indice: number) => ({
          situacion: s.descripcionTipo ?? 'Sin descripción registrada',
          fecha: fecha(s.fecha), fechaRegistro: fecha(s.fechaHoraIngreso), esUltima: indice === 0,
        })),
        implicados: implicados.map((i: any, indice: number) => ({
          numero: indice + 1, nombre: i.nombre || 'Sin nombre registrado',
          tipoImplicado: i.tipoImplicado ?? 'Sin especificar',
          tipoDocumento: i.tipoDocumento ?? 'Sin especificar',
          numeroDocumento: i.numeroDocumento ?? 'Sin registro',
        })),
        imagen: this.imagenDataUrl(empresa.imagen),
        direccion: empresa.direccion,
        latitud: empresa.latitud, longitud: empresa.longitud, ...mapa,
      },
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
