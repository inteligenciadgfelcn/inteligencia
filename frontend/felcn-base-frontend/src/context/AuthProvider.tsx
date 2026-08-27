'use client'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Enforcer } from 'casbin'
import {
  delay,
  encodeBase64,
  guardarCookie,
  InterpreteMensajes,
  leerCookie,
} from '@/utils'
import { CasbinTypes } from '@/types'
import {
  idRolType,
  LoginType,
  RoleType,
  UsuarioType,
} from '@/app/login/types/loginTypes'
import { useAlerts, useCasbinEnforcer, useSession } from '@/hooks'
import { Servicios } from '@/services'
import { VerificarServicioResponse } from '@/app/(fase_2)/inteligencia/registro/services/registro.service'
import { set } from 'lodash'

export interface OtpPendienteType {
  otpSesionId: string
  destinoOfuscado: string
  canal: string
}

interface ContextProps {
  cargarUsuarioManual: () => Promise<void>
  inicializarUsuario: () => Promise<void>
  actualizarPerfilCompleto: () => Promise<void>
  estaAutenticado: boolean
  estaEnServicio: boolean
  codigoIcia: String
  verificarServicioUsuario: () => Promise<VerificarServicioResponse>
  usuario: UsuarioType | null
  rolUsuario: RoleType | undefined
  setRolUsuario: ({ idRol }: idRolType) => Promise<void>
  ingresar: ({ usuario, contrasena }: LoginType) => Promise<void>
  progresoLogin: boolean
  permisoUsuario: (routerName: string) => Promise<CasbinTypes>
  permisoAccion: (objeto: string, accion: string) => Promise<boolean>
  abreviaturaUnidad: string | undefined
  otpPendiente: OtpPendienteType | null
  verificarOtp: (codigo: string) => Promise<void>
  cancelarOtp: () => void
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState<UsuarioType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [codigoIcia, setCodigoIcia] = useState<String>('')
  const [otpPendiente, setOtpPendiente] = useState<OtpPendienteType | null>(
    null
  )

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const router = useRouter()

  const { sesionPeticion, borrarCookiesSesion } = useSession()
  const { inicializarCasbin, interpretarPermiso, permisoSobreAccion } =
    useCasbinEnforcer()
  const [enforcer, setEnforcer] = useState<Enforcer>()

