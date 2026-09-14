import { Injectable } from '@nestjs/common'

import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

import { FiltrosVariablesCruzadasDto } from '../dto/filtros-variables-cruzadas.dto'
import { VariablesCruzadasRepository } from '../repository/variables-cruzadas.repository'

@Injectable()
export class VariablesCruzadasService {
  constructor(
    private readonly variablesRepository: VariablesCruzadasRepository
  ) {}

  async buscar(
    filtros: FiltrosVariablesCruzadasDto,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const filtrosConsulta = filtros ?? {}
    const limite = Math.min(Math.max(Number(pagination?.limite ?? 10), 1), 100)
    const saltar = Math.max(Number(pagination?.saltar ?? 0), 0)
    const filtroGeneral = pagination?.filtro?.trim() ?? ''
    const personas =
      await this.variablesRepository.buscarPersonasSiii(filtrosConsulta)

    if (!personas.length) {
      return [[], 0]
    }

    const numerosCaso: string[] = [
      ...new Set(
        personas
          .filter((persona) => Number(persona.enviado) === 1)
          .map((persona) => String(persona.numero_caso ?? '').trim())
          .filter((numeroCaso) => numeroCaso.length > 0)
      ),
    ]

    const detenidos =
      numerosCaso.length > 0
        ? await this.variablesRepository.buscarDetenidosSii(numerosCaso)
        : []

    const mapaCompleto = new Map<string, any[]>()
    const mapaBasico = new Map<string, any[]>()

    for (const detenido of detenidos) {
      this.agregarAlMapa(
        mapaCompleto,
        this.crearClaveCompleta(detenido, true),
        detenido
      )

      this.agregarAlMapa(
        mapaBasico,
        this.crearClaveBasica(detenido, true),
        detenido
      )
    }

    const personasCompletas = personas.map((persona) => {

      if (Number(persona.enviado) !== 1) {
        return {
          ...persona,
          fecha_operativo: persona.fecha_operativo ?? null,
          fecha_nacimiento_auxiliar: persona.fecha_nacimiento_auxiliar ?? null,
          fecha_registro_persona: persona.fecha_registro_persona ?? null,
          id_detenido: null,
          datos_sii: null,
          coincidencia_sii: 'NO_FILIADO',
        }
      }

      const claveCompleta = this.crearClaveCompleta(persona, false)
      const claveBasica = this.crearClaveBasica(persona, false)
      const coincidenciasCompletas = mapaCompleto.get(claveCompleta) ?? []
      const coincidenciasBasicas = mapaBasico.get(claveBasica) ?? []
      const coincidencias =
        coincidenciasCompletas.length > 0
          ? coincidenciasCompletas
          : coincidenciasBasicas
      const detenido = coincidencias.length === 1 ? coincidencias[0] : null

      if (!detenido) {
        return {
          ...persona,
          fecha_operativo: persona.fecha_operativo ?? null,
          fecha_nacimiento_auxiliar: persona.fecha_nacimiento_auxiliar ?? null,
          fecha_registro_persona: persona.fecha_registro_persona ?? null,
          id_detenido: null,
          datos_sii: null,
          coincidencia_sii:
            coincidencias.length > 1 ? 'AMBIGUA' : 'NO_ENCONTRADA',
        }
      }

      const documentos = this.normalizarDocumentos(detenido.documentos_sii)

      return {
        ...persona,
        fecha_operativo: persona.fecha_operativo ?? null,
        fecha_nacimiento_auxiliar: persona.fecha_nacimiento_auxiliar ?? null,
        fecha_registro_persona: persona.fecha_registro_persona ?? null,
        id_detenido: Number(detenido.id_detenido),

        datos_sii: {
          nombres: detenido.nombres_sii ?? '',
          apellido_paterno: detenido.apellido_paterno_sii ?? '',
          apellido_materno: detenido.apellido_materno_sii ?? '',
          apellido_esposo: detenido.apellido_esposo_sii ?? '',
          id_pais: this.numeroNullable(detenido.id_pais_sii),
          pais: detenido.pais_sii ?? '',
          genero: this.obtenerGeneroSii(detenido.genero_sii_codigo),
          fecha_nacimiento: detenido.fecha_nacimiento_sii ?? null,
          id_estado_civil: this.numeroNullable(detenido.id_estado_civil),
          estado_civil: detenido.estado_civil ?? '',
          direccion: detenido.direccion_sii ?? '',
          esta_vivo: this.convertirBooleano(detenido.esta_vivo),
          tiene_tarjeta: this.convertirBooleano(detenido.tiene_tarjeta),
          fecha_ingreso: detenido.fecha_ingreso_sii ?? null,
          documentos,
        },

        coincidencia_sii:
          coincidenciasCompletas.length > 0
            ? 'ENCONTRADA_COMPLETA'
            : 'ENCONTRADA_BASICA',
      }
    })

    let resultado = personasCompletas.filter((persona) =>
      this.cumpleFiltrosPersonales(persona, filtrosConsulta)
    )

    if (filtroGeneral) {
      const texto = this.normalizar(filtroGeneral)

      resultado = resultado.filter((persona) => {
        const valores: unknown[] = [
          persona.numero_caso,
          persona.nombre_caso,
          persona.cud,
          persona.numero_operativo_asignacion,
          persona.lugar,
          persona.nombres_auxiliar,
          persona.apellido_paterno_auxiliar,
          persona.apellido_materno_auxiliar,
          persona.apellido_esposo_auxiliar,
          persona.documento_auxiliar,
          persona.direccion_auxiliar,
          persona.estado_persona,
          persona.genero_auxiliar,
          persona.filiacion,
          persona.fecha_operativo,
          persona.fecha_nacimiento_auxiliar,
          persona.fecha_registro_persona,
          persona.id_detenido,
          persona.datos_sii?.nombres,
          persona.datos_sii?.apellido_paterno,
          persona.datos_sii?.apellido_materno,
          persona.datos_sii?.apellido_esposo,
          persona.datos_sii?.pais,
          persona.datos_sii?.genero,
          persona.datos_sii?.fecha_nacimiento,
          persona.datos_sii?.estado_civil,
          persona.datos_sii?.direccion,
          persona.datos_sii?.fecha_ingreso,

          ...(persona.datos_sii?.documentos ?? []),
        ]

        return valores.some((valor) => this.normalizar(valor).includes(texto))
      })
    }
    const total = resultado.length

    const filas = resultado.slice(saltar, saltar + limite)

    return [filas, total]
  }

