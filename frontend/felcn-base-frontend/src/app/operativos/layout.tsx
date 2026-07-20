'use client'
import { ReactNode, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthProvider'
import { imprimir } from '@/utils/imprimir'
import VristoUIProvider from '@/components/providers/VristoUIProvider'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { Provider } from 'react-redux'
import store from '@/store'
import i18n from '@/i18n'
import { I18nextProvider } from 'react-i18next'
import {
  catalogosPrioritariosOperativos,
  obtenerCatalogoConCache,
} from '@/hooks/parametricasCache'

/**
 * Precarga en paralelo los catálogos fijos más usados/pesados del módulo
 * de operativos al entrar a /operativos/. Quedan en caché de React Query
 * (staleTime: Infinity) y persistidos en localStorage, así que navegar
 * entre operativos no vuelve a pedirlos: solo se traen las listas
 * dependientes (provincias, localidades, etc.) por cada registro.
 */
const usePrecargaCatalogosOperativos = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    catalogosPrioritariosOperativos().forEach(({ key, fetchFn }) => {
      obtenerCatalogoConCache(queryClient, key, fetchFn).catch(imprimir)
    })
  }, [queryClient])
}

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

export default function OperativosLayout({ children }: { children: ReactNode }) {
  useInitializeUser()
  usePrecargaCatalogosOperativos()
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
