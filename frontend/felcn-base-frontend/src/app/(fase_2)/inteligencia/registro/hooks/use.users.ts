import { useQuery } from '@tanstack/react-query'
import { getUsersByGroup, Usuario } from '../services/users.service'

export function useUsers(idGroup?: number) {
  return useQuery<Usuario[], Error>({
    queryKey: ['users', idGroup],
    enabled: Boolean(idGroup),
    queryFn: () => getUsersByGroup(idGroup!),
  })
}
