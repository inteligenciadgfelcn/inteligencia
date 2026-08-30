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
}
