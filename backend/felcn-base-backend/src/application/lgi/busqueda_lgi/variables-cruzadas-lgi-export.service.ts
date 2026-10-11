import { Injectable } from '@nestjs/common'
import { BusquedaLgiService } from './busqueda_lgi.service'
import { FiltrosVariablesCruzadasLgiDto } from './dto/filtros-variables-cruzadas-lgi.dto'
import { ExportService } from '@/application/inteligencia/reportes/export/export.service'
import { PDF_A3_HORIZONTAL } from '@/application/inteligencia/reportes/export/pdf/pdf-options'
type FilaPlana = Record<string, string | number | boolean>

type Registro = Record<string, any>

@Injectable()
export class VariablesCruzadasLgiExportService {
  constructor(
    private readonly busquedaLgiService: BusquedaLgiService,
    private readonly exportService: ExportService
  ) {}

  async generarExcel(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const casos = await this.obtenerFilas(filtros ?? {})
    const datos = this.prepararExcelConsolidado(casos)
    return this.exportService.generateExcel('Reporte LGI', datos)
  }
  private prepararExcelConsolidado(
    casos: Record<string, any>[]
  ): Record<string, any>[] {
    return casos.map((caso, indice) => {
      const actuaciones = caso.actuaciones ?? []

      const bienes = actuaciones.flatMap((actuacion: Record<string, any>) =>
        (actuacion.bienes ?? []).map((bien: Record<string, any>) => ({
          ...bien,
          numeroActuacion: actuacion.numeroActuacion ?? actuacion.opId,
        }))
      )

      const empresas = actuaciones.flatMap((actuacion: Record<string, any>) =>
        (actuacion.empresas ?? []).map((empresa: Record<string, any>) => ({
          ...empresa,
          numeroActuacion: actuacion.numeroActuacion ?? actuacion.opId,
        }))
      )

      return {
        Nro: indice + 1,
        'ID caso': caso.casosId,
        'Caso GIAEF': caso.numeroCasoGiaef ?? '',
        'Nombre del caso': caso.nombreCaso ?? '',
        CUD: caso.cud ?? '',
        'Caso Fiscalía': caso.numeroCasoFiscalia ?? '',
        'Fecha inicio': this.fecha(caso.fechaInicio),
        Departamento: caso.departamentoCodigo ?? '',
        Unidad: caso.unidad ?? caso.unidadAbreviada ?? '',
        Distrital: caso.distrital ?? '',
        Grupo: caso.grupo ?? '',
        'Etapa investigación': caso.etapaInvestigacion ?? '',
        'Estado procesal': caso.estadoProcesal ?? '',

        Personas: (caso.personasInvestigadas ?? [])
          .map((persona: Record<string, any>) =>
            [
              persona.nombreCompleto ?? '',
              `Documento: ${persona.numeroDocumento ?? ''}`,
              `Relación: ${persona.relacion ?? ''}`,
              `Situación: ${
                persona.situacionJuridicaActual ?? 'Sin situación registrada'
              }`,
              // `Observaciones: ${persona.observaciones ?? ''}`,
            ].join('\n')
          )
          .join('\n\n'),

        Actuaciones: actuaciones
          .map((actuacion: Record<string, any>) =>
            [
              `Actuación: ${actuacion.numeroActuacion ?? actuacion.opId}`,
              `Fecha: ${this.fecha(actuacion.fechaInforme)}`,
              `Tipo: ${actuacion.tipoInforme ?? ''}`,
              `Lugar: ${actuacion.lugar ?? ''}`,
              // `Descripción: ${actuacion.descripcion ?? ''}`,
            ].join('\n')
          )
          .join('\n\n'),

        Bienes: bienes
          .map((bien: Record<string, any>) =>
            [
              `Actuación: ${bien.numeroActuacion}`,
              `ID bien: ${bien.itemBienSecId}`,
              `Bien: ${bien.tipo ?? ''}`,
              `Categoría: ${bien.categoria ?? ''}`,
              `Clase: ${bien.clase ?? ''}`,
              `Características: ${(bien.caracteristicas ?? [])
                .map(
                  (caracteristica: Record<string, any>) =>
                    `${
                      caracteristica.caracteristica ??
                      caracteristica.caracteristicaId
                    }: ${caracteristica.valor ?? ''}`
                )
                .join('; ')}`,
              `Cantidad: ${bien.cantidad ?? 0}`,
              `Costo aproximado: ${this.textoMonto(bien.valorAproximado)}`,
              `Costo cuantificado: ${this.textoMonto(bien.valorCuantificado)}`,
              `Situación legal: ${
                bien.situacionLegalActual ?? 'Sin situación registrada'
              }`,
              `Situación jurídica: ${
                bien.situacionJuridicaActual ?? 'Sin situación registrada'
              }`,
              `Lugar de secuestro: ${bien.lugarSecuestro ?? ''}`,
              // `Resultado pericia: ${bien.resultadoPericia ?? ''}`,
            ].join('\n')
          )
          .join('\n\n'),

        'Registros de bienes': bienes.length,

        'Cantidad total de bienes': bienes.reduce(
          (total: number, bien: Record<string, any>) =>
            total + this.numeroMonto(bien.cantidad),
          0
        ),

        'Total aproximado bienes': this.sumarMontos(bienes, 'valorAproximado'),

        'Total cuantificado bienes': this.sumarMontos(
          bienes,
          'valorCuantificado'
        ),

        Empresas: empresas
          .map((empresa: Record<string, any>) =>
            [
              `Actuación: ${empresa.numeroActuacion}`,
              `ID empresa: ${empresa.empId}`,
              `Empresa: ${empresa.nombre ?? ''}`,
              `NIT: ${empresa.nit ?? ''}`,
              `Matrícula: ${empresa.matricula ?? ''}`,
              `Representante: ${empresa.representante ?? ''}`,
              `Dirección: ${empresa.direccion ?? ''}`,
              `Capital social: ${this.textoMonto(empresa.capitalSocial)}`,
              `Situación jurídica: ${
                empresa.situacionJuridicaActual ?? 'Sin situación registrada'
              }`,
              `Vínculo: ${empresa.vinculo ?? ''}`,
              // `Observaciones: ${empresa.observaciones ?? ''}`,
              // `Resultado pericia: ${empresa.resultadoPericia ?? ''}`,
            ].join('\n')
          )
          .join('\n\n'),

        'Registros de empresas': empresas.length,

        'Total capital social empresas': this.sumarMontos(
          empresas,
          'capitalSocial'
        ),
      }
    })
  }

