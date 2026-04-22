import { Injectable } from '@nestjs/common'
import { CreateOperativoDto } from './dto/create-operativo.dto'
import { UpdateOperativoDto } from './dto/update-operativo.dto'
import { AuthRepository } from './repositories/auth.repository'
import { SiiiRepository } from './repositories/siii.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Operativo } from './entities/operativo.entity'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { Departamento } from '../parametrica/provincia/entities/departamento.entity'
import { BuscarAntecedenteDto } from './dto/buscar-antecedente.dto'
import { Estado } from '@/common/constants'
import { PaginacionQueryDto } from '@/common/dto'

@Injectable()
export class OperativoService {
  constructor(
    private readonly siiiRepo: SiiiRepository,
    private readonly authRepo: AuthRepository,

    @InjectRepository(Operativo, DB_SOSPECHOSO)
    private readonly operativoRepo: Repository<Operativo>,

    @InjectRepository(Departamento, DB_SOSPECHOSO)
    private readonly departamentoRepo: Repository<Departamento>
  ) {}

  async create(dto: CreateOperativoDto) {
    const abrev = dto.idDepartamento?.trim().toUpperCase()

    if (!abrev) {
      throw new Error('La abreviatura es requerida')
    }

    const departamento = await this.departamentoRepo.findOne({
      where: { abreviatura: abrev },
    })

    if (!departamento) {
      throw new Error(`Departamento ${abrev} no existe`)
    }

    const operativo = this.operativoRepo.create({
      ...dto,
      idDepartamento: departamento.idDepartamento,
    })

    return await this.operativoRepo.save(operativo)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination
    const query = this.operativoRepo
      .createQueryBuilder('a')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('a.numeroCaso ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    return await query.getManyAndCount()
  }

  async findOne(numero_caso: string) {
    const limpio = decodeURIComponent(numero_caso).trim()

    const result = await this.siiiRepo.getOperativoByCaso(limpio)

    if (!result.length) return null

    const operativo = result[0]

    const auth = await this.authRepo.getEstructura(
      operativo.id_unidad,
      operativo.id_distrital,
      operativo.id_grupo
    )

    return {
      ...operativo,
      unidad: auth.unidad || null,
      distrital: auth.distrital || null,
      grupo: auth.grupo || null,
    }
  }

  async findOneRegistro(numero_caso: string) {
    const limpio = decodeURIComponent(numero_caso).trim()

    const existe = await this.operativoRepo.findOne({
      where: { numeroCaso: limpio },
    })

    if (existe) {
      return {
        existe: true,
        mensaje: 'Ya existe un registro con ese número de caso',
      }
    }

    const result = await this.siiiRepo.getOperativoRegistrado(limpio)

    if (!result.length) {
      return {
        existe: false,
        mensaje: 'No se encontró información para ese caso',
      }
    }

    const operativo = result[0]

    return {
      existe: false,
      numeroCaso: operativo.numero_caso,
      nombreCaso: operativo.nombre_caso,
      asignado: operativo.asignado_caso,
      fiscalAsignado: operativo.fiscal_asignado_caso,
    }
  }

  async verificarAntecedentes(dto: BuscarAntecedenteDto) {
    const personas = await this.siiiRepo.buscarPersonaDetenida(dto)

    if (!personas.length) {
      return {
        encontrado: false,
        mensaje: 'No se encontraron registros',
        data: [],
      }
    }

    return {
      encontrado: true,
      data: personas.map((p) => ({
        nombreCompleto: `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`,
        ci: p.nro_documento,
        cantidadOperativos: p.cantidad_operativos,
        tieneAntecedentes: p.cantidad_operativos >= 1,
      })),
    }
  }
}
