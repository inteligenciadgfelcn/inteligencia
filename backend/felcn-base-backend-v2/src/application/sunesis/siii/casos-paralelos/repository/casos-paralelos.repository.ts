import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import { InvestigacionParalela } from '../entity/investigacion-paralela.entity'
import { Investigador } from '../entity/investigador.entity'
import { PaginacionQueryDto } from '@/common/dto'

@Injectable()
export class CasosParalelosRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  private get repo() {
    return this.dataSource.getRepository(InvestigacionParalela)
  }

  async crearInvestigacionParalela(
    investigacion: Partial<InvestigacionParalela>
  ): Promise<InvestigacionParalela> {
    const nueva = this.repo.create(investigacion)
    return this.repo.save(nueva)
  }

  async listar(
    paginacion: PaginacionQueryDto
  ): Promise<[InvestigacionParalela[], number]> {
    return this.repo.findAndCount({
      skip: paginacion.saltar,
      take: paginacion.limite,
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async buscarPorUnidadYResultado(
    abreviaturaUnidad: string,
    resultado: boolean,
    paginacion: PaginacionQueryDto,
    respInvParalela?: boolean
  ): Promise<[InvestigacionParalela[], number]> {
    const query = this.repo
      .createQueryBuilder('ip')
      .leftJoinAndSelect('ip.departamento', 'd')
      .leftJoinAndSelect('ip.unidad', 'u')
      .leftJoinAndSelect('ip.distrital', 'dist')
      .leftJoinAndSelect('ip.grupo', 'g')
      .where('TRIM(ip.abreviaturaUnidad) = TRIM(:abreviaturaUnidad)', { abreviaturaUnidad })
      .andWhere('ip.resultado = :resultado', { resultado })

    if (respInvParalela) {
      query.andWhere('ip.respuestaInvestigacionParalela = :respInvParalela', { respInvParalela })
    }

    return query
      .orderBy('ip.fechaHoraIngreso', 'DESC')
      .skip(paginacion.saltar)
      .take(paginacion.limite)
      .getManyAndCount()
  }

  async buscarPorId(id: string): Promise<InvestigacionParalela | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['asignacion', 'operativo'],
    })
  }

  async actualizarInvestigacionParalela(
    investigacion: Partial<InvestigacionParalela>
  ): Promise<InvestigacionParalela> {
    return this.repo.save(investigacion)
  }

  /*// ==================== INVESTIGADOR ====================

  private get investigadorRepo() {
    return this.dataSource.getRepository(Investigador)
  }

  async crearInvestigador(investigador: Partial<Investigador>): Promise<Investigador> {
    const nuevo = this.investigadorRepo.create(investigador)
    return this.investigadorRepo.save(nuevo)
  }

  async listarInvestigadoresPorCaso(idCaso: string): Promise<Investigador[]> {
    return this.investigadorRepo.find({
      where: { idCaso },
      relations: ['grado'],
      order: { fecha: 'DESC' }
    })
  }*/
}
