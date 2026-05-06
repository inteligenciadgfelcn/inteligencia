import { Injectable } from '@nestjs/common'
import { CasosParalelosRepository } from '../repository/casos-paralelos.repository'
import { CreateInvestigacionParalelaDto } from '../dto/create-investigacion-paralela.dto'
import { InvestigacionParalela } from '../entity/investigacion-paralela.entity'
import { Investigador } from '../entity/investigador.entity'
import { PaginacionQueryDto } from '@/common/dto'

@Injectable()
export class CasosParalelosService {
  constructor(private readonly repository: CasosParalelosRepository) { }

  async crearInvestigacionParalela(
    dto: CreateInvestigacionParalelaDto,
    usuario: string
  ): Promise<InvestigacionParalela> {
    dto.usuario = usuario
    return this.repository.crearInvestigacionParalela(dto)
  }

  async listar(
    paginacion: PaginacionQueryDto
  ): Promise<[InvestigacionParalela[], number]> {
    return this.repository.listar(paginacion)
  }

  async buscarPorUnidadYResultado(
    unidad: string,
    resultado: boolean,
    paginacion: PaginacionQueryDto,
    respInvParalela?: boolean
  ): Promise<[InvestigacionParalela[], number]> {
    return this.repository.buscarPorUnidadYResultado(unidad, resultado, paginacion, respInvParalela)
  }

  async buscarPorId(id: string): Promise<InvestigacionParalela | null> {
    return this.repository.buscarPorId(id)
  }

  /*
    // ==================== INVESTIGADOR ====================
  
    async crearInvestigador(investigador: Partial<Investigador>): Promise<Investigador> {
      return this.repository.crearInvestigador(investigador)
    }
  
    async listarInvestigadoresPorCaso(idCaso: string): Promise<Investigador[]> {
      return this.repository.listarInvestigadoresPorCaso(idCaso)
    }
  
     */
}
