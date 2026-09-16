import { Injectable, NotFoundException } from '@nestjs/common'
import { formatearFechaVisualizacionBolivia } from '@/common/utils/date.util'
import { ActuacionReporteRepository } from '../repository/actuacion.repository'

@Injectable()
export class ActuacionLgiService {
  constructor(
    private readonly actuacionRepository: ActuacionReporteRepository
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

    const { datosPrincipales, bienes, personasAfectadas } = resultado

    const montoTotal = bienes.reduce(
      (total, bien) => total + Number(bien.costoCuant ?? bien.costoAprox ?? 0),
      0
    )

    const fotografias = bienes
      .flatMap((bien) => bien.fotografias ?? [])
      .map((fotografia, index) => ({
        numero: index + 1,

        descripcion: fotografia.descripcion ?? 'Sin descripción',

        imagen: this.convertirFotografia(fotografia.fotografia),
      }))

    return {
      reporte: {
        numero: datosPrincipales.numeroActuacion ?? 'Sin especificar',

        gestion: datosPrincipales.fechaInforme
          ? new Date(datosPrincipales.fechaInforme).getFullYear().toString()
          : 'Sin especificar',

        divisionRegional:
          datosPrincipales.divisionRegional ??
          datosPrincipales.unidadAbreviada ??
          'Sin especificar',
      },

      accion: {
        tipo: datosPrincipales.tipoAccion ?? 'Sin especificar',

        nombreCaso: datosPrincipales.nombreCaso ?? 'Sin especificar',

        fechaInicio: this.formatearFechaReporte(datosPrincipales.fechaInicio),

        numeroCasoFiscalia:
          datosPrincipales.numeroCasoFiscalia ??
          datosPrincipales.cudIfp ??
          'Sin especificar',

        numeroCasoGiaef:
          datosPrincipales.numeroCasoGiaef ??
          datosPrincipales.numeroCaso ??
          'Sin especificar',

        productoInstrumento: 'Sin especificar',

        etapa: datosPrincipales.idEtapa
          ? String(datosPrincipales.etapaDescripcion)
          : 'Sin especificar',

        formaInicio: 'Sin especificar',

        lugarInvestigacion:
          datosPrincipales.lugarInvestigacion ?? 'Sin especificar',

        investigadorPrincipal:
          datosPrincipales.investigadorPrincipal ?? 'Sin especificar',

        fiscalAsignado: datosPrincipales.fiscalAsignado ?? 'Sin especificar',
      },

      novedad: {
        tipo: datosPrincipales.otroInforme ?? 'Sin especificar',

        numero: this.formatearNumeroActuacion(
          datosPrincipales.numeroActuacion,
          datosPrincipales.gestionActuacion
        ),

        fecha: this.formatearFechaReporte(datosPrincipales.fechaInforme),

        afectacionEstimadaNumero: this.formatearMoneda(montoTotal),

        afectacionEstimadaLiteral: 'Pendiente de conversión literal',

        sintesis: datosPrincipales.sintesis ?? 'Sin descripción',
      },

      personasAfectadas: personasAfectadas.map((persona, index) => ({
        numero: index + 1,

        nombre: this.construirNombreCompleto(persona),

        documento: persona.numeroDocumento?.trim() || 'Sin documento',

        relacion: persona.relacion?.trim() || 'Sin especificar',
      })),

      delitoPrecedente: {
        numeroCaso: datosPrincipales.numeroCaso ?? 'Sin especificar',

        fecha: this.formatearFechaReporte(datosPrincipales.fechaInicio),

        unidad: datosPrincipales.unidadAbreviada ?? 'Sin especificar',

        lugar: datosPrincipales.lugarInvestigacion ?? 'Sin especificar',

        aprehendidos: [],

        inmuebleSecuestrado: 'Sin especificar',

        dineroSecuestrado: [],

        vehiculosSecuestrados: [],

        mediosComunicacion: [],

        armamentoSecuestrado: 'Sin especificar',

        sustanciasSecuestradas: 'Sin especificar',
      },

      bienesAfectados: {
        inmuebles: [],

        muebles: bienes.map((bien) => ({
          id: bien.itembiensecId,

          descripcion:
            bien.categoriaTipo?.descripcion ?? 'Bien sin descripción',

          cantidad: bien.cantidadBien ?? 1,

          valor: this.formatearMoneda(
            Number(bien.costoCuant ?? bien.costoAprox ?? 0)
          ),

          costoAproximado: Number(bien.costoAprox ?? 0),

          costoCuantificado: Number(bien.costoCuant ?? 0),

          caracteristicas: bien.caracteristicas ?? [],
        })),

        dinero: [],
      },

      fotografias,

      conclusiones: {
        tipologiasIdentificadas:
          datosPrincipales.tipologiasIdentificadas ?? 'Sin especificar',

        verbosRectores: datosPrincipales.verbosRectores ?? 'Sin especificar',

        etapasCicloLgi: datosPrincipales.etapasCicloLgi ?? 'Sin especificar',
      },
    }
  }

