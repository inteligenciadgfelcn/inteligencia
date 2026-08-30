import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginacionQueryDto } from '@/common/dto'
import {
  ConsultaOperativoRepository,
  OperativoConAsignacion,
} from '../repository/consulta-operativo.repository'
import { formatearFecha } from '../shared/fecha.util'

/* eslint-disable camelcase */

/**
 * Servicio ConsultaOperativoService
 * Arma la respuesta para la API de consulta de operativos de la Fiscalía:
 * - listar(): solo cabecera (sin hijos anidados), para no saturar el
 *   sistema con listados pesados.
 * - buscarPorCud(): detalle completo anidado (drogas, sustancias,
 *   fábricas, personas auxiliares, bienes, galería) de UN operativo.
 * Catálogos resueltos a descripción, fechas en español, sin binarios.
 */
@Injectable()
export class ConsultaOperativoService {
  constructor(private readonly repository: ConsultaOperativoRepository) {}

  async listar(paginacion: PaginacionQueryDto) {
    const [operativos, total] = await this.repository.listarPaginado(paginacion)
    const datos = operativos.map((op) => this.mapCabecera(op))
    return { total, pagina: paginacion.pagina, limite: paginacion.limite, datos }
  }

  async buscarPorCud(cud: string) {
    const operativo = await this.repository.buscarPorCud(cud)
    if (!operativo) {
      throw new NotFoundException(`No existe un operativo para el cud ${cud}`)
    }
    return this.armarDetalle(operativo)
  }

  /** Cabecera de un operativo dado su idCaso — usada por ConsultaSeguimientoService. */
  async buscarCabeceraPorIdCaso(idCaso: string) {
    const operativo = await this.repository.buscarCabeceraPorIdCaso(idCaso)
    return operativo ? this.mapCabecera(operativo) : null
  }

  private mapCabecera(operativo: OperativoConAsignacion) {
    const asignacion = operativo.asignacion

    return {
      id_operativo: operativo.id,
      id_caso: operativo.idCaso,
      cud: asignacion?.ianus ?? null,
      numero_caso: asignacion?.numeroCaso ?? null,
      numero_informe: operativo.numeroInforme,
      fecha_operativo: formatearFecha(operativo.fechaOperativo),
      lugar: operativo.lugar,
      coord_x: operativo.coordX,
      coord_y: operativo.coordY,
      mando: operativo.mando,
      descripcion: operativo.descripcion,
      breve_detalle: operativo.breveDetalle ?? null,
      organizacion: operativo.organizacion,
      clan_familiar: operativo.clanFamiliar ?? null,
      descripcion_unidad: operativo.unidad?.descripcion ?? null,
      descripcion_plan_operacion: operativo.planOperacion?.nombre ?? null,
      descripcion_tipo_operativo: operativo.tipoOperacion?.descripcion ?? null,
      descripcion_departamento: operativo.departamento?.descripcion ?? null,
      descripcion_provincia: operativo.provincia?.descripcion ?? null,
      descripcion_localidad: operativo.localidad?.descripcion ?? null,
      descripcion_distrital: operativo.distrital?.descripcion ?? null,
      descripcion_tipo_denuncia: operativo.tipoDenuncia?.descripcion ?? null,
      descripcion_tipo_penal: operativo.tipoPenal?.descripcion ?? null,
      descripcion_tipo_relevancia: operativo.tipoRelevancia?.descripcion ?? null,
    }
  }

