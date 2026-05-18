'use client'
import { ReactNode, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { imprimir } from '@/utils/imprimir'
import VristoUIProvider from '@/components/providers/VristoUIProvider'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { Provider } from 'react-redux'
import store from '@/store'
import i18n from '@/i18n'
import { I18nextProvider } from 'react-i18next'

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

export default function LgiLayout({ children }: { children: ReactNode }) {
  useInitializeUser()

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
