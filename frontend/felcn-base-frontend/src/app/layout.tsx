import '../styles/tailwind.css'
import React, { ReactNode, Suspense } from 'react'
import ThemeRegistry from '@/themes/ThemeRegistry'
import { FullScreenLoadingProvider } from '@/context/FullScreenLoadingProvider'
import AlertProvider from '@/context/AlertProvider'
import DebugBanner from '@/components/utils/DebugBanner'
import { AuthProvider } from '@/context/AuthProvider'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import MatomoTracker from '@/context/MatomoTracker'
import ReactQueryProvider from '@/context/ReactQueryProvider'
import { PublicEnvScript } from 'next-runtime-env'
import AuthBootstrap from './AuthBoostrap'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.css'



export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <ReactQueryProvider>
          <MatomoTracker />
          <ThemeRegistry>
            <MantineProvider>
              <FullScreenLoadingProvider>
                <AlertProvider>
                  <DebugBanner />
                  <AuthProvider>
                    <AuthBootstrap />
                    <Suspense
                      fallback={<FullScreenLoading mensaje={'Cargando...'} />}
                    >
                      {children}
                    </Suspense>
                  </AuthProvider>
                </AlertProvider>
              </FullScreenLoadingProvider>
            </MantineProvider>
          </ThemeRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
