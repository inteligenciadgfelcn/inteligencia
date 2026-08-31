import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginacionQueryDto } from '@/common/dto'
import { SeguimientoService } from '@/application/sunesis/siii/seguimiento/casos/service/seguimiento.service'
import { BienesService } from '@/application/sunesis/siii/seguimiento/bienes/service/bienes.service'
import { PersonasService } from '@/application/sunesis/siii/seguimiento/personas/service/personas.service'
import { ConsultaSeguimientoRepository, AsignacionConEtapa } from '../repository/consulta-seguimiento.repository'
import { ConsultaOperativoService } from './consulta-operativo.service'
import { formatearFecha } from '../shared/fecha.util'

/* eslint-disable camelcase */

/**
 * Servicio ConsultaSeguimientoService
 * Arma la respuesta para la API de consulta de seguimiento de la Fiscalía:
 * - listar(): solo cabecera (asignación + operativo resumido), sin
 *   fiscales/jurisdicciones/archivos/bienes/personas, para no saturar el
 *   sistema con listados pesados.
 * - buscarPorCud(): detalle completo anidado de UN caso (fiscales,
 *   jurisdicciones, control jurisdiccional, archivos, bienes con sus
 *   hitos legales, personas con su situación/etapa procesal). Reutiliza
 *   los services internos del SIII (SeguimientoService, BienesService,
 *   PersonasService) en vez de duplicar las consultas.
 */
@Injectable()
export class ConsultaSeguimientoService {
  constructor(
    private readonly repository: ConsultaSeguimientoRepository,
    private readonly consultaOperativoService: ConsultaOperativoService,
    private readonly seguimientoService: SeguimientoService,
    private readonly bienesService: BienesService,
    private readonly personasService: PersonasService
  ) {}

  async listar(paginacion: PaginacionQueryDto) {
    const [asignaciones, total] = await this.repository.listarPaginado(paginacion)
    const datos = await Promise.all(asignaciones.map((a) => this.mapCabecera(a)))
    return { total, pagina: paginacion.pagina, limite: paginacion.limite, datos }
  }

  async buscarPorCud(cud: string) {
    const asignacion = await this.repository.buscarPorCud(cud)
    if (!asignacion) {
      throw new NotFoundException(`No existe un caso para el cud ${cud}`)
    }
    return this.armarDetalle(asignacion)
  }

  private async mapCabecera(asignacion: AsignacionConEtapa) {
    const operativo = await this.consultaOperativoService.buscarCabeceraPorIdCaso(
      asignacion.idCaso
    )

    return {
      id_caso: asignacion.idCaso,
      cud: asignacion.ianus,
      numero_caso: asignacion.numeroCaso,
      numero_caso_per_dom: asignacion.numeroCasoPerDom,
      nombre_caso: asignacion.nombreCaso,
      fiscal_solicitud: asignacion.fiscalSolicitud,
      telefono_solicitud: asignacion.telefonoSolicitud,
      asignado_caso: asignacion.asignadoCaso,
      telefono_asignado: asignacion.telefonoAsignado,
      fiscal_asignado_caso: asignacion.fiscalAsignadoCaso,
      telefono_fiscal: asignacion.telefonoFiscal,
      etapa: asignacion.descripcionEtapa,
      operativo: operativo
        ? {
            id_operativo: operativo.id_operativo,
            numero_informe: operativo.numero_informe,
            fecha_operativo: operativo.fecha_operativo,
            lugar: operativo.lugar,
            descripcion_unidad: operativo.descripcion_unidad,
            descripcion_distrital: operativo.descripcion_distrital,
          }
        : null,
    }
  }

  private async armarDetalle(asignacion: AsignacionConEtapa) {
    const idCaso = asignacion.idCaso
    const cabecera = await this.mapCabecera(asignacion)
    const detalle = await this.seguimientoService.obtenerDetalleSeguimiento(idCaso)
    const idOperativo: string | undefined = detalle.operativos?.[0]?.id

    const [bienes, archivosBien, personas] = await Promise.all([
      idOperativo ? this.armarBienes(idOperativo) : Promise.resolve([]),
      this.bienesService.listarArchivosBien(idCaso),
      idOperativo ? this.armarPersonas(idOperativo) : Promise.resolve([]),
    ])

    return {
      ...cabecera,
      operativo: detalle.operativos?.[0]
        ? {
            id_operativo: detalle.operativos[0].id,
            nro_informe: detalle.operativos[0].nroInforme,
            fecha_operativo: formatearFecha(detalle.operativos[0].fechaOperativo),
            lugar_completo: detalle.operativos[0].lugarCompleto,
            unidad_distrital: detalle.operativos[0].unidadDistrital,
            relacion_hecho: detalle.operativos[0].relacionHecho,
          }
        : null,
      fiscales: detalle.fiscales.map((f) => ({
        id_fiscal: f.id,
        nombre_apellidos: f.nombreApellidos,
        telefono_celular: f.telefonoCelular,
        telefono_fijo: f.telefonoFijo,
        fecha: formatearFecha(f.fecha),
        es_actual: f.esActual,
      })),
      jurisdicciones: detalle.jurisdicciones.map((j) => ({
        id_jurisdiccion: j.id,
        jurisdiccion: j.jurisdiccion,
        observacion: j.observacion,
        fecha: formatearFecha(j.fecha),
        es_actual: j.esActual,
      })),
      controles_jurisdiccionales: detalle.controles.map((c) => ({
        id_control_jurisdiccional: c.id,
        juzgado_instruccion: c.juzgadoInstruccion,
        juzgado_partido: c.juzgadoPartido,
        tribunal_sentencia: c.tribunalSentencia,
        juzgado_ejecucion: c.juzgadoEjecucion,
        fecha: formatearFecha(c.fecha),
        es_actual: c.esActual,
      })),
      archivos: detalle.archivos.map((a) => ({
        id_archivo: a.id,
        tipo: a.tipo,
        nombre: a.nombre,
        nombre_archivo: a.nombreArchivo,
        contenido: a.contenidoCaso?.descripcion ?? null,
      })),
      // Fechas de bienes/personas abajo NO se reformatean: ya vienen en
      // DD/MM/YYYY desde las consultas SQL reutilizadas (BienesRepository/
      // PersonasRepository), salvo etapas_proceso.fecha que sí es Date cruda.
      archivos_bien: (archivosBien as Record<string, unknown>[]).map((a) => ({
        id: a.id,
        contenido: a.contenido,
        tipo: a.tipo,
        nombre: a.nombre,
        nombre_archivo: a.nombreArchivo,
      })),
      bienes,
      personas,
    }
  }

