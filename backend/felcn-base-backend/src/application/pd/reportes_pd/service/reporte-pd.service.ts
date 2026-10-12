import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ReportePdRepository } from '../repository/reporte-pd.repository'
// Ajustar solamente la ruta al repositorio existente en tu proyecto.
import { ConsultaSiiiRepository } from '@/application/lgi/informacion_siii/repository/consulta.repository'

@Injectable()
export class ReportePdService {
  constructor(
    private readonly repository: ReportePdRepository,
    private readonly consultaSiiiRepository: ConsultaSiiiRepository
  ) {}

  async generarReporte(casosId: string) {
    if (
      !/^[1-9]\d*$/.test(casosId) ||
      BigInt(casosId) > BigInt('9223372036854775807')
    ) {
      throw new BadRequestException(
        'casosId debe ser un bigint positivo válido'
      )
    }

    const caso = await this.repository.obtenerCaso(casosId)
    if (!caso)
      throw new NotFoundException(
        `El caso ${casosId} no existe o está inactivo`
      )

    const [
      investigadores,
      personasInvestigadas,
      bienesSujetosPd,
      sentencias,
      referenciasPrecedentes,
      empresas,
      actuaciones,
      bienes,
    ] = await Promise.all([
      this.repository.obtenerInvestigadores(casosId),
      this.repository.obtenerPersonasInvestigadas(casosId),
      this.repository.obtenerBienesSujetosPd(casosId),
      this.repository.obtenerSentencias(casosId),
      this.repository.obtenerReferenciasPrecedentes(casosId),
      this.repository.obtenerEmpresas(casosId),
      this.repository.obtenerActuaciones(casosId),
      this.repository.obtenerBienesDetallados(casosId),
    ])

    const numeros = [
      ...new Set(
        referenciasPrecedentes
          .map((p) => p.numeroCaso.trim().toUpperCase())
          .filter(Boolean)
      ),
    ]
    const operativosSiii = numeros.length
      ? await this.consultaSiiiRepository.buscarCasosPrecedentesParaReporte(
          numeros
        )
      : []

    // Conserva también los precedentes que todavía no se encuentran en SIII.
    const casosPrecedentes = numeros.map((numeroCaso) => {
      const operativos = operativosSiii.filter(
        (o) => o.numeroCaso?.trim().toUpperCase() === numeroCaso
      )
      return {
        numeroCaso,
        referencias: referenciasPrecedentes.filter(
          (p) => p.numeroCaso.trim().toUpperCase() === numeroCaso
        ),
        encontradoEnSiii: operativos.length > 0,
        operativos: operativos.map((o) => ({
          ...o,
          resumenBienes: [
            o.resumenOtros,
            ...(o.detalleBienes ?? []).map((b) => {
              const caracteristicas = (b.caracteristicas ?? [])
                .map((c) => c.descripcion)
                .filter(Boolean)
                .join(', ')
              return `${b.cantidad ?? ''} ${b.tipoBien || 'Bien'}${caracteristicas ? ': ' + caracteristicas : ''}${b.enInvestigacion ? ' (en investigación)' : ''}`.trim()
            }),
          ]
            .filter(Boolean)
            .join('; '),
          costoTotalAproximadoTexto: this.monto(o.costoTotalAproximadoBienes),
          costoTotalCuantificadoTexto: this.monto(
            o.costoTotalCuantificadoBienes
          ),
          detalleBienes: (o.detalleBienes ?? []).map((b) => ({
            ...b,
            costoAproximadoTexto: this.monto(b.costoAproximado),
            costoCuantificadoTexto: this.monto(b.costoCuantificado),
            caracteristicasTexto: (b.caracteristicas ?? [])
              .map((c) => c.descripcion)
              .filter(Boolean)
              .join('; '),
          })),
        })),
      }
    })

    const bienesPreparados = bienes.map((b) => ({
      ...b,
      fechaRegistroTexto: this.fecha(b.fechaRegistro),
      valorAproximadoTexto: this.monto(b.valorAproximado),
      valorCuantificadoTexto: this.monto(b.valorCuantificado),
      caracteristicasTexto: b.caracteristicas
        .map((c) => `${c.etiqueta || 'Característica'}: ${c.valor}`)
        .join('; '),
      ultimaMedida: b.medidas[0]?.tipo ?? 'No registrada',
      mapaUrl: this.mapaUrl(
        b.latitud == null ? null : String(b.latitud),
        b.longitud == null ? null : String(b.longitud)
      ),
      medidas: b.medidas.map((h, index) => ({
        ...h,
        ultima: index === 0,
        fechaTexto: this.fecha(h.fecha),
        fechaRegistroTexto: this.fecha(h.fechaRegistro),
      })),
      custodias: b.custodias.map((h, index) => ({
        ...h,
        ultima: index === 0,
        fechaTexto: this.fecha(h.fecha),
      })),
      informacionJuridica: b.informacionJuridica.map((h) => ({
        ...h,
        fechaTexto: this.fecha(h.fecha),
      })),
      fotografias: b.fotografias.map((f) => ({
        id: f.id,
        descripcion: f.descripcion,
        imagenSrc: this.imagenSrc(Buffer.from(f.hex, 'hex')),
      })),
    }))

    const cantidadesPorTipo = new Map<string, number>()
    for (const b of bienes) {
      const tipo = b.tipoBien || 'Sin tipo registrado'
      cantidadesPorTipo.set(
        tipo,
        (cantidadesPorTipo.get(tipo) ?? 0) + b.cantidad
      )
    }

    return {
      tipoReporte: 'PERDIDA_DOMINIO',
      fechaGeneracion: new Date().toISOString(),
      fechaGeneracionTexto: this.fecha(new Date()),
      caso: { ...caso, fechaInicioTexto: this.fecha(caso.fechaInicio) },
      investigadores: investigadores.map((i) => ({
        ...i,
        fechaAsignacionTexto: this.fecha(i.fechaAsignacion),
        fechaSeparacionTexto: this.fecha(i.fechaSeparacion),
      })),
      investigadoresActuales: investigadores.filter(
        (i) => i.actual && i.estadoInvestigador === 'ASIGNADO'
      ),
      personasInvestigadas,
      bienesSujetosPd,
      sentencias,
      empresas: empresas.map((e) => {
        const { imagen, ...datos } = e
        const historialJuridico = e.historialJuridico.map((h, index) => ({
          ...h,
          ultima: index === 0,
          fechaTexto: this.fechaCivil(h.fecha),
          fechaRegistroTexto: this.fecha(h.fechaRegistro),
        }))
        return {
          ...datos,
          fechaActuacionTexto: this.fecha(e.fechaActuacion),
          fechaRegistroTexto: this.fecha(e.fechaRegistro),
          imagenSrc: this.imagenSrc(imagen),
          mapaUrl: this.mapaUrl(e.latitud, e.longitud),
          historialJuridico,
          ultimaSituacionJuridica:
            historialJuridico[0]?.descripcion ?? 'No registrada',
        }
      }),
      casosPrecedentes,
      bienes: bienesPreparados,
      actuaciones: actuaciones.map((a) => ({
        ...a,
        fechaInformeTexto: this.fecha(a.fechaInforme),
        cantidadBienes: bienes.filter((b) => b.opId === a.opId).length,
        cantidadEmpresas: empresas.filter((e) => e.opId === a.opId).length,
      })),
      resumenBienesPorTipo: [...cantidadesPorTipo].map(([tipo, cantidad]) => ({
        tipo,
        cantidad,
      })),
      resumen: {
        cantidadInvestigadores: investigadores.length,
        cantidadInvestigadoresActuales: investigadores.filter(
          (i) => i.actual && i.estadoInvestigador === 'ASIGNADO'
        ).length,
        cantidadPersonasInvestigadas: personasInvestigadas.length,
        cantidadBienesSujetosPd: bienesSujetosPd.length,
        cantidadSentencias: sentencias.length,
        cantidadEmpresas: empresas.length,
        cantidadActuaciones: actuaciones.length,
        cantidadRegistrosBienes: bienes.length,
        cantidadCasosPrecedentes: casosPrecedentes.length,
        cantidadOperativosPrecedentes: operativosSiii.length,
      },
    }
  }