  private numeroMonto(valor: unknown): number {
    if (valor === null || valor === undefined || valor === '') {
      return 0
    }

    // PostgreSQL devuelve numeric como texto con punto decimal.
    const numero = Number(valor)

    if (!Number.isFinite(numero)) {
      throw new Error(`Monto inválido recibido: ${String(valor)}`)
    }

    return numero
  }

  private sumarMontos(registros: Record<string, any>[], campo: string): number {
    // Acumula en centavos para evitar errores habituales de decimales.
    const centavos = registros.reduce(
      (total, registro) =>
        total + Math.round(this.numeroMonto(registro[campo]) * 100),
      0
    )

    if (!Number.isSafeInteger(centavos)) {
      throw new Error(
        'El total supera la precisión permitida para exportar como número'
      )
    }

    return centavos / 100
  }

  private textoMonto(valor: unknown): string {
    if (valor === null || valor === undefined || valor === '') {
      return 'Sin registrar'
    }

    return this.numeroMonto(valor).toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  private sinCampos(
    registro: Record<string, any>,
    excluir: string[]
  ): Record<string, any> {
    return Object.fromEntries(
      Object.entries(registro).filter(([campo]) => !excluir.includes(campo))
    )
  }

  async generarCsv(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)
    return this.exportService.generateCSV(this.prepararFilasPlanas(filas))
  }

