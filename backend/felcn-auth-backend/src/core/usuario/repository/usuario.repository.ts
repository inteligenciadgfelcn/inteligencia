import { TextService } from '@/common/lib/text.service'
import { Persona } from '../entity/persona.entity'
import { Usuario } from '../entity/usuario.entity'
import { PersonaDto } from '../dto/persona.dto'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { Injectable } from '@nestjs/common'
import { Brackets, DataSource, EntityManager } from 'typeorm'
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto'
import dayjs from 'dayjs'
import { UsuarioDto } from '../dto/usuario.dto'
import { UsuarioEstado } from '@/core/usuario/constant'
import { RolEstado, UsuarioRolEstado } from '@/core/authorization/constant'

@Injectable()
export class UsuarioRepository {
  constructor(private dataSource: DataSource) { }

  async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, rol, orden, sentido } = paginacionQueryDto

    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect(
        'usuario.usuarioRol',
        'usuarioRol',
        'usuarioRol.estado = :estado',
        { estado: UsuarioRolEstado.ACTIVE }
      )
      .leftJoinAndSelect('usuarioRol.rol', 'rol', 'rol.estado = :estado', {
        estado: RolEstado.ACTIVE,
      })
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoin('usuario.grado', 'grado')
      .leftJoin('usuario.grupo', 'grupo')
      .leftJoin('grupo.distrital', 'distrital')
      .leftJoin('distrital.unidad', 'unidad')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuario.ciudadaniaDigital',
        'usuario.intentos',
        'usuario.fechaBloqueo',
        'usuario.fechaCreacion',
        'usuario.nombreApp',
        'usuario.idGrado',
        'usuario.idGrupo',
        'usuario.numeroPase',
        'usuario.fechaPerfilCompletado',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'rol.nombre',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
        'persona.telefono',
        'grado.id',
        'grado.abreviatura',
        'grado.descripcion',
        'grupo.id',
        'grupo.descripcion',
        'distrital.id',
        'distrital.descripcion',
        'unidad.id',
        'unidad.abreviatura',
        'unidad.descripcion',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'nroDocumento':
        query.addOrderBy('persona.nroDocumento', sentido)
        break
      case 'nombres':
        query.addOrderBy('persona.nombres', sentido)
        break
      case 'usuario':
        query.addOrderBy('usuario.usuario', sentido)
        break
      case 'rol':
        query.addOrderBy('rol.rol', sentido)
        break
      case 'estado':
        query.addOrderBy('usuario.estado', sentido)
        break
      default:
        query.addOrderBy('usuario.id', 'ASC')
    }

    if (rol) {
      query.andWhere('rol.id IN(:...roles)', {
        roles: rol,
      })
    }
    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('usuario.usuario ilike :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('persona.nroDocumento ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.nombres ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.primerApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.segundoApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async recuperar() {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect(
        'usuario.usuarioRol',
        'usuarioRol',
        'usuarioRol.estado = :estado',
        { estado: UsuarioEstado.ACTIVE }
      )
      .leftJoinAndSelect('usuarioRol.rol', 'rol', 'rol.estado = :estado', {
        estado: RolEstado.ACTIVE,
      })
      .getMany()
  }

  async buscarUsuario(usuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect(
        'usuario.usuarioRol',
        'usuarioRol',
        'usuarioRol.estado = :estado',
        { estado: UsuarioRolEstado.ACTIVE }
      )
      .leftJoinAndSelect('usuarioRol.rol', 'rol', 'rol.estado = :estado', {
        estado: RolEstado.ACTIVE,
      })
      .where({ usuario: usuario })
      .getOne()
  }

  async buscarPorId(id: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder('usuario')
      .where({ id: id })
      .getOne()
  }

  async buscarUsuarioPersonaPorId(id: string) {
    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoin('usuario.grado', 'grado')
      .leftJoin('usuario.grupo', 'grupo')
      .leftJoin('grupo.distrital', 'distrital')
      .leftJoin('distrital.unidad', 'unidad')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuario.ciudadaniaDigital',
        'usuario.intentos',
        'usuario.fechaBloqueo',
        'usuario.fechaCreacion',
        'usuario.nombreApp',
        'usuario.telefonoCelular',
        'usuario.telefonoCorporativo',
        'usuario.idGrado',
        'usuario.idGrupo',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
        'persona.telefono',
        'usuario.numeroPase',
        'grado.id',
        'grado.abreviatura',
        'grado.descripcion',
        'grupo.id',
        'grupo.descripcion',
        'distrital.id',
        'distrital.descripcion',
        'unidad.id',
        'unidad.abreviatura',
        'unidad.descripcion',
      ])
      .where('usuarioRol.estado = :estado', { estado: UsuarioRolEstado.ACTIVE })
      .andWhere('usuario.id = :id', { id })

    return await query.getOne()
  }

  async buscarDatosDeContactoDelUsuarioPorId(
    id: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.correoElectronico',
        'usuario.idPersona',
        'usuario.idGrado',
        'usuario.idGrupo',
        'usuario.numeroPase',
        'usuario.fechaPerfilCompletado',
        'persona.id',
        'persona.telefono',
      ])
      .where('usuario.id = :id', { id })
      .getOne()
  }

  async buscarUsuarioRolPorId(id: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect(
        'usuario.usuarioRol',
        'usuarioRol',
        'usuarioRol.estado = :estado',
        { estado: UsuarioRolEstado.ACTIVE }
      )
      .leftJoinAndSelect('usuarioRol.rol', 'rol', 'rol.estado = :estado', {
        estado: RolEstado.ACTIVE,
      })
      .leftJoin('usuario.grado', 'grado')
      .leftJoin('usuario.grupo', 'grupo')
      .leftJoin('grupo.distrital', 'distrital')
      .leftJoin('distrital.unidad', 'unidad')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.contrasena',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuario.ciudadaniaDigital',
        'usuario.urlFoto',
        'usuario.nombreApp',
        'usuario.idGrado',
        'usuario.idGrupo',
        'usuario.fechaPerfilCompletado',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'persona.telefono',
        'usuarioRol',
        'rol',
        'grado.id',
        'grado.abreviatura',
        'grado.descripcion',
        'grupo.id',
        'grupo.descripcion',
        'usuario.numeroPase',
        'distrital.id',
        'distrital.descripcion',
        'unidad.id',
        'unidad.abreviatura',
        'unidad.descripcion',
      ])
      .where({ id })
      .getOne()
  }

  async buscarUsuarioPorCI(ci: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect(
        'usuario.usuarioRol',
        'usuarioRol',
        'usuarioRol.estado = :estado',
        { estado: UsuarioRolEstado.ACTIVE }
      )
      .leftJoinAndSelect('usuarioRol.rol', 'rol', 'rol.estado = :estado', {
        estado: RolEstado.ACTIVE,
      })
      .where('persona.nroDocumento = :ci', { ci: ci })
      .getOne()
  }

  async verificarExisteUsuarioPorCI(ci: string, transaction: EntityManager) {
    const repo = transaction
      ? transaction.getRepository(Usuario)
      : this.dataSource.getRepository(Usuario)

    return await repo
      .createQueryBuilder('usuario')
      .leftJoin('usuario.persona', 'persona')
      .select('usuario.id')
      .where('persona.nroDocumento = :ci', { ci: ci })
      .getOne()
  }

  async buscarUsuarioPorCorreo(correo: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder('usuario')
      .where('usuario.correoElectronico = :correo', { correo })
      .getOne()
  }

  async crear(
    idPersona: string,
    usuarioDto: UsuarioDto,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    return await transaction.getRepository(Usuario).save(
      new Usuario({
        idPersona: idPersona,
        usuario: usuarioDto.usuario,
        estado: usuarioDto?.estado ?? UsuarioEstado.CREATE,
        correoElectronico: usuarioDto?.correoElectronico,
        contrasena:
          usuarioDto?.contrasena ??
          (await TextService.encrypt(TextService.generateUuid())),
        ciudadaniaDigital: usuarioDto?.ciudadaniaDigital ?? false,
        otpHabilitado: usuarioDto?.otpHabilitado ?? false,
        nombreApp: usuarioDto?.nombreApp,
        telefonoCelular: usuarioDto?.telefonoCelular,
        telefonoCorporativo: usuarioDto?.telefonoCorporativo,
        idGrado: usuarioDto?.idGrado,
        idGrupo: usuarioDto?.idGrupo,
        numeroPase: usuarioDto?.numeroPase,
        usuarioCreacion: usuarioAuditoria,
      })
    )
  }

  async actualizar(
    idUsuario: string,
    usuarioDto: ActualizarUsuarioDto,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const manager = transaction ?? this.dataSource.manager
    const repo = manager.getRepository(Usuario)

    const existing = await repo.findOne({ where: { id: idUsuario as any } })
    if (!existing) return null

    Object.assign(existing, {
      ...(usuarioDto.estado && { estado: usuarioDto.estado }),
      ...(usuarioDto.correoElectronico && { correoElectronico: usuarioDto.correoElectronico }),
      ...(usuarioDto.contrasena && { contrasena: usuarioDto.contrasena }),
      ...(usuarioDto.intentos !== undefined && { intentos: usuarioDto.intentos }),
      ...(usuarioDto.fechaBloqueo !== undefined && {
        fechaBloqueo: usuarioDto.fechaBloqueo ? dayjs(usuarioDto.fechaBloqueo).toDate() : null,
      }),
      ...(usuarioDto.codigoDesbloqueo !== undefined && { codigoDesbloqueo: usuarioDto.codigoDesbloqueo }),
      ...(usuarioDto.codigoRecuperacion !== undefined && { codigoRecuperacion: usuarioDto.codigoRecuperacion }),
      ...(usuarioDto.codigoTransaccion !== undefined && { codigoTransaccion: usuarioDto.codigoTransaccion }),
      ...(usuarioDto.codigoActivacion !== undefined && { codigoActivacion: usuarioDto.codigoActivacion }),
      ...(usuarioDto.ciudadaniaDigital !== undefined && { ciudadaniaDigital: usuarioDto.ciudadaniaDigital }),
      ...(usuarioDto.urlFoto !== undefined && { urlFoto: usuarioDto.urlFoto }),
      ...(usuarioDto.nombreApp !== undefined && { nombreApp: usuarioDto.nombreApp }),
      ...(usuarioDto.telefonoCelular !== undefined && { telefonoCelular: usuarioDto.telefonoCelular }),
      ...(usuarioDto.telefonoCorporativo !== undefined && { telefonoCorporativo: usuarioDto.telefonoCorporativo }),
      ...(usuarioDto.idGrado !== undefined && { idGrado: usuarioDto.idGrado }),
      ...(usuarioDto.idGrupo !== undefined && { idGrupo: usuarioDto.idGrupo }),
      ...(usuarioDto.numeroPase !== undefined && { numeroPase: usuarioDto.numeroPase }),
      ...(usuarioDto.fechaPerfilCompletado !== undefined && {
        fechaPerfilCompletado: usuarioDto.fechaPerfilCompletado,
      }),
      ...(usuarioDto.sesionesRevocadasDesde !== undefined && {
        sesionesRevocadasDesde: usuarioDto.sesionesRevocadasDesde,
      }),
      usuarioModificacion: usuarioAuditoria,
    })

    return await repo.save(existing)
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    const repo = this.dataSource.getRepository(Usuario)
    const existing = await repo.findOne({ where: { id: idUsuario as any } })
    if (!existing) return null
    existing.intentos = intento
    return await repo.save(existing)
  }

  async actualizarDatosBloqueo(
    idUsuario: string,
    codigo: string | null,
    fechaBloqueo: Date | null
  ) {
    const repo = this.dataSource.getRepository(Usuario)
    const existing = await repo.findOne({ where: { id: idUsuario as any } })
    if (!existing) return null
    existing.codigoDesbloqueo = codigo
    existing.fechaBloqueo = fechaBloqueo
    return await repo.save(existing)
  }

  async actualizarDatosRecuperacion(idUsuario: string, codigo: string) {
    const repo = this.dataSource.getRepository(Usuario)
    const existing = await repo.findOne({ where: { id: idUsuario as any } })
    if (!existing) return null
    existing.codigoRecuperacion = codigo
    return await repo.save(existing)
  }

  async actualizarDatosActivacion(
    idUsuario: string,
    codigo: string,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    const repo = transaction.getRepository(Usuario)
    const existing = await repo.findOne({ where: { id: idUsuario as any } })
    if (!existing) return null
    existing.codigoActivacion = codigo
    existing.codigoActivacionExpira = dayjs().add(72, 'hour').toDate()
    existing.usuarioModificacion = usuarioAuditoria
    return await repo.save(existing)
  }

  async actualizarDatosTransaccion(idUsuario: string, codigo: string) {
    const repo = this.dataSource.getRepository(Usuario)
    const existing = await repo.findOne({ where: { id: idUsuario as any } })
    if (!existing) return null
    existing.codigoTransaccion = codigo
    return await repo.save(existing)
  }

  async buscarPorCodigoDesbloqueo(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoRecuperacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoRecuperacion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoTransaccion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select([
        'usuario.id',
        'usuario.estado',
        'usuario.fechaBloqueo',
        'usuario.contrasena',
      ])
      .where('usuario.codigoTransaccion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoActivacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select([
        'usuario.id',
        'usuario.estado',
        'usuario.fechaBloqueo',
        'usuario.codigoActivacionExpira',
      ])
      .where('usuario.codigoActivacion = :codigo', { codigo })
      .getOne()
  }

  async actualizarDatosPersona(persona: PersonaDto) {
    const repo = this.dataSource.getRepository(Persona)
    const existing = await repo.findOne({ where: { nroDocumento: persona.nroDocumento } })
    if (!existing) return null
    Object.assign(existing, persona)
    return await repo.save(existing)
  }

  runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }

  async ActualizarDatosPersonaId(
    idPersona: string,
    persona: PersonaDto,
    transaction?: EntityManager,
    usuarioAuditoria?: string
  ) {
    const manager = transaction ?? this.dataSource.manager
    const repo = manager.getRepository(Persona)

    const existing = await repo.findOne({ where: { id: idPersona as any } })
    if (!existing) return null

    Object.assign(existing, persona)
    if (usuarioAuditoria) existing.usuarioModificacion = usuarioAuditoria

    return await repo.save(existing)
  }

  async obtenerCodigoTest(idUsuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.codigoActivacion', 'usuario.codigoDesbloqueo'])
      .where({ id: idUsuario })
      .getOne()
  }
}
