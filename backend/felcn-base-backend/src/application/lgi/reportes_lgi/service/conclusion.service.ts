import { Injectable, NotFoundException } from '@nestjs/common'
import { BienesLgiReporteRepository } from '../repository/bienes-lgi.repository'

@Injectable()
export class ConclusionCasoService {
  constructor(
    private readonly bienesRepository: BienesLgiReporteRepository,
  ) {}

   async GenerarPDFCaso(
    idCaso: number,
  ) {

    /*
     * ============================================
     * VALIDACIÓN
     * ============================================
     */

    if (!idCaso) {

      throw new NotFoundException(
        'No se proporcionó el identificador del caso',
      )

    }


    /*
     * ============================================
     * REPORTE
     * ============================================
     */

    const reporte = {

      numero:
        '001',

      gestion:
        '2026',

      divisionRegional:
        'GIAEF Oriente',

    }


    /*
     * ============================================
     * DATOS DEL CASO
     * ============================================
     */

    const caso = {

      idCaso,

      nombreCaso:
        'MITSUBISHI',

      fechaInicio:
        '10/01/2026',

      numeroCasoFiscalia:
        '401502012402451',

      numeroCasoGiaef:
        'LP-LGI-23/26',

      investigadores: [

        'Sof. 1ro. Rafael Escalante Perales',

        'Cap. Maximiliano Paredez Velasco',

        'Sgto. My. Gregorio Pérez Rellano',

      ],

      fiscalAsignado:
        'Abg. Cristian B. Valerio Berdeja',

      formaInicio:
        'Ministerio Público',

      lugarInvestigacion:
        'Municipio de Sacaba, Provincia Quillacollo - Cochabamba',

      controlJurisdiccional:
        'Juzgado de Instrucción en lo Penal Anticorrupción 2 de Cochabamba Capital',

      etapa:
        'Preliminar',

      investigacionFinancieraParalela:
        'No',

    }


    /*
     * ============================================
     * PERSONAS INVESTIGADAS
     * ============================================
     */

    const personasInvestigadas = [

      {
        numero: 1,

        nombre:
          'Maximiliano Paredez Velasco',

        documento:
          'CI: 12345678',
      },

      {
        numero: 2,

        nombre:
          'Rafael Escalante Perales',

        documento:
          'CI: 12345678',
      },

      {
        numero: 3,

        nombre:
          'Gregorio Pérez Rellano',

        documento:
          'CI: 12345678',
      },

    ]


    /*
     * ============================================
     * DELITO PRECEDENTE
     * ============================================
     */

    const delitoPrecedente = {

      numeroCaso:
        'CB-P-25/2025',

      fecha:
        '12/04/2024',

      unidad:
        'DDFELCN Cochabamba',

      lugar:
        'Zona de Coña, inmediaciones de la calle Copérnico y Av. Melgarejo - Cochabamba',

      aprehendidos:
        'Maximiliano Paredez Velasco, Rafael Escalante Perales y Gregorio Pérez Rellano',

      secuestros:
        '185 kilos con 650 gramos de clorhidrato de cocaína, 10 kilos con 100 gramos de marihuana, un vehículo, teléfonos celulares, arma de fuego y proyectiles calibre 46.',

    }


    /*
     * ============================================
     * CONCLUSIÓN DEL CASO
     * ============================================
     */

    const conclusion = {

      tipoConclusion:
        'CONCLUSIÓN DE INVESTIGACIÓN',

      numero:
        '001/2026',

      fecha:
        '16/09/2026',

      afectacionEstimadaNumero:
        '$ 1.952.258',

      afectacionEstimadaLiteral:
        'Un millón novecientos cincuenta y dos mil doscientos cincuenta y ocho dólares 00/100',

      descripcion:
        `Concluidas las actividades investigativas desarrolladas dentro del caso, se procedió a la evaluación integral de los antecedentes, actuaciones realizadas, personas investigadas y bienes identificados durante el proceso.

Como resultado de las actuaciones desarrolladas, se consolidó la información obtenida durante la investigación, estableciéndose los resultados finales correspondientes al caso.`,

      resultadoFinal:
        'Caso concluido conforme a las actuaciones investigativas desarrolladas y antecedentes registrados.',

    }


    /*
     * ============================================
     * BIENES AFECTADOS
     * ============================================
     */

    const bienesAfectados = [

      {
        numero: 1,

        descripcion:
          'Inmueble',

        valor:
          '$ 230.000',
      },

      {
        numero: 2,

        descripcion:
          'Inmueble',

        valor:
          '$ 150.000',
      },

      {
        numero: 3,

        descripcion:
          'Vehículo ABC-1234',

        valor:
          '$ 25.000',
      },

      {
        numero: 4,

        descripcion:
          'Motocicleta ABC-5678',

        valor:
          '$ 8.000',
      },

      {
        numero: 5,

        descripcion:
          'Avioneta CP-12345',

        valor:
          '$ 1.000.000',
      },

      {
        numero: 6,

        descripcion:
          'Terreno',

        valor:
          '$ 45.000',
      },

    ]


    /*
     * ============================================
     * FOTOGRAFÍAS
     * ============================================
     *
     * Luego reemplazaremos null por las imágenes
     * reales recuperadas desde la BD.
     */

    const fotografias = [

      {
        numero: 1,
        imagen: null,
      },

      {
        numero: 2,
        imagen: null,
      },

      {
        numero: 3,
        imagen: null,
      },

      {
        numero: 4,
        imagen: null,
      },

      {
        numero: 5,
        imagen: null,
      },

      {
        numero: 6,
        imagen: null,
      },

    ]


    /*
     * ============================================
     * DATA FINAL PARA HANDLEBARS
     * ============================================
     */

    return {

      reporte,

      caso,

      personasInvestigadas,

      delitoPrecedente,

      conclusion,

      bienesAfectados,

      fotografias,

    }

  }

}