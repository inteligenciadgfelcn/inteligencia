import { QueryClient } from '@tanstack/react-query'
import { SiiiLookupsService } from '@/services/parametricas'

/**
 * Sirve `fetchFn` desde la caché compartida de React Query
 * (clave `['parametricas', ...key]`, `staleTime: Infinity`).
 * Usado por `useParametricas` y por el prefetch al entrar a /operativos.
 */
export function obtenerCatalogoConCache<T>(
  queryClient: QueryClient,
  key: unknown[],
  fetchFn: () => Promise<{ finalizado: boolean; datos: T }>
): Promise<T> {
  return queryClient.ensureQueryData<T>({
    queryKey: ['parametricas', ...key],
    queryFn: async () => {
      const res = await fetchFn()
      if (!res.finalizado) {
        throw new Error(`No se pudo cargar el catálogo: ${key.join('/')}`)
      }
      return res.datos
    },
    staleTime: Infinity,
  })
}

/**
 * Catálogos fijos (sin parámetros), más usados/pesados en el módulo de
 * operativos. Se precargan en paralelo al entrar a /operativos/ para que
 * cualquier operativo que se abra después los sirva desde caché.
 */
export function catalogosPrioritariosOperativos(): Array<{
  key: unknown[]
  fetchFn: () => Promise<{ finalizado: boolean; datos: unknown }>
}> {
  return [
    { key: ['departamentos'], fetchFn: () => SiiiLookupsService.obtenerDepartamentos() },
    { key: ['unidades'], fetchFn: () => SiiiLookupsService.obtenerUnidades() },
    { key: ['tipos-operacion'], fetchFn: () => SiiiLookupsService.obtenerTiposOperacion() },
    { key: ['categorias-operativo'], fetchFn: () => SiiiLookupsService.obtenerCategoriasOperativo() },
    { key: ['tipos-denuncia'], fetchFn: () => SiiiLookupsService.obtenerTiposDenuncia() },
    { key: ['tipos-penal'], fetchFn: () => SiiiLookupsService.obtenerTiposPenal() },
    { key: ['tipos-relevancia'], fetchFn: () => SiiiLookupsService.obtenerTiposRelevancia() },
    { key: ['planes-operaciones'], fetchFn: () => SiiiLookupsService.obtenerPlanesOperaciones() },
    { key: ['paises'], fetchFn: () => SiiiLookupsService.obtenerPaises() },
    { key: ['tipos-droga'], fetchFn: () => SiiiLookupsService.obtenerTiposDroga() },
    { key: ['formas-transporte'], fetchFn: () => SiiiLookupsService.obtenerFormasTransporte() },
    { key: ['bienes'], fetchFn: () => SiiiLookupsService.obtenerBienes() },
    { key: ['tipos-persona'], fetchFn: () => SiiiLookupsService.obtenerTiposPersona() },
    { key: ['tipos-documento'], fetchFn: () => SiiiLookupsService.obtenerTiposDocumento() },
    { key: ['estados-civiles'], fetchFn: () => SiiiLookupsService.obtenerEstadosCiviles() },
  ]
}
