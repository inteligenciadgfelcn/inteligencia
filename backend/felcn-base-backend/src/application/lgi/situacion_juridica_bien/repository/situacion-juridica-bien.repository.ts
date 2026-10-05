import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'

import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'

import { CreateSituacionJuridicaBienDto } from '../dto/create-principal.dto'
import { UpdateSituacionJuridicaBienDto } from '../dto/update-situacion_juridica_bien.dto'

import { CreateBienSecuestadoDto } from '../dto/create-bien-secuestrado.dto'
import { CreateBienIncautadoDto } from '../dto/create-bien-incautado.dto'
import { CreateBienConfiscadoDto } from '../dto/create-bien-confiscado.dto'

import { UpdateBienSecuestradoDto } from '../dto/update-bien-secuestrado.dto'
import { UpdateBienIncautadoDto } from '../dto/update-bien-incautado.dto'
import { UpdateBienConfiscadoDto } from '../dto/update-bien-confiscado.dto'

import { BienSecuestado } from '../entities/bien-secuestrado.entity'
import { BienIncautado } from '../entities/bien-incautado.entity'
import { BienConfiscado } from '../entities/bien_confiscado.entity'

type DtoConUsuario<T> = T & {
  usuario?: string
}

@Injectable()
export class SituacionJuridicaBienRepository {
  constructor(
    @InjectRepository(BieneSecuestradoLgi, DB_LGI)
    private readonly bienesRepository: Repository<BieneSecuestradoLgi>,

    @InjectRepository(BienSecuestado, DB_LGI)
    private readonly secuestradoRepository: Repository<BienSecuestado>,

    @InjectRepository(BienIncautado, DB_LGI)
    private readonly incautadoRepository: Repository<BienIncautado>,

    @InjectRepository(BienConfiscado, DB_LGI)
    private readonly confiscadoRepository: Repository<BienConfiscado>,
  ) {}

  async create(dto: CreateSituacionJuridicaBienDto): Promise<any> {
    await this.verificarBien(dto.itembiensecId)

    const auditoria = dto as DtoConUsuario<CreateSituacionJuridicaBienDto>

    if (!auditoria.usuario) {
      throw new UnauthorizedException(
        'No se pudo obtener el usuario autenticado'
      )
    }

    const usuario = auditoria.usuario

    switch (dto.idTipoSituacionLegalBien) {
      case 1:
        return this.crearSecuestrado(
          dto.itembiensecId,
          dto.datos as CreateBienSecuestadoDto,
          usuario
        )

      case 2:
        return this.crearIncautado(
          dto.itembiensecId,
          dto.datos as CreateBienIncautadoDto,
          usuario
        )

      case 3:
        return this.crearConfiscado(
          dto.itembiensecId,
          dto.datos as CreateBienConfiscadoDto,
          usuario
        )
      default:
        throw new BadRequestException('Tipo de situación legal no válido')
    }
  }

  async findAll(): Promise<any[]> {
    const [secuestrados, incautados, confiscados] =
      await Promise.all([
        this.secuestradoRepository.find(),
        this.incautadoRepository.find(),
        this.confiscadoRepository.find(),
      ])

    const registros = [
      ...secuestrados.map((registro) => this.formatearSecuestrado(registro)),
      ...incautados.map((registro) => this.formatearIncautado(registro)),
      ...confiscados.map((registro) => this.formatearConfiscado(registro)),
    ]

    return this.ordenarPorFecha(registros)
  }

  async findByBien(itembiensecId: number): Promise<any> {
    await this.verificarBien(itembiensecId)

    const [secuestrados, incautados, confiscados] =
      await Promise.all([
        this.secuestradoRepository.find({
          where: {
            itemBienSecId: itembiensecId,
          },
        }),

        this.incautadoRepository.find({
          where: {
            itemBienSecId: itembiensecId,
          },
        }),

        this.confiscadoRepository.find({
          where: {
            itemBienSecId: itembiensecId,
          },
        }),
      ])

    const registros = [
      ...secuestrados.map((registro) => this.formatearSecuestrado(registro)),

      ...incautados.map((registro) => this.formatearIncautado(registro)),

      ...confiscados.map((registro) => this.formatearConfiscado(registro)),
    ]

    return {
      itembiensecId,
      total: registros.length,
      situacionesJuridicas: this.ordenarPorFecha(registros),
    }
  }

  async findOne(itembiensecId: number): Promise<any> {
    return this.findByBien(itembiensecId)
  }