  private async armarDetalle(operativo: OperativoConAsignacion) {
    const idOperativo = operativo.id

    const [drogas, sustanciasSolidas, sustanciasLiquidas, fabricas, personas, bienes, galeria] =
      await Promise.all([
        this.repository.listarDrogas(idOperativo),
        this.repository.listarSustanciasSolidas(idOperativo),
        this.repository.listarSustanciasLiquidas(idOperativo),
        this.repository.listarFabricas(idOperativo),
        this.repository.listarPersonasAuxiliares(idOperativo),
        this.repository.listarBienes(idOperativo),
        this.repository.listarGaleria(idOperativo),
      ])

    const drogasConLogotipos = await Promise.all(
      drogas.map(async (d) => ({
        id_droga: d.id,
        cantidad_gramos: d.cantidadGramos,
        cantidad_unidades: d.cantidadUnidades,
        costo: d.costo,
        fecha_hora_ingreso: formatearFecha(d.fechaHoraIngreso),
        descripcion_estado_droga: d.estadoDroga?.descripcion ?? null,
        descripcion_forma_transporte: d.formaTransporte?.descripcion ?? null,
        descripcion_pais_procedencia: d.paisProcedencia?.descripcion ?? null,
        descripcion_pais_destino: d.paisDestino?.descripcion ?? null,
        logotipos: (await this.repository.listarLogotipos(d.id)).map((l) => ({
          id_logotipo: l.id,
          imagen: l.imagen,
          descripcion_logo: l.descripcionLogo,
          organizacion: l.organizacion,
          blanco: l.blanco,
          observacion: l.observacion,
        })),
      }))
    )

    const bienesConCaracteristicas = await Promise.all(
      bienes.map(async (b) => ({
        id_item_bien_secuestrado: b.id,
        cantidad_bien: b.cantidadBien,
        costo_aproximado: b.costoAproximado,
        costo_cuantificado: b.costoCuantificado,
        en_investigacion: b.enInvestigacion,
        fecha_hora_ingreso: formatearFecha(b.fechaHoraIngreso),
        descripcion_tipo: b.catalogoTipo?.descripcion ?? null,
        caracteristicas: (await this.repository.listarCaracteristicasBien(b.id)).map((c) => ({
          id_item_bien_caracteristica: c.id,
          descripcion_caracteristica: c.catalogoCaracteristica?.descripcion ?? null,
          valor: c.descripcion,
        })),
      }))
    )

    return {
      ...this.mapCabecera(operativo),
      drogas: drogasConLogotipos,
      sustancias_solidas: sustanciasSolidas.map((s) => ({
        id_sustancia_solida: s.id,
        cantidad: s.cantidad,
        costo: s.costo,
        fecha_hora_ingreso: formatearFecha(s.fechaHoraIngreso),
        descripcion: s.descripcionRef?.descripcion ?? null,
      })),
      sustancias_liquidas: sustanciasLiquidas.map((s) => ({
        id_sustancia_liquida: s.id,
        cantidad: s.cantidad,
        costo: s.costo,
        fecha_hora_ingreso: formatearFecha(s.fechaHoraIngreso),
        descripcion: s.descripcionRef?.descripcion ?? null,
      })),
      fabricas: fabricas.map((f) => ({
        id_fabrica: f.id,
        cantidad: f.cantidad,
        fecha_hora_ingreso: formatearFecha(f.fechaHoraIngreso),
        descripcion_modelo: f.fabricaModelo?.descripcion ?? null,
      })),
      personas_auxiliares: personas.map((p) => ({
        id_persona_auxiliar: p.id,
        nombres: p.nombres,
        apellido_paterno: p.apellidoPaterno,
        apellido_materno: p.apellidoMaterno,
        apellido_esposo: p.apellidoEsposo,
        nro_documento: p.nroDocumento,
        fecha_nacimiento: formatearFecha(p.fechaNacimiento),
        genero: p.genero,
        direccion: p.direccion,
        estado: p.estado,
        fecha_hora_ingreso: formatearFecha(p.fechaHoraIngreso),
        descripcion_pais: p.pais?.descripcion ?? null,
        descripcion_tipo_documento: p.tipoDocumento?.descripcion ?? null,
      })),
      bienes: bienesConCaracteristicas,
      galeria: galeria.map((g) => ({
        id_galeria: g.id,
        descripcion: g.descripcion,
      })),
    }
  }
}
