import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { customAlphabet, nanoid } from 'nanoid'
import { v4, v5 } from 'uuid'
import zxcvbn from 'zxcvbn-typescript'
import { Configurations } from '../params'

@Injectable()
export class TextService {
  /**
   * Método para encriptar un password.
   * @param password contraseña
   * @param rounds costo bcrypt — por defecto el de contraseñas (SALT_ROUNDS).
   *   Para valores de vida corta y ya protegidos por rate-limit/intentos
   *   máximos (ej. el código OTP), usar un costo bajo (ver OTP_SALT_ROUNDS)
   *   evita una demora de más de un segundo por operación sin aportar
   *   seguridad real — el costo alto de bcrypt defiende contra fuerza bruta
   *   offline de un hash robado, algo que no aplica a un código de 6 dígitos
   *   que expira en minutos y ya tiene su propio límite de intentos.
   */
  static async encrypt(password: string, rounds: number = Configurations.SALT_ROUNDS) {
    return await hash(password, rounds)
  }

  static async compare(
    passwordInPlainText: string | Buffer,
    hashedPassword: string
  ) {
    return await compare(passwordInPlainText, hashedPassword)
  }

  /**
   * Método para convertir un texto a formato uuid
   * @param text Texto
   * @param namespace Uuid base
   */
  static textToUuid(
    text: string,
    namespace = 'bb5d0ffa-9a4c-4d7c-8fc2-0a7d2220ba45'
  ): string {
    return v5(text, namespace)
  }

  static generateUuid(): string {
    return v4()
  }

  /**
   * Método para generar un texto aleatorio corto de acuerdo a un alfabeto
   * @returns string
   */
  static generateShortRandomText(length = 8): string {
    const nanoid = customAlphabet(
      '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      length
    )
    return nanoid()
  }

  /**
   * Método para generar un texto aleatorio corto
   * @returns string
   */
  static generateNanoId(): string {
    return nanoid()
  }

  static generateNumericOtp(length = 6): string {
    const generate = customAlphabet('0123456789', length)
    return generate()
  }

  static validateLevelPassword(password: string) {
    const result = zxcvbn(password)
    return result.score >= Configurations.SCORE_PASSWORD
  }

  static decodeBase64 = (base64: string) => {
    const text = TextService.atob(base64)
    return decodeURI(text)
  }

  static atob = (a: string) => Buffer.from(a, 'base64').toString('ascii')

  static btoa = (b: string) => Buffer.from(b).toString('base64')
}
