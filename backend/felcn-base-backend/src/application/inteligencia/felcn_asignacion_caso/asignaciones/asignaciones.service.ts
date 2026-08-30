import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreateAsignacionDto } from './dto/create-asignacione.dto'
import { UpdateAsignacionDto } from './dto/update-asignacione.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import {
  DB_SIII,
  DB_ASIG_CASOS,
  DB_SII,
  DB_AUTH,
} from '@/core/config/database/database.module'
import { Estado } from '../../felcn_siii/estado.enum'
import { AsignacionesRepository } from './repository/asignaciones.repository'
import { AsignacionASIG } from './entities/asignacionAsig.entity'
import { cleanText } from '@/common/utils/text.util'

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSourceAUTH: DataSource,

    @InjectRepository(AsignacionASIG, DB_ASIG_CASOS)
    private readonly asignacionAsig: Repository<AsignacionASIG>,

    @InjectDataSource(DB_SII)
    private readonly dataSourceSII: DataSource,

    @InjectDataSource(DB_SIII)
    private readonly dataSourceSIII: DataSource,

    private readonly asignacionesRepository: AsignacionesRepository
  ) {}

  async generarCodigoRegistro(idDepartamento: string, idGrupo: number) {
    const departamento = await this.dataSourceSII.query(
      `
      SELECT abreviatura
      FROM parametricas.departamento
      WHERE abreviatura = $1
    `,
      [idDepartamento]
    )

    if (!departamento.length) {
      throw new BadRequestException('Departamento no válido')
    }

    const grupo = await this.dataSourceAUTH.query(
      `
      SELECT u.abreviatura as "abreviaturaUnidad"
      FROM parametro.grupo g
      INNER JOIN parametro.distrital d ON g.id_distrital = d.id
      INNER JOIN parametro.unidad u ON d.id_unidad = u.id
      WHERE g.id = $1
    `,
      [idGrupo]
    )

    if (!grupo.length) {
      throw new BadRequestException('Grupo no válido')
    }

    const yearShort = new Date().getFullYear().toString().slice(-2)

    const countResult = await this.dataSourceSIII.query(
      `
      SELECT COUNT(*) as total
      FROM public.asignacion
      WHERE id_departamento_caso = $1
        AND id_grupo = $2
        AND numero_operativo LIKE $3
    `,
      [departamento[0].abreviatura, idGrupo, `%/${yearShort}`]
    )

    const correlativo = Number(countResult[0].total) + 1

    return `${departamento[0].abreviatura}-${grupo[0].abreviaturaUnidad.trim()}-${correlativo}/${yearShort}`
  }

  async create(dto: CreateAsignacionDto) {
    const nroOperativo = await this.generarCodigoRegistro(
      dto.idDepartamento,
      dto.idGrupo
    )

    return this.asignacionesRepository.crearAsignacionDual(dto, nroOperativo)
  }

  async findByCodigoResumen(nroOperativo: string) {
    const result = await this.dataSourceSIII.query(
      `
      SELECT 
        a.id_caso as "id",
        a.numero_operativo as "nroOperativo",
        a.nombre_caso as "nombreCaso",
        a.telefono_solicitud as "telefonoSolicitud",
        a.asignado_caso as "asignado",
        a.telefono_asignado as "telefonoAsignado",
        a.fiscal_asignado_caso as "fiscalAsignado",
        a.telefono_fiscal as "telefonoFiscal",
        d.descripcion as "departamento",
        g.descripcion as "grupo",
        dis.descripcion as "distrito",
        u.descripcion as "unidad"
      FROM public.asignacion a
      LEFT JOIN parametro.departamento d ON a.id_departamento = d.id
      LEFT JOIN parametro.grupo g ON a.id_grupo = g.id
      LEFT JOIN parametro.distrital dis ON g.id_distrital = dis.id
      LEFT JOIN parametro.unidad u ON dis.id_unidad = u.id
      WHERE a.numero_operativo = $1
    `,
      [nroOperativo]
    )

    if (!result.length) {
      throw new NotFoundException(
        `No se encontró asignación con código ${nroOperativo}`
      )
    }

    return result[0]
  }

  async update(id: number, dto: UpdateAsignacionDto) {
    const asignacion = await this.asignacionAsig.findOne({
      where: { idAsignacion: id },
    })
    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada')
    }
    Object.assign(asignacion, dto)
    return this.asignacionAsig.save(asignacion)
  }


  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination
    const query = this.asignacionAsig
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.departamento', 'd')
      .leftJoinAndSelect('a.unidad', 'u')
      .where('a.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('a.nombreCaso ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    return await query.getManyAndCount()
  }

  async findOperativos(
    codigo: string,
    registrados: boolean,
    pagination: PaginacionQueryDto
  ) {
    return this.asignacionesRepository.findOperativos(
      codigo,
      registrados,
      pagination
    )
  }

  async generarNumeroCaso(dpto: string, letra: string) {
    const year = new Date().getFullYear().toString().slice(-2)

    const max = await this.asignacionesRepository.obtenerMaxCorrelativo(
      dpto,
      letra,
      year
    )

    return `${dpto}-${letra.trim()}-${max + 1}/${year}`
  }

  async asignarNumeroCaso(
    nroOperativo: string,
    abreviatura: string,
    letra: string
  ) {
    const result = await this.dataSourceSIII.query(
      `
      SELECT * FROM public.asignacion WHERE numero_operativo = $1
    `,
      [nroOperativo]
    )

    if (!result.length) {
      throw new NotFoundException('Asignación no encontrada')
    }

    const nroCaso = await this.generarNumeroCaso(
      abreviatura.toUpperCase(),
      letra.toUpperCase()
    )

    await this.asignacionesRepository.actualizarNumeroCasoDual(
      nroOperativo,
      cleanText(nroCaso),
      letra
    )

    return {
      message: 'Número de caso asignado correctamente',
      nroCaso,
    }
  }
}
