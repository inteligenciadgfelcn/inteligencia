import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOperativoLgiDto } from './dto/create-operativoLgi.dto'
import { UpdateOperativoLgiDto } from './dto/update-operativoLgi.dto'
import { OperativoLgiRepository } from './repository/operativo_lgi.repository'
import { OperativoLgi } from './entities/operativoLgi.entity'
import path from 'path'
import { obtenerRutaRelativa } from '@/common/utils/file-storage.util'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class ActuacionesService {
  constructor(
    private readonly operativoLgiRepository: OperativoLgiRepository
  ) {}

  async create(
    dto: CreateOperativoLgiDto,
    archivo: Express.Multer.File,
    usuario: string
  ): Promise<OperativoLgi> {
    const rutaArchivo = obtenerRutaRelativa(archivo.path)

    return this.operativoLgiRepository.create({
      ...dto,
      rutaArchivo,
      usuario,
    })
  }

  async findAllPaginadoByCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[OperativoLgi[], number]> {
    return this.operativoLgiRepository.findAllPaginadoByCaso(
      casosId,
      pagination
    )
  }
  async findOne(id: number): Promise<OperativoLgi> {
    const operativo = await this.operativoLgiRepository.findOne(id)

    if (!operativo) {
      throw new NotFoundException(`No existe el operativo con op_id ${id}`)
    }

    return operativo
  }

  async update(
    id: number,
    dto: UpdateOperativoLgiDto,
    usuario: string,
    archivo?: Express.Multer.File
  ): Promise<OperativoLgi> {
    const { archivo: archivoDto, ...datos } = dto

    const data: Partial<OperativoLgi> = {
      ...datos,
      usuarioActualizacion: usuario,
    }

    if (archivo) {
      data.rutaArchivo = obtenerRutaRelativa(archivo.path)
    }

    const operativo = await this.operativoLgiRepository.update(id, data)

    if (!operativo) {
      throw new NotFoundException(`No existe el operativo con op_id ${id}`)
    }

    return operativo
  }

  async remove(id: number, usuario: string): Promise<OperativoLgi> {
    const operativo = await this.operativoLgiRepository.inactivar(id, usuario)

    if (!operativo) {
      throw new NotFoundException(
        `No existe el operativo activo con op_id ${id}`
      )
    }

    return operativo
  }
}
