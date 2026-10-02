'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState } from 'react'
import packageJson from '../../package.json'

/** Un día: los catálogos paramétricos cambian con muy poca frecuencia. */
const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24

// Mismo tag real de la imagen desplegada que usa el footer (ver Footer.tsx),
// con el mismo fallback a package.json para build local sin pasar por el
// registry. Se usa como `buster`: cuando cambia entre un deploy y el
// siguiente, PersistQueryClientProvider descarta solo el caché viejo de
// localStorage sin que nadie tenga que limpiarlo a mano (hallazgo real,
// 2026-10: un catálogo paramétrico cambiado en la base no se veía reflejado
// ni con hard refresh, porque sigue persistido hasta por 24h).
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // En SSR (window indefinido) no hay localStorage: se sirve sin persistencia.
  if (typeof window === 'undefined') {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: createSyncStoragePersister({
          storage: window.localStorage,
          key: 'felcn-react-query-cache',
        }),
        maxAge: PERSIST_MAX_AGE,
        buster: APP_VERSION,
        // Solo se persisten los catálogos paramétricos (fijos, comunes a
        // cualquier operativo); los datos propios del operativo en edición
        // se descartan al cerrar la pestaña.
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] === 'parametricas',
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}

export default ReactQueryProvider