  async update(
    idTipo: number,
    idRegistro: number,
    dto: UpdateSituacionJuridicaBienDto
  ): Promise<any> {
    if (idTipo !== dto.idTipoSituacionLegalBien) {
      throw new BadRequestException(
        'El tipo de la ruta no coincide con el tipo enviado en el DTO'
      )
    }

    if (dto.itembiensecId !== undefined) {
      await this.verificarBien(dto.itembiensecId)
    }

    const auditoria = dto as DtoConUsuario<UpdateSituacionJuridicaBienDto>

    switch (idTipo) {
      case 1:
        return this.actualizarSecuestrado(idRegistro, dto, auditoria.usuario)

      case 2:
        return this.actualizarIncautado(idRegistro, dto, auditoria.usuario)

      case 3:
        return this.actualizarConfiscado(idRegistro, dto, auditoria.usuario)

      default:
        throw new BadRequestException('Tipo de situación legal no válido')
    }
  }

  async remove(idTipo: number, idRegistro: number): Promise<void> {
    switch (idTipo) {
      case 1: {
        const resultado = await this.secuestradoRepository.delete({
          bsecId: idRegistro,
        })

        this.verificarEliminacion(resultado.affected, idTipo, idRegistro)
        return
      }

      case 2: {
        const resultado = await this.incautadoRepository.delete({
          bincId: idRegistro,
        })

        this.verificarEliminacion(resultado.affected, idTipo, idRegistro)
        return
      }

      case 3: {
        const resultado = await this.confiscadoRepository.delete({
          bconfId: idRegistro,
        })

        this.verificarEliminacion(resultado.affected, idTipo, idRegistro)
        return
      }

      default:
        throw new BadRequestException('Tipo de situación legal no válido')
    }
  }

  private async crearSecuestrado(
    itembiensecId: number,
    dto: CreateBienSecuestadoDto,
    usuario: string
  ): Promise<any> {
    const registro = this.secuestradoRepository.create({
      itemBienSecId: itembiensecId,

      fiscal: dto.fiscal ?? null,

      fechaActaSecuestro: new Date(dto.fechaActaSecuestro),

      investigador: dto.investigador ?? null,

      fechaHoraIngreso: new Date(),

      usuario,
    })

    const resultado = await this.secuestradoRepository.save(registro)

    return this.formatearSecuestrado(resultado)
  }

  private async crearIncautado(
    itembiensecId: number,
    dto: CreateBienIncautadoDto,
    usuario: string
  ): Promise<any> {
    const registro = this.incautadoRepository.create({
      itemBienSecId: itembiensecId,

      nroResol: dto.nroResol ?? null,

      fechaResolucion: new Date(dto.fechaResolucion),

      autoridad: dto.autoridad ?? null,

      fechaHoraIngreso: new Date(),

      usuario,
    })

    const resultado = await this.incautadoRepository.save(registro)

    return this.formatearIncautado(resultado)
  }

  private async crearConfiscado(
    itembiensecId: number,
    dto: CreateBienConfiscadoDto,
    usuario: string
  ): Promise<any> {
    const registro = this.confiscadoRepository.create({
      itemBienSecId: itembiensecId,

      numSentJud: dto.numSentJud ?? null,

      fechaSenjud: new Date(dto.fechaSenjud),

      autoridad: dto.autoridad ?? null,

      fechaHoraIngreso: new Date(),

      usuario,
    })

    const resultado = await this.confiscadoRepository.save(registro)

    return this.formatearConfiscado(resultado)
  }

  private async actualizarSecuestrado(
    idRegistro: number,
    dto: UpdateSituacionJuridicaBienDto,
    usuario?: string
  ): Promise<any> {
    const registro = await this.secuestradoRepository.findOne({
      where: {
        bsecId: idRegistro,
      },
    })

    if (!registro) {
      this.lanzarNoEncontrado(1, idRegistro)
    }

    const datos = dto.datos as UpdateBienSecuestradoDto

    if (dto.itembiensecId !== undefined) {
      registro!.itemBienSecId = dto.itembiensecId
    }

    if (datos.fiscal !== undefined) {
      registro!.fiscal = datos.fiscal
    }

    if (datos.fechaActaSecuestro !== undefined) {
      registro!.fechaActaSecuestro = new Date(datos.fechaActaSecuestro)
    }

    if (datos.investigador !== undefined) {
      registro!.investigador = datos.investigador
    }

    if (usuario) {
      registro!.usuario = usuario
    }

    const resultado = await this.secuestradoRepository.save(registro!)

    return this.formatearSecuestrado(resultado)
  }

