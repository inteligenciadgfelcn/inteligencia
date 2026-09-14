import { Injectable } from '@nestjs/common'

import { ExportService } from '../../export/export.service'

import { PDF_A3_HORIZONTAL } from '../../export/pdf/pdf-options'

import { FiltrosVariablesCruzadasDto } from '../dto/filtros-variables-cruzadas.dto'

import { VariablesCruzadasService } from './variables-cruzadas.service'

@Injectable()
export class VariablesCruzadasExportService {
  constructor(
    private readonly variablesCruzadasService: VariablesCruzadasService,

    private readonly exportService: ExportService
  ) {}

  /*
   * =====================================================
   * EXPORTAR MICROSOFT EXCEL
   * =====================================================
   */

  async generarExcel(filtros: FiltrosVariablesCruzadasDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)

    const datosPlanos = this.prepararFilasPlanas(filas)

    return this.exportService.generateExcel('Variables cruzadas', datosPlanos)
  }

  /*
   * =====================================================
   * EXPORTAR CSV
   * =====================================================
   */

  async generarCsv(filtros: FiltrosVariablesCruzadasDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)

    const datosPlanos = this.prepararFilasPlanas(filas)

    return this.exportService.generateCSV(datosPlanos)
  }

  /*
   * =====================================================
   * EXPORTAR JSON
   * =====================================================
   */

  async generarJson(filtros: FiltrosVariablesCruzadasDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)

    return this.exportService.generateJSON({
      titulo: 'Reporte de variables cruzadas',

      fechaGeneracion: this.obtenerFechaGeneracion(),

      filtros: filtros ?? {},

      resumen: this.crearResumen(filas),

      /*
       * En JSON conservamos la estructura completa,
       * incluyendo datos_sii.
       */
      filas,
    })
  }

  /*
   * =====================================================
   * EXPORTAR PDF
   * =====================================================
   */

  async generarPdf(filtros: FiltrosVariablesCruzadasDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)

    const datosPdf = this.prepararDatosPdf(filas, filtros)

    return this.exportService.generatePDF(
      'variables-cruzadas',
      datosPdf,
      PDF_A3_HORIZONTAL
    )
  }

  /*
   * =====================================================
   * OBTENER TODOS LOS REGISTROS
   * =====================================================
   */

  private async obtenerFilas(
    filtros: FiltrosVariablesCruzadasDto
  ): Promise<any[]> {
    return this.variablesCruzadasService.obtenerTodosParaExportar(filtros ?? {})
  }

  /*
   * =====================================================
   * PREPARAR EXCEL Y CSV
   * =====================================================
   *
   * Excel y CSV necesitan objetos planos.
   * Si enviáramos datos_sii directamente, podría aparecer
   * [object Object] dentro de una celda.
   */

  private prepararFilasPlanas(filas: any[]): any[] {
    return filas.map((fila, indice) => ({
      Nro: indice + 1,

      NumeroCaso: fila.numero_caso ?? '',

      NombreCaso: fila.nombre_caso ?? '',

      CUD: fila.cud ?? '',

      IdCaso: fila.id_caso ?? '',

      IdOperativo: fila.id_operativo ?? '',

      NumeroOperativo: fila.numero_operativo_asignacion ?? '',

      FechaOperativo: fila.fecha_operativo ?? '',

      Lugar: fila.lugar ?? '',

      Departamento: fila.id_departamento_operativo ?? '',

      Distrito: fila.id_distrital_operativo ?? '',

      Grupo: fila.id_grupo_operativo ?? '',

      Unidad: fila.id_unidad ?? '',

      IdPersonaAuxiliar: fila.id_persona_auxiliar ?? '',

      Nombres: fila.nombres_auxiliar ?? '',

      ApellidoPaterno: fila.apellido_paterno_auxiliar ?? '',

      ApellidoMaterno: fila.apellido_materno_auxiliar ?? '',

      ApellidoEsposo: fila.apellido_esposo_auxiliar ?? '',

      Pais:
        fila.datos_sii?.pais ||
        fila.pais_auxiliar ||
        fila.id_pais_auxiliar ||
        '',

      Genero: fila.datos_sii?.genero || fila.genero_auxiliar || '',

      FechaNacimiento:
        fila.datos_sii?.fecha_nacimiento ||
        fila.fecha_nacimiento_auxiliar ||
        '',

      Edad: fila.edad ?? '',

      DocumentoSIII: fila.documento_auxiliar ?? '',

      DocumentosSII: (fila.datos_sii?.documentos ?? []).join(', '),

      Direccion: fila.datos_sii?.direccion || fila.direccion_auxiliar || '',

      EstadoPersona: fila.estado_persona ?? '',

      FechaRegistroPersona: fila.fecha_registro_persona ?? '',

      Filiacion: fila.filiacion ?? '',

      Enviado: Number(fila.enviado) === 1 ? 'Sí' : 'No',

      IdDetenido: fila.id_detenido ?? '',

      EstadoCivilSII: fila.datos_sii?.estado_civil ?? '',

      EstaVivo: this.textoBooleano(fila.datos_sii?.esta_vivo),

      TieneTarjeta: this.textoBooleano(fila.datos_sii?.tiene_tarjeta),

      FechaIngresoSII: fila.datos_sii?.fecha_ingreso ?? '',

      CoincidenciaSII: fila.coincidencia_sii ?? '',

      OperativoPositivo: this.textoBooleano(fila.es_positivo),

      Aprehendido: this.textoBooleano(fila.es_aprehendido),

      Arrestado: this.textoBooleano(fila.es_arrestado),
    }))
  }

  /*
   * =====================================================
   * PREPARAR PDF
   * =====================================================
   */

  private prepararDatosPdf(
  filas: any[],
  filtros: FiltrosVariablesCruzadasDto
) {
  return {
    titulo:
      'REPORTE DE VARIABLES CRUZADAS',

    fechaGeneracion:
      this.obtenerFechaGeneracion(),

    filtros:
      filtros ?? {},

    resumen:
      this.crearResumen(filas),

    filas:
      filas.map(
        (fila, indice) => ({
          numero:
            indice + 1,

          numeroCaso:
            fila.numero_caso ?? '',

          nombreCaso:
            fila.nombre_caso ?? '',

          cud:
            fila.cud ?? '',

          /*
           * Faltaba enviar este campo al template.
           */
          numeroOperativo:
            this.obtenerOperativo(
              fila
            ),

          fechaOperativo:
            fila.fecha_operativo ?? '',

          lugar:
            fila.lugar ?? '',

          unidad:
            fila.abreviatura_unidad ||
            fila.id_unidad ||
            '',

          grupo:
            fila.id_grupo_operativo ??
            '',

          distrito:
            fila
              .id_distrital_operativo ??
            '',

          departamento:
            fila
              .id_departamento_operativo ??
            '',

          persona:
            this.construirNombre(
              fila
            ),

          genero:
            fila.datos_sii?.genero ||
            fila.genero_auxiliar ||
            '',

          fechaNacimiento:
            fila.datos_sii
              ?.fecha_nacimiento ||
            fila
              .fecha_nacimiento_auxiliar ||
            '',

          documento:
            fila.documento_auxiliar ??
            '',

          estado:
            fila.estado_persona ?? '',

          filiacion:
            fila.filiacion ?? '',

          idDetenido:
            fila.id_detenido ?? '',

          fechaIngresoSii:
            fila.datos_sii
              ?.fecha_ingreso ?? '',

          estadoCivil:
            fila.datos_sii
              ?.estado_civil ?? '',

          estaVivo:
            this.textoBooleano(
              fila.datos_sii
                ?.esta_vivo
            ),
        })
      ),
  }
}

