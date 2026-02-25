import React from 'react'
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { ToggleOrden } from '@/components/datatable/utils'
import { Icono } from '../Icono'

interface TableHeaderProps {
  columnas: Array<CriterioOrdenType>
  cambioOrdenCriterios?: (nuevosCriterios: Array<CriterioOrdenType>) => void
  seleccionable?: boolean
  todoSeleccionado: boolean
  cambiarTodoSeleccionado: (event: React.ChangeEvent<HTMLInputElement>) => void
  cargando: boolean
  indicesSeleccionados: boolean[]
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columnas,
  cambioOrdenCriterios,
  seleccionable,
  todoSeleccionado,
  cambiarTodoSeleccionado,
  cargando,
  indicesSeleccionados,
}) => {
  return (
    <TableHead>
      <TableRow>
        {seleccionable && (
          <TableCell key={`cabecera-id-seleccionar`} sx={{ p: 1.2 }}>
            <Checkbox
              checked={todoSeleccionado}
              disabled={cargando}
              onChange={cambiarTodoSeleccionado}
              indeterminate={
                indicesSeleccionados.filter((value) => value).length !==
                  indicesSeleccionados.length &&
                indicesSeleccionados.filter((value) => value).length > 0
              }
            />
          </TableCell>
        )}
        {columnas.map((columna, index) => (
          <TableCell
            key={`cabecera-id-${index}`}
            sx={{ p: 1.2, pl: { md: 2, xl: 2 } }}
          >
            {columna.ordenar ? (
              <Button
                disabled={cargando}
                style={{
                  justifyContent: 'flex-start',
                  minWidth: '0',
                  padding: '0 1',
                }}
                onClick={() => {
                  if (cambioOrdenCriterios) {
                    const nuevosCriterios = columnas.map((value, indice) => ({
                      ...value,
                      orden:
                        index === indice ? ToggleOrden(value.orden) : undefined,
                    }))
                    cambioOrdenCriterios(nuevosCriterios)
                  }
                }}
              >
                <Typography
                  variant={'caption'}
                  color="text.primary"
                  fontWeight={'600'}
                  align={'left'}
                  noWrap
                >
                  {columna.nombre}
                </Typography>
                {columna.orden && (
                  <>
                    <Box width={'10px'} />
                    <Icono fontSize={'inherit'} color={'secondary'}>
                      {columna.orden === 'asc' ? 'north' : 'south'}
                    </Icono>
                  </>
                )}
              </Button>
            ) : (
              <Typography
                variant={'caption'}
                color="text.primary"
                fontWeight={'600'}
                align={'left'}
                noWrap
                sx={{ pl: { md: 2, xl: 2 } }}
              >
                {columna.nombre}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

TableHeader.displayName = 'TableHeader'

export default React.memo(TableHeader)
