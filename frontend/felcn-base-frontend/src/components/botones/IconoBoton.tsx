import { Button } from '@/components/ui/Button'
import { IconoTooltip } from './IconoTooltip'

interface IconoBotonParams {
  id: string
  variante?: 'icono' | 'boton'
  variant?: 'primary' | 'secondary' | 'outline-primary' // Simplified variant
  texto: string
  icono: string
  descripcion: string
  accion: () => void
}

export const IconoBoton = ({
  id,
  texto,
  icono,
  variante = 'boton',
  variant = 'primary',
  descripcion,
  accion,
}: IconoBotonParams) => {
  return variante == 'boton' ? (
    <Button
      id={id}
      variant={variant as any}
      className="ml-1 mr-1"
      size={'sm'}
      onClick={() => {
        accion()
      }}
    >
      {texto}
    </Button>
  ) : (
    <IconoTooltip
      id={id}
      titulo={descripcion}
      accion={() => {
        accion()
      }}
      icono={icono}
      name={texto}
    />
  )
}
