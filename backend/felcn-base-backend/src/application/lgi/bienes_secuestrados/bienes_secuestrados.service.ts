import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  PaginacionQueryDto,
} from '@/common/dto/paginacion-query.dto'

import {
  CreateBienesSecuestradoDto,
} from './dto/create-bienes_secuestrado.dto'
import {
  UpdateBieneSecuestradoLgiDto,
} from './dto/update-bienes_secuestrado.dto'
import {
  BieneSecuestradoLgi,
} from './entities/bienes_secuestrado.entity'
import {
  BienSecuestradoLgiRepository,
} from './repository/bien_secuestrado_lgi.repository'

@Injectable()
export class BieneSecuestradoLgiService {
  constructor(
    private readonly repository:
      BienSecuestradoLgiRepository,
  ) {}

  create(
    dto: CreateBienesSecuestradoDto,
    archivos: Express.Multer.File[],
  ): Promise<BieneSecuestradoLgi> {
    return this.repository.create(
      dto,
      archivos,
    )
  }

  findAll(
    opId: number,
  ): Promise<BieneSecuestradoLgi[]> {
    return this.repository.findAll(opId)
  }

  findAllPaginado(
    opId: number,
    pagination: PaginacionQueryDto,
  ): Promise<[BieneSecuestradoLgi[], number]> {
    return this.repository
      .findAllPaginado(
        opId,
        pagination,
      )
  }

  findAllByOperativo(
    opId: number,
  ): Promise<BieneSecuestradoLgi[]> {
    return this.repository
      .findAllByOperativo(opId)
  }

  findOne(id: number) {
    return this.repository.findOne(id)
  }

  update(
    id: number,
    dto: UpdateBieneSecuestradoLgiDto,
  ) {
    return this.repository.update(
      id,
      dto,
    )
  }

  agregarFotografias(
    id: number,
    archivos: Express.Multer.File[],
  ) {
    return this.repository
      .guardarFotografias(
        id,
        archivos,
      )
  }

  async obtenerFotografias(
    id: number,
  ) {
    const fotografias =
      await this.repository
        .findFotografias(id)

    if (!fotografias.length) {
      throw new NotFoundException(
        'El bien no tiene fotografías',
      )
    }

    return fotografias.map(
      (foto) => {
        const mimeType =
          this.detectarMimeType(
            foto.fotografia,
          )

        const contenidoBase64 =
          foto.fotografia
            .toString('base64')

        return {
          fotobienId:
            foto.fotobienId,

          descripcion:
            foto.descripcion,

          mimeType,

          contenidoBase64,

          dataUrl:
            `data:${mimeType};base64,${contenidoBase64}`,
        }
      },
    )
  }

  async eliminarFotografia(
    fotoId: number,
  ) {
    await this.repository
      .inactivarFotografia(fotoId)

    return {
      message:
        'Fotografía inactivada correctamente',
    }
  }

  async eliminar(id: number) {
    await this.repository.inactivar(id)

    return {
      message:
        'Bien secuestrado inactivado correctamente',
    }
  }

  private detectarMimeType(
    buffer: Buffer,
  ): string {
    if (
      buffer[0] === 0xff &&
      buffer[1] === 0xd8
    ) {
      return 'image/jpeg'
    }

    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'image/png'
    }

    if (
      buffer
        .subarray(0, 4)
        .toString() === 'RIFF' &&
      buffer
        .subarray(8, 12)
        .toString() === 'WEBP'
    ) {
      return 'image/webp'
    }

    return 'application/octet-stream'
  }
}