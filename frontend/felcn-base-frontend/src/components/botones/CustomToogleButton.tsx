import { Icono } from '@/components/Icono'

interface BotonFiltroParams {
  id: string
  seleccionado: boolean
  size?: 'small' | 'medium' | 'large'
  icono: string
  cambiar: (mostrar: boolean) => void
}

export const CustomToggleButton = ({
  id,
  seleccionado,
  size = 'small',
  icono,
  cambiar,
}: BotonFiltroParams) => {
  // Tailwind classes mapping
  const baseClasses =
    'inline-flex items-center justify-center rounded transition-colors duration-200 focus:outline-none border border-transparent'
  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
  }

  // Selected state
  const selectedClasses = seleccionado
    ? 'bg-primary/10 text-primary hover:bg-primary/20'
    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'

  return (
    <button
      id={id}
      type="button"
      className={`${baseClasses} ${sizeClasses[size]} ${selectedClasses}`}
      onClick={() => cambiar(!seleccionado)}
      aria-label="search"
      aria-pressed={seleccionado}
    >
      <Icono>{icono}</Icono>
    </button>
  )
}