  private async actualizarIncautado(
    idRegistro: number,
    dto: UpdateSituacionJuridicaBienDto,
    usuario?: string
  ): Promise<any> {
    const registro = await this.incautadoRepository.findOne({
      where: {
        bincId: idRegistro,
      },
    })

    if (!registro) {
      this.lanzarNoEncontrado(2, idRegistro)
    }

    const datos = dto.datos as UpdateBienIncautadoDto

    if (dto.itembiensecId !== undefined) {
      registro!.itemBienSecId = dto.itembiensecId
    }

    if (datos.nroResol !== undefined) {
      registro!.nroResol = datos.nroResol
    }

    if (datos.fechaResolucion !== undefined) {
      registro!.fechaResolucion = new Date(datos.fechaResolucion)
    }

    if (datos.autoridad !== undefined) {
      registro!.autoridad = datos.autoridad
    }

    if (usuario) {
      registro!.usuario = usuario
    }

    const resultado = await this.incautadoRepository.save(registro!)

    return this.formatearIncautado(resultado)
  }

  private async actualizarConfiscado(
    idRegistro: number,
    dto: UpdateSituacionJuridicaBienDto,
    usuario?: string
  ): Promise<any> {
    const registro = await this.confiscadoRepository.findOne({
      where: {
        bconfId: idRegistro,
      },
    })

    if (!registro) {
      this.lanzarNoEncontrado(3, idRegistro)
    }

    const datos = dto.datos as UpdateBienConfiscadoDto

    if (dto.itembiensecId !== undefined) {
      registro!.itemBienSecId = dto.itembiensecId
    }

    if (datos.numSentJud !== undefined) {
      registro!.numSentJud = datos.numSentJud
    }

    if (datos.fechaSenjud !== undefined) {
      registro!.fechaSenjud = new Date(datos.fechaSenjud)
    }

    if (datos.autoridad !== undefined) {
      registro!.autoridad = datos.autoridad
    }

    if (usuario) {
      registro!.usuario = usuario
    }

    const resultado = await this.confiscadoRepository.save(registro!)

    return this.formatearConfiscado(resultado)
  }

  private formatearSecuestrado(registro: BienSecuestado): any {
    return {
      idRegistro: registro.bsecId,

      idTipoSituacionLegalBien: 1,

      descripcionTipo: 'Secuestrado',

      tabla: 'bienessecuestrados',

      fechaSituacion: registro.fechaActaSecuestro,

      fechaHoraIngreso: registro.fechaHoraIngreso,

      datos: registro,
    }
  }

  private formatearIncautado(registro: BienIncautado): any {
    return {
      idRegistro: registro.bincId,

      idTipoSituacionLegalBien: 2,

      descripcionTipo: 'Incautado',

      tabla: 'bienesincautados',

      fechaSituacion: registro.fechaResolucion,

      fechaHoraIngreso: registro.fechaHoraIngreso,

      datos: registro,
    }
  }

  private formatearConfiscado(registro: BienConfiscado): any {
    return {
      idRegistro: registro.bconfId,

      idTipoSituacionLegalBien: 3,

      descripcionTipo: 'Confiscado/Decomisado',

      tabla: 'bienesconfiscados',

      fechaSituacion: registro.fechaSenjud,

      fechaHoraIngreso: registro.fechaHoraIngreso,

      datos: registro,
    }
  }

  private ordenarPorFecha(registros: any[]): any[] {
    return registros.sort((a, b) => {
      const fechaA = new Date(a.fechaSituacion ?? a.fechaHoraIngreso).getTime()

      const fechaB = new Date(b.fechaSituacion ?? b.fechaHoraIngreso).getTime()

      return fechaB - fechaA
    })
  }

  private verificarEliminacion(
    affected: number | null | undefined,
    idTipo: number,
    idRegistro: number
  ): void {
    if (!affected) {
      this.lanzarNoEncontrado(idTipo, idRegistro)
    }
  }

  private lanzarNoEncontrado(idTipo: number, idRegistro: number): never {
    throw new NotFoundException(
      `No existe el registro ${idRegistro} para el tipo de situación ${idTipo}`
    )
  }

  private async verificarBien(itembiensecId: number): Promise<void> {
    const existe = await this.bienesRepository.exists({
      where: {
        itembiensecId: String(itembiensecId),

        estado: 'ACTIVO',
      },
    })

    if (!existe) {
      throw new NotFoundException(
        `No existe el bien secuestrado con ID ${itembiensecId}`
      )
    }
  }
}
