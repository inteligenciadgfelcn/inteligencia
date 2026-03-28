import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { BaseService } from '@/common/base'
import { DB_S2I } from '../../../shared/constants'
import { Menu } from '../entity/menu.entity'

@Injectable()
export class MenuService extends BaseService {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {
    super()
  }

  async listarMenus(): Promise<Menu[]> {
    return this.dataSource
      .getRepository(Menu)
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.hijos', 'hijos')
      .orderBy('menu.menuPadre', 'ASC')
      .addOrderBy('hijos.nombreMenu', 'ASC')
      .getMany()
  }

  async buscarPorId(id: number): Promise<Menu | null> {
    return this.dataSource
      .getRepository(Menu)
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.hijos', 'hijos')
      .where('menu.id = :id', { id })
      .getOne()
  }
}
