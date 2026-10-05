import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, DeepPartial, Repository } from 'typeorm'
import { promises as fs } from 'fs'
import { relative, resolve, sep } from 'path'
import { DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto'
import { crearStreamArchivo } from '@/common/utils/archivo-seguro.util'
import { CreatePersonasJuridicaDto } from '@/application/lgi/personas_juridicas/dto/create-personas_juridica.dto'
import { UpdatePersonasJuridicaDto } from '@/application/lgi/personas_juridicas/dto/update-personas_juridica.dto'
import { PersonasJuridica } from '@/application/lgi/personas_juridicas/entities/personas_juridica.entity'
import { SituacionJuridicaEmpresa } from '@/application/lgi/situacion_jurica_empresa/entities/situacion_jurica_empresa.entity'
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
export class PersonasJuridicasPdRepository {
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
      await this.limpiarArchivosSubidos(imagen, documento)
      throw new UnauthorizedException(
        'No se pudo obtener el usuario autenticado'
      )
    }
    const {
      imagen: _imagen,
      documento: _documento,
      opId,
      idVinculo,
      pericia,
      ...datosDto
    } = dto
    let documentoGuardado: DocumentoGuardado | null = null
    let resultado: PersonasJuridica
    try {
      const imagenBuffer = await this.leerImagen(imagen)
      if (documento) {
        documentoGuardado = await this.guardarDocumento(documento)
      }
      const datosRegistro: DeepPartial<PersonasJuridica> = {
        ...datosDto,
        opId: String(opId),
        idVinculo: this.convertirIdVinculo(idVinculo) ?? null,
        pericia,
        imagen: imagenBuffer,
        documento: documentoGuardado?.rutaRelativa,
        usuario: auditoria.usuario,
        fechaHoraIngreso: new Date(),
      }
      const registro = this.repository.create(datosRegistro)
      resultado = await this.repository.save(registro)
    } catch (error) {
      await this.limpiarArchivosSubidos(imagen, documento)
      throw error
    }
    return this.findOne(Number(resultado.empId))
  }

  async findAll(): Promise<any[]> {
    const registros = await this.repository.find({
      relations: {
        vinculo: true,
        operativo: true,
      },
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
      relations: {
        vinculo: true,
        operativo: true,
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
    const [relaciones, situacionesJuridicas] = await Promise.all([
      this.obtenerRelacionesEmpresa(empId),
      this.obtenerSituacionesJuridicas(empId),
    ])
    return {
      ...this.formatearEmpresa(empresa, true),
      operativo: relaciones?.operativo ?? null,
      asignacion: relaciones?.asignacion ?? null,
      vinculo: relaciones?.vinculo ?? null,
      situacionesJuridicas,
      ultimaSituacionJuridica: situacionesJuridicas[0] ?? null,
    }
  }

  async update(
    empId: number,
    dto: UpdatePersonasJuridicaDto,
    imagen?: Express.Multer.File,
    documento?: Express.Multer.File
  ): Promise<any> {
    const registro = await this.buscarEntidadConImagen(empId).catch(async (error) => {
      await this.limpiarArchivosSubidos(imagen, documento)
      throw error
    })
    const auditoria = dto as DtoConUsuario<UpdatePersonasJuridicaDto>
    const rutaDocumentoAnterior = registro.documento
    const {
      imagen: _imagen,
      documento: _documento,
      opId,
      idVinculo,
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
      if (idVinculo !== undefined) {
        registro.idVinculo = this.convertirIdVinculo(idVinculo) ?? null
      }
      if (pericia !== undefined) {
        registro.pericia = pericia
      }
      if (imagen) {
        registro.imagen = await this.leerImagen(imagen)
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
      await this.limpiarArchivosSubidos(imagen, documento)
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
      query.andWhere(`empresa.op_id = :opId`, {
        opId: filtros.opId,
      })
    }
    if (filtros.casosId !== undefined) {
      query.andWhere(`operativo.casos_id = :casosId`, {
        casosId: filtros.casosId,
      })
    }
    if (filtro?.trim()) {
      const columnas = [
        'empresa.nombre',
        'empresa.nit',
        'empresa.matricula',
        'empresa.representante',
        'empresa.propietario_socio',
        'empresa.beneficiarios_finales',
        'empresa.direccion',
        'operativo.op_nrooper',
        'asignacion.nombrecaso',
        'asignacion.nrocaso',
        'asignacion.nrocasogiaef',
        'asignacion.nrocasofis',
        'asignacion.cudifp',
        'vinculo.descripcion',
        'ultima_situacion.descripcion_tipo',
      ]
      query.andWhere(
        new Brackets((qb) => {
          columnas.forEach((columna, index) => {
            const condicion = `${columna} ILIKE :filtro`
            if (index === 0) qb.where(condicion)
            else qb.orWhere(condicion)
          })
        }),
        { filtro: `%${filtro.trim()}%` }
      )
    }
    const total = await query.clone().getCount()
    const data = await query
      .orderBy('empresa.emp_id', 'DESC')
      .limit(limite)
      .offset(saltar)
      .getRawMany()
    return [data, total]
  }

  private consultaBase() {
    return this.repository
      .createQueryBuilder('empresa')
      .innerJoin('empresa.operativo', 'operativo')
      .leftJoin(
        'asignacion',
        'asignacion',
        `asignacion.casos_id = operativo.casos_id`
      )
      .leftJoin('empresa.vinculo', 'vinculo')
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
        `empresa.propietario_socio AS "propietarioSocio"`,
        `empresa.beneficiarios_finales AS "beneficiariosFinales"`,
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
        `jsonb_build_object( 'opId', operativo.op_id, 'casosId', operativo.casos_id, 'numeroOperativo', operativo.op_nrooper, 'fechaInforme', operativo.op_fechainf, 'lugar', operativo.op_lugar, 'descripcion', operativo.op_descripcion, 'estado', operativo.estado ) AS "operativo"`,
        `CASE WHEN asignacion.casos_id IS NULL THEN NULL ELSE jsonb_build_object( 'casosId', asignacion.casos_id, 'nombreCaso', asignacion.nombrecaso, 'numeroCaso', asignacion.nrocaso, 'numeroCasoGiaef', asignacion.nrocasogiaef, 'numeroCasoFiscalia', asignacion.nrocasofis, 'cud', asignacion.cudifp ) END AS "asignacion"`,
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
    const situaciones = await this.repository.manager
      .getRepository(SituacionJuridicaEmpresa)
      .find({
        where: { idEmpresa: empId },
        relations: { tipoSituacionJuridica: true },
        order: {
          fecha: 'DESC',
          fechaHoraIngreso: 'DESC',
          idSituacionJuridicaEmpresa: 'DESC',
        },
      })

    return situaciones.map(({ tipoSituacionJuridica, ...situacion }) => ({
      ...situacion,
      usuario: situacion.usuario?.trim() ?? null,
      descripcionTipo: tipoSituacionJuridica?.descripcion ?? null,
    }))
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

  private convertirIdVinculo(
    valor: string | number | null | undefined
  ): number | null | undefined {
    if (valor === undefined || valor === null) return valor

    if (
      (typeof valor === 'string' && !/^[0-9]+$/.test(valor)) ||
      (typeof valor !== 'string' && typeof valor !== 'number')
    ) {
      throw new BadRequestException('idVinculo debe ser un entero positivo')
    }

    const id = Number(valor)
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      throw new BadRequestException(
        'idVinculo debe ser un entero positivo válido de tipo integer'
      )
    }

    return id
  }

  private async guardarDocumento(
    archivo: Express.Multer.File
  ): Promise<DocumentoGuardado> {
    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!tiposPermitidos.includes(archivo.mimetype)) {
      throw new BadRequestException(
        'El documento debe estar en formato PDF, JPG, PNG o WEBP'
      )
    }

    if (!archivo.path || !archivo.size) {
      throw new BadRequestException(
        'El documento recibido no contiene información'
      )
    }

    // Multer ya guardó el archivo mediante crearConfiguracionArchivo.
    // Equivale a obtenerRutaRelativa, sin depender de una ruta de import desconocida.
    return {
      rutaCompleta: archivo.path,
      rutaRelativa: relative(process.cwd(), archivo.path).replace(/\\/g, '/'),
    }
  }

  private async leerImagen(
    archivo?: Express.Multer.File
  ): Promise<Buffer | undefined> {
    if (!archivo) return undefined

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(archivo.mimetype)) {
      throw new BadRequestException(
        'La imagen debe estar en formato JPG, PNG o WEBP'
      )
    }

    if (archivo.buffer?.length) return archivo.buffer

    if (!archivo.path || !archivo.size) {
      throw new BadRequestException('La imagen recibida no contiene información')
    }

    try {
      return await fs.readFile(archivo.path)
    } finally {
      await this.eliminarArchivoFisico(archivo.path)
    }
  }

  private async limpiarArchivosSubidos(
    ...archivos: (Express.Multer.File | undefined)[]
  ): Promise<void> {
    await Promise.all(
      archivos.map((archivo) =>
        archivo?.path
          ? this.eliminarArchivoFisico(archivo.path)
          : Promise.resolve()
      )
    )
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
}
