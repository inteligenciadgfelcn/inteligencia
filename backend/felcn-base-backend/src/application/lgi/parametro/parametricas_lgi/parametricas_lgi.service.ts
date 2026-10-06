import { Injectable } from '@nestjs/common'
import { DistritalLgiRepository } from './repository/distrito.repository'
import { GrupoLgiRepository } from './repository/grupo.repository'
import { DepartamentoLgiRepository } from './repository/departamento.repository'
import { SituacionJuridicaRepository } from './repository/situacion_juridica.repository'
import { PaisLgiRepository } from './repository/pais.repository'
import { EstadoCivilLgiRepository } from './repository/estado_civil.repository'
import { ProfesionLgiRepository } from './repository/profesion.repository'
import { TipoDocumentoLgiRepository } from './repository/tipo_documento.repository'
import { TipoInformeLgiRepository } from './repository/tipo_informe.repository'
import { InicioCasoRepository } from './repository/inicio_caso.repository'
import { TipoImplicadoRepository } from './repository/tipo_implicado.repository'
import { CicloLgiRepository } from './repository/ciclo.repository'
import { VerboRectorLgiRepository } from './repository/verbo_rector.repository'
import { TipologiaLgiRepository } from './repository/tipologia.repository'
import { CicloLgi } from './entity/ciclo.entity'
import { TipologiaLgi } from './entity/tipologia.entity'
import { VerboRectorLgi } from './entity/verbo-rector.entity'
import { MedidaCautelarRepository } from './repository/medida_cautelar.repository'
import { SentenciaRepository } from './repository/sentencia.repository'
import { BienSujetoPdRepository } from './repository/bien_sujeto_pd.repository'
import { Sentencia } from './entity/sentencia.entity'

@Injectable()
export class ParametricasLgiService {
  constructor(
    private readonly distritoRepository: DistritalLgiRepository,
    private readonly grupoLgiRepository: GrupoLgiRepository,
    private readonly departamentoRepository: DepartamentoLgiRepository,
    private readonly paisRepository: PaisLgiRepository,
    private readonly situacionJuridicaRepository: SituacionJuridicaRepository,
    private readonly estadoCivilRepository: EstadoCivilLgiRepository,
    private readonly profesionRepository: ProfesionLgiRepository,
    private readonly tipoDocumentoRepository: TipoDocumentoLgiRepository,
    private readonly tipoInformeRepository: TipoInformeLgiRepository,
    private readonly inicioCasoRepository: InicioCasoRepository,
    private readonly tipoImplicadoRepository: TipoImplicadoRepository,
    private readonly cicloRepository: CicloLgiRepository,
    private readonly verboRectorRepository: VerboRectorLgiRepository,
    private readonly tipologiaRepository: TipologiaLgiRepository,
    private readonly medidaCautelarRepository: MedidaCautelarRepository, 
    private readonly sentenciaRepository: SentenciaRepository,
    private readonly bienSujetoPdRepository: BienSujetoPdRepository
  ) {}

  findAllDistrito(idUsuario: number) {
    return this.distritoRepository.findAllGeneral(idUsuario)
  }

  findOne(id: number) {
    return this.distritoRepository.findOne(id)
  }

  async findAllGrupo(idDistrito: number) {
    return await this.grupoLgiRepository.findAllDistrito(idDistrito)
  }

  findAllDepartamento() {
    return this.departamentoRepository.findAllGeneral()
  }

  findAllPais() {
    return this.paisRepository.findAllGeneral()
  }

  findAllEstadoCivil() {
    return this.estadoCivilRepository.findAllGeneral()
  }

  findAllSituacionJuridica() {
    return this.situacionJuridicaRepository.findAllGeneral()
  }

  findAllProfesion() {
    return this.profesionRepository.findAllGeneral()
  }

  findAllTipoDocumento() {
    return this.tipoDocumentoRepository.findAllGeneral()
  }

  findAllTipoInforme() {
    return this.tipoInformeRepository.findAllGeneral()
  }

  findAllIncioCaso() {
    return this.inicioCasoRepository.findAllGeneral()
  }

  findAllTipoImplicado() {
    return this.tipoImplicadoRepository.findAllGeneral()
  }

  async listarCiclos(): Promise<CicloLgi[]> {
    return this.cicloRepository.findAllGeneral()
  }

  async listarVerbosRectores(): Promise<VerboRectorLgi[]> {
    return this.verboRectorRepository.findAllGeneral()
  }

  async listarTipologias(): Promise<TipologiaLgi[]> {
    return this.tipologiaRepository.findAllGeneral()
  }

  findAllGeneralMedidaCautelar() {
    return this.medidaCautelarRepository.findAllGeneral()
  }

  findOneMedidaCautelar(id: number) {
    return this.medidaCautelarRepository.findOne(id)
  }
   async findAllSentencia() {
    return this.sentenciaRepository.findAllGeneral()
  }
   async findAllBienSujeto(){
    return this.bienSujetoPdRepository.findAllGeneral()
  }
}
