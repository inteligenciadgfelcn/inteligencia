export interface Libro {
  id: string
  nombre: string
  categoria: string
  resumen: string
  fechaPublicacion: string
}

export interface DatatableStoryProps {
  titulo?: string
  mostrarFiltros?: boolean
  paginacion?: boolean
  cargando?: boolean
  seleccionable?: boolean
  error?: boolean
}

export interface FiltrosLibroProps {
  palabraClave: string
  categorias: string[]
  fechaInicial?: Date
  fechaFinal?: Date
  onFiltrosChange: (filtros: FiltrosLibroProps) => void
}
