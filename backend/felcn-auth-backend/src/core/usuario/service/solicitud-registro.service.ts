import { BaseService } from '@/common/base'
import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { SolicitudRegistroRepository } from '../repository/solicitud-registro.repository'
import { UsuarioRepository } from '../repository/usuario.repository'
import { UsuarioService } from './usuario.service'
import { GradoService } from '@/core/estructura/service/grado.service'
import { MensajeriaService } from '@/core/external-services/mensajeria/mensajeria.service'
import { TemplateEmailService } from '@/common/templates/templates-email.service'
import { SolicitarAccesoRegistroDto } from '../dto/solicitar-acceso-registro.dto'
import { CompletarSolicitudRegistroDto } from '../dto/completar-solicitud-registro.dto'
import { RechazarSolicitudRegistroDto } from '../dto/rechazar-solicitud-registro.dto'
import { FiltrosSolicitudRegistroDto } from '../dto/filtros-solicitud-registro.dto'
import { SolicitudRegistroEstado } from '../entity/solicitud-registro.entity'
import { Messages } from '@/common/constants/response-messages'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'

const TOKEN_ACCESO_MINUTOS = 60

interface TokenAccesoPayload {
  correoElectronico: string
  tipo: 'solicitud_registro'
}

@Injectable()
export class SolicitudRegistroService extends BaseService {
  constructor(
    private readonly solicitudRepositorio: SolicitudRegistroRepository,
    private readonly usuarioRepositorio: UsuarioRepository,
    private readonly usuarioService: UsuarioService,
    private readonly gradoService: GradoService,
    private readonly mensajeriaService: MensajeriaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    super()
  }

  private construirUrl(pathname: string, params: Record<string, string>): URL {
    const base = this.configService.get('URL_FRONTEND') ?? ''
    const url = new URL(pathname, base.endsWith('/') ? base : `${base}/`)
    for (const [clave, valor] of Object.entries(params)) {
      url.searchParams.append(clave, valor)
    }
    return url
  }

  /**
   * Paso 1 — no escribe nada en la base de datos. El correo queda sellado
   * dentro de un JWT de corta duración; el link solo sirve para acceder al
   * formulario del paso 2, no autoriza ni crea nada por sí mismo.
   */
  async solicitarAcceso(dto: SolicitarAccesoRegistroDto): Promise<void> {
    const token = this.jwtService.sign(
      { correoElectronico: dto.correoElectronico, tipo: 'solicitud_registro' } as TokenAccesoPayload,
      { expiresIn: `${TOKEN_ACCESO_MINUTOS}m` }
    )

    const url = this.construirUrl('pre-registro', { token })
    const template = TemplateEmailService.armarPlantillaSolicitudAccesoRegistro(
      url.toString(),
      TOKEN_ACCESO_MINUTOS
    )

    // Envío fuera del ciclo request/response: si el SMTP está lento o caído
    // no debe demorar ni tumbar esta respuesta (ver mismo criterio en
    // usuario.service.ts para crear/activar cuentas).
    this.mensajeriaService
      .sendEmail(dto.correoElectronico, 'Completar preregistro — Sistema FELCN', template)
      .catch((error) => {
        this.logger.error(error, 'Falló al enviar el correo de acceso al preregistro')
      })
    // Respuesta siempre genérica en el controller — nunca revela si el
    // correo es válido, si ya tiene cuenta, ni si el envío realmente ocurrió.
  }

  /** Valida el token del paso 1 sin consumir nada — para que el frontend
   *  decida si muestra el formulario o un aviso de link vencido/inválido. */
  validarToken(token: string): { correoElectronico: string } {
    try {
      const payload = this.jwtService.verify<TokenAccesoPayload>(token)
      if (payload.tipo !== 'solicitud_registro') {
        throw new Error('tipo de token incorrecto')
      }
      return { correoElectronico: payload.correoElectronico }
    } catch {
      throw new PreconditionFailedException(Messages.EXPIRED_ACTIVATION_LINK)
    }
  }

