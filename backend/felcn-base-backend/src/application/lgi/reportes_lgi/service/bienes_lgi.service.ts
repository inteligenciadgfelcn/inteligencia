import { Injectable, NotFoundException } from '@nestjs/common'
import { BienesLgiReporteRepository } from '../repository/bienes-lgi.repository'

@Injectable()
export class BienesLgiService {
  constructor(
    private readonly bienesRepository: BienesLgiReporteRepository,
  ) {}

  async GenerarPDFBienes(idBien: number) {
    if (!idBien) {
      throw new NotFoundException(
        'No se proporcionó el identificador del bien',
      )
    }

    return {
      /*
       * DATOS DEL REPORTE
       */
      reporte: {
        numero: '011',
        gestion: '2025',
        divisionRegional: 'GIAEF Oriente',
      },

      /*
       * DATOS DEL CASO
       * Se muestran en la columna izquierda.
       */
      accion: {
        nombreCaso: 'SILVESTRE',

        fechaInicio: '16/01/2024',

        numeroCasoFiscalia: '801102012400084',

        numeroCasoGiaef: 'BN-X-01/24',

        etapa: 'Preparatoria',

        investigacionFinancieraParalela: 'No',

        formaInicio: 'Ministerio Público',

        lugarInvestigacion:
          'Municipio de Trinidad, Provincia Cercado - Beni',

        investigadores: [
          'Sgto. My. Milton Mita Guaigua',
          'Sgto. 2do. Jasmín F. Molle Callisaya',
        ],

        fiscalAsignado:
          'Abg. Oscar M. Vargas Suarez',

        controlJurisdiccional:
          'Juzgado de Instrucción Anticorrupción y Violencia hacia la Mujer 2do. - Trinidad',
      },

      /*
       * PERSONAS INVESTIGADAS
       */
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

      /*
       * DELITO PRECEDENTE
       */
      delitoPrecedente: {
        numeroCaso: 'BN-X-32/2021',

        fecha: '19/06/2021',

        unidad: 'GIOE-AMAZONIA',

        lugar:
          'Municipio de Ixiamas, provincia Abel Iturralde del departamento de La Paz',

        aprehendidos:
          'Sin aprehendidos',

        ampliados: [
          'Yaser Andrés Vásquez Cardona',
          'Limbert Alexander Chávez',
        ],

        secuestros:
          'Total de 298 kilos con 980 gramos de clorhidrato de cocaína y 1.500 litros de av-gas',
      },

      /*
       * BIEN SELECCIONADO
       *
       * Este objeto reemplaza a:
       * novedad
       * bienesAfectados
       */
      bien: {
        idBien,

        numero: idBien,

        tipoBien: 'VEHÍCULO',

        fechaRegistro: '08/05/2025',

        valorEstimado:
          '$ 15.000,00',

        valorLiteral:
          'Quince mil dólares americanos 00/100',

        descripcion:
          'Vehículo automotor secuestrado dentro del proceso de investigación por Legitimación de Ganancias Ilícitas.',

        /*
         * Datos específicos del bien.
         *
         * Los que no existan pueden enviarse como null.
         * El template solamente mostrará los que tengan valor.
         */
        clase: 'Camioneta',

        tipo: 'Grandtiger',

        marca: 'ZX AUTO',

        modelo: null,

        color: 'Blanco',

        placa: '3018-NLS',

        chasis:
          'LTA12H2P5D2000143',

        motor: null,

        ubicacion:
          'Municipio de Trinidad, Provincia Cercado - Beni',

        superficie: null,
      },

      /*
       * HISTORIAL / SITUACIÓN JURÍDICA DEL BIEN
       */
      situacionesLegales: [
        {
          situacion:
            'SECUESTRADO',

          fecha:
            '16/01/2024',

          detalle:
            'Bien secuestrado dentro del proceso de investigación.',

          autoridad:
            'Ministerio Público',

          responsable:
            null,

          institucion:
            'FELCN',
        },

        {
          situacion:
            'ENTREGADO A DIRCABI',

          fecha:
            '08/05/2025',

          detalle:
            'Se procedió a la entrega del bien para su administración.',

          autoridad:
            null,

          responsable:
            'Lic. Marco Antonio Justiniano Saucedo',

          institucion:
            'DIRCABI BENI',
        },
      ],

      /*
       * FOTOGRAFÍAS DEL BIEN
       *
       * Después reemplazaremos estos valores por las
       * fotografías reales almacenadas en la BD.
       */
      fotografias: [
        {
          numero: 1,
          imagen:
            'data:image/jpeg;base64,...',
        },
        {
          numero: 2,
          imagen:
            'data:image/jpeg;base64,...',
        },
        {
          numero: 3,
          imagen:
            'data:image/jpeg;base64,...',
        },
      ],
    }
  }
}