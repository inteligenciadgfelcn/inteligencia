'use client'
import { ReactNode, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { imprimir } from '@/utils/imprimir'
import VristoUIProvider from '@/components/providers/VristoUIProvider'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { Provider } from 'react-redux'
import store from '@/store'
import i18n from '@/i18n'
import { I18nextProvider } from 'react-i18next'

const RUTA_COMPLETAR_PERFIL = '/admin/perfil'

const useInitializeUser = () => {
  const { inicializarUsuario, estaAutenticado, progresoLogin } = useAuth()

  const initUser = useCallback(async () => {
    if (progresoLogin || estaAutenticado) return

    try {
      await inicializarUsuario()
    } catch (error) {
      imprimir(error)
    } finally {
      imprimir('Verificación de login finalizada 👨‍💻')
    }
  }, [inicializarUsuario, progresoLogin, estaAutenticado])

  useEffect(() => {
    initUser().catch(imprimir)
  }, [initUser])

  return { estaAutenticado }
}

/**
 * Mientras un usuario con rol USUARIO (el rol por defecto de autorregistro)
 * no complete por única vez su Estructura FELCN (`fechaPerfilCompletado`),
 * se lo mantiene forzosamente en /admin/perfil — no puede usar el resto del
 * sistema hasta completarla (o hasta que un admin la complete por él).
 */
const usePerfilObligatorio = () => {
  const { estaAutenticado, usuario, rolUsuario } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!estaAutenticado || !usuario) return
    const perfilPendiente =
      rolUsuario?.rol === 'USUARIO' && !usuario.fechaPerfilCompletado

    if (perfilPendiente && pathname !== RUTA_COMPLETAR_PERFIL) {
      router.replace(RUTA_COMPLETAR_PERFIL)
    }
  }, [estaAutenticado, usuario, rolUsuario, pathname, router])
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  useInitializeUser()
  usePerfilObligatorio()

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <VristoUIProvider>
          <DefaultLayout>{children}</DefaultLayout>
        </VristoUIProvider>
      </I18nextProvider>
    </Provider>
  )
}
