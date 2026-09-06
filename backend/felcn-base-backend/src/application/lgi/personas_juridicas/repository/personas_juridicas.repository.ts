import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import { extname, join } from 'path'
import { DB_LGI } from '@/core/config/database/database.module'
import {
  crearStreamArchivo,
  obtenerArchivoSeguro,
} from '@/common/utils/archivo-seguro.util'
import { obtenerRutaRelativa } from '@/common/utils/file-storage.util'
import { CreatePersonasJuridicaDto } from '../dto/create-personas_juridica.dto'
import { UpdatePersonasJuridicaDto } from '../dto/update-personas_juridica.dto'
import { PersonasJuridica } from '../entities/personas_juridica.entity'

type DtoConUsuario<T> = T & {
  usuario?: string
}

@Injectable()
export class PersonasJuridicasRepository {
  constructor(
    @InjectRepository(PersonasJuridica, DB_LGI)
    private readonly repository: Repository<PersonasJuridica>
  ) {}

  async create(
    dto: CreatePersonasJuridicaDto,
    imagen?: Express.Multer.File,
    documento?: Express.Multer.File
  ): Promise<any> {
    const auditoria = dto as DtoConUsuario<CreatePersonasJuridicaDto>

    if (!auditoria.usuario) {
      throw new UnauthorizedException(
        'No se pudo obtener el usuario autenticado'
      )
    }

    let rutaDocumento: string | null = null

    try {
      if (documento) {
        rutaDocumento = await this.guardarDocumento(documento)
      }

      const datosEmpresa: Record<string, any> = {
        ...dto,
      }

      const registro = this.repository.create({
        ...datosEmpresa,

        opId: String(dto.opId),

        idTipoVinculo: dto.idTipoVinculo ?? null,

        imagen: imagen?.buffer ?? null,

        documento: rutaDocumento,

        pericia: dto.pericia ?? false,

        fechaHoraIngreso: new Date(),

        usuario: auditoria.usuario,
      })

      const resultado = await this.repository.save(registro)

      return this.findOne(Number(resultado.empId))
    } catch (error) {
      if (rutaDocumento) {
        await this.eliminarDocumentoGuardado(rutaDocumento)
      }

      throw error
    }
  }

  async findByOperativo(opId: number): Promise<any[]> {
    const registros = await this.repository.find({
      where: {
        opId: String(opId),
      },

      order: {
        empId: 'DESC',
      },
    })

    return registros.map((registro) => this.formatearEmpresa(registro))
  }

  async findOne(empId: number): Promise<any> {
    const registro = await this.buscarEntidadConImagen(empId)

    return this.formatearEmpresa(registro, true)
  }

  async update(
    empId: number,
    dto: UpdatePersonasJuridicaDto,
    imagen?: Express.Multer.File,
    documento?: Express.Multer.File
  ): Promise<any> {
    const registro = await this.buscarEntidadConImagen(empId)

    const auditoria = dto as DtoConUsuario<UpdatePersonasJuridicaDto>

    const documentoAnterior = registro.documento

    let nuevoDocumento: string | null = null

    try {
      const datosEmpresa: Record<string, any> = {
        ...dto,
      }

      this.repository.merge(registro, datosEmpresa)

      if (dto.opId !== undefined) {
        registro.opId = String(dto.opId)
      }

      if (dto.idTipoVinculo !== undefined) {
        registro.idTipoVinculo = dto.idTipoVinculo
      }

      if (dto.pericia !== undefined) {
        registro.pericia = dto.pericia
      }

      if (imagen?.buffer) {
        registro.imagen = imagen.buffer
      }

      if (documento) {
        nuevoDocumento = await this.guardarDocumento(documento)

        registro.documento = nuevoDocumento
      }

      if (auditoria.usuario) {
        registro.usuario = auditoria.usuario
      }

      await this.repository.save(registro)

      if (nuevoDocumento && documentoAnterior) {
        await this.eliminarDocumentoGuardado(documentoAnterior)
      }

      return this.findOne(empId)
    } catch (error) {
      if (nuevoDocumento) {
        await this.eliminarDocumentoGuardado(nuevoDocumento)
      }

      throw error
    }
  }

  async remove(empId: number): Promise<void> {
    const registro = await this.repository.findOne({
      where: {
        empId: String(empId),
      },
    })

    if (!registro) {
      throw new NotFoundException(`No existe la empresa con ID ${empId}`)
    }

    const rutaDocumento = registro.documento

    await this.repository.remove(registro)

    if (rutaDocumento) {
      await this.eliminarDocumentoGuardado(rutaDocumento)
    }
  }

  private async buscarEntidadConImagen(
    empId: number
  ): Promise<PersonasJuridica> {
    const registro = await this.repository
      .createQueryBuilder('empresa')
      .addSelect('empresa.imagen')
      .where('empresa.empId = :empId', {
        empId,
      })
      .getOne()

    if (!registro) {
      throw new NotFoundException(`No existe la empresa con ID ${empId}`)
    }

    return registro
  }

  private formatearEmpresa(
    registro: PersonasJuridica,
    incluirImagen = false
  ): any {
    const { imagen, ...datos } = registro

    let imagenBase64: string | null = null

    let imagenDataUrl: string | null = null

    let imagenMimeType: string | null = null

    if (incluirImagen && imagen) {
      const buffer = Buffer.from(imagen)

      imagenMimeType = this.detectarMimeImagen(buffer)

      imagenBase64 = buffer.toString('base64')

      imagenDataUrl = `data:${imagenMimeType};base64,${imagenBase64}`
    }

    return {
      ...datos,

      usuario: registro.usuario?.trim() ?? null,

      tieneImagen: incluirImagen ? Boolean(imagen) : undefined,

      imagenMimeType: incluirImagen ? imagenMimeType : undefined,

      imagenBase64: incluirImagen ? imagenBase64 : undefined,

      imagenDataUrl: incluirImagen ? imagenDataUrl : undefined,

      tieneDocumento: Boolean(registro.documento),
    }
  }

  private async guardarDocumento(
    archivo: Express.Multer.File
  ): Promise<string> {
    const anio = new Date().getFullYear().toString()

    const directorio = join(
      process.cwd(),
      'storage',
      'lgi',
      'personas-juridicas',
      anio
    )

    await fs.mkdir(directorio, {
      recursive: true,
    })

    const extension = extname(archivo.originalname).toLowerCase()

    const nombreArchivo = `${Date.now()}-${randomUUID()}${extension}`

    const rutaCompleta = join(directorio, nombreArchivo)

    await fs.writeFile(rutaCompleta, archivo.buffer)

    return obtenerRutaRelativa(rutaCompleta)
  }

  private async eliminarDocumentoGuardado(
    ruta: string | null | undefined
  ): Promise<void> {
    if (!ruta) {
      return
    }

    try {
      const archivo = await obtenerArchivoSeguro(ruta)

      if (archivo) {
        await fs.unlink(archivo.rutaCompleta)
      }
    } catch {}
  }

  private detectarMimeImagen(buffer: Buffer): string {
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'image/png'
    }

    if (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString() === 'RIFF' &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    ) {
      return 'image/webp'
    }

    if (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    ) {
      return 'image/jpeg'
    }

    return 'application/octet-stream'
  }
}
