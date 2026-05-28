import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'

// Geografía
import { Continente } from '../entity/geografia/continente.entity'
import { Pais } from '../entity/geografia/pais.entity'
import { PaisDestino } from '../entity/geografia/pais-destino.entity'
import { Departamento } from '../entity/geografia/departamento.entity'
import { Provincia } from '../entity/geografia/provincia.entity'
import { Localidad } from '../entity/geografia/localidad.entity'

// Tipos
import { TipoDroga } from '../entity/tipo/tipo-droga.entity'
import { TipoOperacion } from '../entity/tipo/tipo-operacion.entity'
import { TipoPenal } from '../entity/tipo/tipo-penal.entity'
import { TipoRelevancia } from '../entity/tipo/tipo-relevancia.entity'
import { TipoPersona } from '../entity/tipo/tipo-persona.entity'
import { TipoDenuncia } from '../entity/tipo/tipo-denuncia.entity'
import { TipoFabrica } from '../entity/tipo/tipo-fabrica.entity'
import { TipoDocumento } from '../entity/tipo/tipo-documento.entity'
import { TipoImplicado } from '../entity/tipo/tipo-implicado.entity'

// Persona
import { EstadoCivil } from '../entity/persona/estado-civil.entity'
import { ColorPiel } from '../entity/persona/color-piel.entity'
import { ColorOjos } from '../entity/persona/color-ojos.entity'
import { ColorCabello } from '../entity/persona/color-cabello.entity'
import { TipoCabello } from '../entity/persona/tipo-cabello.entity'

// Operativo
import { CategoriaOperativo } from '../entity/operativo/categoria-operativo.entity'
import { PlanOperaciones } from '../entity/operativo/plan-operaciones.entity'
import { FormaTransporte } from '../entity/operativo/forma-transporte.entity'
import { EtapaOperativo } from '../entity/operativo/etapa.entity'
import { EtapaInvestigacion } from '../entity/operativo/etapa-investigacion.entity'
import { Recurso } from '../entity/operativo/recurso.entity'

// Sustancias
import { SustanciaSolidaDescripcion } from '../entity/sustancia/sustancia-solida-descripcion.entity'
import { SustanciaLiquidaDescripcion } from '../entity/sustancia/sustancia-liquida-descripcion.entity'
import { CocaProcedencia } from '../entity/sustancia/coca-procedencia.entity'
import { CocaEstado } from '../entity/sustancia/coca-estado.entity'
import { CocaDescripcion } from '../entity/sustancia/coca-descripcion.entity'
import { SituacionLegal } from '../entity/sustancia/situacion-legal.entity'

// Bienes
import { Bienes } from '../entity/bien/bienes.entity'
import { CalidadBien } from '../entity/bien/calidad-bien.entity'
import { ContenidoBien } from '../entity/bien/contenido-bien.entity'

// Estructura organizacional
import { Unidad } from '../entity/estructura/unidad.entity'
import { Distrital } from '../entity/estructura/distrital.entity'
import { Grupo } from '../entity/estructura/grupo.entity'

// Otros
import { ContenidoCaso } from '../entity/bien/contenido-caso.entity'
import { Estado } from '../../seguimiento/personas/entity/estado.entity'
import { CatalogoCaracteristica } from '../entity/operativo/catalogo-caracteristica.entity'
import { CatalogoTipo } from '../entity/operativo/catalogo-tipo.entity'
import { CatalogoClase } from '../entity/operativo/catalogo-clase.entity'
import { ItemOperativo } from '../entity/operativo/item-operativo.entity'
import { FabricaModelo } from '../entity/operativo/fabrica-modelo.entity'
import { EstadoDroga } from '../entity/operativo/estado-droga.entity'

