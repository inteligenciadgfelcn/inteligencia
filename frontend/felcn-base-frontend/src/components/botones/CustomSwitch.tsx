import { ChangeEventHandler, FC } from 'react'
import { Tooltip } from '@mui/material'
import { Switch } from '@/components/ui/Switch'

interface Props {
  titulo: string
  accion: ChangeEventHandler<HTMLInputElement> | undefined
  desactivado?: boolean
  name: string
  id: string
  marcado: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
}

export const CustomSwitch: FC<Props> = ({
  color = 'primary',
  titulo,
  desactivado = false,
  name,
  id,
  accion,
  marcado,
}) => {
  // Map MUI colors to our Switch colors
  const mapColor = (c: string): any => {
    if (c === 'error') return 'danger';
    return c;
  }

  return (
    <Tooltip title={titulo}>
      <div>
        <Switch
          id={id}
          disabled={desactivado}
          name={name}
          checked={marcado}
          onChange={(event) => {
            if (accion) {
              accion(event)
            }
          }}
          color={mapColor(color)}
        />
      </div>
    </Tooltip>
  )
}
