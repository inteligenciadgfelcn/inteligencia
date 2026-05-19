import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseService } from '@/common/base'
import { LookupRepository } from '../repository/lookup.repository'

@Injectable()
export class LookupService extends BaseService {
  constructor(
    private readonly lookupRepository: LookupRepository,
    private readonly configService: ConfigService
  ) {
    super()
  }

  // ==================== LOOKUPS ESTÁTICOS (desde .env) ====================

  /**
   * Género para persona_auxiliar (genero bit(1): true=Masculino, false=Femenino).
   * .env: LOOKUP_GENERO=1:Masculino,0:Femenino
   */
  listarGenero(): { id: boolean; descripcion: string }[] {
    const raw = this.configService.get<string>('LOOKUP_GENERO', '1:Masculino,0:Femenino')
    return raw.split(',').map((entry) => {
      const [id, ...rest] = entry.trim().split(':')
      return { id: id.trim() === '1', descripcion: rest.join(':') }
    })
  }

  /**
   * Estados para persona_auxiliar (enum estado_persona_auxiliar en BD).
   * .env: LOOKUP_ESTADO_SUJETO=Principal Implicado,Aprehendido,Arrestado,LGI O Perdida de Dominio
   */
  listarEstadoSujeto(): { id: string; descripcion: string }[] {
    const raw = this.configService.get<string>(
      'LOOKUP_ESTADO_SUJETO',
      'Principal Implicado,Aprehendido,Arrestado,LGI O Perdida de Dominio'
    )
    return raw.split(',').map((entry) => {
      const val = entry.trim()
      return { id: val, descripcion: val }
    })
  }

  // Geografía
  async listarContinentes() {
    return this.lookupRepository.listarContinentes()
  }

  async listarPaises() {
    return this.lookupRepository.listarPaises()
  }

  async listarPaisesPorContinente(idContinente: number) {
    return this.lookupRepository.listarPaisesPorContinente(idContinente)
  }

  async listarPaisesDestino() {
    return this.lookupRepository.listarPaisesDestino()
  }

  async listarDepartamentos() {
    return this.lookupRepository.listarDepartamentos()
  }

  async listarDepartamentosPorPais(idPais: number) {
    return this.lookupRepository.listarDepartamentosPorPais(idPais)
  }

  async listarProvincias() {
    return this.lookupRepository.listarProvincias()
  }

  async listarProvinciasPorDepartamento(idDepartamento: number) {
    return this.lookupRepository.listarProvinciasPorDepartamento(idDepartamento)
  }

  async listarLocalidades() {
    return this.lookupRepository.listarLocalidades()
  }

  async listarLocalidadesPorProvincia(idProvincia: number) {
    return this.lookupRepository.listarLocalidadesPorProvincia(idProvincia)
  }

  // Tipos
  async listarTiposDroga() {
    return this.lookupRepository.listarTiposDroga()
  }

  async listarTiposOperacion() {
    return this.lookupRepository.listarTiposOperacion()
  }

  async listarTiposPenal() {
    return this.lookupRepository.listarTiposPenal()
  }

  async listarTiposRelevancia() {
    return this.lookupRepository.listarTiposRelevancia()
  }

  async listarTiposPersona() {
    return this.lookupRepository.listarTiposPersona()
  }

  async listarEstadosCiviles() {
    return this.lookupRepository.listarEstadosCiviles()
  }

  async listarCategoriasOperativo() {
    return this.lookupRepository.listarCategoriasOperativo()
  }

  // Nuevos tipos
  async listarTiposDenuncia() {
    return this.lookupRepository.listarTiposDenuncia()
  }

  async listarTiposFabrica() {
    return this.lookupRepository.listarTiposFabrica()
  }

  async listarTiposDocumento() {
    return this.lookupRepository.listarTiposDocumento()
  }

  async listarTiposImplicado() {
    return this.lookupRepository.listarTiposImplicado()
  }

  // Operativo params
  async listarPlanesOperaciones() {
    return this.lookupRepository.listarPlanesOperaciones()
  }

  async listarFormasTransporte() {
    return this.lookupRepository.listarFormasTransporte()
  }

  async listarEtapas() {
    return this.lookupRepository.listarEtapas()
  }

  async listarEtapasInvestigacion() {
    return this.lookupRepository.listarEtapasInvestigacion()
  }

  async listarRecursos() {
    return this.lookupRepository.listarRecursos()
  }

  // Sustancias
  async listarSustanciasSolidasDesc() {
    return this.lookupRepository.listarSustanciasSolidasDesc()
  }

  async listarSustanciasLiquidasDesc() {
    return this.lookupRepository.listarSustanciasLiquidasDesc()
  }

  async listarCocaProcedencias() {
    return this.lookupRepository.listarCocaProcedencias()
  }

  async listarCocaEstados() {
    return this.lookupRepository.listarCocaEstados()
  }

  async listarCocaDescripciones() {
    return this.lookupRepository.listarCocaDescripciones()
  }

  // Bienes
  async listarBienes() {
    return this.lookupRepository.listarBienes()
  }

  async listarCalidadesBien() {
    return this.lookupRepository.listarCalidadesBien()
  }

  // Persona - colores
  async listarColoresPiel() {
    return this.lookupRepository.listarColoresPiel()
  }

  async listarColoresOjos() {
    return this.lookupRepository.listarColoresOjos()
  }

  async listarColoresCabello() {
    return this.lookupRepository.listarColoresCabello()
  }

  async listarTiposCabello() {
    return this.lookupRepository.listarTiposCabello()
  }

  // Estructura organizacional
  async listarUnidades() {
    return this.lookupRepository.listarUnidades()
  }

  async listarDistritalesPorUnidad(idUnidad: number) {
    return this.lookupRepository.listarDistritalesPorUnidad(idUnidad)
  }

  async listarGruposPorDistrital(idDistrital: number) {
    return this.lookupRepository.listarGruposPorDistrital(idDistrital)
  }

  async listarContenidoCaso() {
    return this.lookupRepository.listarContenidoCaso()
  }

  async listarEstadosPorEtapa(idEtapa: number) {
    return this.lookupRepository.listarEstadosPorEtapa(idEtapa)
  }

  async listarSituacionesLegales() {
    return this.lookupRepository.listarSituacionesLegales()
  }

  async listarContenidoBien() {
    return this.lookupRepository.listarContenidoBien()
  }

  async listarEstadosDroga(idTipoDroga: number) {
    return this.lookupRepository.listarEstadosDrogaPorTipo(idTipoDroga);
  }

  async listarFabricaModelos(idTipoFabrica: number) {
    return this.lookupRepository.listarFabricaModelosPorTipo(idTipoFabrica);
  }

  async listarItemsOperativo(idCategoriaOperativo: number) {
    return this.lookupRepository.listarItemsOperativoPorCategoria(idCategoriaOperativo);
  }

  async listarCatalogoClases(idBien: number) {
    return this.lookupRepository.listarCatalogoClasesPorBien(idBien);
  }

  async listarCatalogoTipos(idCatalogoClase: number) {
    return this.lookupRepository.listarCatalogoTiposPorClase(idCatalogoClase);
  }

  async listarCatalogoCaracteristicas(idCatalogoClase: number) {
    return this.lookupRepository.listarCatalogoCaracteristicasPorClase(idCatalogoClase);
  }
}
