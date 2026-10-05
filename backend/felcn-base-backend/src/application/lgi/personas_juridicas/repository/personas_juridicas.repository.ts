import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, DeepPartial, In, Repository } from 'typeorm'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import { resolve, sep } from 'path'
import { DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto'
import { crearStreamArchivo } from '@/common/utils/archivo-seguro.util'
import { CreatePersonasJuridicaDto } from '../dto/create-personas_juridica.dto'
import { UpdatePersonasJuridicaDto } from '../dto/update-personas_juridica.dto'
import { PersonasJuridica } from '../entities/personas_juridica.entity'
import { VinculoLgi } from '../../parametro/vinculo/entities/vinculo.entity'
import { ImplicadoLgi } from '../../implicados/entities/implicado.entity'
type DtoConUsuario<T> = T & {
  usuario?: string
}
interface FiltrosEmpresas {
  opId?: number
  casosId?: number
}
interface DocumentoGuardado {
  rutaRelativa: string
  rutaCompleta: string
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
    auditoria.usuario = auditoria.usuario?.trim()
    if (!auditoria.usuario) {
      throw new UnauthorizedException(
        'No se pudo obtener el usuario autenticado'
      )
    }
    const {
      imagen: _imagen,
      documento: _documento,
      opId,
      pericia,
      ...datosDto
    } = dto
    let documentoGuardado: DocumentoGuardado | null = null
    let resultado: PersonasJuridica
    try {
      if (documento) {
        documentoGuardado = await this.guardarDocumento(documento)
      }
      const datosRegistro: DeepPartial<PersonasJuridica> = {
        ...datosDto,
        opId: String(opId),
        pericia,
        imagen: imagen?.buffer,
        documento: documentoGuardado?.rutaRelativa,
        usuario: auditoria.usuario,
        fechaHoraIngreso: new Date(),
      }
      const registro = this.repository.create(datosRegistro)
      resultado = await this.repository.save(registro)
    } catch (error) {
      if (documentoGuardado) {
        await this.eliminarArchivoFisico(documentoGuardado.rutaCompleta)
      }
      throw error
    }
    return this.findOne(Number(resultado.empId))
  }

  async findAll(): Promise<any[]> {
    const registros = await this.repository.find({
      order: {
        empId: 'DESC',
      },
    })
    return registros.map((registro) => this.formatearEmpresa(registro))
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

  async findAllPaginadoPorOperativo(
    opId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    return this.buscarEmpresasPaginadas(pagination, {
      opId,
    })
  }

  async findAllPaginadoPorCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    return this.buscarEmpresasPaginadas(pagination, {
      casosId,
    })
  }

  async findOne(empId: number): Promise<any> {
    const empresa = await this.buscarEntidadConImagen(empId)
    const [relaciones, situacionesJuridicas, implicados] = await Promise.all([
      this.obtenerRelacionesEmpresa(empId),
      this.obtenerSituacionesJuridicas(empId),
      this.obtenerImplicadosEmpresa(empId),
    ])
    return {
      ...this.formatearEmpresa(empresa, true),
      vinculo: relaciones?.vinculo ?? null,
      situacionesJuridicas,
      ultimaSituacionJuridica: situacionesJuridicas[0] ?? null,
      implicados,
    }
  }

  async update(
    empId: number,
    dto: UpdatePersonasJuridicaDto,
    imagen?: Express.Multer.File,
    documento?: Express.Multer.File
  ): Promise<any> {
    const registro = await this.buscarEntidadConImagen(empId)
    const auditoria = dto as DtoConUsuario<UpdatePersonasJuridicaDto>
    const rutaDocumentoAnterior = registro.documento
    const {
      imagen: _imagen,
      documento: _documento,
      opId,
      pericia,
      ...datosDto
    } = dto
    let documentoNuevo: DocumentoGuardado | null = null
    try {
      this.repository.merge(registro, datosDto as DeepPartial<PersonasJuridica>)
      if (opId !== undefined) {
        if (opId === null) {
          throw new BadRequestException('opId no puede ser null')
        }
        registro.opId = String(opId)
      }
      if (pericia !== undefined) {
        registro.pericia = pericia
      }
      if (imagen?.buffer?.length) {
        registro.imagen = imagen.buffer
      }
      if (documento) {
        documentoNuevo = await this.guardarDocumento(documento)
        registro.documento = documentoNuevo.rutaRelativa
      }
      if (auditoria.usuario) {
        registro.usuario = auditoria.usuario
      }
      await this.repository.save(registro)
    } catch (error) {
      if (documentoNuevo) {
        await this.eliminarArchivoFisico(documentoNuevo.rutaCompleta)
      }
      throw error
    }
    if (documentoNuevo && rutaDocumentoAnterior) {
      await this.eliminarDocumentoGuardado(rutaDocumentoAnterior)
    }
    return this.findOne(empId)
  }

  async remove(empId: number): Promise<void> {
    const registro = await this.buscarEntidadConImagen(empId)
    const rutaDocumento = registro.documento
    await this.repository.remove(registro)
    if (rutaDocumento) {
      await this.eliminarDocumentoGuardado(rutaDocumento)
    }
  }

  async obtenerDocumento(empId: number) {
    const registro = await this.repository.findOne({
      where: {
        empId: String(empId),
      },
    })
    if (!registro) {
      throw new NotFoundException(`No existe la empresa con ID ${empId}`)
    }
    return crearStreamArchivo(registro.documento)
  }

  private async buscarEmpresasPaginadas(
  pagination: PaginacionQueryDto,
  filtros: FiltrosEmpresas
): Promise<[any[], number]> {
  const { limite, saltar, filtro } = pagination
  const query = this.consultaBase()

  if (filtros.opId !== undefined) {
    query.andWhere('empresa.op_id = :opId', {
      opId: filtros.opId,
    })
  }

  if (filtros.casosId !== undefined) {
    query.andWhere(
      `EXISTS (
        SELECT 1
        FROM operativo o
        WHERE o.op_id = empresa.op_id
          AND o.casos_id = :casosId
      )`,
      { casosId: filtros.casosId }
    )
  }

  if (filtro?.trim()) {
    const columnas = [
      'empresa.nombre',
      'empresa.nit',
      'empresa.matricula',
      'empresa.representante',
      'empresa.direccion',
      'vinculo.descripcion',
      'ultima_situacion.descripcion_tipo',
    ]

    query.andWhere(
      new Brackets((qb) => {
        columnas.forEach((columna, index) => {
          const condicion = `${columna} ILIKE :filtro`

          if (index === 0) {
            qb.where(condicion)
          } else {
            qb.orWhere(condicion)
          }
        })
      }),
      { filtro: `%${filtro.trim()}%` }
    )
  }

  const total = await query.clone().getCount()

  const empresas = await query
    .orderBy('empresa.emp_id', 'DESC')
    .limit(limite)
    .offset(saltar)
    .getRawMany()

  if (!empresas.length) {
    return [[], total]
  }

  // id_empresa es integer en la entidad de implicados.
  const empresasIds = empresas.map((empresa) => Number(empresa.empId))

  const implicados = await this.repository.manager
    .getRepository(ImplicadoLgi)
    .find({
      where: {
        empresaId: In(empresasIds),
        estado: 'ACTIVO',
      },
      order: {
        id: 'ASC',
      },
    })

  const implicadosPorEmpresa = new Map<number, ImplicadoLgi[]>()

  for (const implicado of implicados) {
    if (implicado.empresaId === null) continue

    const lista = implicadosPorEmpresa.get(implicado.empresaId) ?? []

    lista.push(implicado)
    implicadosPorEmpresa.set(implicado.empresaId, lista)
  }

  const data = empresas.map((empresa) => ({
    ...empresa,
    implicados: implicadosPorEmpresa.get(Number(empresa.empId)) ?? [],
  }))

  return [data, total]
}

  private consultaBase() {
    return this.repository
      .createQueryBuilder('empresa')
      .leftJoin(
        VinculoLgi,
        'vinculo',
        `vinculo.id_vinculo = empresa.id_vinculo`
      )
      .leftJoin(
        (subQuery) =>
          subQuery
            .select('situacion.id_empresa', 'id_empresa')
            .addSelect(
              `situacion.id_situacion_juridica_empresa`,
              'id_situacion_juridica_empresa'
            )
            .addSelect('situacion.fecha', 'fecha')
            .addSelect(`situacion.fechahoraing`, 'fechahoraing')
            .addSelect('situacion.usuario', 'usuario')
            .addSelect(
              `situacion.id_tipo_situacion_juridica`,
              'id_tipo_situacion_juridica'
            )
            .addSelect(`tipo_situacion.descripcion`, 'descripcion_tipo')
            .distinctOn(['situacion.id_empresa'])
            .from('situacion_juridica_empresa', 'situacion')
            .leftJoin(
              'tipo_situacion_juridica',
              'tipo_situacion',
              `tipo_situacion.id_tipo_situacion_juridica = situacion.id_tipo_situacion_juridica`
            )
            .orderBy('situacion.id_empresa', 'ASC')
            .addOrderBy('situacion.fecha', 'DESC', 'NULLS LAST')
            .addOrderBy('situacion.fechahoraing', 'DESC', 'NULLS LAST')
            .addOrderBy(`situacion.id_situacion_juridica_empresa`, 'DESC'),
        'ultima_situacion',
        `ultima_situacion.id_empresa::bigint = empresa.emp_id`
      )
      .select([
        `empresa.emp_id AS "empId"`,
        `empresa.op_id AS "opId"`,
        `empresa.nombre AS "nombre"`,
        `empresa.nit AS "nit"`,
        `empresa.matricula AS "matricula"`,
        `empresa.representante AS "representante"`,
        `empresa.obs AS "observaciones"`,
        `empresa.capital_social AS "capitalSocial"`,
        `empresa.direccion AS "direccion"`,
        `empresa.latitud AS "latitud"`,
        `empresa.longitud AS "longitud"`,
        `empresa.id_vinculo AS "idVinculo"`,
        `empresa.pericia AS "pericia"`,
        `empresa.resultado AS "resultado"`,
        `empresa.documento AS "documento"`,
        `empresa.fechahoraing AS "fechaHoraIngreso"`,
        `TRIM(empresa.usuario) AS "usuario"`,
        'empresa.imagen IS NOT NULL AS "tieneImagen"',
        `CASE WHEN vinculo.id_vinculo IS NULL THEN NULL
 ELSE jsonb_build_object(
   'idVinculo', vinculo.id_vinculo,
   'descripcion', vinculo.descripcion
 ) END AS "vinculo"`,
        `CASE WHEN ultima_situacion.id_situacion_juridica_empresa IS NULL THEN NULL ELSE jsonb_build_object( 'idSituacionJuridicaEmpresa', ultima_situacion.id_situacion_juridica_empresa, 'idEmpresa', ultima_situacion.id_empresa, 'fecha', ultima_situacion.fecha, 'fechaHoraIngreso', ultima_situacion.fechahoraing, 'usuario', TRIM( ultima_situacion.usuario ), 'idTipoSituacionJuridica', ultima_situacion.id_tipo_situacion_juridica, 'descripcionTipo', ultima_situacion.descripcion_tipo ) END AS "ultimaSituacionJuridica"`,
      ])
  }

  private async obtenerRelacionesEmpresa(empId: number): Promise<any> {
    return this.consultaBase()
      .where('empresa.emp_id = :empId', { empId })
      .getRawOne()
  }

  private async obtenerSituacionesJuridicas(empId: number): Promise<any[]> {
    return this.repository.manager
      .createQueryBuilder()
      .select([
        `situacion.id_situacion_juridica_empresa AS "idSituacionJuridicaEmpresa"`,
        `situacion.id_empresa AS "idEmpresa"`,
        `situacion.fecha AS "fecha"`,
        `situacion.fechahoraing AS "fechaHoraIngreso"`,
        `TRIM(situacion.usuario) AS "usuario"`,
        `situacion.id_tipo_situacion_juridica AS "idTipoSituacionJuridica"`,
        `tipo_situacion.descripcion AS "descripcionTipo"`,
      ])
      .from('situacion_juridica_empresa', 'situacion')
      .leftJoin(
        'tipo_situacion_juridica',
        'tipo_situacion',
        `tipo_situacion.id_tipo_situacion_juridica = situacion.id_tipo_situacion_juridica`
      )
      .where(`situacion.id_empresa = :empId`, {
        empId,
      })
      .orderBy('situacion.fecha', 'DESC', 'NULLS LAST')
      .addOrderBy('situacion.fechahoraing', 'DESC', 'NULLS LAST')
      .addOrderBy(`situacion.id_situacion_juridica_empresa`, 'DESC')
      .getRawMany()
  }

  private async buscarEntidadConImagen(
    empId: number
  ): Promise<PersonasJuridica> {
    const registro = await this.repository
      .createQueryBuilder('empresa')
      .addSelect('empresa.imagen')
      .where(`empresa.empId = :empId`, {
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
      tieneImagen: Boolean(imagen),
      imagenMimeType: incluirImagen ? imagenMimeType : undefined,
      imagenBase64: incluirImagen ? imagenBase64 : undefined,
      imagenDataUrl: incluirImagen ? imagenDataUrl : undefined,
      tieneDocumento: Boolean(registro.documento),
    }
  }

  private async guardarDocumento(
    archivo: Express.Multer.File
  ): Promise<DocumentoGuardado> {
    if (!archivo.buffer?.length) {
      throw new BadRequestException(
        'El documento recibido no contiene información'
      )
    }
    const extensionesPermitidas = new Map<string, string>([
      ['application/pdf', '.pdf'],
      ['image/jpeg', '.jpg'],
      ['image/png', '.png'],
      ['image/webp', '.webp'],
    ])
    const extension = extensionesPermitidas.get(archivo.mimetype)
    if (!extension) {
      throw new BadRequestException(
        'El documento debe estar en formato PDF, JPG, PNG o WEBP'
      )
    }
    const year = new Date().getFullYear().toString()
    const directorio = resolve(
      process.cwd(),
      'storage',
      'lgi',
      'personas-juridicas',
      year
    )
    await fs.mkdir(directorio, {
      recursive: true,
    })
    const nombreArchivo = `${Date.now()}-${randomUUID()}${extension}`
    const rutaCompleta = resolve(directorio, nombreArchivo)
    await fs.writeFile(rutaCompleta, archivo.buffer)
    return {
      rutaCompleta,
      rutaRelativa: [
        'storage',
        'lgi',
        'personas-juridicas',
        year,
        nombreArchivo,
      ].join('/'),
    }
  }

  private async eliminarDocumentoGuardado(rutaRelativa: string): Promise<void> {
    const directorioStorage = resolve(process.cwd(), 'storage')
    const rutaNormalizada = rutaRelativa
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^storage\//, '')
    const rutaCompleta = resolve(directorioStorage, rutaNormalizada)
    if (!rutaCompleta.startsWith(`${directorioStorage}${sep}`)) {
      return
    }
    await this.eliminarArchivoFisico(rutaCompleta)
  }

  private async eliminarArchivoFisico(rutaCompleta: string): Promise<void> {
    try {
      await fs.unlink(rutaCompleta)
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
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    ) {
      return 'image/jpeg'
    }
    if (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString() === 'RIFF' &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    ) {
      return 'image/webp'
    }
    return 'application/octet-stream'
  }
  private obtenerImplicadosEmpresa(empId: number): Promise<ImplicadoLgi[]> {
    return this.repository.manager.getRepository(ImplicadoLgi).find({
      where: {
        empresaId: empId,
        estado: 'ACTIVO',
      },
      order: {
        id: 'ASC',
      },
    })
  }
}
