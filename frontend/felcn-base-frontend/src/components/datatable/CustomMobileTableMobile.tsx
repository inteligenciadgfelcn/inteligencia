import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { Box, Card, CardContent, Checkbox, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { ListSkeleton } from '@/components/datatable/CustomSkeleton'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'

export interface CustomDataTableTypeMobile {
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

export const CustomMobileTableMobile: React.FC<CustomDataTableTypeMobile> = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
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
          if (value) resultado.push(index)
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
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          {titulo ? (
            <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
              {titulo}
            </Typography>
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
        {descripcion && (
          <Typography sx={{ pt: 1 }} fontSize={15}>
            {descripcion}
          </Typography>
        )}
      </Box>
    )
  }, [
    cabeceraPersonalizada,
    titulo,
    tituloPersonalizado,
    descripcion,
    seleccionable,
    indicesSeleccionados,
    acciones,
  ])

  const renderContent = useMemo(() => {
    if (error) {
      return (
        <Typography variant={'body1'} align="center">
          Error obteniendo información
        </Typography>
      )
    }

    if (contenidoTabla.length === 0 && !cargando) {
      return (
        <Typography variant={'body1'} align="center">
          Sin registros
        </Typography>
      )
    }

    if (cargando) {
      return <ListSkeleton filas={10} />
    }

    return contenidoTabla.map((contenidoFila, index) => (
      <Card key={`celda-id-${index}`} sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ '&:last-child': { pb: 1 } }}>
          {seleccionable && (
            <Grid
              container
              direction="row"
              paddingBottom={'0px'}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary" variant={'subtitle2'}>
                Seleccionar
              </Typography>
              {indicesSeleccionados.length > index && (
                <Checkbox
                  checked={indicesSeleccionados[index]}
                  onChange={handleChange}
                  name={`${index}`}
                />
              )}
            </Grid>
          )}
          {contenidoFila.map((contenido, indexContenido) => (
            <Grid
              key={`Grid-id-${index}-${indexContenido}`}
              container
              direction="row"
              paddingTop={'5px'}
              paddingBottom={'0px'}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary" variant={'subtitle2'}>
                {columnas[indexContenido].nombre}
              </Typography>
              {contenido}
            </Grid>
          ))}
        </CardContent>
      </Card>
    ))
  }, [
    error,
    cargando,
    contenidoTabla,
    columnas,
    seleccionable,
    indicesSeleccionados,
    handleChange,
  ])

  return (
    <Box sx={{ pb: 2 }}>
      {renderHeader}
      {filtros && <Box sx={{ py: 2 }}>{filtros}</Box>}
      <Box>
        {renderContent}
        {paginacion}
      </Box>
    </Box>
  )
}

CustomMobileTableMobile.displayName = 'CustomMobileTableMobile'
