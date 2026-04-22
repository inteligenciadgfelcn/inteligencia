import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UpdateServicioDto } from './dto/update-servicio.dto'
import { DB_ASIG_CASOS, DB_AUTH } from '@/core/config/database/database.module'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { Servicio } from './entities/servicio.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateServicioDto } from './dto/create-servicio.dto'
import { formatearFecha, validarRangoFechas } from './utils/fecha.util'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import {
  buscarServicioPorFecha,
  cerrarServiciosVencidos,
  generarCodigoServicio,
  validarCruceServicios,
} from './utils/servicio.util'
import { Estado } from '../../felcn_siii/estado.enum'

type UsuarioAuth = {
  usuario: string
  nombreCompleto: string
  numero_pase: string
  abreviatura: string
}

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio, DB_ASIG_CASOS)
    private readonly servicioRepository: Repository<Servicio>,

    @InjectDataSource(DB_AUTH)
    private readonly dataSourceAuth: DataSource
  ) {}

  async generarCodigoServicio(fechaIngreso: Date, fechaSalida: Date) {
    const ahora = new Date()
    return generarCodigoServicio(fechaIngreso, fechaSalida, ahora)
  }

  async create(dto: CreateServicioDto) {
    const fechaIngreso = dto.fechaIngreso
    const fechaSalida = dto.fechaSalida
    const ahora = new Date()

    validarRangoFechas(fechaIngreso, fechaSalida, ahora)

    await cerrarServiciosVencidos(this.servicioRepository, ahora)

    const servicioHoy = await buscarServicioPorFecha(
      this.servicioRepository,
      fechaIngreso
    )

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

    await validarCruceServicios(
      this.servicioRepository,
      fechaIngreso,
      fechaSalida
    )

    const codigoServicio = generarCodigoServicio(
      fechaIngreso,
      fechaSalida,
      ahora
    )

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

  async findAllPaginado(
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.servicioRepository
      .createQueryBuilder('servicio')
      .take(limite)
      .skip(saltar)
      .orderBy('servicio.fechaIngreso', 'DESC')

    if (filtro) {
      query.andWhere(
        '(servicio.usuarioPrincipal ILIKE :filtro OR servicio.usuarioEmergencia ILIKE :filtro OR servicio.codigoServicio ILIKE :filtro)',
        { filtro: `%${filtro}%` }
      )
    }

    const [servicios, total] = await query.getManyAndCount()

    const usuariosIds = Array.from(
      new Set(
        [
          ...servicios.map((s) => s.usuarioPrincipal),
          ...servicios.map((s) => s.usuarioEmergencia),
        ].filter(Boolean)
      )
    )
    console.log('usuariosIds:', usuariosIds)

    const usuarios: UsuarioAuth[] = await this.dataSourceAuth.query(
      `
  SELECT 
    u.usuario,
    u.numero_pase,
    u.id as "idUsuario",
    TRIM(CONCAT(
      gr.abreviatura, ' ',
      p.nombres, ' ',
      p.primer_apellido, ' ',
      COALESCE(p.segundo_apellido, '')
    )) as "nombreCompleto",
    gr.abreviatura
  FROM usuario.usuario u
  LEFT JOIN usuario.persona p ON p.id = u.id_persona
  LEFT JOIN parametro.grado gr ON gr.id = u.id_grado
  WHERE u.numero_pase = ANY($1::text[])
  `,
      [usuariosIds]
    )

    const usuariosMap = new Map(usuarios.map((u) => [u.numero_pase, u]))

    const resultado = servicios.map((servicio) => {
      const usuarioPrincipal = usuariosMap.get(servicio.usuarioPrincipal)
      const usuarioEmergencia = usuariosMap.get(servicio.usuarioEmergencia)

      return {
        ...servicio,
        fechaIngreso: formatearFecha(servicio.fechaIngreso),
        fechaSalida: formatearFecha(servicio.fechaSalida),

        nombreUsuarioPrincipal: usuarioPrincipal
          ? usuarioPrincipal.nombreCompleto
          : null,

        nombreUsuarioEmergencia: usuarioEmergencia
          ? usuarioEmergencia.nombreCompleto
          : null,
      }
    })

    return [resultado, total]
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
