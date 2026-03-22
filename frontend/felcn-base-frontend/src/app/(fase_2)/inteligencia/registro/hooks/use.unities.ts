import { useQuery } from '@tanstack/react-query'
import { getUnities, Unidad } from '../services/unities.service'

export function useUnities() {
  return useQuery<Unidad[], Error>({
    queryKey: ['unities'],
    queryFn: () => getUnities(),
  })
}