  private formatearNumeroActuacion(
    numero: number | string | null | undefined,
    gestion: number | string | null | undefined
  ): string {
    const correlativo = Number(numero)
    const anio = Number(gestion)

    if (
      !Number.isInteger(correlativo) ||
      correlativo <= 0 ||
      !Number.isInteger(anio) ||
      anio <= 0
    ) {
      return 'Sin especificar'
    }

    return `${correlativo.toString().padStart(2, '0')}/${anio}`
  }

  private construirNombreCompleto(persona: {
    nombres?: string | null
    paterno?: string | null
    materno?: string | null
    esposo?: string | null
  }): string {
    const nombreCompleto = [
      persona.nombres,
      persona.paterno,
      persona.materno,
      persona.esposo,
    ]
      .map((valor) => valor?.trim())
      .filter((valor): valor is string => Boolean(valor))
      .join(' ')

    return nombreCompleto || 'Sin especificar'
  }

  private convertirFotografia(fotografia?: Buffer | null): string {
    if (!fotografia?.length) {
      return ''
    }

    return `data:image/jpeg;base64,${fotografia.toString('base64')}`
  }

  private formatearFechaReporte(
    fecha: Date | string | null | undefined
  ): string {
    if (!fecha) {
      return 'Sin especificar'
    }

    const resultado = formatearFechaVisualizacionBolivia(fecha)

    return resultado === 'N/A' ? 'Sin especificar' : resultado
  }

  private formatearMoneda(valor: number): string {
    const monto = Number.isFinite(valor) ? valor : 0

    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(monto)
  }

  async GenerarPDFGiaef(id: number) {
    if (!id) {
      throw new NotFoundException(
        'No se proporcionó el identificador del reporte'
      )
    }

    return {
      reporte: {
        numero: '32',

        gestion: '2026',

        divisionRegional: 'GIAEF Oriente',
      },

      accion: {
        tipo: 'Acción de Pérdida de Dominio',

        nombreCaso: 'ODISEA',

        fechaInicio: '22/07/2026',

        numeroCasoFiscalia: '701102012605679',

        numeroCasoGiaef: 'SC-PP-03/26',

        productoInstrumento: 'Producto',

        etapa: 'Pre-Procesal',

        formaInicio: 'De oficio',

        lugarInvestigacion: 'Santa Cruz de la Sierra',

        investigadores: [
          'Sgto. My. Roddy Choque Quispe',
          'Sgto. 2do. Jasmín F. Molle Callisaya',
        ],

        fiscalAsignado: 'Abg. Saktty Vargas Camachano',

        controlJurisdiccional: 'Juzgado Especializado en Pérdida de Dominio',
      },

      novedad: {
        tipo: 'Apertura',

        numero: '001/2026',

        fecha: '26/08/2026',

        afectacionEstimadaNumero: '$ 345.298,18',

        afectacionEstimadaLiteral:
          'Trescientos cuarenta y cinco mil doscientos noventa y ocho 18/100 dólares',

        sintesis: `En fecha 10 de mayo de 2026, a horas 07:10 a.m.,
      personal del GIOE-ORIENTE ejecutó un mandamiento de
      allanamiento en la “Quinta La Odisea”, ubicada en la
      localidad de Jorochito, municipio de El Torno, provincia
      Andrés Ibáñez.

      Durante el registro de los cuatro bloques del inmueble se
      secuestraron 722 gramos de marihuana, armas de fuego con
      munición y cargadores, teléfonos celulares, indumentaria
      policial, dinero, vehículos y motocicletas.

      Se procedió a la aprehensión de las personas involucradas
      y al secuestro de las evidencias, sustancias, armas,
      dinero, vehículos y del inmueble.`,
      },

      personasAfectadas: [
        {
          numero: 1,

          nombre: 'Por determinar',
        },
      ],

      delitoPrecedente: {
        numeroCaso: 'SC-D-06/2026',

        fecha: '10/05/2026',

        unidad: 'GIOE-ORIENTE',

        lugar: 'Santa Cruz de la Sierra',

        aprehendidos: [
          'Felipe Anderson Pinto Da Sousa',
          'Lucas Da Silva Cardoso',
          'Gustavo Adolfo Flores Paz',
          'Anyel Desiderio Flores Paz',
        ],

        inmuebleSecuestrado: `Propiedad rural ubicada en la localidad de Jorochito,
      municipio de El Torno, distrito IV, denominada
      QUINTA LA ODISEA.`,

        dineroSecuestrado: [
          '150.000 dólares estadounidenses',
          '3.400 bolivianos',
        ],

        vehiculosSecuestrados: ['1 vehículo', '2 motocicletas'],

        mediosComunicacion: ['25 teléfonos celulares'],

        armamentoSecuestrado: `Total de 19 armas de fuego, entre fusiles, pistolas
      y un rifle de aire comprimido, munición, cargadores
      y chalecos antibalas.`,

        sustanciasSecuestradas: `722 gramos de marihuana y 824 gramos de clorhidrato
      de cocaína, realizándose además la extracción de
      muestras para peritaje.`,
      },

      bienesAfectados: {
        inmuebles: [
          {
            descripcion: 'Inmueble',

            valor: '$ 150.000',
          },
        ],

        muebles: [
          {
            descripcion: 'Vehículo',

            valor: '$ 35.000',
          },
          {
            descripcion: 'Motocicleta',

            valor: '$ 7.000',
          },
          {
            descripcion: 'Motocicleta',

            valor: '$ 3.000',
          },
        ],

        dinero: [
          {
            descripcion: 'Dólares estadounidenses',

            valor: '$ 150.000',
          },
          {
            descripcion: 'Bolivianos',

            valor: 'Bs 3.450 (convertido en $ 298,18)',
          },
        ],
      },

      fotografias: [
        {
          numero: 1,

          imagen: '',
        },
        {
          numero: 2,

          imagen: '',
        },
        {
          numero: 3,

          imagen: '',
        },
        {
          numero: 4,

          imagen: '',
        },
      ],
    }
  }

