import { useQuery } from '@tanstack/react-query'
import { Departamento, getDepartments } from '../services/departments.service'

export function useDepartments() {
  return useQuery<Departamento[], Error>({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  })
}
