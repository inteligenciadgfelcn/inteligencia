import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, DeepPartial, Repository } from 'typeorm'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import { extname, resolve, sep } from 'path'

import { DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto'
import { crearStreamArchivo } from '@/common/utils/archivo-seguro.util'

import { CreatePersonasJuridicaDto } from '../dto/create-personas_juridica.dto'
import { UpdatePersonasJuridicaDto } from '../dto/update-personas_juridica.dto'
import { PersonasJuridica } from '../entities/personas_juridica.entity'
import { TipoVinculoLgi } from '../../parametro/tipo-vinculo/entities/tipo-vinculo.entity'
import { VinculoLgi } from '../../parametro/vinculo/entities/vinculo.entity'

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

  /*
   * Registrar una persona jurídica.
   *
   * La imagen se guarda como bytea.
   * El documento se guarda físicamente
   * y en la BD solamente se registra su ruta.
   */
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

    const {
      imagen: imagenDto,
      documento: documentoDto,
      opId,
      idTipoVinculo,
      pericia,
      ...datosDto
    } = dto

    let documentoGuardado: DocumentoGuardado | null = null

    try {
      if (documento) {
        documentoGuardado = await this.guardarDocumento(documento)
      }

      const datosRegistro: DeepPartial<PersonasJuridica> = {
        ...datosDto,

        opId: String(opId),

        idTipoVinculo:
          idTipoVinculo !== undefined && idTipoVinculo !== null
            ? String(idTipoVinculo)
            : null,

        pericia: pericia ?? false,

        imagen: imagen?.buffer?.length ? imagen.buffer : null,

        documento: documentoGuardado?.rutaRelativa ?? null,

        usuario: auditoria.usuario,

        fechaHoraIngreso: new Date(),
      }

      const registro = this.repository.create(datosRegistro)

      const resultado = await this.repository.save(registro)

      return this.findOne(Number(resultado.empId))
    } catch (error) {
      if (documentoGuardado) {
        await this.eliminarArchivoFisico(documentoGuardado.rutaCompleta)
      }

      throw error
    }
  }

  /*
   * Listar todas las empresas.
   */
  async findAll(): Promise<any[]> {
    const registros = await this.repository.find({
      order: {
        empId: 'DESC',
      },
    })

    return registros.map((registro) => this.formatearEmpresa(registro))
  }

  /*
   * Listar empresas sin paginación
   * por operativo.
   */
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

  /*
   * Listado paginado por operativo.
   */
  async findAllPaginadoPorOperativo(
    opId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    return this.buscarEmpresasPaginadas(pagination, {
      opId,
    })
  }

  /*
   * Listado paginado por casos_id.
   */
  async findAllPaginadoPorCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    return this.buscarEmpresasPaginadas(pagination, {
      casosId,
    })
  }

  /*
   * Obtener una empresa con:
   *
   * - Imagen en Base64.
   * - Operativo.
   * - Asignación.
   * - Tipo de vínculo.
   * - Vínculo.
   * - Historial jurídico.
   * - Última situación jurídica.
   */
  async findOne(empId: number): Promise<any> {
    const empresa = await this.buscarEntidadConImagen(empId)

    const relaciones = await this.obtenerRelacionesEmpresa(empId)

    const situacionesJuridicas = await this.obtenerSituacionesJuridicas(empId)

    return {
      ...this.formatearEmpresa(empresa, true),

      operativo: relaciones?.operativo ?? null,

      asignacion: relaciones?.asignacion ?? null,

      tipoVinculo: relaciones?.tipoVinculo ?? null,

      situacionesJuridicas,

      ultimaSituacionJuridica: situacionesJuridicas[0] ?? null,
    }
  }

  /*
   * Actualizar una empresa.
   */
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
      imagen: imagenDto,
      documento: documentoDto,
      opId,
      idTipoVinculo,
      pericia,
      ...datosDto
    } = dto

    let documentoNuevo: DocumentoGuardado | null = null

    try {
      /*
       * Se usa un objeto explícito porque
       * opId en el DTO es number, pero en
       * la entidad bigint está representado
       * como string.
       */
      this.repository.merge(registro, datosDto as DeepPartial<PersonasJuridica>)

      if (opId !== undefined) {
        registro.opId = String(opId)
      }

      if (idTipoVinculo !== undefined) {
        registro.idTipoVinculo =
          idTipoVinculo !== null ? String(idTipoVinculo) : null
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

      /*
       * El documento anterior solamente
       * se elimina después de guardar
       * correctamente el nuevo registro.
       */
      if (documentoNuevo && rutaDocumentoAnterior) {
        await this.eliminarDocumentoGuardado(rutaDocumentoAnterior)
      }

      return this.findOne(empId)
    } catch (error) {
      /*
       * Si falla la actualización, se
       * elimina únicamente el archivo nuevo.
       */
      if (documentoNuevo) {
        await this.eliminarArchivoFisico(documentoNuevo.rutaCompleta)
      }

      throw error
    }
  }

  /*
   * Eliminar una empresa.
   *
   * Esta operación es física porque
   * la tabla mostrada no tiene estado.
   */
  async remove(empId: number): Promise<void> {
    const registro = await this.buscarEntidadConImagen(empId)

    const rutaDocumento = registro.documento

    await this.repository.remove(registro)

    if (rutaDocumento) {
      await this.eliminarDocumentoGuardado(rutaDocumento)
    }
  }

  /*
   * Obtener el documento para visualizar
   * o descargar desde el controller.
   */
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

  /*
   * Consulta paginada compartida.
   */
  private async buscarEmpresasPaginadas(
    pagination: PaginacionQueryDto,
    filtros: FiltrosEmpresas
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('empresa')
      .innerJoin(
        'operativo',
        'operativo',
        `
            operativo.op_id =
            empresa.op_id
          `
      )
      .leftJoin(
        'asignacion',
        'asignacion',
        `
            asignacion.casos_id =
            operativo.casos_id
          `
      )
      .leftJoin(
        TipoVinculoLgi,
        'tipo_vinculo',
        `
            tipo_vinculo
              .id_tipo_vinculo::text =
            empresa.id_tipo_vinculo
          `
      )
      .leftJoin(
        VinculoLgi,
        'vinculo',
        `
            vinculo.id_vinculo =
            tipo_vinculo.id_vinculo
          `
      )
      .leftJoin(
        (subQuery) =>
          subQuery
            .select('situacion.id_empresa', 'id_empresa')
            .addSelect(
              `
                  situacion
                    .id_situacion_juridica_empresa
                `,
              'id_situacion_juridica_empresa'
            )
            .addSelect('situacion.fecha', 'fecha')
            .addSelect(
              `
                  situacion.quien_autoriza
                `,
              'quien_autoriza'
            )
            .addSelect(
              `
                  situacion.a_quien_entregan
                `,
              'a_quien_entregan'
            )
            .addSelect(
              `
                  situacion.fechahoraing
                `,
              'fechahoraing'
            )
            .addSelect('situacion.usuario', 'usuario')
            .addSelect(
              `
                  situacion
                    .id_tipo_situacion_juridica
                `,
              'id_tipo_situacion_juridica'
            )
            .addSelect(
              `
                  tipo_situacion.descripcion
                `,
              'descripcion_tipo'
            )
            .distinctOn(['situacion.id_empresa'])
            .from('situacion_juridica_empresa', 'situacion')
            .leftJoin(
              'tipo_situacion_juridica',
              'tipo_situacion',
              `
                  tipo_situacion
                    .id_tipo_situacion_juridica =
                  situacion
                    .id_tipo_situacion_juridica
                `
            )
            .orderBy('situacion.id_empresa', 'ASC')
            .addOrderBy('situacion.fecha', 'DESC', 'NULLS LAST')
            .addOrderBy('situacion.fechahoraing', 'DESC', 'NULLS LAST')
            .addOrderBy(
              `
                  situacion
                    .id_situacion_juridica_empresa
                `,
              'DESC'
            ),
        'ultima_situacion',
        `
            ultima_situacion
              .id_empresa::bigint =
            empresa.emp_id
          `
      )

    if (filtros.opId !== undefined) {
      query.andWhere(
        `
          empresa.op_id =
          :opId
        `,
        {
          opId: filtros.opId,
        }
      )
    }

    if (filtros.casosId !== undefined) {
      query.andWhere(
        `
          operativo.casos_id =
          :casosId
        `,
        {
          casosId: filtros.casosId,
        }
      )
    }

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            `
                empresa.nombre
                ILIKE :filtro
              `,
            {
              filtro: valor,
            }
          )
            .orWhere(
              `
                  empresa.nit
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  empresa.matricula
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  empresa.representante
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  empresa.propietario_socio
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  empresa.beneficiarios_finales
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  empresa.direccion
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  operativo.op_nrooper
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  asignacion.nombrecaso
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  asignacion.nrocaso
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  asignacion.nrocasogiaef
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  asignacion.nrocasofis
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  asignacion.nrocasoifp
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  asignacion.cudifp
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  tipo_vinculo.descripcion
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  vinculo.descripcion
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
                  ultima_situacion
                    .descripcion_tipo
                  ILIKE :filtro
                `,
              {
                filtro: valor,
              }
            )
        })
      )
    }

    const total = await query.clone().getCount()

    const data = await query
      .select([
        `
            empresa.emp_id
            AS "empId"
          `,

        `
            empresa.op_id
            AS "opId"
          `,

        `
            empresa.nombre
            AS "nombre"
          `,

        `
            empresa.nit
            AS "nit"
          `,

        `
            empresa.matricula
            AS "matricula"
          `,

        `
            empresa.representante
            AS "representante"
          `,

        `
            empresa.obs
            AS "observaciones"
          `,

        `
            empresa.propietario_socio
            AS "propietarioSocio"
          `,

        `
            empresa.beneficiarios_finales
            AS "beneficiariosFinales"
          `,

        `
            empresa.capital_social
            AS "capitalSocial"
          `,

        `
            empresa.direccion
            AS "direccion"
          `,

        `
            empresa.latitud
            AS "latitud"
          `,

        `
            empresa.longitud
            AS "longitud"
          `,

        `
            empresa.id_tipo_vinculo
            AS "idTipoVinculo"
          `,

        `
            empresa.pericia
            AS "pericia"
          `,

        `
            empresa.resultado
            AS "resultado"
          `,

        `
            empresa.documento
            AS "documento"
          `,

        `
            empresa.fechahoraing
            AS "fechaHoraIngreso"
          `,

        `
            TRIM(empresa.usuario)
            AS "usuario"
          `,

        `
            CASE
              WHEN empresa.imagen
                IS NOT NULL
              THEN true
              ELSE false
            END
            AS "tieneImagen"
          `,

        /*
         * Operativo.
         */
        `
            jsonb_build_object(
              'opId',
              operativo.op_id,

              'casosId',
              operativo.casos_id,

              'numeroOperativo',
              operativo.op_nrooper,

              'fechaInforme',
              operativo.op_fechainf,

              'lugar',
              operativo.op_lugar,

              'descripcion',
              operativo.op_descripcion,

              'estado',
              operativo.estado
            )
            AS "operativo"
          `,

        /*
         * Asignación.
         */
        `
            CASE
              WHEN asignacion.casos_id
                IS NULL
              THEN NULL
              ELSE jsonb_build_object(
                'casosId',
                asignacion.casos_id,

                'nombreCaso',
                asignacion.nombrecaso,

                'numeroCaso',
                asignacion.nrocaso,

                'numeroCasoGiaef',
                asignacion.nrocasogiaef,

                'numeroCasoFiscalia',
                asignacion.nrocasofis,

                'numeroCasoIfp',
                asignacion.nrocasoifp,

                'cud',
                asignacion.cudifp
              )
            END
            AS "asignacion"
          `,

        /*
         * Tipo de vínculo y vínculo.
         */
        `
            CASE
              WHEN tipo_vinculo
                .id_tipo_vinculo
                IS NULL
              THEN NULL
              ELSE jsonb_build_object(
                'idTipoVinculo',
                tipo_vinculo
                  .id_tipo_vinculo,

                'descripcion',
                tipo_vinculo.descripcion,

                'vinculo',
                CASE
                  WHEN vinculo.id_vinculo
                    IS NULL
                  THEN NULL
                  ELSE jsonb_build_object(
                    'idVinculo',
                    vinculo.id_vinculo,

                    'descripcion',
                    vinculo.descripcion
                  )
                END
              )
            END
            AS "tipoVinculo"
          `,

        /*
         * Última situación jurídica.
         */
        `
            CASE
              WHEN ultima_situacion
                .id_situacion_juridica_empresa
                IS NULL
              THEN NULL
              ELSE jsonb_build_object(
                'idSituacionJuridicaEmpresa',
                ultima_situacion
                  .id_situacion_juridica_empresa,

                'idEmpresa',
                ultima_situacion.id_empresa,

                'fecha',
                ultima_situacion.fecha,

                'quienAutoriza',
                ultima_situacion.quien_autoriza,

                'aQuienEntregan',
                ultima_situacion.a_quien_entregan,

                'fechaHoraIngreso',
                ultima_situacion.fechahoraing,

                'usuario',
                TRIM(
                  ultima_situacion.usuario
                ),

                'idTipoSituacionJuridica',
                ultima_situacion
                  .id_tipo_situacion_juridica,

                'descripcionTipo',
                ultima_situacion
                  .descripcion_tipo
              )
            END
            AS "ultimaSituacionJuridica"
          `,
      ])
      .orderBy('empresa.emp_id', 'DESC')
      .take(limite)
      .skip(saltar)
      .getRawMany()

    return [data, total]
  }

  /*
   * Obtener las relaciones principales
   * correspondientes a una empresa.
   */
  private async obtenerRelacionesEmpresa(empId: number): Promise<any> {
    const resultado = await this.repository
      .createQueryBuilder('empresa')
      .innerJoin(
        'operativo',
        'operativo',
        `
            operativo.op_id =
            empresa.op_id
          `
      )
      .leftJoin(
        'asignacion',
        'asignacion',
        `
            asignacion.casos_id =
            operativo.casos_id
          `
      )
      .leftJoin(
        TipoVinculoLgi,
        'tipo_vinculo',
        `
            tipo_vinculo
              .id_tipo_vinculo::text =
            empresa.id_tipo_vinculo
          `
      )
      .leftJoin(
        VinculoLgi,
        'vinculo',
        `
            vinculo.id_vinculo =
            tipo_vinculo.id_vinculo
          `
      )
      .select([
        `
            jsonb_build_object(
              'opId',
              operativo.op_id,

              'casosId',
              operativo.casos_id,

              'numeroOperativo',
              operativo.op_nrooper,

              'fechaInforme',
              operativo.op_fechainf,

              'lugar',
              operativo.op_lugar,

              'descripcion',
              operativo.op_descripcion,

              'estado',
              operativo.estado
            )
            AS "operativo"
          `,

        `
            CASE
              WHEN asignacion.casos_id
                IS NULL
              THEN NULL
              ELSE jsonb_build_object(
                'casosId',
                asignacion.casos_id,

                'nombreCaso',
                asignacion.nombrecaso,

                'numeroCaso',
                asignacion.nrocaso,

                'numeroCasoGiaef',
                asignacion.nrocasogiaef,

                'numeroCasoFiscalia',
                asignacion.nrocasofis,

                'numeroCasoIfp',
                asignacion.nrocasoifp,

                'cud',
                asignacion.cudifp
              )
            END
            AS "asignacion"
          `,

        `
            CASE
              WHEN tipo_vinculo
                .id_tipo_vinculo
                IS NULL
              THEN NULL
              ELSE jsonb_build_object(
                'idTipoVinculo',
                tipo_vinculo
                  .id_tipo_vinculo,

                'descripcion',
                tipo_vinculo.descripcion,

                'vinculo',
                CASE
                  WHEN vinculo.id_vinculo
                    IS NULL
                  THEN NULL
                  ELSE jsonb_build_object(
                    'idVinculo',
                    vinculo.id_vinculo,

                    'descripcion',
                    vinculo.descripcion
                  )
                END
              )
            END
            AS "tipoVinculo"
          `,
      ])
      .where(
        `
            empresa.emp_id =
            :empId
          `,
        {
          empId,
        }
      )
      .getRawOne()

    return resultado ?? null
  }

  private async obtenerSituacionesJuridicas(empId: number): Promise<any[]> {
    return this.repository.manager
      .createQueryBuilder()
      .select([
        `
          situacion
            .id_situacion_juridica_empresa
          AS "idSituacionJuridicaEmpresa"
        `,

        `
          situacion.id_empresa
          AS "idEmpresa"
        `,

        `
          situacion.fecha
          AS "fecha"
        `,

        `
          situacion.quien_autoriza
          AS "quienAutoriza"
        `,

        `
          situacion.a_quien_entregan
          AS "aQuienEntregan"
        `,

        `
          situacion.fechahoraing
          AS "fechaHoraIngreso"
        `,

        `
          TRIM(situacion.usuario)
          AS "usuario"
        `,

        `
          situacion
            .id_tipo_situacion_juridica
          AS "idTipoSituacionJuridica"
        `,

        `
          tipo_situacion.descripcion
          AS "descripcionTipo"
        `,
      ])
      .from('situacion_juridica_empresa', 'situacion')
      .leftJoin(
        'tipo_situacion_juridica',
        'tipo_situacion',
        `
          tipo_situacion
            .id_tipo_situacion_juridica =
          situacion
            .id_tipo_situacion_juridica
        `
      )
      .where(
        `
          situacion.id_empresa =
          :empId
        `,
        {
          empId,
        }
      )
      .orderBy('situacion.fecha', 'DESC', 'NULLS LAST')
      .addOrderBy('situacion.fechahoraing', 'DESC', 'NULLS LAST')
      .addOrderBy(
        `
          situacion
            .id_situacion_juridica_empresa
        `,
        'DESC'
      )
      .getRawMany()
  }

  /*
   * Buscar una empresa incluyendo
   * la columna imagen, aunque tenga
   * select: false en la entidad.
   */
  private async buscarEntidadConImagen(
    empId: number
  ): Promise<PersonasJuridica> {
    const registro = await this.repository
      .createQueryBuilder('empresa')
      .addSelect('empresa.imagen')
      .where(
        `
            empresa.empId =
            :empId
          `,
        {
          empId,
        }
      )
      .getOne()

    if (!registro) {
      throw new NotFoundException(`No existe la empresa con ID ${empId}`)
    }

    return registro
  }

  /*
   * Dar formato a una empresa.
   */
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

  /*
   * Guardar físicamente el documento.
   */
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

    const extension =
      extensionesPermitidas.get(archivo.mimetype) ??
      extname(archivo.originalname).toLowerCase()

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

  /*
   * Eliminar un documento registrado
   * mediante una ruta relativa.
   */
  private async eliminarDocumentoGuardado(rutaRelativa: string): Promise<void> {
    const directorioStorage = resolve(process.cwd(), 'storage')

    const rutaNormalizada = rutaRelativa
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^storage\//, '')

    const rutaCompleta = resolve(directorioStorage, rutaNormalizada)

    /*
     * Impedir que una ruta manipulada
     * elimine archivos fuera de storage.
     */
    if (!rutaCompleta.startsWith(`${directorioStorage}${sep}`)) {
      return
    }

    await this.eliminarArchivoFisico(rutaCompleta)
  }

  /*
   * Eliminar archivo físico sin interrumpir
   * la operación si ya no existe.
   */
  private async eliminarArchivoFisico(rutaCompleta: string): Promise<void> {
    try {
      await fs.unlink(rutaCompleta)
    } catch {
      /*
       * El archivo puede haber sido eliminado
       * previamente. No se interrumpe el CRUD.
       */
    }
  }

  /*
   * Detectar el MIME real de la imagen
   * almacenada en bytea.
   */
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
