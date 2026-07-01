import { Controller, Get } from '@nestjs/common';
import { UnidadLgiService } from '../lgi/parametro/unidad/unidad.service';
import { ApiTags } from '@nestjs/swagger';
import { BienesService } from '../lgi/parametro/bienes/bienes.service';
import { CatalogoClaseLgiService } from '../lgi/parametro/catalogo-clase/catalogo-clase.service';
import { CatalogoCaracteristicasLgiService } from '../lgi/parametro/catalogo-caracteristica/catalogo-caracteristicas.service';
import { CatalogoTipoLgiService } from '../lgi/parametro/catalogo-tipo/catalogo-tipo.service';
import { CatalogoJuridicaLgiService } from '../lgi/parametro/catalogo-juridica/catalogo-juridica.service';
import { SituacionLegalLgiService } from '../lgi/parametro/situacion-legal/situacion-legal.service';
import { EtapaLgiService } from '../lgi/parametro/etapa/etapa.service';
import { EstadoLgiService } from '../lgi/parametro/estado/estado.service';
import { TipoPersonaLgiService } from '../lgi/parametro/tipo-persona/tipo-persona.service';
import { ContenidoCasoLgiService } from '../lgi/parametro/contenido-caso/contenido-caso.service';
import { GradoLgiService } from '../lgi/parametro/grado/grado.service';
import { TamanoDocLgiService } from '../lgi/parametro/tamano-doc/tamano-doc.service';
import { ContenidoBienLgiService } from '../lgi/parametro/contenido-bien/contenido-bien.service';
import { CalidadBienLgiService } from '../lgi/parametro/calidad-bien/calidad-bien.service';

@ApiTags('Catalogo - Fiscalía')
@Controller('catalogo-fiscalia')
export class CatalogoFiscaliaController {
     constructor(
        private readonly unidadService: UnidadLgiService,
        private readonly bienesService: BienesService,
        private readonly catalogoClaseService: CatalogoClaseLgiService,
        private readonly catalogoCaracteristicasService: CatalogoCaracteristicasLgiService,
        private readonly catalogoTipoService: CatalogoTipoLgiService,
        private readonly catalogoJuridicaService: CatalogoJuridicaLgiService,
        private readonly situacionLegalService: SituacionLegalLgiService,
        private readonly recursosService: SituacionLegalLgiService,
        private readonly etapaService: EtapaLgiService,
        private readonly estadoService: EstadoLgiService,
        private readonly tipoPersonaService: TipoPersonaLgiService,
        private readonly contenidoCasoService: ContenidoCasoLgiService,
        private readonly gradoService: GradoLgiService,
        private readonly tamanoDocService: TamanoDocLgiService,
        private readonly contenidoBienService: ContenidoBienLgiService,
        private readonly calidadBienService: CalidadBienLgiService,
      ) {}
    
     @Get('unidades')
      unidades() {
        return this.unidadService.findAll();
      }
     
      @Get('bienes')
      bienes() {
        return this.bienesService.findAll();
      }
      
      @Get('catalogo-clase')
      catalogoClase() {
        return this.catalogoClaseService.findAll();
      }
      
      @Get('catalogo-caracteristicas')
      catalogoCaracteristicas() {
        return this.catalogoCaracteristicasService.findAll();
      }
      
      @Get('catalogo-tipo')
      catalogoTipo() {
        return this.catalogoTipoService.findAll();
      }
      
      @Get('catalogo-juridica')
      catalogoJuridica() {
        return this.catalogoJuridicaService.findAll();
      }
      
      @Get('situacion-legal')
      catalogoSituacionLegal() {
        return this.situacionLegalService.findAll();
      }
      
      @Get('recursos')
      catalogoRecursos() {
        return this.recursosService.findAll();
      }
      
      @Get('etapa')
      catalogoEtapa() {
        return this.etapaService.findAll();
      }
      
      @Get('estado')
      catalogoEstado() {
        return this.estadoService.findAll();
      }
      
      @Get('tipo-persona')
      catalogoTipoPersona() {
        return this.tipoPersonaService.findAll();
      }
      
      @Get('contenido-caso')
      catalogoContenidoCaso() {
        return this.contenidoCasoService.findAll();
      }
      
      @Get('grado')
      catalogoGrado() {
        return this.gradoService.findAll();
      }
      
      @Get('tamano-doc')
      catalogoTamanoDoc() {
        return this.tamanoDocService.findAll();
      }
      
      @Get('contenido-bien')
      catalogoContenidoBien() {
        return this.contenidoBienService.findAll();
      }
      
      @Get('calidad-bien')
      catalogoCalidadBien() {
        return this.calidadBienService.findAll();
      }
}