  const inicializarUsuario = async () => {
    const token = leerCookie('token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      mostrarFullScreen()
      await obtenerUsuarioRol()
      await obtenerPermisos()

      await delay(1000)
    } catch (error: Error | any) {
      imprimir(`Error durante inicializarUsuario 🚨`, typeof error, error)
      borrarSesionUsuario()

      router.replace('/login')
      throw error
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const actualizarPerfilCompleto = async () => {
    try {
      const respuestaUsuario = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/cuenta/perfil`,
      })

      setUser(respuestaUsuario.datos)
      imprimir('Perfil de usuario actualizado 👤', respuestaUsuario.datos)
    } catch (error) {
      imprimir('Error al actualizar el perfil completo:', error)
      Alerta({
        mensaje: 'Error al actualizar la información del perfil',
        variant: 'error',
      })
    }
  }

  const borrarSesionUsuario = () => {
    setUser(null)
    borrarCookiesSesion()
  }

  const cargarUsuarioManual = async () => {
    try {
      await obtenerUsuarioRol()
      await obtenerPermisos()

      mostrarFullScreen()
      await delay(1000)

      router.replace('/admin/home')
    } catch (error: Error | any) {
      imprimir(`Error durante cargarUsuarioManual 🚨`, error)
      borrarSesionUsuario()

      imprimir(`🚨 -> login`)
      router.replace('/login')
      throw error
    } finally {
      ocultarFullScreen()
    }
  }

  // Común a login directo y a la verificación OTP: guarda el token, carga
  // usuario/permisos y redirige al home.
  const finalizarAutenticacion = async (datos: any) => {
    guardarCookie('token', datos?.access_token)
    imprimir(`Token ✅: ${datos?.access_token}`)

    setUser(datos)
    imprimir(`Usuarios ✅`, datos)

    await obtenerPermisos()
    // await verificarServicioUsuario(respuesta.datos.numeroPase)

    mostrarFullScreen()
    await delay(1000)
    router.replace('/admin/home')
    await delay(1000)
  }

  const login = async ({ usuario, contrasena }: LoginType) => {
    // console.log('...');
    try {
      setLoading(true)

      await delay(1000)
      const respuesta = await Servicios.post({
        url: `${Constantes.authUrl}/auth`,
        body: { usuario, contrasena: encodeBase64(encodeURI(contrasena)) },
        headers: {},
      })

      // Credenciales correctas pero el usuario tiene 2FA habilitado: no hay
      // token todavía, se debe esperar a que verifique el código OTP.
      if (respuesta.datos?.requiereOtp) {
        setOtpPendiente({
          otpSesionId: respuesta.datos.otpSesionId,
          destinoOfuscado: respuesta.datos.destinoOfuscado,
          canal: respuesta.datos.canal,
        })
        return
      }

      await finalizarAutenticacion(respuesta.datos)
    } catch (e) {
      imprimir(`Error al iniciar sesión: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      borrarSesionUsuario()
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const verificarOtp = async (codigo: string) => {
    if (!otpPendiente) return

    try {
      setLoading(true)

      const respuesta = await Servicios.post({
        url: `${Constantes.authUrl}/auth/otp`,
        body: { otpSesionId: otpPendiente.otpSesionId, codigo },
        headers: {},
      })

      // El overlay de carga cubre pantalla completa ANTES de limpiar
      // otpPendiente — si se limpiara primero, el formulario de login
      // se alcanza a renderizar un instante por debajo antes de tapar
      // con el spinner ("vuelve al login y luego recién ingresa").
      mostrarFullScreen()
      setOtpPendiente(null)
      await finalizarAutenticacion(respuesta.datos)
    } catch (e) {
      imprimir(`Error al verificar OTP: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const cancelarOtp = () => {
    setOtpPendiente(null)
  }

  const cambiarRol = async ({ idRol }: idRolType) => {
    try {
      mostrarFullScreen(`Cambiando de rol..`)
      await delay(1000)
      imprimir(`Cambiando rol 👮‍♂️: ${idRol}`)
      await actualizarRol({ idRol })
      await obtenerPermisos()
      router.replace('/admin/home')
    } catch (error) {
      imprimir(`Error al cambiar de rol 🚨`, typeof error, error)
      borrarSesionUsuario()
      router.replace('/login')
    } finally {
      ocultarFullScreen()
    }
  }

  const actualizarRol = async ({ idRol }: idRolType) => {
    const respuestaUsuario = await sesionPeticion({
      method: 'patch',
      url: `${Constantes.authUrl}/cambiarRol`,
      body: {
        idRol,
      },
    })

    guardarCookie('token', respuestaUsuario.datos?.access_token)
    imprimir(`Token ✅: ${respuestaUsuario.datos?.access_token}`)

    await obtenerUsuarioRol()
  }

  const obtenerPermisos = async () => {
    const respuestaPermisos = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/permisos`,
    })

    setEnforcer(await inicializarCasbin(respuestaPermisos.datos))
  }

  const obtenerUsuarioRol = async () => {
    const respuestaUsuario = await sesionPeticion({
      url: `${Constantes.authUrl}/usuarios/cuenta/perfil`,
    })

    if (!respuestaUsuario || !respuestaUsuario.datos) {
      throw new Error('Respuesta del perfil del usuario vacía o incorrecta')
    }

    setUser(respuestaUsuario.datos)
    imprimir(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRol}`
    )
  }

  const rolUsuario = () => user?.roles.find((rol) => rol.idRol == user?.idRol)

  const verificarServicioUsuario =
    async (): Promise<VerificarServicioResponse> => {
      const response = await sesionPeticion<VerificarServicioResponse>({
        url: `${Constantes.baseUrl}/servicio/verificar/${user?.numeroPase}`,
        withCredentials: true,
      })

      setIsVerified(response.enServicio)
      setCodigoIcia(response.codigoServicio || '')

      return response
    }

  return (
    <AuthContext.Provider
      value={{
        cargarUsuarioManual,
        inicializarUsuario,
        estaAutenticado: !!user && !loading,
        actualizarPerfilCompleto,
        usuario: user,
        rolUsuario: rolUsuario(),
        setRolUsuario: cambiarRol,
        ingresar: login,
        progresoLogin: loading,
        otpPendiente,
        verificarOtp,
        cancelarOtp,
        estaEnServicio: isVerified,
        codigoIcia,
        verificarServicioUsuario,
        abreviaturaUnidad: user?.grupo?.distrital?.unidad?.abreviatura,
        permisoUsuario: (routerName: string) =>
          interpretarPermiso({ routerName, enforcer, rol: rolUsuario()?.rol }),
        permisoAccion: (objeto: string, accion: string) =>
          permisoSobreAccion({
            objeto,
            enforcer,
            rol: rolUsuario()?.rol ?? '',
            accion,
          }),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