@Injectable()
export class LookupRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  // Geografía
  async listarContinentes(): Promise<Continente[]> {
    return this.dataSource
      .getRepository(Continente)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarPaises(): Promise<Pais[]> {
    return this.dataSource.getRepository(Pais).find({
      relations: ['continente'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarPaisesPorContinente(idContinente: number): Promise<Pais[]> {
    return this.dataSource.getRepository(Pais).find({
      where: { idContinente },
      relations: ['continente'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarPaisesDestino(): Promise<PaisDestino[]> {
    return this.dataSource
      .getRepository(PaisDestino)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarDepartamentos(): Promise<Departamento[]> {
    return this.dataSource.getRepository(Departamento).find({
      relations: ['pais'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarDepartamentosPorPais(idPais: number): Promise<Departamento[]> {
    return this.dataSource.getRepository(Departamento).find({
      where: { idPais },
      relations: ['pais'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarProvincias(): Promise<Provincia[]> {
    return this.dataSource.getRepository(Provincia).find({
      relations: ['departamento'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarProvinciasPorDepartamento(
    idDepartamento: number
  ): Promise<Provincia[]> {
    return this.dataSource.getRepository(Provincia).find({
      where: { idDepartamento },
      relations: ['departamento'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarLocalidades(): Promise<Localidad[]> {
    return this.dataSource.getRepository(Localidad).find({
      relations: ['provincia'],
      order: { descripcion: 'ASC' },
    })
  }

  async listarLocalidadesPorProvincia(
    idProvincia: number
  ): Promise<Localidad[]> {
    return this.dataSource.getRepository(Localidad).find({
      where: { idProvincia },
      relations: ['provincia'],
      order: { descripcion: 'ASC' },
    })
  }

  // Tipos
  async listarTiposDroga(): Promise<TipoDroga[]> {
    return this.dataSource
      .getRepository(TipoDroga)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposOperacion(): Promise<TipoOperacion[]> {
    return this.dataSource
      .getRepository(TipoOperacion)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposPenal(): Promise<TipoPenal[]> {
    return this.dataSource
      .getRepository(TipoPenal)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposRelevancia(): Promise<TipoRelevancia[]> {
    return this.dataSource
      .getRepository(TipoRelevancia)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposPersona(): Promise<TipoPersona[]> {
    return this.dataSource
      .getRepository(TipoPersona)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarEstadosCiviles(): Promise<EstadoCivil[]> {
    return this.dataSource
      .getRepository(EstadoCivil)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarCategoriasOperativo(): Promise<CategoriaOperativo[]> {
    return this.dataSource
      .getRepository(CategoriaOperativo)
      .find({ order: { descripcion: 'ASC' } })
  }

  // Nuevos tipos
  async listarTiposDenuncia(): Promise<TipoDenuncia[]> {
    return this.dataSource
      .getRepository(TipoDenuncia)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposFabrica(): Promise<TipoFabrica[]> {
    return this.dataSource
      .getRepository(TipoFabrica)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposDocumento(): Promise<TipoDocumento[]> {
    return this.dataSource
      .getRepository(TipoDocumento)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposImplicado(): Promise<TipoImplicado[]> {
    return this.dataSource
      .getRepository(TipoImplicado)
      .find({ order: { descripcion: 'ASC' } })
  }

  // Operativo params
  async listarPlanesOperaciones(): Promise<PlanOperaciones[]> {
    return this.dataSource
      .getRepository(PlanOperaciones)
      .find({ order: { nombre: 'ASC' } })
  }

  async listarFormasTransporte(): Promise<FormaTransporte[]> {
    return this.dataSource
      .getRepository(FormaTransporte)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarEtapas(): Promise<EtapaOperativo[]> {
    return this.dataSource
      .getRepository(EtapaOperativo)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarEtapasInvestigacion(): Promise<EtapaInvestigacion[]> {
    return this.dataSource
      .getRepository(EtapaInvestigacion)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarRecursos(): Promise<Recurso[]> {
    return this.dataSource
      .getRepository(Recurso)
      .find({ order: { descripcion: 'ASC' } })
  }

  // Sustancias
  async listarSustanciasSolidasDesc(): Promise<SustanciaSolidaDescripcion[]> {
    return this.dataSource
      .getRepository(SustanciaSolidaDescripcion)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarSustanciasLiquidasDesc(): Promise<SustanciaLiquidaDescripcion[]> {
    return this.dataSource
      .getRepository(SustanciaLiquidaDescripcion)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarCocaProcedencias(): Promise<CocaProcedencia[]> {
    return this.dataSource
      .getRepository(CocaProcedencia)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarCocaEstados(): Promise<CocaEstado[]> {
    return this.dataSource
      .getRepository(CocaEstado)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarCocaDescripciones(): Promise<CocaDescripcion[]> {
    return this.dataSource
      .getRepository(CocaDescripcion)
      .find({ order: { descripcion: 'ASC' } })
  }

  // Bienes
  async listarBienes(): Promise<Bienes[]> {
    return this.dataSource
      .getRepository(Bienes)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarCalidadesBien(): Promise<CalidadBien[]> {
    return this.dataSource
      .getRepository(CalidadBien)
      .find({ order: { descripcion: 'ASC' } })
  }

  // Persona - colores
  async listarColoresPiel(): Promise<ColorPiel[]> {
    return this.dataSource
      .getRepository(ColorPiel)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarColoresOjos(): Promise<ColorOjos[]> {
    return this.dataSource
      .getRepository(ColorOjos)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarColoresCabello(): Promise<ColorCabello[]> {
    return this.dataSource
      .getRepository(ColorCabello)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposCabello(): Promise<TipoCabello[]> {
    return this.dataSource
      .getRepository(TipoCabello)
      .find({ order: { descripcion: 'ASC' } })
  }

  // Estructura organizacional
  async listarUnidades(): Promise<Unidad[]> {
    return this.dataSource
      .getRepository(Unidad)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarDistritalesPorUnidad(idUnidad: number): Promise<Distrital[]> {
    return this.dataSource
      .getRepository(Distrital)
      .find({ where: { idUnidad }, order: { descripcion: 'ASC' } })
  }

  async listarGruposPorDistrital(idDistrital: number): Promise<Grupo[]> {
    return this.dataSource
      .getRepository(Grupo)
      .find({ where: { idDistrital }, order: { descripcion: 'ASC' } })
  }

  async listarContenidoCaso(): Promise<ContenidoCaso[]> {
    return this.dataSource
      .getRepository(ContenidoCaso)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarEstadosPorEtapa(idEtapa: number): Promise<Estado[]> {
    return this.dataSource
      .getRepository(Estado)
      .find({ where: { idEtapa }, order: { descripcion: 'ASC' } })
  }

  async listarSituacionesLegales(): Promise<SituacionLegal[]> {
    return this.dataSource
      .getRepository(SituacionLegal)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarContenidoBien(): Promise<ContenidoBien[]> {
    return this.dataSource
      .getRepository(ContenidoBien)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarEstadosDrogaPorTipo(idTipoDroga: number): Promise<EstadoDroga[]> {
    return this.dataSource.getRepository(EstadoDroga).find({
      where: { idTipoDroga },
    })
  }

  async listarFabricaModelosPorTipo(
    idTipoFabrica: number
  ): Promise<FabricaModelo[]> {
    return this.dataSource.getRepository(FabricaModelo).find({
      where: { idTipoFabrica },
    })
  }

  async listarItemsOperativoPorCategoria(
    idCategoriaOperativo: number
  ): Promise<ItemOperativo[]> {
    return this.dataSource.getRepository(ItemOperativo).find({
      where: { idCategoriaOperativo },
    })
  }

  async listarCatalogoClasesPorBien(idBien: number): Promise<CatalogoClase[]> {
    return this.dataSource.getRepository(CatalogoClase).find({
      where: { idBien },
    })
  }

  async listarCatalogoTiposPorClase(
    idCatalogoClase: number
  ): Promise<CatalogoTipo[]> {
    return this.dataSource.getRepository(CatalogoTipo).find({
      where: { idCatalogoClase },
    })
  }

  async listarCatalogoCaracteristicasPorClase(
    idCatalogoClase: number
  ): Promise<CatalogoCaracteristica[]> {
    return this.dataSource.getRepository(CatalogoCaracteristica).find({
      where: { idCatalogoClase },
    })
  }
}
