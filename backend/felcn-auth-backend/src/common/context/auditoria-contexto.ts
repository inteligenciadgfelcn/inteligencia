import { AsyncLocalStorage } from 'async_hooks'

export interface AuditoriaContextoData {
  idOperacion: string
  userId: string
  userName: string
}

// Singleton — propaga el contexto a través de toda la cadena async del request,
// incluyendo transacciones TypeORM independientemente de qué conexión del pool se use.
export const auditoriaContexto = new AsyncLocalStorage<AuditoriaContextoData>()
