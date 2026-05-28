import { Injectable, OnModuleInit } from '@nestjs/common'
import { generateKeyPair, exportJWK, importJWK, SignJWT, jwtVerify } from 'jose'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import type { KeyLike } from 'jose'

// Ruta donde se persiste el par de llaves entre reinicios.
// Esto evita que openid-client (auth-backend) falle con JWSSignatureVerificationFailed
// cuando el fake reinicia y genera un nuevo par RSA con el mismo kid.
// En Docker: montar un volumen en KEY_DATA_DIR (/app/data por defecto) para persistir la clave.
const KEY_DATA_DIR = process.env.KEY_DATA_DIR || process.cwd()
const KEY_FILE = path.join(KEY_DATA_DIR, '.fake-jwk-keys.json')

@Injectable()
export class JwtService implements OnModuleInit {
  private privateKey: KeyLike
  private publicKey: KeyLike
  private jwks: { keys: object[] }
  private kid = 'fake-ciudadania-key-1'

  async onModuleInit() {
    let privateJwk: object | null = null
    let publicJwk: object | null = null

    // Intentar cargar llaves persistidas
    if (fs.existsSync(KEY_FILE)) {
      try {
        const stored = JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8'))
        privateJwk = stored.privateJwk
        publicJwk = stored.publicJwk
        this.privateKey = (await importJWK(privateJwk as Parameters<typeof importJWK>[0], 'RS256')) as KeyLike
        this.publicKey = (await importJWK(publicJwk as Parameters<typeof importJWK>[0], 'RS256')) as KeyLike
        console.log('[JwtService] Par RSA cargado desde disco (.fake-jwk-keys.json)')
      } catch {
        privateJwk = null
      }
    }

    // Generar nuevo par si no hay llaves válidas
    if (!privateJwk) {
      const { privateKey, publicKey } = await generateKeyPair('RS256')
      this.privateKey = privateKey
      this.publicKey = publicKey
      privateJwk = await exportJWK(privateKey)
      publicJwk = await exportJWK(publicKey)
      fs.writeFileSync(KEY_FILE, JSON.stringify({ privateJwk, publicJwk }, null, 2))
      console.log('[JwtService] Nuevo par RSA generado y guardado en .fake-jwk-keys.json')
    }

    this.jwks = {
      keys: [{ ...(publicJwk as object), use: 'sig', alg: 'RS256', kid: this.kid }],
    }
  }

  getJwks() {
    return this.jwks
  }

  async signAccessToken(payload: object, expiresIn = '1h'): Promise<string> {
    const issuer = process.env.FAKE_ISSUER || 'http://localhost:3001'
    return new SignJWT(payload as Record<string, unknown>)
      .setProtectedHeader({ alg: 'RS256', kid: this.kid })
      .setIssuedAt()
      .setIssuer(issuer)
      .setExpirationTime(expiresIn)
      .sign(this.privateKey)
  }

  async signIdToken(
    sub: string,
    clientId: string,
    nonce: string | undefined,
    extra: Record<string, unknown> = {}
  ): Promise<string> {
    const issuer = process.env.FAKE_ISSUER || 'http://localhost:3001'
    const builder = new SignJWT({ ...extra, sub, nonce })
      .setProtectedHeader({ alg: 'RS256', kid: this.kid })
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(clientId)
      .setExpirationTime('1h')

    return builder.sign(this.privateKey)
  }

  /** Verifica un access_token y devuelve el payload */
  async verifyAccessToken(token: string): Promise<Record<string, unknown>> {
    const issuer = process.env.FAKE_ISSUER || 'http://localhost:3001'
    const { payload } = await jwtVerify(token, this.publicKey, { issuer })
    return payload as Record<string, unknown>
  }

  /** Hash SHA-256 — usado para guardar el authorization code en DB */
  hashCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex')
  }
}