  private async armarBienes(idOperativo: string) {
    const items = (await this.bienesService.listarBienesPorOperativo(
      idOperativo
    )) as Record<string, unknown>[]

    return Promise.all(
      items.map(async (item) => {
        const idItemBien = String(item.id)
        const [secuestro, incautacion, confiscacion, perdidaDominio, situaciones] =
          await Promise.all([
            this.bienesService.listarBienSecuestrado(idItemBien),
            this.bienesService.listarBienIncautado(idItemBien),
            this.bienesService.listarBienConfiscado(idItemBien),
            this.bienesService.listarPerdidaDominio(idItemBien),
            this.bienesService.listarSituacionBien(idItemBien),
          ])

        return {
          id_item_bien_secuestrado: item.id,
          bien: item.bien,
          clase: item.clase,
          tipo: item.tipo,
          cantidad: item.cantidad,
          caracteristicas: item.caracteristicas,
          secuestro: (secuestro as Record<string, unknown>[]).map((s) => ({
            id: s.id,
            fiscal: s.fiscal,
            fecha_acto_secuestro: s.fechaActoSecuestro,
            investigador: s.investigador,
          })),
          incautacion: (incautacion as Record<string, unknown>[]).map((i) => ({
            id: i.id,
            numero_resolucion: i.numeroResolucion,
            fecha_resolucion: i.fechaResolucion,
            autoridad: i.autoridad,
          })),
          confiscacion: (confiscacion as Record<string, unknown>[]).map((c) => ({
            id: c.id,
            numero_sentencia_judicial: c.numeroSentenciaJudicial,
            fecha_sentencia_judicial: c.fechaSentenciaJudicial,
            autoridad: c.autoridad,
          })),
          perdida_dominio: (perdidaDominio as Record<string, unknown>[]).map((p) => ({
            id: p.id,
            fiscalia: p.fiscalia,
            fecha_resolucion: p.fechaResolucion,
            autoridad: p.autoridad,
          })),
          situaciones: (situaciones as Record<string, unknown>[]).map((s) => ({
            id: s.id,
            fecha_requerimiento: s.fechaRequerimiento,
            fiscal_requerimiento: s.fiscalRequerimiento,
            calidad_bien: s.calidadBien,
            fecha_entrega: s.fechaEntrega,
            responsable_entrega: s.responsableEntrega,
            responsable_recepcion: s.responsableRecepcion,
            institucion: s.institucion,
            ubicacion: s.ubicacion,
          })),
        }
      })
    )
  }

  private async armarPersonas(idOperativo: string) {
    const personas = (await this.personasService.listarPersonasPorOperativo(
      idOperativo
    )) as Record<string, unknown>[]

    return Promise.all(
      personas.map(async (persona) => {
        const idDetenido = String(persona.id)
        const [situaciones, etapasProceso] = await Promise.all([
          this.personasService.listarSituacionesPorPersona(idDetenido),
          this.personasService.listarEtapasProcesoPorPersona(idDetenido),
        ])

        return {
          id_detenido_auxiliar: persona.id,
          nombre_completo: persona.nombreCompleto,
          nacionalidad: persona.nacionalidad,
          genero: persona.genero,
          fecha_nacimiento: persona.fechaNacimiento,
          estado_civil: persona.estadoCivil,
          serie: persona.serie,
          seccion: persona.seccion,
          direccion: persona.direccion,
          tarjeta: persona.tarjeta,
          condicion: persona.condicion,
          situaciones: (situaciones as Record<string, unknown>[]).map((s) => ({
            id: s.id,
            situacion_legal: s.situacionLegal,
            nro_resolucion: s.nroResolucion,
            lugar: s.lugar,
            fecha: s.fecha,
            autoridad: s.autoridad,
            fjt: s.fjt,
          })),
          etapas_proceso: (etapasProceso as Record<string, unknown>[]).map((e) => ({
            id: e.id,
            etapa: e.etapa,
            estado: e.estado,
            nro_resolucion: e.nroResolucion,
            lugar: e.lugar,
            fecha: formatearFecha(e.fecha),
            autoridad: e.autoridad,
            fjt: e.fjt,
          })),
        }
      })
    )
  }
}
