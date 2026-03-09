import { useQuery } from '@tanstack/react-query'
import { Distrital, getDistritales } from '../services/distrital.service'

export function useDistritales(idUnity?: number) {
  return useQuery<Distrital[], Error>({
    queryKey: ['distritales', idUnity],
    enabled: Boolean(idUnity),
    queryFn: () => getDistritales(idUnity!),
  })
}