  /*
   * =====================================================
   * RELACIÓN ENTRE PERSONA AUXILIAR Y DETENIDO
   * =====================================================
   */

  private crearClaveCompleta(registro: any, esSii: boolean): string {
    const nombres = esSii ? registro.nombres_sii : registro.nombres_auxiliar

    const apellidoPaterno = esSii
      ? registro.apellido_paterno_sii
      : registro.apellido_paterno_auxiliar
    const apellidoMaterno = esSii
      ? registro.apellido_materno_sii
      : registro.apellido_materno_auxiliar

    return [
      this.normalizar(registro.numero_caso),
      this.normalizar(nombres),
      this.normalizar(apellidoPaterno),
      this.normalizar(apellidoMaterno),
    ].join('|')
  }

  private crearClaveBasica(registro: any, esSii: boolean): string {
    const nombres = esSii ? registro.nombres_sii : registro.nombres_auxiliar

    return [
      this.normalizar(registro.numero_caso),
      this.normalizar(nombres),
    ].join('|')
  }

  private agregarAlMapa(
    mapa: Map<string, any[]>,
    clave: string,
    detenido: any
  ): void {
    const registros = mapa.get(clave) ?? []

    registros.push(detenido)

    mapa.set(clave, registros)
  }

  /*
   * =====================================================
   * FILTROS PERSONALES Y DE SII
   * =====================================================
   */

