import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { RUTA_FISCALIA } from '../shared/constants'
import { UnidadLgiService } from '@/application/lgi/parametro/unidad/unidad.service'
import { BienesService } from '@/application/lgi/parametro/bienes/bienes.service'
import { CatalogoClaseLgiService } from '@/application/lgi/parametro/catalogo-clase/catalogo-clase.service'
import { CatalogoCaracteristicasLgiService } from '@/application/lgi/parametro/catalogo-caracteristica/catalogo-caracteristicas.service'
import { CatalogoTipoLgiService } from '@/application/lgi/parametro/catalogo-tipo/catalogo-tipo.service'
import { CatalogoJuridicaLgiService } from '@/application/lgi/parametro/catalogo-juridica/catalogo-juridica.service'
import { SituacionLegalLgiService } from '@/application/lgi/parametro/situacion-legal/situacion-legal.service'
import { RecursosLgiService } from '@/application/lgi/parametro/recursos/recursos.service'
import { EtapaLgiService } from '@/application/lgi/parametro/etapa/etapa.service'
import { EstadoLgiService } from '@/application/lgi/parametro/estado/estado.service'
import { TipoPersonaLgiService } from '@/application/lgi/parametro/tipo-persona/tipo-persona.service'
import { ContenidoCasoLgiService } from '@/application/lgi/parametro/contenido-caso/contenido-caso.service'
import { GradoLgiService } from '@/application/lgi/parametro/grado/grado.service'
import { TamanoDocLgiService } from '@/application/lgi/parametro/tamano-doc/tamano-doc.service'
import { ContenidoBienLgiService } from '@/application/lgi/parametro/contenido-bien/contenido-bien.service'
import { CalidadBienLgiService } from '@/application/lgi/parametro/calidad-bien/calidad-bien.service'

/* eslint-disable camelcase */

/**
 * Controlador CatalogoController
 * Catálogos que consulta el Ministerio Público (fachada sobre los services
 * de lgi/parametro). Respuesta: lista directa con campos en snake_case
 * limpios (sin los prefijos legacy de columnas).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
@ApiTags('MP → POL: Catálogos')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(`${RUTA_FISCALIA}/catalogos`)
export class CatalogoController {
  constructor(
    private readonly unidadService: UnidadLgiService,
    private readonly bienesService: BienesService,
    private readonly claseService: CatalogoClaseLgiService,
    private readonly caracteristicaService: CatalogoCaracteristicasLgiService,
    private readonly tipoService: CatalogoTipoLgiService,
    private readonly juridicaService: CatalogoJuridicaLgiService,
    private readonly situacionLegalService: SituacionLegalLgiService,
    private readonly recursosService: RecursosLgiService,
    private readonly etapaService: EtapaLgiService,
    private readonly estadoService: EstadoLgiService,
    private readonly tipoPersonaService: TipoPersonaLgiService,
    private readonly contenidoCasoService: ContenidoCasoLgiService,
    private readonly gradoService: GradoLgiService,
    private readonly tamanoDocService: TamanoDocLgiService,
    private readonly contenidoBienService: ContenidoBienLgiService,
    private readonly calidadBienService: CalidadBienLgiService
  ) {}

  @ApiOperation({ summary: 'Catálogo de unidades' })
  @Get('unidades')
  async unidades() {
    const items = await this.unidadService.findAll()
    return items.map((u) => ({
      id: Number(u.uniId),
      abreviatura: u.uniAbrev?.trim(),
      descripcion: u.uniDescripcion,
      es_operativo_administrativo: u.uniOpadm,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de bienes' })
  @Get('bienes')
  async bienes() {
    const items = await this.bienesService.findAll()
    return items.map((b) => ({
      id: Number(b.bienId),
      descripcion: b.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de clases de bien' })
  @Get('clases')
  async clases() {
    const items = await this.claseService.findAll()
    return items.map((c) => ({
      id: Number(c.catClasId),
      bien_id: Number(c.bienId),
      descripcion: c.descripcion,
      fungible: c.fungible,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de características de bien' })
  @Get('caracteristicas')
  async caracteristicas() {
    const items = await this.caracteristicaService.findAll()
    return items.map((c) => ({
      id: Number(c.catcaracId),
      clase_id: Number(c.catclasId),
      descripcion: c.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de tipos de bien' })
  @Get('tipos')
  async tipos() {
    const items = await this.tipoService.findAll()
    return items.map((t) => ({
      id: Number(t.cattipoId),
      clase_id: Number(t.catclasId),
      descripcion: t.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de situaciones jurídicas de bien' })
  @Get('juridicas')
  async juridicas() {
    const items = await this.juridicaService.findAll()
    return items.map((j) => ({
      id: Number(j.catjurId),
      clase_id: Number(j.catclasId),
      descripcion: j.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de situaciones legales' })
  @Get('situaciones-legales')
  async situacionesLegales() {
    const items = await this.situacionLegalService.findAll()
    return items.map((s) => ({
      id: Number(s.slId),
      descripcion: s.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de recursos' })
  @Get('recursos')
  async recursos() {
    const items = await this.recursosService.findAll()
    return items.map((r) => ({
      id: Number(r.recId),
      descripcion: r.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de etapas' })
  @Get('etapas')
  async etapas() {
    const items = await this.etapaService.findAll()
    return items.map((e) => ({
      id: Number(e.etId),
      descripcion: e.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de estados' })
  @Get('estados')
  async estados() {
    const items = await this.estadoService.findAll()
    return items.map((e) => ({
      id: Number(e.estId),
      etapa_id: Number(e.etId),
      descripcion: e.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de tipos de persona' })
  @Get('tipos-persona')
  async tiposPersona() {
    const items = await this.tipoPersonaService.findAll()
    return items.map((t) => ({
      id: Number(t.tpId),
      descripcion: t.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de contenidos de caso' })
  @Get('contenidos-caso')
  async contenidosCaso() {
    const items = await this.contenidoCasoService.findAll()
    return items.map((c) => ({
      id: Number(c.contcasoId),
      descripcion: c.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de grados' })
  @Get('grados')
  async grados() {
    const items = await this.gradoService.findAll()
    return items.map((g) => ({
      id: Number(g.grId),
      abreviatura: g.abrev?.trim(),
      descripcion: g.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de tamaños de documento' })
  @Get('tamanos-documento')
  async tamanosDocumento() {
    const items = await this.tamanoDocService.findAll()
    return items.map((t) => ({
      id: Number(t.tamdocId),
      descripcion: t.descripcion,
      ancho: t.ancho,
      alto: t.alto,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de contenidos de bien' })
  @Get('contenidos-bien')
  async contenidosBien() {
    const items = await this.contenidoBienService.findAll()
    return items.map((c) => ({
      id: Number(c.contbienId),
      descripcion: c.descripcion,
    }))
  }

  @ApiOperation({ summary: 'Catálogo de calidades de bien' })
  @Get('calidades-bien')
  async calidadesBien() {
    const items = await this.calidadBienService.findAll()
    return items.map((c) => ({
      id: Number(c.calbId),
      descripcion: c.descripcion,
    }))
  }
}
