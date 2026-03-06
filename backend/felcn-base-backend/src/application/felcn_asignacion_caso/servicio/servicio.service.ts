import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UpdateServicioDto } from './dto/update-servicio.dto'
import { DB_ASIG_CASOS } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Servicio } from './entities/servicio.entity'
import { Repository } from 'typeorm'
import { CreateServicioDto } from './dto/create-servicio.dto'
import { Estado } from '@/application/felcn_siii/estado.enum'
import { formatearFecha, validarRangoFechas } from './utils/fecha.util'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import {
  buscarServicioHoy,
  cerrarServiciosVencidos,
  generarCodigoServicio,
  validarCruceServicios,
} from './utils/servicio.util'

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio, DB_ASIG_CASOS)
    private readonly servicioRepository: Repository<Servicio>
  ) {}

  async create(dto: CreateServicioDto) {
    const fechaIngreso = dto.fechaIngreso
    const fechaSalida = dto.fechaSalida
    const ahora = new Date()

    validarRangoFechas(fechaIngreso, fechaSalida, ahora)

    // cerrar servicios vencidos
    await cerrarServiciosVencidos(this.servicioRepository, ahora)

    // verificar si ya existe servicio hoy
    const servicioHoy = await buscarServicioHoy(this.servicioRepository)

    if (servicioHoy) {
      return {
        mensaje: 'Hoy ya existe un servicio registrado',
        servicio: {
          codigoServicio: servicioHoy.codigoServicio,
          usuarioPrincipal: servicioHoy.usuarioPrincipal,
          usuarioEmergencia: servicioHoy.usuarioEmergencia,
          fechaIngreso: formatearFecha(servicioHoy.fechaIngreso),
          fechaSalida: formatearFecha(servicioHoy.fechaSalida),
          estado: servicioHoy.estado,
        },
      }
    }

    // validar cruce de servicios
    await validarCruceServicios(
      this.servicioRepository,
      fechaIngreso,
      fechaSalida
    )

    // generar codigo
    const codigoServicio = generarCodigoServicio(
      fechaIngreso,
      fechaSalida,
      ahora
    )

    // verificar si el código ya existe
    const existeCodigo = await this.servicioRepository.findOne({
      where: { codigoServicio },
    })

    if (existeCodigo) {
      return {
        mensaje: 'El código de servicio ya existe',
        servicio: {
          codigoServicio: existeCodigo.codigoServicio,
          usuarioPrincipal: existeCodigo.usuarioPrincipal,
          usuarioEmergencia: existeCodigo.usuarioEmergencia,
          fechaIngreso: formatearFecha(existeCodigo.fechaIngreso),
          fechaSalida: formatearFecha(existeCodigo.fechaSalida),
          estado: existeCodigo.estado,
        },
      }
    }

    const servicio = this.servicioRepository.create({
      codigoServicio,
      usuarioPrincipal: dto.usuarioPrincipal,
      usuarioEmergencia: dto.usuarioEmergencia,
      fechaIngreso,
      fechaSalida,
    })

    const servicioGuardado = await this.servicioRepository.save(servicio)

    return {
      codigoServicio: servicioGuardado.codigoServicio,
      usuarioPrincipal: servicioGuardado.usuarioPrincipal,
      usuarioEmergencia: servicioGuardado.usuarioEmergencia,
      fechaIngreso: formatearFecha(servicioGuardado.fechaIngreso),
      fechaSalida: formatearFecha(servicioGuardado.fechaSalida),
      estado: servicioGuardado.estado,
    }
  }

  async verificarServicio(usuario: string) {
    const ahora = new Date()

    const servicio = await this.servicioRepository
      .createQueryBuilder('s')
      .where(
        '(s.usuarioPrincipal = :usuario OR s.usuarioEmergencia = :usuario)',
        { usuario }
      )
      .andWhere('s.estado = :estado', { estado: Estado.ACTIVO })
      .andWhere('s.fechaIngreso <= :ahora', { ahora })
      .andWhere('s.fechaSalida >= :ahora', { ahora })
      .getOne()

    if (!servicio) {
      return {
        enServicio: false,
        mensaje: 'Usuario sin servicio asignado',
      }
    }

    return {
      enServicio: true,
      codigoServicio: servicio.codigoServicio,
      usuario,
      desde: formatearFecha(servicio.fechaIngreso),
      hasta: formatearFecha(servicio.fechaSalida),
    }
  }

  async infoServicio(codigoServicio: string) {
    const servicio = await this.servicioRepository.findOne({
      where: { codigoServicio },
    })

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado')
    }

    return servicio
  }

  async update(codigoServicio: string, dto: UpdateServicioDto) {
    const servicio = await this.servicioRepository.findOne({
      where: { codigoServicio },
    })

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado')
    }

    const ahora = new Date()

    if (servicio.fechaIngreso <= ahora) {
      throw new BadRequestException(
        'No se puede modificar un servicio que ya inició'
      )
    }

    const fechaIngreso = dto.fechaIngreso ?? servicio.fechaIngreso
    const fechaSalida = dto.fechaSalida ?? servicio.fechaSalida

    validarRangoFechas(fechaIngreso, fechaSalida, ahora)

    await validarCruceServicios(
      this.servicioRepository,
      fechaIngreso,
      fechaSalida,
      codigoServicio
    )

    if (dto.usuarioPrincipal !== undefined) {
      servicio.usuarioPrincipal = dto.usuarioPrincipal
    }

    if (dto.usuarioEmergencia !== undefined) {
      servicio.usuarioEmergencia = dto.usuarioEmergencia
    }

    servicio.fechaIngreso = fechaIngreso
    servicio.fechaSalida = fechaSalida

    const actualizado = await this.servicioRepository.save(servicio)

    return {
      codigoServicio: actualizado.codigoServicio,
      usuarioPrincipal: actualizado.usuarioPrincipal,
      usuarioEmergencia: actualizado.usuarioEmergencia,
      fechaIngreso: formatearFecha(actualizado.fechaIngreso),
      fechaSalida: formatearFecha(actualizado.fechaSalida),
      estado: actualizado.estado,
    }
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination

    const query = this.servicioRepository
      .createQueryBuilder('servicio')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(servicio.usuarioPrincipal ILIKE :filtro OR servicio.usuarioEmergencia ILIKE :filtro OR servicio.codigoServicio ILIKE :filtro)',
        { filtro: `%${filtro}%` }
      )
    }
    return await query.getManyAndCount()
  }

  async findOne(codigoServicio: string) {
    const servicio = await this.servicioRepository.findOne({
      where: { codigoServicio },
    })

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado')
    }

    return {
      codigoServicio: servicio.codigoServicio,
      usuarioPrincipal: servicio.usuarioPrincipal,
      usuarioEmergencia: servicio.usuarioEmergencia,
      fechaIngreso: formatearFecha(servicio.fechaIngreso),
      fechaSalida: formatearFecha(servicio.fechaSalida),
      estado: servicio.estado,
    }
  }
}
