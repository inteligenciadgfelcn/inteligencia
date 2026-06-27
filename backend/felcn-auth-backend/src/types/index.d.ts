import 'express-session'

declare global {
  type PassportUser = {
    id: string // colocar el tipo según el modelo usuario.entity
    usuario: string // nombre de usuario único (CI o login)
    roles: Array<string>
    idRol?: string // rol principal
    rol?: string // rol principal
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
    idRol?: string // rol principal
    rol?: string // rol principal
    exp?: number
    iat?: number
    numeroPase: string | null // número de pase → vinculación con asignacion.usuario en felcn_siii
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