  private fecha(valor: Date | string | null | undefined): string {
    if (!valor) return 'No registrado'
    const fecha = new Date(valor)
    if (Number.isNaN(fecha.getTime())) return 'No registrado'
    return new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(fecha)
  }

  private monto(valor: number | string | null | undefined): string {
    if (valor == null || valor === '') return 'No registrado'
    const numero = Number(valor)
    return Number.isFinite(numero)
      ? new Intl.NumberFormat('es-BO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numero)
      : 'No registrado'
  }

  private fechaCivil(valor: string | null): string {
    if (!valor) return 'No registrada'
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor)
    return match ? `${match[3]}/${match[2]}/${match[1]}` : this.fecha(valor)
  }

  private mapaUrl(
    latitud: string | null,
    longitud: string | null
  ): string | null {
    if (!latitud?.trim() || !longitud?.trim()) return null
    const lat = Number(latitud),
      lon = Number(longitud)
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      Math.abs(lat) > 90 ||
      Math.abs(lon) > 180
    )
      return null
    return `https://www.google.com/maps?q=${lat},${lon}`
  }

  private imagenSrc(imagen: Buffer | null): string | null {
    if (!imagen?.length) return null
    // Reconoce imágenes binarias; no asume que todo bytea sea JPEG.
    let mime: string | null = null
    if (
      imagen
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      mime = 'image/png'
    else if (imagen[0] === 255 && imagen[1] === 216 && imagen[2] === 255)
      mime = 'image/jpeg'
    else if (
      ['GIF87a', 'GIF89a'].includes(imagen.subarray(0, 6).toString('ascii'))
    )
      mime = 'image/gif'
    else if (
      imagen.subarray(0, 4).toString('ascii') === 'RIFF' &&
      imagen.subarray(8, 12).toString('ascii') === 'WEBP'
    )
      mime = 'image/webp'
    return mime ? `data:${mime};base64,${imagen.toString('base64')}` : null
  }
}
