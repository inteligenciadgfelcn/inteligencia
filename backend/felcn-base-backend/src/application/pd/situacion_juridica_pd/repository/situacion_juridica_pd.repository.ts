import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'

import { MedidaCautelar } from '@/application/lgi/parametro/parametricas_lgi/entity/medida_cautelar.entity'

import { CreateSituacionJuridicaPdDto } from '../dto/create-situacion_juridica_pd.dto'
import { UpdateSituacionJuridicaPdDto } from '../dto/update-situacion_juridica_pd.dto'
import {PerdidaDominioLgi } from '../entities/perdida-dominio.entity'
import { BieneSecuestradoLgi } from '@/application/lgi/bienes_secuestrados/entities/bienes_secuestrado.entity'

export type SituacionJuridicaConRelaciones = PerdidaDominioLgi & {
  medidaCautelar: MedidaCautelar | null
}

@Injectable()
export class SituacionJuridicaPdRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // CONSULTA BASE
  // =====================================================

  private consultaBase(
    manager: EntityManager = this.dataSource.manager,
  ) {
    return manager
      .getRepository(PerdidaDominioLgi)
      .createQueryBuilder('s')
      .leftJoinAndMapOne(
        's.medidaCautelar',
        MedidaCautelar,
        'mc',
        'mc.idMedidaCautelar = s.idMedidaCautelar',
      )
  }

  // =====================================================
  // CREAR
  // =====================================================

  async create(
    dto: CreateSituacionJuridicaPdDto,
    usuarioAuditoria?: string,
  ): Promise<SituacionJuridicaConRelaciones> {
    this.validarId(dto.itemBienSecId, 'itemBienSecId')

    const usuario = this.validarTexto(
      usuarioAuditoria,
      'usuario de auditoría',
      15,
    )

    const fiscalia = this.validarTexto(
      dto.fiscalia,
      'fiscalia',
      100,
    )

    const autoridad = this.validarTexto(
      dto.autoridad,
      'autoridad',
      300,
    )

    const fechaResolucion = this.convertirFecha(
      dto.fechaResolucion,
    )

    const idMedidaCautelar = dto.idMedidaCautelar ?? null

    this.validarIdMedidaCautelar(idMedidaCautelar)

    return this.dataSource.transaction(async (manager) => {
      await this.verificarBien(
        manager,
        dto.itemBienSecId,
      )

      await this.verificarMedidaCautelar(
        manager,
        idMedidaCautelar,
      )

      const repository = manager.getRepository(
        PerdidaDominioLgi,
      )

      const registro = repository.create({
        itemBienSecId: dto.itemBienSecId,
        fiscalia,
        autoridad,
        fechaResolucion,
        idMedidaCautelar,
        fechaHoraIngreso: new Date(),
        usuario,
      })

      const guardado = await repository.save(registro)

      return this.obtenerConRelaciones(
        guardado.perdomId,
        manager,
      )
    })
  }

  // =====================================================
  // LISTAR
  // =====================================================

  async findAll(): Promise<SituacionJuridicaConRelaciones[]> {
    const registros = await this.consultaBase()
      .orderBy('s.perdomId', 'DESC')
      .getMany()

    return registros as SituacionJuridicaConRelaciones[]
  }

  // =====================================================
  // LISTAR POR BIEN
  // =====================================================

  async findByBien(
    itemBienSecId: string,
  ): Promise<SituacionJuridicaConRelaciones[]> {
    this.validarId(itemBienSecId, 'itemBienSecId')

    const registros = await this.consultaBase()
      .where('s.itemBienSecId = :itemBienSecId', {
        itemBienSecId,
      })
      .orderBy('s.fechaResolucion', 'DESC')
      .addOrderBy('s.perdomId', 'DESC')
      .getMany()

    return registros as SituacionJuridicaConRelaciones[]
  }

  // =====================================================
  // OBTENER POR ID
  // =====================================================

  async findOne(
    id: string,
  ): Promise<SituacionJuridicaConRelaciones> {
    this.validarId(id, 'perdomId')

    return this.obtenerConRelaciones(id)
  }

  // =====================================================
  // ACTUALIZAR
  // =====================================================

  async update(
    id: string,
    dto: UpdateSituacionJuridicaPdDto,
  ): Promise<SituacionJuridicaConRelaciones> {
    this.validarId(id, 'perdomId')

    const camposNoNulos = [
      'itemBienSecId',
      'fiscalia',
      'fechaResolucion',
      'autoridad',
    ] as const

    for (const campo of camposNoNulos) {
      if (dto[campo] === null) {
        throw new BadRequestException(
          `El campo ${campo} no puede ser null`,
        )
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(
        PerdidaDominioLgi,
      )

      const registro = await repository.findOne({
        where: { perdomId: id },
        lock: { mode: 'pessimistic_write' },
      })

      if (!registro) {
        throw new NotFoundException(
          `No existe una situación jurídica con ID ${id}`,
        )
      }

      if (dto.itemBienSecId !== undefined) {
        this.validarId(
          dto.itemBienSecId,
          'itemBienSecId',
        )

        await this.verificarBien(
          manager,
          dto.itemBienSecId,
        )

        registro.itemBienSecId = dto.itemBienSecId
      }

      if (dto.fiscalia !== undefined) {
        registro.fiscalia = this.validarTexto(
          dto.fiscalia,
          'fiscalia',
          100,
        )
      }

      if (dto.autoridad !== undefined) {
        registro.autoridad = this.validarTexto(
          dto.autoridad,
          'autoridad',
          300,
        )
      }

      if (dto.fechaResolucion !== undefined) {
        registro.fechaResolucion = this.convertirFecha(
          dto.fechaResolucion,
        )
      }

      if (dto.idMedidaCautelar !== undefined) {
        this.validarIdMedidaCautelar(
          dto.idMedidaCautelar,
        )

        await this.verificarMedidaCautelar(
          manager,
          dto.idMedidaCautelar,
        )

        registro.idMedidaCautelar =
          dto.idMedidaCautelar
      }

      const guardado = await repository.save(registro)

      return this.obtenerConRelaciones(
        guardado.perdomId,
        manager,
      )
    })
  }

  // =====================================================
  // ELIMINAR FÍSICAMENTE
  // =====================================================

  async remove(
    id: string,
  ): Promise<{
    mensaje: string
    perdomId: string
  }> {
    this.validarId(id, 'perdomId')

    const resultado = await this.dataSource
      .getRepository(PerdidaDominioLgi)
      .delete({ perdomId: id })

    if (!resultado.affected) {
      throw new NotFoundException(
        `No existe una situación jurídica con ID ${id}`,
      )
    }

    return {
      mensaje: 'Situación jurídica eliminada correctamente',
      perdomId: id,
    }
  }

  // =====================================================
  // CONSULTA INTERNA
  // =====================================================

  private async obtenerConRelaciones(
    id: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<SituacionJuridicaConRelaciones> {
    const registro = await this.consultaBase(manager)
      .where('s.perdomId = :id', { id })
      .getOne()

    if (!registro) {
      throw new NotFoundException(
        `No existe una situación jurídica con ID ${id}`,
      )
    }

    return registro as SituacionJuridicaConRelaciones
  }

  // =====================================================
  // VERIFICAR BIEN
  // =====================================================

  private async verificarBien(
    manager: EntityManager,
    itemBienSecId: string,
  ): Promise<void> {
    const bien = await manager
      .getRepository(BieneSecuestradoLgi)
      .findOne({
        where: {
          itembiensecId: itemBienSecId,
        },
      })

    if (!bien) {
      throw new BadRequestException(
        `No existe el bien con ID ${itemBienSecId}`,
      )
    }
  }

  // =====================================================
  // VERIFICAR MEDIDA CAUTELAR
  // =====================================================

  private async verificarMedidaCautelar(
    manager: EntityManager,
    id: number | null,
  ): Promise<void> {
    if (id === null) {
      return
    }

    const medida = await manager
      .getRepository(MedidaCautelar)
      .findOne({
        where: {
          idMedidaCautelar: id,
        },
      })

    if (!medida) {
      throw new BadRequestException(
        `No existe la medida cautelar con ID ${id}`,
      )
    }
  }

  // =====================================================
  // VALIDACIONES
  // =====================================================

  private validarId(
    id: string,
    campo: string,
  ): void {
    if (
      typeof id !== 'string' ||
      !/^[1-9]\d*$/.test(id) ||
      id.length > 19 ||
      BigInt(id) > BigInt('9223372036854775807')
    ) {
      throw new BadRequestException(
        `${campo} debe ser una cadena con un entero positivo válido de tipo bigint`,
      )
    }
  }

  private validarTexto(
    valor: unknown,
    campo: string,
    longitudMaxima: number,
  ): string {
    if (typeof valor !== 'string') {
      throw new BadRequestException(
        `El campo ${campo} debe ser texto`,
      )
    }

    const texto = valor.trim()

    if (
      !texto ||
      Array.from(texto).length > longitudMaxima
    ) {
      throw new BadRequestException(
        `El campo ${campo} es obligatorio y debe tener hasta ${longitudMaxima} caracteres`,
      )
    }

    return texto
  }

  private convertirFecha(valor: string): Date {
    if (
      typeof valor !== 'string' ||
      !valor.trim()
    ) {
      throw new BadRequestException(
        'La fecha de resolución es obligatoria',
      )
    }

    const fecha = new Date(valor)

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException(
        'La fecha de resolución no es válida',
      )
    }

    return fecha
  }

  private validarIdMedidaCautelar(
    id: number | null,
  ): void {
    if (id === null) {
      return
    }

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      id > 2147483647
    ) {
      throw new BadRequestException(
        'idMedidaCautelar debe ser un entero positivo válido',
      )
    }
  }
}