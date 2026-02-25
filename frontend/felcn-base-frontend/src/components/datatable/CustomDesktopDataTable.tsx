import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Box,
  Card,
  Checkbox,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { TableSkeletonBody } from './CustomSkeleton'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import TableHeader from './TableHeader'

export interface CustomDataTableType {
  titulo?: string
  descripcion?: string
  tituloPersonalizado?: ReactNode
  cabeceraPersonalizada?: ReactNode
  error?: boolean
  cargando?: boolean
  acciones?: Array<ReactNode>
  cambioOrdenCriterios?: (nuevosCriterios: Array<CriterioOrdenType>) => void
  columnas: Array<CriterioOrdenType>
  filtros?: ReactNode
  contenidoTabla: Array<Array<ReactNode>>
  paginacion?: ReactNode
  seleccionable?: boolean
  seleccionados?: (indices: Array<number>) => void
}

export const CustomDesktopDataTable: React.FC<CustomDataTableType> = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  cambioOrdenCriterios,
  filtros,
  contenidoTabla,
  paginacion,
  seleccionable,
  seleccionados,
}) => {
  const [todoSeleccionado, setTodoSeleccionado] = useState(false)
  const [indicesSeleccionados, setIndicesSeleccionados] = useState<
    Array<boolean>
  >([])

  const cambiarTodoSeleccionado = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoSeleccionado(event.target.checked)
    },
    []
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const index = Number(event.target.name)
      setIndicesSeleccionados((prev) => {
        const newState = [...prev]
        newState[index] = event.target.checked
        return newState
      })
    },
    []
  )

  useEffect(() => {
    if (seleccionados) {
      const indices = indicesSeleccionados.reduce(
        (resultado: Array<number>, value, index) => {
          if (value) {
            resultado.push(index)
          }
          return resultado
        },
        []
      )
      seleccionados(indices)
    }

    const todosSeleccionados =
      indicesSeleccionados.every((value) => value) &&
      indicesSeleccionados.length > 0
    setTodoSeleccionado(todosSeleccionados)
  }, [indicesSeleccionados, seleccionados])

  useEffect(() => {
    setIndicesSeleccionados(
      new Array(contenidoTabla.length).fill(todoSeleccionado)
    )
  }, [todoSeleccionado, contenidoTabla.length])

  useEffect(() => {
    if (!cargando) {
      setIndicesSeleccionados(new Array(contenidoTabla.length).fill(false))
      setTodoSeleccionado(false)
    }
  }, [cargando, contenidoTabla.length])

  const renderHeader = useMemo(() => {
    if (cabeceraPersonalizada) return cabeceraPersonalizada
    return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {titulo ? (
          <Grid>
            <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
              {titulo}
            </Typography>
            {descripcion && (
              <Typography sx={{ pt: 1 }} fontSize={15}>
                {descripcion}
              </Typography>
            )}
          </Grid>
        ) : tituloPersonalizado ? (
          tituloPersonalizado
        ) : (
          <Box />
        )}
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {seleccionable &&
              indicesSeleccionados.filter((value) => value).length > 0 && (
                <Box sx={{ mx: 1 }}>
                  <Typography key={'contador'} variant={'subtitle2'}>
                    {`${indicesSeleccionados.filter((value) => value).length} seleccionados`}
                  </Typography>
                </Box>
              )}
            {acciones.map((accion, index) => (
              <div key={`accion-id-${index}`}>{accion}</div>
            ))}
          </Grid>
        </Box>
      </Grid>
    )
  }, [
    cabeceraPersonalizada,
    titulo,
    descripcion,
    tituloPersonalizado,
    seleccionable,
    indicesSeleccionados,
    acciones,
  ])

  const renderContent = useMemo(() => {
    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columnas.length + (seleccionable ? 1 : 0)}>
              <Typography variant={'body1'} align="center">
                Error obteniendo información
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    }

    if (contenidoTabla.length === 0 && !cargando) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columnas.length + (seleccionable ? 1 : 0)}>
              <Typography variant={'body1'} align="center">
                Sin registros
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    }

    if (cargando) {
      return (
        <TableSkeletonBody
          filas={10}
          columnas={columnas.length + (seleccionable ? 1 : 0)}
        />
      )
    }

    return (
      <TableBody>
        {contenidoTabla.map((contenidoFila, indexContenidoTabla) => (
          <TableRow key={`row-id-${indexContenidoTabla}`} hover={true}>
            {seleccionable && (
              <TableCell key={`row-id-seleccionar-${indexContenidoTabla}`}>
                <Fade in={!cargando} timeout={1000}>
                  <Box>
                    {indicesSeleccionados.length > indexContenidoTabla && (
                      <Checkbox
                        checked={indicesSeleccionados[indexContenidoTabla]}
                        onChange={handleChange}
                        name={`${indexContenidoTabla}`}
                      />
                    )}
                  </Box>
                </Fade>
              </TableCell>
            )}
            {contenidoFila.map((contenido, indexContenidoFila) => (
              <TableCell
                key={`celda-id-${indexContenidoTabla}-${indexContenidoFila}`}
                sx={{ p: '10px', px: { md: 2.5, xl: 2.5 } }}
              >
                <Fade in={!cargando} timeout={1000}>
                  <Box>{contenido}</Box>
                </Fade>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    )
  }, [
    error,
    cargando,
    contenidoTabla,
    columnas.length,
    seleccionable,
    indicesSeleccionados,
    handleChange,
  ])

  return (
    <Box sx={{ pb: 2 }}>
      {renderHeader}
      {filtros && <Box sx={{ py: 2 }}>{filtros}</Box>}
      <Card
        sx={{
          borderRadius: 3,
          pt: 0,
          pb: { sm: 2, md: 2, xl: 2 },
          mb: { sm: 3, md: 3, xl: 3 },
        }}
      >
        <TableContainer>
          <Table>
            <TableHeader
              columnas={columnas}
              cambioOrdenCriterios={cambioOrdenCriterios}
              seleccionable={seleccionable}
              todoSeleccionado={todoSeleccionado}
              cambiarTodoSeleccionado={cambiarTodoSeleccionado}
              cargando={cargando}
              indicesSeleccionados={indicesSeleccionados}
            />
            {renderContent}
          </Table>
        </TableContainer>
        {paginacion}
      </Card>
    </Box>
  )
}
