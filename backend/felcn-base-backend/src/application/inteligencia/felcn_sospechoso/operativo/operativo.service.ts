import { Injectable } from '@nestjs/common'
import { CreateOperativoDto } from './dto/create-operativo.dto'
import { UpdateOperativoDto } from './dto/update-operativo.dto'
import { DB_SIII } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'

@Injectable()
export class OperativoService {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource
  ) {}
  create(createOperativoDto: CreateOperativoDto) {
    return 'This action adds a new operativo'
  }

  findAll() {
    return `This action returns all operativo`
  }

 async findOne(numero_caso: string) {
  const result = await this.dataSource.query(
    `SELECT o.* 
     FROM operativo o
     INNER JOIN asignacion a 
       ON o.numero_operativo = a.numero_operativo
     WHERE a.numero_caso = $1`,
    [numero_caso]
  )

  console.log(result)

  return result
}

  update(id: number, updateOperativoDto: UpdateOperativoDto) {
    return `This action updates a #${id} operativo`
  }

  remove(id: number) {
    return `This action removes a #${id} operativo`
  }
}