  async generarJson(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)
    return this.exportService.generateJSON({
      titulo: 'Reporte de variables cruzadas LGI',
      fechaGeneracion: this.obtenerFechaGeneracion(),
      filtros: filtros ?? {},
      resumen: this.crearResumen(filas),
      // Estructura original: personas del caso y bienes/empresas de cada actuación.
      filas,
    })
  }

  async generarPdf(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const casos = await this.obtenerFilas(filtros ?? {})

    const datos = this.prepararDatosPdf(casos, filtros)

    return this.exportService.generatePDF(
      'variables-cruzadas-lgi',
      datos,
      PDF_A3_HORIZONTAL
    )
  }

  private obtenerFilas(
    filtros: FiltrosVariablesCruzadasLgiDto
  ): Promise<Registro[]> {
    return this.busquedaLgiService.obtenerTodosParaExportar(filtros ?? {})
  }

  private obtenerFechaGeneracion(): string {
    return new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      dateStyle: 'short',
      timeStyle: 'medium',
      hourCycle: 'h23',
    }).format(new Date())
  }

  private fecha(valor: unknown): string {
    if (valor === null || valor === undefined || valor === '') return ''
    // Fechas sin hora conservan su día: no se parsean como medianoche UTC.
    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor))
      return valor
    const date = valor instanceof Date ? valor : new Date(String(valor))
    if (Number.isNaN(date.getTime())) return String(valor)
    return new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      dateStyle: 'short',
      timeStyle: 'short',
      hourCycle: 'h23',
    }).format(date)
  }

  private crearResumen(casos: Registro[]): Registro {
    let personas = 0,
      actuaciones = 0,
      registrosBienes = 0,
      cantidadBienes = 0n,
      empresas = 0
    for (const caso of casos) {
      personas += (caso.personasInvestigadas ?? []).length
      for (const actuacion of caso.actuaciones ?? []) {
        actuaciones++
        registrosBienes += (actuacion.bienes ?? []).length
        empresas += (actuacion.empresas ?? []).length
        for (const bien of actuacion.bienes ?? [])
          cantidadBienes += BigInt(bien.cantidad ?? 0)
      }
    }
    return {
      casos: casos.length,
      personasRegistradas: personas,
      actuaciones,
      registrosBienes,
      cantidadBienes: cantidadBienes.toString(),
      empresasRegistradas: empresas,
    }
  }

  /** Una fila por registro, sin multiplicar personas × bienes × empresas. */
  private prepararFilasPlanas(casos: Registro[]): FilaPlana[] {
    const filas: FilaPlana[] = []
    for (const caso of casos) {
      const base: FilaPlana = {
        'Tipo registro': '',
        'ID registro': '',
        'ID caso': caso.casosId,
        'Caso GIAEF': caso.numeroCasoGiaef ?? '',
        'Nombre caso': caso.nombreCaso ?? '',
        'CUD / IFP': caso.cud ?? '',
        'Caso Fiscalía': caso.numeroCasoFiscalia ?? '',
        'Departamento código': caso.departamentoCodigo ?? '',
        Unidad: caso.unidad ?? '',
        Distrital: caso.distrital ?? '',
        Grupo: caso.grupo ?? '',
        'Inicio caso': this.fecha(caso.fechaInicio),
        'Etapa investigación': caso.etapaInvestigacion ?? '',
        'Estado procesal': caso.estadoProcesal ?? '',
        'ID actuación': '',
        Actuación: '',
        'Fecha informe': '',
        'Tipo informe': '',
        'Lugar actuación': '',
        'Persona / empresa / bien': '',
        'Tipo documento': '',
        'Documento / NIT': '',
        País: '',
        Sexo: '',
        'Estado civil': '',
        Profesión: '',
        Relación: '',
        'Categoría bien': '',
        'Clase bien': '',
        'Tipo bien': '',
        Características: '',
        Cantidad: '',
        'Valor aproximado': '',
        'Valor cuantificado': '',
        'Lugar secuestro': '',
        Matrícula: '',
        Representante: '',
        Dirección: '',
        'Capital social': '',
        Vínculo: '',
        'Pericia realizada': '',
        'Resultado pericia': '',
        Observaciones: '',
        'Situación legal actual': '',
        'Situación jurídica actual': '',
        'Fecha registro': '',
        'Historial legal': '',
        'Historial jurídico': '',
      }
      filas.push({
        ...base,
        'Tipo registro': 'CASO',
        'ID registro': caso.casosId,
      })
      for (const p of caso.personasInvestigadas ?? [])
        filas.push({
          ...base,
          'Tipo registro': 'PERSONA',
          'ID registro': p.deId,
          'Persona / empresa / bien': p.nombreCompleto ?? '',
          'Tipo documento': p.tipoDocumento ?? '',
          'Documento / NIT': p.numeroDocumento ?? '',
          País: p.pais ?? '',
          Sexo: p.sexo ?? '',
          'Estado civil': p.estadoCivil ?? '',
          Profesión: p.profesion ?? '',
          Relación: p.relacion ?? '',
          Observaciones: p.observaciones ?? '',
          'Fecha registro': this.fecha(p.fechaRegistro),
          'Situación jurídica actual':
            p.situacionJuridicaActual ?? 'Sin situación registrada',
          'Historial jurídico': this.historial(p.historialSituaciones),
        })
      for (const a of caso.actuaciones ?? []) {
        const actuacion: FilaPlana = {
          ...base,
          'ID actuación': a.opId,
          Actuación: a.numeroActuacion ?? '',
          'Fecha informe': this.fecha(a.fechaInforme),
          'Tipo informe': a.tipoInforme ?? '',
          'Lugar actuación': a.lugar ?? '',
        }
        filas.push({
          ...actuacion,
          'Tipo registro': 'ACTUACION',
          'ID registro': a.opId,
          Observaciones: a.descripcion ?? '',
        })
        for (const b of a.bienes ?? [])
          filas.push({
            ...actuacion,
            'Tipo registro': 'BIEN',
            'ID registro': b.itemBienSecId,
            'Persona / empresa / bien': b.tipo ?? '',
            'Categoría bien': b.categoria ?? '',
            'Clase bien': b.clase ?? '',
            'Tipo bien': b.tipo ?? '',
            Características: (b.caracteristicas ?? [])
              .map(
                (c: Registro) =>
                  `${c.caracteristica ?? c.caracteristicaId}: ${c.valor ?? ''}`
              )
              .join('; '),
            Cantidad: b.cantidad ?? '',
            'Valor aproximado': b.valorAproximado ?? '',
            'Valor cuantificado': b.valorCuantificado ?? '',
            'Lugar secuestro': b.lugarSecuestro ?? '',
            'Pericia realizada': b.pericia ? 'Sí' : 'No',
            'Resultado pericia': b.resultadoPericia ?? '',
            'Situación legal actual':
              b.situacionLegalActual ?? 'Sin situación registrada',
            'Situación jurídica actual':
              b.situacionJuridicaActual ?? 'Sin situación registrada',
            'Fecha registro': this.fecha(b.fechaRegistro),
            'Historial legal': this.historial(b.historialLegal),
            'Historial jurídico': this.historial(b.historialJuridico),
          })
        for (const e of a.empresas ?? [])
          filas.push({
            ...actuacion,
            'Tipo registro': 'EMPRESA',
            'ID registro': e.empId,
            'Persona / empresa / bien': e.nombre ?? '',
            'Documento / NIT': e.nit ?? '',
            Matrícula: e.matricula ?? '',
            Representante: e.representante ?? '',
            Dirección: e.direccion ?? '',
            'Capital social': e.capitalSocial ?? '',
            Vínculo: e.vinculo ?? '',
            'Pericia realizada': e.pericia ? 'Sí' : 'No',
            'Resultado pericia': e.resultadoPericia ?? '',
            Observaciones: e.observaciones ?? '',
            'Fecha registro': this.fecha(e.fechaRegistro),
            'Situación jurídica actual':
              e.situacionJuridicaActual ?? 'Sin situación registrada',
            'Historial jurídico': this.historial(e.historialSituaciones),
          })
      }
    }
    // Evitar que datos de texto se interpreten como fórmulas al abrir CSV/Excel.
    return filas.map((fila) =>
      Object.fromEntries(
        Object.entries(fila).map(([k, v]) => [
          k,
          typeof v === 'string' && /^[\s]*[=+\-@\t\r\n]/.test(v) ? `'${v}` : v,
        ])
      )
    )
  }

  private historial(eventos: Registro[] = []): string {
    return eventos
      .map((e) =>
        [
          this.fecha(e.fecha ?? e.fechaRegistro),
          e.descripcion ?? e.tipo ?? e.situacionId ?? '',
          e.numeroResolucion ?? e.documento ?? '',
        ]
          .filter(Boolean)
          .join(' · ')
      )
      .join(' | ')
  }

  private prepararDatosPdf(
    casos: Record<string, any>[],
    filtros: FiltrosVariablesCruzadasLgiDto
  ) {
    const filas = this.prepararExcelConsolidado(casos)

    return {
      titulo: 'REPORTE DE VARIABLES CRUZADAS LGI',
      fechaGeneracion: this.obtenerFechaGeneracion(),

      filtros: Object.entries(filtros ?? {})
        .filter(
          ([, valor]) => valor !== undefined && valor !== null && valor !== ''
        )
        .map(([nombre, valor]) => ({
          nombre,
          valor: String(valor),
        })),

      filas: filas.map((fila) => ({
        ...fila,

        totalAproximadoBienes: this.textoMonto(fila['Total aproximado bienes']),

        totalCuantificadoBienes: this.textoMonto(
          fila['Total cuantificado bienes']
        ),

        totalCapitalEmpresas: this.textoMonto(
          fila['Total capital social empresas']
        ),
      })),
    }
  }
}