  private cumpleFiltrosPersonales(
    persona: any,
    filtros: FiltrosVariablesCruzadasDto
  ): boolean {
    const sii = persona.datos_sii
    const nombres = sii?.nombres || persona.nombres_auxiliar
    const apellidoPaterno =
      sii?.apellido_paterno || persona.apellido_paterno_auxiliar
    const apellidoMaterno =
      sii?.apellido_materno || persona.apellido_materno_auxiliar
    const apellidoEsposo =
      sii?.apellido_esposo || persona.apellido_esposo_auxiliar
    const idPais = sii?.id_pais ?? persona.id_pais_auxiliar
    const genero = sii?.genero || persona.genero_auxiliar
    const fechaNacimiento =
      sii?.fecha_nacimiento ?? persona.fecha_nacimiento_auxiliar
    const direccion = sii?.direccion || persona.direccion_auxiliar
    const documentos: string[] = [
      persona.documento_auxiliar,

      ...(sii?.documentos ?? []),
    ]
      .filter(Boolean)
      .map(String)

    /*
     * Nombre.
     */
    if (filtros.nombres?.trim() && !this.contiene(nombres, filtros.nombres)) {
      return false
    }

    /*
     * Apellido paterno.
     */
    if (
      filtros.apellidoPaterno?.trim() &&
      !this.contiene(apellidoPaterno, filtros.apellidoPaterno)
    ) {
      return false
    }

    /*
     * Apellido materno.
     */
    if (
      filtros.apellidoMaterno?.trim() &&
      !this.contiene(apellidoMaterno, filtros.apellidoMaterno)
    ) {
      return false
    }

    /*
     * Apellido de esposo.
     */
    if (
      filtros.apellidoEsposo?.trim() &&
      !this.contiene(apellidoEsposo, filtros.apellidoEsposo)
    ) {
      return false
    }

    /*
     * País.
     */
    if (
      filtros.idPais !== undefined &&
      Number(idPais) !== Number(filtros.idPais)
    ) {
      return false
    }

    /*
     * Género.
     */
    if (
      filtros.genero &&
      this.normalizar(genero) !== this.normalizar(filtros.genero)
    ) {
      return false
    }

    /*
     * Fecha de nacimiento.
     */
    if (
      !this.fechaDentroRango(
        fechaNacimiento,
        filtros.fechaNacimientoDesde,
        filtros.fechaNacimientoHasta
      )
    ) {
      return false
    }

    /*
     * Número de documento.
     *
     * Busca tanto en el documento registrado en SIII como
     * en todos los documentos registrados en SII.
     */
    if (
      filtros.numeroDocumento?.trim() &&
      !documentos.some((documento) =>
        this.contieneDocumento(documento, filtros.numeroDocumento!)
      )
    ) {
      return false
    }

    /*
     * Dirección.
     */
    if (
      filtros.direccion?.trim() &&
      !this.contiene(direccion, filtros.direccion)
    ) {
      return false
    }

    /*
     * Estos filtros solamente pueden evaluarse cuando
     * existe una coincidencia válida en SII.
     */
    const tieneFiltrosSii =
      filtros.idEstadoCivil !== undefined ||
      filtros.estaVivo !== undefined ||
      Boolean(filtros.fechaIngresoSiiDesde) ||
      Boolean(filtros.fechaIngresoSiiHasta)

    if (tieneFiltrosSii && !sii) {
      return false
    }

    /*
     * Estado civil.
     */
    if (
      filtros.idEstadoCivil !== undefined &&
      Number(sii?.id_estado_civil) !== Number(filtros.idEstadoCivil)
    ) {
      return false
    }

    /*
     * Está vivo.
     */
    if (
      filtros.estaVivo !== undefined &&
      this.convertirBooleano(sii?.esta_vivo) !== filtros.estaVivo
    ) {
      return false
    }

    /*
     * Rango de fecha de ingreso a SII.
     */
    if (
      !this.fechaDentroRango(
        sii?.fecha_ingreso,
        filtros.fechaIngresoSiiDesde,
        filtros.fechaIngresoSiiHasta
      )
    ) {
      return false
    }

    return true
  }

