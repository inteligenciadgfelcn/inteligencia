import { ConsultaSiiiRepository } from "@/application/lgi/informacion_siii/repository/consulta.repository"
import { formatearMoneda, convertirFotografia, formatearFechaReporte, formatearNumeroActuacion, convertirMontoLiteral, construirNombreCompleto } from "@/common/utils/reporte.util"
import { Injectable, NotFoundException } from "@nestjs/common"
import { ActuacionReporteRepository } from "../repository/actuacion.repository"


@Injectable()
export class ActuacionLgiService {
  constructor(
    private readonly actuacionRepository: ActuacionReporteRepository,
    private readonly consultaSiiiRepository: ConsultaSiiiRepository
  ) {}

  async GenerarPDFActuacion(opId: number) {
    if (!opId) {
      throw new NotFoundException(
        'No se proporcionó el identificador del reporte'
      )
    }

    const resultado =
      await this.actuacionRepository.obtenerReporteCompleto(opId)

    if (!resultado) {
      throw new NotFoundException(
        `No existe un operativo activo con ID ${opId}`
      )
    }

    const {
      datosPrincipales,
      datosCaso,
      etapaProcesal,
      responsables,
      bienes,
      personasAfectadas,
      empresas,
    } = resultado

    const numerosCasosPrecedentes =
      datosCaso.numerosCasosPrecedentes ?? []

    const operativosPrecedentes =
      await this.consultaSiiiRepository.buscarCasosPrecedentesParaReporte(
        numerosCasosPrecedentes
      )

    const delitosPrecedentes = operativosPrecedentes.map((operativo) => {
      const bienesRegistrados = (operativo.detalleBienes ?? []).map(
        (bien) => {
          const estados: string[] = []

          if (bien.enInvestigacion) {
            estados.push('En investigación')
          }

          if (bien.esSecuestrado) {
            estados.push('Secuestrado')
          }

          if (bien.esIncautado) {
            estados.push('Incautado')
          }

          if (bien.esConfiscado) {
            estados.push('Confiscado')
          }

          const caracteristicas = (bien.caracteristicas ?? [])
            .map((item) => item.descripcion?.trim())
            .filter(Boolean)
            .join(', ')

          return {
            id: bien.idItemBienSecuestrado,

            descripcion:
              bien.tipoBien?.trim() || 'Bien sin descripción',

            cantidad: bien.cantidad ?? 1,

            caracteristicas:
              caracteristicas || 'Sin características registradas',

            costoAproximado: formatearMoneda(
              Number(bien.costoAproximado ?? 0)
            ),

            costoCuantificado: formatearMoneda(
              Number(bien.costoCuantificado ?? 0)
            ),

            estadoJuridico:
              estados.join(', ') || 'Sin estado registrado',
          }
        }
      )

      const textoBienes = bienesRegistrados
        .map((bien) => {
          const caracteristicas =
            bien.caracteristicas === 'Sin características registradas'
              ? ''
              : `: ${bien.caracteristicas}`

          const estado =
            bien.estadoJuridico === 'Sin estado registrado'
              ? ''
              : ` (${bien.estadoJuridico.toLowerCase()})`

          return `${bien.cantidad} ${bien.descripcion}${caracteristicas}${estado}`
        })
        .join('; ')

      const resumenBienes = [
        operativo.resumenOtros?.trim(),
        textoBienes,
      ]
        .filter(Boolean)
        .join('; ')

      const secuestros = (operativo.detalleBienes ?? [])
        .filter((bien) => bien.esSecuestrado)
        .map((bien) => {
          const caracteristicas = (bien.caracteristicas ?? [])
            .map((item) => item.descripcion?.trim())
            .filter(Boolean)
            .join(', ')

          return [
            `${bien.cantidad ?? 1} ${bien.tipoBien ?? 'bien'}`,
            caracteristicas,
          ]
            .filter(Boolean)
            .join(': ')
        })
        .join('; ')

      return {
        numeroCaso:
          operativo.numeroCaso?.trim() || 'Sin especificar',

        nombreCaso:
          operativo.nombreCaso?.trim() || 'Sin especificar',

        numeroOperativo:
          operativo.numeroOperativo ?? 'Sin especificar',

        numeroInforme:
          operativo.numeroInforme ?? 'Sin especificar',

        idOperativo: operativo.idOperativo,

        fecha:
          operativo.fechaOperativo?.split(' ')[0] ||
          'Sin especificar',

        unidad:
          operativo.ubicacionInstitucional?.trim() ||
          'Sin especificar',

        lugar:
          operativo.ubicacionGeografica?.trim() ||
          'Sin especificar',

        aprehendidos:
          operativo.aprehendidos?.trim() ||
          'Sin personas registradas.',

        bienesRegistrados,

        resumenBienes: resumenBienes
          ? `${resumenBienes}.`
          : 'Sin bienes, drogas ni otros registros.',

        secuestros:
          secuestros || 'Sin secuestros registrados.',

        costoTotalAproximado: formatearMoneda(
          Number(operativo.costoTotalAproximadoBienes ?? 0)
        ),

        costoTotalCuantificado: formatearMoneda(
          Number(operativo.costoTotalCuantificadoBienes ?? 0)
        ),
      }
    })

    // Afectación estimada: aproximados de bienes y empresas LGI.
    const totalBienesAproximado = bienes.reduce(
      (total, bien) => total + Number(bien.costoAprox ?? 0),
      0
    )

    const totalEmpresasAproximado = empresas.reduce(
      (total, empresa) =>
        total + Number(empresa.capitalSocial?.trim() || 0),
      0
    )

    const montoTotal =
      totalBienesAproximado + totalEmpresasAproximado

    const fotografias = bienes
      .flatMap((bien) => bien.fotografias ?? [])
      .map((fotografia, index) => ({
        numero: index + 1,

        descripcion:
          fotografia.descripcion ?? 'Sin descripción',

        imagen: convertirFotografia(fotografia.fotografia),
      }))

    return {
      reporte: {
        numero:
          datosPrincipales.numeroActuacion ?? 'Sin especificar',

        gestion: datosPrincipales.fechaInforme
          ? new Date(datosPrincipales.fechaInforme)
              .getFullYear()
              .toString()
          : 'Sin especificar',

        divisionRegional:
          datosPrincipales.divisionRegional ??
          datosPrincipales.unidadAbreviada ??
          'Sin especificar',
      },

      accion: {
        tipo: 'Legitimación de Ganancias Ilícitas',

        nombreCaso:
          datosCaso.nombreCaso?.trim() || 'Sin especificar',

        fechaInicio: formatearFechaReporte(datosCaso.fechaInicio),

        numeroCasoFiscalia:
          datosCaso.numeroCasoFiscalia?.trim() ||
          datosCaso.cudIfp?.trim() ||
          'Sin especificar',

        numeroCasoGiaef:
          datosCaso.numeroCasoGiaef?.trim() ||
          datosCaso.numeroCaso?.trim() ||
          'Sin especificar',

        productoInstrumento: 'Sin especificar',

        etapa:
          etapaProcesal.etapaDescripcion ?? 'Sin especificar',

        formaInicio:
          datosCaso.formaInicio?.trim() || 'Sin especificar',

        lugarInvestigacion:
          datosPrincipales.lugarInvestigacion ??
          'Sin especificar',

        investigadores: responsables.investigadores ?? [],

        fiscalAsignado:
          responsables.fiscalAsignado?.trim() ||
          'Sin especificar',

        controlJurisdiccional:
          responsables.controlJurisdiccional?.trim() ||
          'Sin especificar',

        cudIfp:
          datosCaso.cudIfp?.trim() || 'Sin especificar',
      },

      novedad: {
        tipo:
          datosPrincipales.tipoInformeDescripcion?.trim() ||
          datosPrincipales.otroInforme?.trim() ||
          'Sin especificar',

        numero: formatearNumeroActuacion(
          datosPrincipales.numeroActuacion,
          datosPrincipales.gestionActuacion
        ),

        fecha: formatearFechaReporte(
          datosPrincipales.fechaInforme
        ),

        afectacionEstimadaNumero: formatearMoneda(montoTotal),

        afectacionEstimadaLiteral:
          convertirMontoLiteral(montoTotal),

        sintesis:
          datosPrincipales.sintesis ?? 'Sin descripción',
      },

      personasAfectadas: personasAfectadas.map(
        (persona, index) => ({
          numero: index + 1,

          nombre: construirNombreCompleto(persona),

          documento:
            persona.numeroDocumento?.trim() || 'Sin documento',

          relacion:
            persona.relacion?.trim() || 'Sin especificar',
        })
      ),

      delitoPrecedente: delitosPrecedentes,

      bienesAfectados: {
        inmuebles: empresas.map((empresa) => ({
          id: empresa.id,

          descripcion:
            empresa.nombre?.trim() || 'Empresa sin nombre',

          valorAproximado: empresa.capitalSocial?.trim()
            ? formatearMoneda(Number(empresa.capitalSocial))
            : 'Sin especificar',
        })),

        muebles: bienes.map((bien) => ({
          id: bien.itembiensecId,

          descripcion:
            bien.categoriaTipo?.descripcion ??
            'Bien sin descripción',

          cantidad: bien.cantidadBien ?? 1,

          valorAproximado: formatearMoneda(
            Number(bien.costoAprox ?? 0)
          ),

          valorCuantiaPresuntamenteIlegal: formatearMoneda(
            Number(bien.costoCuant ?? 0)
          ),

          costoAproximado: Number(bien.costoAprox ?? 0),

          costoCuantificado: Number(bien.costoCuant ?? 0),

          caracteristicas: bien.caracteristicas ?? [],
        })),
      },

      fotografias
    }
  }
}