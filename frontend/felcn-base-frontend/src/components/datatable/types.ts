export interface ServerResult<T> {
  filas: T[]
  total: number
}

export interface ServerParams {
  page: number
  limit: number
  search: string
  sort: string
}

export interface ServerTableHookProps<T> {
  queryKey: string[]
  queryFn: (p: ServerParams) => Promise<ServerResult<T>>
}