private obtenerOperativo(
  fila: any
): string {
  const numeroOperativo =
    String(
      fila
        .numero_operativo_asignacion ??
      ''
    ).trim()

  const idOperativo =
    fila.id_operativo !== null &&
    fila.id_operativo !== undefined
      ? String(
          fila.id_operativo
        ).trim()
      : ''

  if (
    numeroOperativo &&
    idOperativo
  ) {
    return (
      `${numeroOperativo} ` +
      `(ID: ${idOperativo})`
    )
  }

  if (numeroOperativo) {
    return numeroOperativo
  }

  if (idOperativo) {
    return `ID: ${idOperativo}`
  }

  return ''
}

  /*
   * =====================================================
   * RESUMEN
   * =====================================================
   */

  private crearResumen(filas: any[]) {
    const filiados = filas.filter((fila) => Number(fila.enviado) === 1).length

    const sinFiliar = filas.filter((fila) => Number(fila.enviado) !== 1).length

    return {
      total: filas.length,

      filiados,

      sinFiliar,
    }
  }

  /*
   * =====================================================
   * MÉTODOS AUXILIARES
   * =====================================================
   */

  private construirNombre(fila: any): string {

    const nombres = fila.datos_sii?.nombres || fila.nombres_auxiliar

    const apellidoPaterno =
      fila.datos_sii?.apellido_paterno || fila.apellido_paterno_auxiliar

    const apellidoMaterno =
      fila.datos_sii?.apellido_materno || fila.apellido_materno_auxiliar

    const apellidoEsposo =
      fila.datos_sii?.apellido_esposo || fila.apellido_esposo_auxiliar

    return [nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo]
      .map((valor) => String(valor ?? '').trim())
      .filter(Boolean)
      .join(' ')
  }

  private textoBooleano(valor: unknown): string {
    if (
      valor === true ||
      valor === 1 ||
      valor === '1' ||
      valor === 'true' ||
      valor === 't'
    ) {
      return 'Sí'
    }

    if (
      valor === false ||
      valor === 0 ||
      valor === '0' ||
      valor === 'false' ||
      valor === 'f'
    ) {
      return 'No'
    }

    return ''
  }

  private obtenerFechaGeneracion(): string {
    return new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',

      day: '2-digit',

      month: '2-digit',

      year: 'numeric',

      hour: '2-digit',

      minute: '2-digit',

      second: '2-digit',

      hourCycle: 'h23',
    }).format(new Date())
  }
}
