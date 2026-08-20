import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AsignarInvestigadoresDto } from '../dto/asignar-investigador.dto';
import { InvestigadorLgi } from '../entities/investigadore.entity';

@Injectable()
export class InvestigadorLgiRepository {
  constructor(
    @InjectDataSource('DB_ASIG_CASOS')
    private readonly dataSource: DataSource,
  ) {}

  async asignarInvestigadores(
    casoId: number,
    dto: AsignarInvestigadoresDto,
  ): Promise<InvestigadorLgi[]> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(InvestigadorLgi);
      await repository
        .createQueryBuilder()
        .update(InvestigadorLgi)
        .set({
          actual: false,
        })
        .where('casos_id = :casoId', { casoId })
        .andWhere('actual = :actual', { actual: true })
        .execute();

      const fechaActual = new Date();

      const investigadores = dto.numerosPase.map((numeroPase) =>
        repository.create({
          casoId,
          numeroPase: numeroPase.trim(),
          memo: dto.memo.trim(),
          fechaAsignacion: fechaActual,
          actual: true,
          informacionActualizada: 'REGISTRO DE ASIGNACIÓN',
          fechaHoraIngreso: fechaActual,
        }),
      );

      return repository.save(investigadores);
    });
  }

  async findByCaso(casoId: number): Promise<InvestigadorLgi[]> {
    return this.dataSource
      .getRepository(InvestigadorLgi)
      .createQueryBuilder('investigador')
      .where('investigador.casos_id = :casoId', { casoId })
      .orderBy('investigador.actual', 'DESC')
      .addOrderBy('investigador.fechaasignacion', 'DESC')
      .getMany();
  }

  async findActualesByCaso(
    casoId: number,
  ): Promise<InvestigadorLgi[]> {
    return this.dataSource
      .getRepository(InvestigadorLgi)
      .createQueryBuilder('investigador')
      .where('investigador.casos_id = :casoId', { casoId })
      .andWhere('investigador.actual = :actual', {
        actual: true,
      })
      .orderBy('investigador.fechaasignacion', 'DESC')
      .getMany();
  }
}