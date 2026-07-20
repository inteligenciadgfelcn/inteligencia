'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState } from 'react'

/** Un día: los catálogos paramétricos cambian con muy poca frecuencia. */
const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24

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
