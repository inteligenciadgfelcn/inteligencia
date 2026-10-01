import { Injectable, NotFoundException } from '@nestjs/common'
import { obtenerRutaRelativa } from '@/common/utils/file-storage.util'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { OperativoLgi } from '@/application/lgi/actuaciones/entities/operativoLgi.entity'
import { CreateOperativoPdDto } from './dto/create-operativoPd.dto'
import { OperativoPdRepository } from './repository/operativo_lgi.repository'
import { UpdateOperativoPdDto } from './dto/update-operativoPd.dto'

@Injectable()
export class ActuacionesPdService {
  constructor(
    private readonly operativoRepository: OperativoPdRepository
  ) {}

  async create(
    dto: CreateOperativoPdDto,
    archivo: Express.Multer.File,
    usuario: string
  ): Promise<OperativoLgi> {
    const rutaArchivo = obtenerRutaRelativa(archivo.path)

    return this.operativoRepository.create({
      ...dto,
      rutaArchivo,
      usuario,
    })
  }

  async findAllPaginadoByCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[OperativoLgi[], number]> {
    return this.operativoRepository.findAllPaginadoByCaso(
      casosId,
      pagination
    )
  }
  async findOne(id: number): Promise<OperativoLgi> {
    const operativo = await this.operativoRepository.findOne(id)

    if (!operativo) {
      throw new NotFoundException(`No existe el operativo con op_id ${id}`)
    }

    return operativo
  }

  async update(
    id: number,
    dto: UpdateOperativoPdDto,
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

    const operativo = await this.operativoRepository.update(id, data)

    if (!operativo) {
      throw new NotFoundException(`No existe el operativo con op_id ${id}`)
    }

    return operativo
  }

  async remove(id: number, usuario: string): Promise<OperativoLgi> {
    const operativo = await this.operativoRepository.inactivar(id, usuario)

    if (!operativo) {
      throw new NotFoundException(
        `No existe el operativo activo con op_id ${id}`
      )
    }

    return operativo
  }
}