  /**
   * Paso 2 — recién acá se evalúa si ya existe una cuenta real con el mismo
   * documento o correo. Si existe, no se crea ninguna fila: se le avisa por
   * ese mismo correo (no por la respuesta del API) para no filtrar nada a
   * quien esté llenando el formulario.
   */
  async completarFormulario(dto: CompletarSolicitudRegistroDto): Promise<void> {
    const { correoElectronico } = this.validarToken(dto.token)

    const [usuarioPorDocumento, usuarioPorCorreo] = await Promise.all([
      this.usuarioRepositorio.buscarUsuarioPorCI(dto.nroDocumento),
      this.usuarioRepositorio.buscarUsuarioPorCorreo(correoElectronico),
    ])

    if (usuarioPorDocumento || usuarioPorCorreo) {
      const template = TemplateEmailService.armarPlantillaCuentaYaExiste()
      this.mensajeriaService
        .sendEmail(correoElectronico, 'Preregistro — Sistema FELCN', template)
        .catch((error) => {
          this.logger.error(error, 'Falló al enviar el aviso de cuenta ya existente')
        })
      return
    }

    await this.solicitudRepositorio.crear({
      estado: SolicitudRegistroEstado.PENDIENTE_APROBACION,
      nombres: dto.nombres,
      primerApellido: dto.primerApellido,
      segundoApellido: dto.segundoApellido,
      nroDocumento: dto.nroDocumento,
      fechaNacimiento: dto.fechaNacimiento,
      correoElectronico,
      telefono: dto.telefono,
      idGrado: dto.idGrado,
      numeroPase: dto.numeroPase,
    })
  }

  /** Lookup público — el formulario de preregistro no tiene sesión todavía. */
  async listarGradosPublico() {
    return await this.gradoService.listar()
  }

  async listar(filtros: FiltrosSolicitudRegistroDto) {
    const [filas, total] = await this.solicitudRepositorio.listar(filtros)
    const [grados] = await this.gradoService.listarTodos()
    const gradosPorId = new Map(grados.map((g: any) => [g.id, g]))

    return {
      filas: filas.map((s) => ({ ...s, grado: gradosPorId.get(s.idGrado) ?? null })),
      total,
    }
  }

  async buscarPorId(id: string) {
    const solicitud = await this.solicitudRepositorio.buscarPorId(id)
    if (!solicitud) {
      throw new NotFoundException(Messages.INVALID_USER)
    }
    const [grados] = await this.gradoService.listarTodos()
    const grado = grados.find((g: any) => g.id === solicitud.idGrado) ?? null
    return { ...solicitud, grado }
  }

  private async obtenerPendiente(id: string) {
    const solicitud = await this.solicitudRepositorio.buscarPorId(id)
    if (!solicitud) {
      throw new NotFoundException(Messages.INVALID_USER)
    }
    if (solicitud.estado !== SolicitudRegistroEstado.PENDIENTE_APROBACION) {
      throw new PreconditionFailedException(Messages.SOLICITUD_REGISTRO_YA_RESUELTA)
    }
    return solicitud
  }

  /**
   * El admin confirma desde el mismo formulario de "Nuevo Usuario",
   * precargado con los datos de la solicitud pero totalmente editable —
   * lo que llega acá ya es lo que el admin revisó/corrigió, no los datos
   * originales de la solicitud (que solo sirvieron para precargar el form).
   */
  async aprobar(id: string, dto: CrearUsuarioDto, idAdmin: string) {
    await this.obtenerPendiente(id)

    const resultado = await this.usuarioService.crear(dto, idAdmin)

    await this.solicitudRepositorio.actualizar(id, {
      estado: SolicitudRegistroEstado.APROBADA,
      fechaResolucion: new Date(),
      idAdminResolutor: idAdmin,
      idUsuarioCreado: resultado.id,
    })

    return { id, idUsuarioCreado: resultado.id }
  }

  async rechazar(id: string, dto: RechazarSolicitudRegistroDto, idAdmin: string) {
    await this.obtenerPendiente(id)

    await this.solicitudRepositorio.actualizar(id, {
      estado: SolicitudRegistroEstado.RECHAZADA,
      fechaResolucion: new Date(),
      idAdminResolutor: idAdmin,
      comentarioRechazo: dto.comentario,
    })

    return { id }
  }
}