  async GenerarPDFBienes(id: number) {
    if (!id) {
      throw new NotFoundException(
        'No se proporcionó el identificador del reporte'
      )
    }

    return {
      reporte: {
        numero: '011',
        gestion: '2025',
        divisionRegional: 'GIAEF Oriente',
      },

      accion: {
        tipo: 'Legitimación de Ganancias Ilícitas',

        nombreCaso: 'SILVESTRE',

        fechaInicio: '16/01/2024',

        numeroCasoFiscalia: '801102012400084',

        numeroCasoGiaef: 'BN-X-01/24',

        etapa: 'Preparatoria',

        investigacionFinancieraParalela: 'No',

        formaInicio: 'Ministerio Público',

        lugarInvestigacion: 'Municipio de Trinidad, Provincia Cercado - Beni',

        investigadores: [
          'Sgto. My. Milton Mita Guaigua',
          'Sgto. 2do. Jasmín F. Molle Callisaya',
        ],

        fiscalAsignado: 'Abg. Oscar M. Vargas Suarez',

        controlJurisdiccional:
          'Juzgado de Instrucción Anticorrupción y Violencia hacia la Mujer 2do. - Trinidad',
      },

      novedad: {
        tipo: 'Entrega de bienes a DIRCABI',

        numero: '004/2025',

        fecha: '08/05/2025',

        afectacionEstimadaNumero: '$ 150.000,00',

        afectacionEstimadaLiteral:
          'Ciento cincuenta mil dólares americanos 00/100',

        sintesis:
          'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains',
      },

      personasInvestigadas: [
        {
          numero: 1,
          nombre: 'Yaser Andrés Vásquez Cardona',
          documento: 'CI: 10784111',
        },
        {
          numero: 2,
          nombre: 'Raquel Álvarez Velásquez',
          documento: 'CI: 5596889',
        },
        {
          numero: 3,
          nombre: 'Alondra Mercado Campos',
          documento: 'CI: 5604681',
        },
      ],

      delitoPrecedente: {
        numeroCaso: 'BN-X-32/2021',

        fecha: '19/06/2021',

        unidad: 'GIOE-AMAZONIA',

        lugar:
          'Municipio de Ixiamas, provincia Abel Iturralde del departamento de La Paz',

        aprehendidos: 'Sin aprehendidos',

        ampliados: ['Yaser Andrés Vásquez Cardona', 'Limbert Alexander Chávez'],

        secuestros:
          'Total de 298 kilos con 980 gramos de clorhidrato de cocaína y 1.500 litros de av-gas',
      },

      bienesAfectados: [
        {
          numero: 1,
          descripcion: 'Inmueble',
          valor: '$ 55.000,00',
        },
        {
          numero: 2,
          descripcion: 'Inmueble',
          valor: '$ 80.000,00',
        },
        {
          numero: 3,
          descripcion: 'Vehículo',
          valor: '$ 15.000,00',
        },
      ],

      fotografias: [
        {
          numero: 1,
          imagen: 'data:image/jpeg;base64,...',
        },
        {
          numero: 2,
          imagen: 'data:image/jpeg;base64,...',
        },
        {
          numero: 3,
          imagen: 'data:image/jpeg;base64,...',
        },
      ],
    }
  }
}
