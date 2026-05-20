import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { InteraccionService } from './interaccion.service'

@Controller('interaction')
export class InteraccionController {
  constructor(private readonly interaccionService: InteraccionService) {}

  /** Página 1: formulario de login (CI + password) */
  @Get(':uid')
  async paginaLogin(@Param('uid') uid: string, @Res() res: Response) {
    try {
      const datos = await this.interaccionService.getDatosLogin(uid)
      return res.render('login', {
        uid: datos.uid,
        clientName: datos.clientName,
        error: null,
      })
    } catch (err) {
      return res.render('error', { mensaje: err.message || 'Sesión inválida o expirada' })
    }
  }

  /** POST login: valida CI + password, genera OTP, redirige a /otp */
  @Post(':uid/login')
  async procesarLogin(
    @Param('uid') uid: string,
    @Body() body: { login: string; password: string },
    @Res() res: Response
  ) {
    try {
      const { emailMasked } = await this.interaccionService.validarCredencialesYGenerarOtp(
        uid,
        body.login,
        body.password
      )
      return res.redirect(`/interaction/${uid}/otp?em=${encodeURIComponent(emailMasked)}`)
    } catch (err) {
      return res.render('login', {
        uid,
        clientName: 'Sistema FELCN',
        error: err.message || 'Error de autenticación',
      })
    }
  }

  /** Página 2: formulario de OTP */
  @Get(':uid/otp')
  async paginaOtp(
    @Param('uid') uid: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const emailMasked = (req.query.em as string) || 'co***@m***.com'
      const datos = await this.interaccionService.getDatosOtp(uid)
      return res.render('otp', {
        uid: datos.uid,
        emailMasked,
        error: null,
      })
    } catch (err) {
      return res.render('error', { mensaje: err.message || 'Sesión inválida o expirada' })
    }
  }

  /** POST validate: valida OTP, redirige al auth-backend con el code */
  @Post(':uid/validate')
  async validarOtp(
    @Param('uid') uid: string,
    @Body() body: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // Los 6 dígitos vienen como campo "data" (combinado por JS del frontend)
    // O como los 6 inputs individuales. Soportamos ambos formatos.
    const codigo = body.data ||
      [body['0'], body['1'], body['2'], body['3'], body['4'], body['5']].join('')

    const emailMasked = (req.query.em as string) || 'co***@m***.com'

    try {
      const { redirectUri } = await this.interaccionService.validarOtp(uid, codigo)
      return res.redirect(redirectUri)
    } catch (err) {
      return res.render('otp', {
        uid,
        emailMasked,
        error: err.message || 'Código incorrecto',
      })
    }
  }
}
