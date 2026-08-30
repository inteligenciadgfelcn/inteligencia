import 'express-session'

declare global {
  type PassportUser = {
    id: string
    usuario: string // nombre de usuario único (CI o login)
    roles: Array<string>
    idRol?: string
    rol?: string
    numeroPase?: string
    idToken?: string
    accessToken?: string
    refreshToken?: string
    exp?: number
    iat?: number
    error?: string
  }

  type PayloadType = {
    id: string
    usuario: string // nombre de usuario único (CI o login)
    roles: Array<string>
    idRol?: string
    rol?: string
    numeroPase?: string
    exp?: number
    iat?: number
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    startTime?: number
    user?: PassportUser
  }
}

declare module 'express-session' {
  interface SessionData {
    origen: string
    passport: {
      user: PassportUser
    }
  }
}
