import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { FC, ReactNode, SyntheticEvent } from 'react'
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import { useMediaQuery, useTheme } from '@mui/material'
interface selectType {
  seleccion: number
}
interface TabFiltrosType {
  titulo: string
  pestanas: Array<string>
  pestanaActiva: number
  acciones?: ReactNode
  labelSelect?: string
  accion: (nuevoValor: number) => void
}
export const FiltrosTab: FC<TabFiltrosType> = ({
  acciones,
  titulo,
  pestanas,
  pestanaActiva,
  labelSelect = 'Opciones:',
  accion,
}) => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const handleTabChange = (event: SyntheticEvent, nuevoValor: number) => {
    accion(nuevoValor)
  }
  const { register } = useForm<selectType>({
    defaultValues: {
      seleccion: pestanaActiva,
    },
    values: {
      seleccion: pestanaActiva,
    },
  })
  const handleSelectChange = (event: SelectChangeEvent) => {
    accion(parseInt(event.target.value))
  }
  return (
    <Box>
      <Grid container direction="row" justifyContent="space-between">
        <Grid
          size={{
            xs: acciones ? 8 : 12,
            md: 6,
          }}
        >
          <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
            {`${titulo}`}
          </Typography>
        </Grid>
        {acciones && (
          <Grid
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            size={{
              xs: 4,
              md: 6,
            }}
          >
            {acciones}
          </Grid>
        )}
      </Grid>
      {xs ? (
        <>
          <InputLabel
            htmlFor={'seleccionTabs'}
            sx={{ fontWeight: '500', mb: 1 }}
          >
            {labelSelect}
          </InputLabel>
          <Select
            {...register('seleccion')}
            id="seleccionTabs"
            fullWidth
            size="small"
            onChange={handleSelectChange}
            defaultValue={'0'}
          >
            {pestanas.map((pestana, index) => (
              <MenuItem key={index} value={index}>
                {pestana}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <Tabs
          sx={{
            pt: 1,
            minWidth: 300,
          }}
          value={pestanaActiva}
          onChange={handleTabChange}
          variant="scrollable"
        >
          {pestanas.map((pestana, indice) => (
            <Tab key={indice} label={pestana} />
          ))}
        </Tabs>
      )}
    </Box>
  )
}
