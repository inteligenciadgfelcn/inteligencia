import { useQuery } from '@tanstack/react-query'
import { getGroups, Grupo } from '../services/group.service'

export function useGroups(idDistrital?: number) {
  return useQuery<Grupo[], Error>({
    queryKey: ['grupos', idDistrital],
    enabled: Boolean(idDistrital),
    queryFn: () => getGroups(idDistrital!),
  })
}
