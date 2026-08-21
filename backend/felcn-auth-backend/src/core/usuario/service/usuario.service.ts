import { BaseService } from '@/common/base'
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { UsuarioRepository } from '../repository/usuario.repository'
import { Status, TipoDocumento, USUARIO_NORMAL } from '@/common/constants'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { TextService } from '@/common/lib/text.service'
import { Messages } from '@/common/constants/response-messages'
import { PersonaDto } from '../dto/persona.dto'
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto'
import { CrearUsuarioCiudadaniaDto } from '../dto/crear-usuario-ciudadania.dto'
import { ConfigService } from '@nestjs/config'
import { TemplateEmailService } from '@/common/templates/templates-email.service'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { EntityManager } from 'typeorm'
import { CrearUsuarioCuentaDto } from '../dto/crear-usuario-cuenta.dto'
import {
  NuevaContrasenaDto,
  RecuperarCuentaDto,
  ValidarRecuperarCuentaDto,
} from '../dto/recuperar-cuenta.dto'
import { PersonaRepository } from '../repository/persona.repository'
import { RolRepository } from '@/core/authorization/repository/rol.repository'
import { AuthorizationService } from '@/core/authorization/controller/authorization.service'
import { UsuarioRolRepository } from '@/core/authorization/repository/usuario-rol.repository'
import { MensajeriaService } from '@/core/external-services/mensajeria/mensajeria.service'
import { UsuarioEstado } from '@/core/usuario/constant'
import { UsuarioRolEstado } from '@/core/authorization/constant'
import { ActualizarPerfilDto } from '@/core/usuario/dto/ActualizarPerfilDto'
import { FileValidationService } from '@/common/lib/file-validation.service'
import { RefreshTokensRepository } from '@/core/authentication/repository/refreshTokens.repository'
import { HistorialContrasenaRepository } from '../repository/historial-contrasena.repository'
import { Configurations } from '@/common/params'
import path from 'path'
import fs from 'node:fs/promises'

@Injectable()
export class UsuarioService extends BaseService {
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    @Inject(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
    @Inject(RolRepository)
    private rolRepositorio: RolRepository,
    @Inject(PersonaRepository)
    private personaRepositorio: PersonaRepository,
    private readonly mensajeriaService: MensajeriaService,
    private readonly authorizationService: AuthorizationService,
    private fileValidationService: FileValidationService,
    private configService: ConfigService,
    @Inject(RefreshTokensRepository)
    private refreshTokensRepositorio: RefreshTokensRepository,
    @Inject(HistorialContrasenaRepository)
    private historialContrasenaRepositorio: HistorialContrasenaRepository
  ) {
    super()
  }

  /**
   * Revoca todas las sesiones activas (refresh tokens) del usuario. Se invoca
   * tras cualquier cambio de contraseña (autogestionado, por recuperación o
   * restaurado por un Administrador) para que una sesión ya abierta con la
   * contraseña anterior no pueda seguir renovando su acceso indefinidamente.
   * El access token (JWT) ya emitido antes del cambio sigue siendo válido
   * hasta su propio vencimiento (no tiene estado, no se puede revocar antes).
   */
  async revocarSesionesActivas(idUsuario: string) {
    await this.refreshTokensRepositorio.eliminarPorUsuario(idUsuario)
  }

  /**
   * Rechaza la contraseña nueva si coincide con la actual o con alguna de
   * las últimas PASSWORD_HISTORY_SIZE contraseñas del usuario. Debe llamarse
   * ANTES de guardar la nueva contraseña. `hashActual` es el hash vigente en
   * ese momento (aún no reemplazado).
   */
  private async verificarContrasenaNoReutilizada(
    idUsuario: string,
    contrasenaNuevaPlano: string,
    hashActual: string
  ) {
    const hashesAVerificar = [hashActual]
    const historial = await this.historialContrasenaRepositorio.obtenerUltimas(
      idUsuario,
      Configurations.PASSWORD_HISTORY_SIZE
    )
    hashesAVerificar.push(...historial.map((h) => h.contrasena))

    for (const hash of hashesAVerificar) {
      if (await TextService.compare(contrasenaNuevaPlano, hash)) {
        throw new PreconditionFailedException(Messages.PASSWORD_REUSED)
      }
    }
  }

