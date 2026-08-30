import { PaginacionQueryDto } from "@/common/dto"
import { DB_SOSPECHOSO } from "@/core/config/database/database.module"
import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { DetenidoSospechoso } from "../entities/detenido-sospechoso.entity"

@Injectable()
export class DetenidoSospechosoRepository {
  constructor(
    @InjectDataSource(DB_SOSPECHOSO)
    private readonly dataSource: DataSource
  ) {}

  async findAllPaginado(
    pagination: PaginacionQueryDto,
    idOperativo?: number
  ): Promise<[DetenidoSospechoso[], number]> {
    const { limite = 10, saltar = 0, filtro } = pagination

    const query = this.dataSource
      .getRepository(DetenidoSospechoso)
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.estado', 'estado')
      .leftJoinAndSelect('d.pais', 'pais')
      .leftJoinAndSelect('d.tipoDocumento', 'tipoDocumento')
      .take(limite)
      .skip(saltar)
      .orderBy('d.fechaCreacion', 'DESC')

    if (filtro) {
      query.andWhere(
        `(d.numeroDocumento ILIKE :filtro 
          OR d.nombres ILIKE :filtro 
          OR d.apellidoPaterno ILIKE :filtro 
          OR d.apellidoMaterno ILIKE :filtro)`,
        { filtro: `%${filtro}%` }
      )
    }

    if (idOperativo) {
      query.andWhere('d.idOperativo = :idOperativo', { idOperativo })
    }

    return query.getManyAndCount()
  }

  async updateDetenido(
    id: number,
    dto: Partial<DetenidoSospechoso>
  ): Promise<DetenidoSospechoso> {
    const repo = this.dataSource.getRepository(DetenidoSospechoso)

    await repo.update({ idDetenido: id }, dto)

    const updated = await repo.findOne({
      where: { idDetenido: id },
      relations: ['estado', 'pais', 'tipoDocumento'],
    })

    if (!updated) {
      throw new Error('No se pudo actualizar el detenido')
    }

    return updated
  }

  
}