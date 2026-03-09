import { useQuery } from '@tanstack/react-query'
import { getUsersInteligencia, Usuario } from '../services/users.service'

export function useUsersInteligencia() {
  return useQuery<Usuario[], Error>({
    queryKey: ['users_inteligencia'],
    queryFn: () => getUsersInteligencia(),
  })
}