  /**
   * Archiva el hash que la contraseña de un usuario tenía antes de un cambio,
   * para que futuras verificaciones de reuso lo tengan en cuenta.
   */
  private async archivarContrasenaAnterior(
    idUsuario: string,
    hashSaliente: string
  ) {
    await this.historialContrasenaRepositorio.guardar(idUsuario, hashSaliente)
  }

  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    return await this.usuarioRepositorio.listar(paginacionQueryDto)
  }

  async buscarUsuario(usuario: string) {
    return await this.usuarioRepositorio.buscarUsuario(usuario)
  }

  /**
   * Arma una URL absoluta hacia una ruta del frontend (activación, recuperación,
   * desbloqueo, etc.) resolviéndola en forma relativa a URL_FRONTEND, para que
   * el path base (p. ej. "/staging/" en el entorno de staging) no se pierda.
   */
  private construirUrlAccion(pathname: string, codigo: string): URL {
    const base = this.configService.get('URL_FRONTEND') ?? ''
    const url = new URL(pathname, base.endsWith('/') ? base : `${base}/`)
    url.searchParams.append('q', codigo)
    return url
  }

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    // verificar si el usuario ya fue registrado
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(
      usuarioDto.persona.nroDocumento
    )

    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    // verificar si el correo no esta registrado
    const correo = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
      usuarioDto.correoElectronico
    )

    if (correo) {
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
    }

    // verificar si el telefono no esta registrado
    if (usuarioDto.persona.telefono) {
      const telefono = await this.personaRepositorio.buscarPersonaPorTelefono(
        usuarioDto.persona.telefono
      )

      if (telefono) {
        throw new PreconditionFailedException(Messages.EXISTING_PHONE)
      }
    }

    const { persona, roles } = usuarioDto

    // [FAKE] Si está configurada la URL interna del fake de Ciudadanía Digital,
    // activar automáticamente la bandera ciudadaniaDigital en el nuevo usuario.
    const fakeCiudadaniaUrl = this.configService.get<string>(
      'FAKE_CIUDADANIA_INTERNAL_URL'
    )
    if (fakeCiudadaniaUrl) {
      usuarioDto.ciudadaniaDigital = true
    }

    let codigoActivacion = ''

    const op = async (transaction: EntityManager) => {
      // No se define contrasena: el repositorio genera un hash placeholder
      // (ver UsuarioRepository.crear) que nadie conoce. El usuario recién
      // define su propia contraseña al activar la cuenta desde el enlace.
      usuarioDto.estado = UsuarioEstado.PENDING

      const persona = await this.personaRepositorio.crear(
        usuarioDto.persona,
        usuarioAuditoria,
        transaction
      )

      const usuario = await this.usuarioRepositorio.crear(
        persona.id,
        {
          ...usuarioDto,
          usuario: usuarioDto.usuario ?? usuarioDto?.persona?.nroDocumento,
        },
        usuarioAuditoria,
        transaction
      )

      await this.usuarioRolRepositorio.crear(
        usuario.id,
        roles,
        usuarioAuditoria,
        transaction
      )

      await this.procesarExcepcionesRecurso(
        usuario.id,
        usuarioDto.recursosExceptuados,
        usuarioAuditoria,
        transaction
      )

      codigoActivacion = TextService.generateUuid()
      await this.actualizarDatosActivacion(
        usuario.id,
        codigoActivacion,
        usuarioAuditoria,
        transaction
      )

      return usuario
    }

    const crearResult = await this.usuarioRepositorio.runTransaction(op)

    const urlActivacion = this.construirUrlAccion(
      'activacion',
      codigoActivacion
    )

    if (crearResult.correoElectronico) {
      const template =
        TemplateEmailService.armarPlantillaActivacionCuentaPorAdmin(
          urlActivacion.toString()
        )

      await this.mensajeriaService
        .sendEmail(
          crearResult.correoElectronico,
          Messages.NEW_USER_ACCOUNT_VERIFY,
          template
        )
        .catch((error) => {
          this.logger.error(
            error,
            `Falló al enviar el correo de activación de cuenta — CI: ${usuarioDto.persona.nroDocumento}`
          )
        })
    }

    // [FAKE] Dar de alta en el fake de Ciudadanía Digital (fire-and-forget).
    // Usa una contraseña propia, desacoplada de la cuenta real: el fake simula
    // un proveedor externo de identidad, no el login local del sistema.
    if (fakeCiudadaniaUrl) {
      const contrasenaFake = TextService.generateShortRandomText()
      this.darDeAltaEnFakeCiudadania(
        fakeCiudadaniaUrl,
        usuarioDto,
        contrasenaFake
      ).catch((err) => {
        this.logger.warn(
          `[FAKE] No se pudo registrar en fake-ciudadania-api: ${err.message}`
        )
      })
    }

    // El link se devuelve también en la respuesta (endpoint admin-only) como
    // respaldo por si el envío de correo falla (p. ej. SMTP caído): el admin
    // puede copiarlo y hacérselo llegar al usuario por otro canal.
    return { ...crearResult, urlActivacion: urlActivacion.toString() }
  }

  async crearCuenta(usuarioDto: CrearUsuarioCuentaDto) {
    const { persona, ...datosUsuarios } = usuarioDto

    // verificar si el usuario ya fue registrado con su correo
    const usuario = await this.usuarioRepositorio.buscarUsuario(
      persona.nroDocumento
    )

    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    // verificar si el correo no esta registrado
    const correo = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
      usuarioDto.correoElectronico
    )

    if (correo) {
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
    }

    // verificar si el telefono no esta registrado
    if (usuarioDto.persona.telefono) {
      const telefono = await this.personaRepositorio.buscarPersonaPorTelefono(
        usuarioDto.persona.telefono
      )

      if (telefono) {
        throw new PreconditionFailedException(Messages.EXISTING_PHONE)
      }
    }

    const rol = await this.rolRepositorio.buscarPorNombreRol('USUARIO')

    if (!rol) {
      throw new PreconditionFailedException(Messages.NO_PERMISSION_FOUND)
    }

    let correoActivacion: string | null = null
    let templateActivacion: string | null = null

    const op = async (transaction: EntityManager) => {
      const personaNueva = await this.personaRepositorio.crear(
        {
          ...persona,
          tipoDocumento: usuarioDto.persona.tipoDocumento ?? TipoDocumento.CI,
        },
        USUARIO_NORMAL,
        transaction
      )

      // No se define contrasena: el repositorio genera un hash placeholder
      // (ver UsuarioRepository.crear) que nadie conoce. El usuario recién
      // define su propia contraseña al activar la cuenta desde el enlace.
      const usuarioNuevo = await this.usuarioRepositorio.crear(
        personaNueva.id,
        {
          usuario: persona.nroDocumento,
          correoElectronico: datosUsuarios.correoElectronico,
          estado: UsuarioEstado.PENDING,
        },
        USUARIO_NORMAL,
        transaction
      )

      await this.usuarioRolRepositorio.crear(
        usuarioNuevo.id,
        [rol.id],
        USUARIO_NORMAL,
        transaction
      )

      const codigo = TextService.generateUuid()
      const urlActivacion = this.construirUrlAccion('activacion', codigo)

      this.logger.info(`📩 urlActivacion: ${urlActivacion}`)

      await this.actualizarDatosActivacion(
        usuarioNuevo.id,
        codigo,
        USUARIO_NORMAL,
        transaction
      )

      correoActivacion = usuarioNuevo.correoElectronico ?? null
      templateActivacion =
        TemplateEmailService.armarPlantillaActivacionCuentaManual(
          urlActivacion.toString()
        )

      const { id, usuario, correoElectronico, estado } = usuarioNuevo
      return { id, usuario, correoElectronico, estado }
    }

    const resultado = await this.usuarioRepositorio.runTransaction(op)

    // Envío de correo fuera de la transacción (no bloquea la respuesta)
    if (correoActivacion) {
      this.mensajeriaService
        .sendEmail(
          correoActivacion,
          Messages.NEW_USER_ACCOUNT_VERIFY,
          templateActivacion!
        )
        .catch((err) => {
          const mensaje = `Falló al enviar el correo de activación de cuenta`
          this.logger.error(err, mensaje)
        })
    }

    return resultado
  }

  async activarCuenta(codigo: string, contrasenaNueva: string) {
    const usuario =
      await this.usuarioRepositorio.buscarPorCodigoActivacion(codigo)

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    const contrasenaPlano = TextService.decodeBase64(contrasenaNueva)

    if (!TextService.validateLevelPassword(contrasenaPlano)) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    await this.usuarioRepositorio.actualizar(
      usuario.id,
      {
        estado: UsuarioEstado.ACTIVE,
        codigoActivacion: null,
        contrasena: await TextService.encrypt(contrasenaPlano),
      },
      usuario.id
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return { id: usuarioActualizado.id, estado: usuarioActualizado.estado }
  }

  async recuperarCuenta(recuperarCuentaDto: RecuperarCuentaDto) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
      recuperarCuentaDto.correoElectronico
    )

    if (!usuario) {
      this.logger.error('Usuario no encontrado')
      return 'Búsqueda terminada'
    }

    const codigo = TextService.generateUuid()
    const urlRecuperacion = this.construirUrlAccion('recuperacion', codigo)

    // this.logger.info(`📩 urlRecuperacion: ${urlRecuperacion}`)

    await this.actualizarDatosRecuperacion(usuario.id, codigo)

    const template = TemplateEmailService.armarPlantillaRecuperacionCuenta(
      urlRecuperacion.toString()
    )

    if (usuario.correoElectronico) {
      await this.mensajeriaService
        .sendEmail(
          usuario.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
          template
        )
        .catch((err) => {
          const mensaje = `Falló al enviar el correo de recuperación de cuenta`
          this.logger.error(err, mensaje)
        })
    }
    return 'Búsqueda terminada'
  }

  async validarRecuperar(validarRecuperarCuentaDto: ValidarRecuperarCuentaDto) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoRecuperacion(
      validarRecuperarCuentaDto.codigo
    )

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    const codigo = TextService.generateUuid()

    await this.actualizarDatosTransaccionRecuperacion(usuario.id, codigo)

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return { code: usuarioActualizado.codigoTransaccion }
  }

  async nuevaContrasenaTransaccion(nuevaContrasenaDto: NuevaContrasenaDto) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoTransaccion(
      nuevaContrasenaDto.codigo
    )

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    const contrasenaNuevaPlano = TextService.decodeBase64(
      nuevaContrasenaDto.contrasenaNueva
    )

    if (!TextService.validateLevelPassword(contrasenaNuevaPlano)) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    if (usuario.contrasena) {
      await this.verificarContrasenaNoReutilizada(
        usuario.id,
        contrasenaNuevaPlano,
        usuario.contrasena
      )
    }

    await this.usuarioRepositorio.actualizar(
      usuario.id,
      {
        fechaBloqueo: null,
        intentos: 0,
        codigoDesbloqueo: null,
        codigoTransaccion: null,
        codigoRecuperacion: null,
        contrasena: await TextService.encrypt(contrasenaNuevaPlano),
        estado: UsuarioEstado.ACTIVE,
      },
      usuario.id
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    if (usuario.contrasena) {
      await this.archivarContrasenaAnterior(usuario.id, usuario.contrasena)
    }

    await this.revocarSesionesActivas(usuario.id)

    return { id: usuarioActualizado.id }
  }

  async crearConCiudadania(
    usuarioDto: CrearUsuarioCiudadaniaDto,
    usuarioAuditoria: string
  ) {
    const op = async (transaction: EntityManager) => {
      const persona = new PersonaDto()
      persona.nroDocumento = usuarioDto.usuario
      const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(
        persona.nroDocumento
      )

      if (usuario) {
        throw new PreconditionFailedException(Messages.EXISTING_USER)
      }

      const personaResult = await this.personaRepositorio.crear(
        persona,
        usuarioAuditoria,
        transaction
      )

      usuarioDto.estado = UsuarioEstado.ACTIVE

      const usuarioResult = await this.usuarioRepositorio.crear(
        personaResult.id,
        usuarioDto as CrearUsuarioDto,
        usuarioAuditoria,
        transaction
      )

      const rol = await this.rolRepositorio.buscarPorNombreRol(
        'USUARIO',
        transaction
      )

      if (!rol) {
        throw new NotFoundException(Messages.NO_PERMISSION_FOUND)
      }

      await this.usuarioRolRepositorio.crear(
        usuarioResult.id,
        [rol.id],
        usuarioAuditoria,
        transaction
      )

      return usuarioResult
    }
    return await this.usuarioRepositorio.runTransaction(op)
  }

  async crearConPersonaExistente(
    idPersona: string,
    nroDocumento: string,
    otrosDatos: { correoElectronico: string },
    usuarioAuditoria: string
  ) {
    const op = async (transaction: EntityManager) => {
      // verificar si el usuario ya fue registrado
      const usuario = await this.usuarioRepositorio.verificarExisteUsuarioPorCI(
        nroDocumento,
        transaction
      )

      if (usuario) {
        throw new PreconditionFailedException(Messages.EXISTING_USER)
      }

      const usuarioResult = await this.usuarioRepositorio.crear(
        idPersona,
        {
          estado: UsuarioEstado.ACTIVE,
          correoElectronico: otrosDatos?.correoElectronico,
          ciudadaniaDigital: true,
        },
        usuarioAuditoria,
        transaction
      )

      const rol = await this.rolRepositorio.buscarPorNombreRol(
        'USUARIO',
        transaction
      )

      if (!rol) {
        throw new NotFoundException(Messages.NO_PERMISSION_FOUND)
      }

      await this.usuarioRolRepositorio.crear(
        usuarioResult.id,
        [rol.id],
        usuarioAuditoria,
        transaction
      )

      return usuarioResult
    }

    const result = await this.usuarioRepositorio.runTransaction(op)

    return { id: result.id, estado: result.estado }
  }

  async crearConCiudadaniaV2(
    personaCiudadania: PersonaDto,
    otrosDatos: { correoElectronico: string },
    usuarioAuditoria: string
  ) {
    const op = async (transaction: EntityManager) => {
      const persona = new PersonaDto()
      // completar campos de Ciudadanía
      persona.tipoDocumento = personaCiudadania.tipoDocumento
      persona.nroDocumento = personaCiudadania.nroDocumento
      persona.fechaNacimiento = personaCiudadania.fechaNacimiento
      persona.nombres = personaCiudadania.nombres
      persona.primerApellido = personaCiudadania.primerApellido
      persona.segundoApellido = personaCiudadania.segundoApellido
      persona.telefono = personaCiudadania.telefono
      persona.uuidCiudadano = personaCiudadania.uuidCiudadano

      const usuario = await this.usuarioRepositorio.verificarExisteUsuarioPorCI(
        persona.nroDocumento,
        transaction
      )

      if (usuario) throw new PreconditionFailedException(Messages.EXISTING_USER)

      const rol = await this.rolRepositorio.buscarPorNombreRol(
        'USUARIO',
        transaction
      )

      if (!rol) {
        throw new NotFoundException(Messages.NO_PERMISSION_FOUND)
      }

      const nuevaPersona = await this.personaRepositorio.crear(
        persona,
        usuarioAuditoria,
        transaction
      )

      const nuevoUsuario = await this.usuarioRepositorio.crear(
        nuevaPersona.id,
        {
          usuario: personaCiudadania.nroDocumento,
          estado: UsuarioEstado.ACTIVE,
          correoElectronico: otrosDatos?.correoElectronico,
          ciudadaniaDigital: true,
        },
        usuarioAuditoria,
        transaction
      )

      await this.usuarioRolRepositorio.crear(
        nuevoUsuario.id,
        [rol.id],
        usuarioAuditoria,
        transaction
      )

      return nuevoUsuario
    }

    const result = await this.usuarioRepositorio.runTransaction(op)

    return { id: result.id, estado: result.estado }
  }

  async activar(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [
      UsuarioEstado.CREATE,
      UsuarioEstado.INACTIVE,
      UsuarioEstado.PENDING,
    ]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        estado: UsuarioEstado.ACTIVE,
      },
      usuarioAuditoria
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    // Mismo patrón que recuperación/restablecimiento: nunca se genera ni se
    // envía una contraseña por correo. La cuenta queda activa de inmediato
    // con su contraseña anterior; el enlace es solo por si el usuario no la
    // recuerda.
    const codigo = TextService.generateUuid()
    const urlRecuperacion = this.construirUrlAccion('recuperacion', codigo)

    await this.actualizarDatosRecuperacion(idUsuario, codigo)

    if (usuarioActualizado.correoElectronico) {
      const template = TemplateEmailService.armarPlantillaRecuperacionCuenta(
        urlRecuperacion.toString()
      )

      await this.mensajeriaService
        .sendEmail(
          usuarioActualizado.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
          template
        )
        .catch((err) => {
          const mensaje = `Falló al enviar el correo de activación de cuenta`
          this.logger.error(err, mensaje)
        })
    }

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
      urlRecuperacion: urlRecuperacion.toString(),
    }
  }

  async inactivar(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)

    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        estado: UsuarioEstado.INACTIVE,
      },

      usuarioAuditoria
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
    }
  }

  verificarPermisos(usuarioAuditoria: string, id: string) {
    if (usuarioAuditoria === id) {
      throw new ForbiddenException(Messages.EXCEPTION_OWN_ACCOUNT_ACTION)
    }
  }

  async actualizarContrasena(
    idUsuario: string,
    contrasenaActual: string,
    contrasenaNueva: string
  ) {
    const hash = TextService.decodeBase64(contrasenaActual)
    const usuario =
      await this.usuarioRepositorio.buscarUsuarioRolPorId(idUsuario)

    if (!(usuario && (await TextService.compare(hash, usuario.contrasena)))) {
      throw new PreconditionFailedException(Messages.INVALID_CREDENTIALS)
    }
    // validar que la contraseña nueva cumpla nivel de seguridad
    const contrasena = TextService.decodeBase64(contrasenaNueva)

    if (!TextService.validateLevelPassword(contrasena)) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    await this.verificarContrasenaNoReutilizada(
      idUsuario,
      contrasena,
      usuario.contrasena
    )

    // guardar en bd
    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        contrasena: await TextService.encrypt(contrasena),
        estado: UsuarioEstado.ACTIVE,
      },
      idUsuario
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    await this.archivarContrasenaAnterior(idUsuario, usuario.contrasena)
    await this.revocarSesionesActivas(idUsuario)

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
    }
  }

  async restaurarContrasena(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [UsuarioEstado.ACTIVE, UsuarioEstado.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    // Mismo patrón que la autorecuperación: se manda un enlace de un solo uso
    // y es el propio usuario quien define su contraseña nueva — nunca se
    // genera ni se envía una contraseña por correo.
    const codigo = TextService.generateUuid()
    const urlRecuperacion = this.construirUrlAccion('recuperacion', codigo)

    await this.actualizarDatosRecuperacion(idUsuario, codigo)
    await this.revocarSesionesActivas(idUsuario)

    if (usuario.correoElectronico) {
      const template = TemplateEmailService.armarPlantillaRecuperacionCuenta(
        urlRecuperacion.toString()
      )

      await this.mensajeriaService
        .sendEmail(
          usuario.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_RESET,
          template
        )
        .catch((error) => {
          const mensaje = `Ocurrió un error al enviar el correo electrónico para restaurar la contraseña`
          this.logger.error(error, mensaje)
        })
    }

    // El link se devuelve también en la respuesta (endpoint admin-only) como
    // respaldo por si el envío de correo falla (p. ej. SMTP caído).
    return {
      id: idUsuario,
      estado: usuario.estado,
      urlRecuperacion: urlRecuperacion.toString(),
    }
  }

  async reenviarCorreoActivacion(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [UsuarioEstado.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    const codigo = TextService.generateUuid()
    const urlActivacion = this.construirUrlAccion('activacion', codigo)

    const op = async (transaction: EntityManager) => {
      await this.actualizarDatosActivacion(
        usuario.id,
        codigo,
        usuarioAuditoria,
        transaction
      )

      const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
        idUsuario,
        transaction
      )

      if (!usuarioActualizado) {
        throw new NotFoundException(Messages.INVALID_USER)
      }

      return usuarioActualizado
    }

    const usuarioResult = await this.usuarioRepositorio.runTransaction(op)

    if (usuario.correoElectronico) {
      const template =
        TemplateEmailService.armarPlantillaActivacionCuentaManual(
          urlActivacion.toString()
        )
      await this.mensajeriaService
        .sendEmail(
          usuario.correoElectronico,
          Messages.NEW_USER_ACCOUNT_VERIFY,
          template
        )
        .catch((error) => {
          const mensaje = `Ocurrió un error al enviar el correo electrónico de activación de cuenta`
          this.logger.error(error, mensaje)
        })
    }

    // El link se devuelve también en la respuesta (endpoint admin-only) como
    // respaldo por si el envío de correo falla (p. ej. SMTP caído): el admin
    // puede copiarlo y hacérselo llegar al usuario por otro canal.
    return {
      id: idUsuario,
      estado: usuarioResult.estado,
      urlActivacion: urlActivacion.toString(),
    }
  }

  async actualizarDatos(
    id: string,
    usuarioDto: ActualizarUsuarioRolDto,
    usuarioAuditoria: string
  ) {
    const { persona } = usuarioDto

    // 1. verificar que exista el usuario
    const op = async (transaction: EntityManager) => {
      const usuario =
        await this.usuarioRepositorio.buscarDatosDeContactoDelUsuarioPorId(
          id,
          transaction
        )

      if (!usuario) {
        throw new NotFoundException(Messages.INVALID_USER)
      }

      if (persona) {
        // Verificar que el telefono no este registrado
        if (
          usuarioDto.persona?.telefono &&
          usuarioDto.persona.telefono !== usuario.persona.telefono
        ) {
          const existe = await this.personaRepositorio.buscarPersonaPorTelefono(
            usuarioDto.persona.telefono
          )
          if (existe) {
            throw new PreconditionFailedException(Messages.EXISTING_PHONE)
          }
        }

        const personaResult = await this.personaRepositorio.buscarPersonaId(
          usuario.idPersona,
          transaction
        )
        if (!personaResult) {
          throw new PreconditionFailedException(Messages.INVALID_USER)
        }

        await this.usuarioRepositorio.ActualizarDatosPersonaId(
          personaResult.id,
          persona,
          transaction,
          usuarioAuditoria
        )
      }

      const {
        correoElectronico,
        roles,
        ciudadaniaDigital,
        otpHabilitado,
        nombreApp,
        telefonoCelular,
        telefonoCorporativo,
        idGrado,
        idGrupo,
        numeroPase,
        recursosExceptuados,
      } = usuarioDto
      // 2. verificar que el email no este registrado

      if (
        correoElectronico &&
        correoElectronico !== usuario.correoElectronico
      ) {
        const existe = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
          correoElectronico,
          transaction
        )
        if (existe) {
          throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
        }
        await this.usuarioRepositorio.actualizar(
          id,
          {
            correoElectronico: correoElectronico,
          },
          usuarioAuditoria,
          transaction
        )
      }

      if (roles.length > 0) {
        // realizar reglas de roles
        await this.actualizarRoles(id, roles, usuarioAuditoria, transaction)
      }

      await this.procesarExcepcionesRecurso(
        id,
        recursosExceptuados,
        usuarioAuditoria,
        transaction
      )

      if (ciudadaniaDigital !== undefined && ciudadaniaDigital !== null) {
        await this.usuarioRepositorio.actualizar(
          id,
          {
            ciudadaniaDigital: ciudadaniaDigital,
          },
          usuarioAuditoria,
          transaction
        )
      }

      if (otpHabilitado !== undefined && otpHabilitado !== null) {
        await this.usuarioRepositorio.actualizar(
          id,
          {
            otpHabilitado: otpHabilitado,
          },
          usuarioAuditoria,
          transaction
        )
      }

      // Actualizar campos FELCN opcionales si fueron enviados
      const camposFelcn = {
        ...(nombreApp !== undefined && { nombreApp }),
        ...(telefonoCelular !== undefined && { telefonoCelular }),
        ...(telefonoCorporativo !== undefined && { telefonoCorporativo }),
        ...(idGrado !== undefined && { idGrado }),
        ...(idGrupo !== undefined && { idGrupo }),
        ...(numeroPase !== undefined && { numeroPase }),
      }
      if (Object.keys(camposFelcn).length > 0) {
        await this.usuarioRepositorio.actualizar(
          id,
          camposFelcn,
          usuarioAuditoria,
          transaction
        )
      }

      return { id: usuario.id }
    }

    const usuarioResult = await this.usuarioRepositorio.runTransaction(op)

    return { id: usuarioResult.id }
  }

  async actualizarRoles(
    id: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaccion?: EntityManager
  ) {
    const usuarioRoles =
      await this.usuarioRolRepositorio.obtenerRolesPorUsuario(id, transaccion)

    const { inactivos, activos, nuevos } = this.verificarUsuarioRoles(
      usuarioRoles,
      roles
    )

    // ACTIVAR roles inactivos
    if (inactivos.length > 0) {
      await this.usuarioRolRepositorio.activar(
        id,
        inactivos,
        usuarioAuditoria,
        transaccion
      )
    }
    // INACTIVAR roles activos
    if (activos.length > 0) {
      await this.usuarioRolRepositorio.inactivar(
        id,
        activos,
        usuarioAuditoria,
        transaccion
      )
    }
    // CREAR nuevos roles
    if (nuevos.length > 0) {
      await this.usuarioRolRepositorio.crear(
        id,
        nuevos,
        usuarioAuditoria,
        transaccion
      )
    }
  }

  verificarUsuarioRoles(
    usuarioRoles: Array<{
      rol: { id: string }
      estado: string
    }>,
    roles: Array<string>
  ) {
    const inactivos = roles.filter((rol) =>
      usuarioRoles.some(
        (usuarioRol) =>
          usuarioRol.rol.id === rol &&
          usuarioRol.estado === UsuarioRolEstado.INACTIVE
      )
    )

    const activos = usuarioRoles
      .filter(
        (usuarioRol) =>
          !roles.includes(usuarioRol.rol.id) &&
          usuarioRol.estado === UsuarioRolEstado.ACTIVE
      )
      .map((usuarioRol) => usuarioRol.rol.id)

    const nuevos = roles.filter((rol) =>
      usuarioRoles.every((usuarioRol) => usuarioRol.rol.id !== rol)
    )

    return {
      activos,
      inactivos,
      nuevos,
    }
  }

  /**
   * Sincroniza las excepciones de recurso enviadas para cada rol mencionado
   * en `recursosExceptuados`. Si el campo no viene en el payload, no se toca
   * nada — así ningún cliente/integración existente que no lo use se ve
   * afectado. Un rol mencionado con el que el usuario no cuenta (activo) es
   * un error del cliente, no un no-op silencioso.
   */
  private async procesarExcepcionesRecurso(
    idUsuario: string,
    recursosExceptuados: Record<string, string[]> | undefined,
    usuarioAuditoria: string,
    transaccion: EntityManager
  ) {
    if (!recursosExceptuados) {
      return
    }

    const usuarioRoles =
      await this.usuarioRolRepositorio.obtenerRolesPorUsuario(
        idUsuario,
        transaccion
      )
    const usuarioRolesActivos = usuarioRoles.filter(
      (usuarioRol) => usuarioRol.estado === UsuarioRolEstado.ACTIVE
    )

    for (const [idRol, idsModulo] of Object.entries(recursosExceptuados)) {
      const usuarioRol = usuarioRolesActivos.find(
        (item) => item.rol.id === idRol
      )
      if (!usuarioRol) {
        throw new PreconditionFailedException(
          `No se pueden gestionar excepciones para el rol ${idRol}: el usuario no lo tiene asignado activo`
        )
      }
      await this.authorizationService.sincronizarExcepcionesRecurso(
        usuarioRol.id,
        usuarioRol.rol.rol,
        idsModulo,
        usuarioAuditoria,
        transaccion
      )
    }
  }

  async buscarUsuarioPerfil(id: string, idRol: string) {
    const perfil = await this.buscarUsuarioId(id)
    return { ...perfil, idRol }
  }

  async buscarUsuarioPersonaPorId(id: string) {
    return await this.usuarioRepositorio.buscarUsuarioPersonaPorId(id)
  }

  async buscarUsuarioId(id: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(id)

    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      ciudadaniaDigital: usuario.ciudadaniaDigital,
      otpHabilitado: usuario.otpHabilitado,
      correoElectronico: usuario.correoElectronico,
      urlFoto: usuario.urlFoto,
      estado: usuario.estado,
      nombreApp: usuario.nombreApp,
      idGrado: usuario.idGrado,
      idGrupo: usuario.idGrupo,
      grado: usuario.grado ?? null,
      grupo: usuario.grupo ?? null,
      numeroPase: usuario.numeroPase ?? null,
      roles: await Promise.all(
        usuario.usuarioRol
          .filter((value) => value.estado === UsuarioRolEstado.ACTIVE)
          .map(async (usuarioRol) => {
            const { id, rol, nombre, descripcion } = usuarioRol.rol
            const modulos =
              await this.authorizationService.obtenerPermisosPorRol(
                rol,
                usuarioRol.id
              )
            return {
              idRol: id,
              rol,
              nombre,
              descripcion,
              modulos,
            }
          })
      ),
      persona: usuario.persona,
    }
  }

  async buscarUsuarioPorCI(persona: PersonaDto) {
    return await this.usuarioRepositorio.buscarUsuarioPorCI(
      persona.nroDocumento
    )
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    return await this.usuarioRepositorio.actualizarContadorBloqueos(
      idUsuario,
      intento
    )
  }

  async actualizarDatosBloqueo(
    idUsuario: string,
    codigo: string | null,
    fechaBloqueo: Date | null
  ) {
    return await this.usuarioRepositorio.actualizarDatosBloqueo(
      idUsuario,
      codigo,
      fechaBloqueo
    )
  }

  async actualizarDatosRecuperacion(idUsuario: string, codigo: string) {
    return await this.usuarioRepositorio.actualizarDatosRecuperacion(
      idUsuario,
      codigo
    )
  }

  async actualizarDatosActivacion(
    idUsuario: string,
    codigo: string,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    return await this.usuarioRepositorio.actualizarDatosActivacion(
      idUsuario,
      codigo,
      usuarioAuditoria,
      transaction
    )
  }

  async actualizarDatosTransaccionRecuperacion(
    idUsuario: string,
    codigo: string
  ) {
    return await this.usuarioRepositorio.actualizarDatosTransaccion(
      idUsuario,
      codigo
    )
  }

  async actualizarPerfil(
    idUsuario: string,
    actualizarPerfilDto: ActualizarPerfilDto
  ) {
    const usuario =
      await this.usuarioRepositorio.buscarDatosDeContactoDelUsuarioPorId(
        idUsuario
      )
    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    const {
      nombres,
      primerApellido,
      segundoApellido,
      correoElectronico,
      telefono,
    } = actualizarPerfilDto

    const op = async (transaction: EntityManager) => {
      if (telefono && telefono !== usuario.persona.telefono) {
        const existeTelefono =
          await this.personaRepositorio.buscarPersonaPorTelefono(telefono)

        if (existeTelefono) {
          throw new PreconditionFailedException(Messages.EXISTING_PHONE)
        }
      }

      // Actualizar datos de la persona
      await this.personaRepositorio.actualizar(
        usuario.idPersona,
        { nombres, primerApellido, segundoApellido, telefono },
        idUsuario,
        transaction
      )

      // Actualizar correo electrónico del usuario si ha cambiado
      if (
        correoElectronico &&
        correoElectronico !== usuario.correoElectronico
      ) {
        const existeCorreo =
          await this.usuarioRepositorio.buscarUsuarioPorCorreo(
            correoElectronico
          )
        if (existeCorreo) {
          throw new BadRequestException(Messages.EXISTING_EMAIL)
        }
        await this.usuarioRepositorio.actualizar(
          idUsuario,
          { correoElectronico },
          idUsuario,
          transaction
        )
      }
    }
    await this.usuarioRepositorio.runTransaction(op)

    return { id: idUsuario, mensaje: 'Perfil actualizado correctamente' }
  }

  async actualizarFotoPerfil(idUsuario: string, file: Express.Multer.File) {
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    // Validar el archivo contra XSS
    const validationResult = await this.fileValidationService.validateFile(
      file,
      'image'
    )
    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.error)
    }

    const storagePath = this.configService.get<string>('STORAGE_NFS_PATH')
    if (!storagePath) {
      throw new BadRequestException(
        'La configuración de almacenamiento no está disponible'
      )
    }

    const codigo = TextService.generateUuid()
    const fileName = `${codigo}${path.extname(file.originalname)}`
    const uploadPath = path.join(
      storagePath,
      'uploads',
      'profile-photos',
      fileName
    )

    try {
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.copyFile(file.path, uploadPath)
      await fs.unlink(file.path) // Eliminar el archivo temporal

      const fotoUrl = `/uploads/profile-photos/${fileName}`

      // Si existe una foto anterior, la eliminamos
      if (usuario.urlFoto) {
        const oldPhotoPath = path.join(
          storagePath,
          usuario.urlFoto.substring(1)
        )
        await fs.unlink(oldPhotoPath).catch((reason) => {
          this.logger.error(reason, 'Error en eliminar archivo')
        })
      }

      await this.usuarioRepositorio.actualizar(
        idUsuario,
        { urlFoto: fotoUrl },
        idUsuario
      )

      return {
        id: idUsuario,
        urlFoto: fotoUrl,
        mensaje: 'Foto de perfil actualizada correctamente',
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error)
      throw new BadRequestException('Error al procesar el archivo')
    }
  }

  async eliminarFotoPerfil(idUsuario: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    if (usuario.urlFoto) {
      const storagePath = this.configService.get<string>('STORAGE_NFS_PATH')

      if (!storagePath) {
        throw new BadRequestException(
          'La configuración de almacenamiento no está disponible'
        )
      }

      const filePath = path.join(storagePath, usuario.urlFoto.substring(1))
      await fs.unlink(filePath).catch((reason) => {
        this.logger.error(reason, 'Error en eliminar archivo')
      })

      await this.usuarioRepositorio.actualizar(
        idUsuario,
        { urlFoto: null },
        idUsuario
      )
    }

    return { mensaje: 'Foto de perfil eliminada correctamente' }
  }

  async desbloquearCuenta(codigo: string) {
    const usuario =
      await this.usuarioRepositorio.buscarPorCodigoDesbloqueo(codigo)
    if (usuario?.fechaBloqueo) {
      await this.usuarioRepositorio.actualizar(
        usuario.id,
        {
          fechaBloqueo: null,
          intentos: 0,
          codigoDesbloqueo: null,
        },
        USUARIO_NORMAL
      )
    }
    return { codigo }
  }

  /**
   * Desbloqueo manual por un Administrador, sin depender del correo del
   * usuario. Único camino administrativo hoy: el bloqueo ya no expira solo
   * (ver `AuthenticationService.verificarBloqueo`).
   */
  async desbloquearPorAdmin(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)

    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        fechaBloqueo: null,
        intentos: 0,
        codigoDesbloqueo: null,
      },
      usuarioAuditoria
    )

    return { id: idUsuario }
  }

  async actualizarDatosPersona(datosPersona: PersonaDto) {
    return await this.usuarioRepositorio.actualizarDatosPersona(datosPersona)
  }

  obtenerRolActual(
    roles: Array<{ idRol: string; rol: string }>,
    idRol: string | null | undefined
  ) {
    if (roles.length < 1) {
      throw new UnauthorizedException(`El usuario no cuenta con roles.`)
    }

    // buscar el primer rol
    if (!idRol) {
      return roles[0]
    }

    // buscar el rol activo
    const rol = roles.find((item) => item.idRol === idRol)
    if (!rol) {
      throw new UnauthorizedException(`Rol no permitido.`)
    }
    return rol
  }

  async obtenerCodigoTest(idUser: string) {
    return await this.usuarioRepositorio.obtenerCodigoTest(idUser)
  }

  /**
   * [FAKE] Registra el usuario recién creado en el fake de Ciudadanía Digital.
   * Usa fetch nativo (Node 18+). Es fire-and-forget — nunca bloquea el registro.
   * Al desacoplar el fake se elimina este método y las dos líneas que lo invocan.
   */
  private async darDeAltaEnFakeCiudadania(
    baseUrl: string,
    dto: CrearUsuarioDto,
    contrasena: string
  ): Promise<void> {
    const fechaNac = dto.persona.fechaNacimiento
      ? (() => {
          const d = new Date(dto.persona.fechaNacimiento as Date)
          const dd = String(d.getUTCDate()).padStart(2, '0')
          const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
          const yyyy = d.getUTCFullYear()
          return `${dd}/${mm}/${yyyy}`
        })()
      : ''

    const body = {
      ci: dto.persona.nroDocumento,
      password: contrasena,
      email: dto.correoElectronico,
      nombres: dto.persona.nombres,
      primerApellido: dto.persona.primerApellido ?? '',
      segundoApellido: dto.persona.segundoApellido ?? null,
      fechaNacimiento: fechaNac,
      celular: dto.telefonoCelular ?? null,
    }

    const resp = await fetch(`${baseUrl}/internal/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`)
    }
  }
}