  /*
   * =====================================================
   * MÉTODOS AUXILIARES
   * =====================================================
   */
  private contiene(valor: unknown, filtro: string): boolean {
    return this.normalizar(valor).includes(this.normalizar(filtro))
  }

  private contieneDocumento(documento: string, filtro: string): boolean {
    const limpiar = (valor: string) =>
      this.normalizar(valor).replace(/[^A-Z0-9]/g, '')

    return limpiar(documento).includes(limpiar(filtro))
  }

  private normalizar(valor: unknown): string {
    return String(valor ?? '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
  }

  private normalizarFecha(valor: string | Date | null | undefined): string {
    if (!valor) {
      return ''
    }
    if (typeof valor === 'string') {
      const coincidencia = valor.match(/^(\d{4}-\d{2}-\d{2})/)

      if (coincidencia) {
        return coincidencia[1]
      }

      return ''
    }

    if (valor instanceof Date) {
      if (Number.isNaN(valor.getTime())) {
        return ''
      }

      const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/La_Paz',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(valor)

      const obtener = (tipo: Intl.DateTimeFormatPartTypes): string => {
        return partes.find((parte) => parte.type === tipo)?.value ?? ''
      }

      return (
        `${obtener('year')}-` + `${obtener('month')}-` + `${obtener('day')}`
      )
    }

    return ''
  }

  private fechaDentroRango(
    valor: string | Date | null | undefined,

    desde?: string,
    hasta?: string
  ): boolean {
    if (!desde && !hasta) {
      return true
    }

    if (!valor) {
      return false
    }

    const fecha = this.normalizarFecha(valor)

    if (!fecha) {
      return false
    }

    const fechaDesde = this.normalizarFechaFiltro(desde)
    const fechaHasta = this.normalizarFechaFiltro(hasta)

    if (fechaDesde && fecha < fechaDesde) {
      return false
    }

    if (fechaHasta && fecha > fechaHasta) {
      return false
    }

    return true
  }

  private normalizarFechaFiltro(valor?: string): string {
    if (!valor) {
      return ''
    }

    const coincidencia = valor.trim().match(/^(\d{4}-\d{2}-\d{2})/)

    return coincidencia?.[1] ?? ''
  }

  private convertirBooleano(valor: unknown): boolean | null {
    if (
      valor === true ||
      valor === 1 ||
      valor === '1' ||
      valor === 'true' ||
      valor === 'TRUE' ||
      valor === 't' ||
      valor === 'T'
    ) {
      return true
    }

    if (
      valor === false ||
      valor === 0 ||
      valor === '0' ||
      valor === 'false' ||
      valor === 'FALSE' ||
      valor === 'f' ||
      valor === 'F'
    ) {
      return false
    }

    return null
  }

  private obtenerGeneroSii(valor: unknown): string {
    const genero = this.convertirBooleano(valor)

    if (genero === true) {
      return 'Masculino'
    }

    if (genero === false) {
      return 'Femenino'
    }

    return 'Sin registrar'
  }

  private numeroNullable(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null
    }

    const numero = Number(valor)
    return Number.isNaN(numero) ? null : numero
  }

  private normalizarDocumentos(valor: unknown): string[] {
    if (Array.isArray(valor)) {
      return valor.filter(Boolean).map(String)
    }

    if (!valor) {
      return []
    }

    if (
      typeof valor === 'string' &&
      valor.startsWith('{') &&
      valor.endsWith('}')
    ) {
      return valor
        .slice(1, -1)
        .split(',')
        .map((documento) => documento.replace(/^"|"$/g, '').trim())
        .filter(Boolean)
    }

    return [String(valor)]
  }
}
