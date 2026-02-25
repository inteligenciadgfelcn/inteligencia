interface BackdropParams {
  cargando: boolean
  color:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  titulo: string
  size?: number
}

export const BackdropVista = ({
  cargando,
  color,
  titulo,
  size = 40,
}: BackdropParams) => {
  if (!cargando) return null

  const colorClasses = {
    inherit: 'text-gray-500',
    primary: 'text-primary',
    secondary: 'text-secondary', 
    error: 'text-danger',
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center ${colorClasses[color]}`}>
          <svg
            className="animate-spin"
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12" 
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-white mt-2">{titulo}</p>
      </div>
    </div>
  )
}
