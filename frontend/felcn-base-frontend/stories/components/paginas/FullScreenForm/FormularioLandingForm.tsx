import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'

import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { useAlerts } from '@/hooks'
import FormInputImage from '@/components/form/FormInputImage'
import Tiptap from '@/components/form/TipTap'
import { useState } from 'react'

const FormularioLandingForm = () => {
  const { control } = useForm<any>()
  const theme = useTheme()
  const { Alerta } = useAlerts()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const [unidadPeso, setUnidadPeso] = useState<string>('')
  const [estado, setEstado] = useState<string>('')
  const [tema, setTema] = useState<string>('')

  return (
    <Box sx={{ pt: 2 }}>
      <form
        onSubmit={() => {
          Alerta({
            mensaje: 'Producto registrado con éxito',
            variant: 'success',
          })
        }}
      >
        <Box display={'flex'} alignItems={'center'} width={'100%'}>
          <IconoTooltip
            id={'atras-landingForm'}
            titulo={'Atrás'}
            color={'primary'}
            accion={() => {}}
            icono={'keyboard_backspace'}
            name={'Atrás'}
          />
          <Typography
            variant="h6"
            component={'h4'}
            fontWeight={600}
            textAlign={'center'}
            alignContent={'center'}
          >
            Agregar Producto
          </Typography>
        </Box>
        <Grid container spacing={2} paddingTop={2}>
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Box>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <InputLabel
                  htmlFor={'nombre'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Nombre
                </InputLabel>
                <TextField id="nombre" fullWidth />
                <Box height={15} />

                <InputLabel
                  htmlFor="textfield-descripcion"
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Descripción
                </InputLabel>
                <Tiptap contenido={''} onChange={() => {}} editable={true} />
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <FormInputImage
                  control={control}
                  id="textfield-multimedia"
                  label="Elementos multimedia"
                  multiple
                  name="elementosMultimedia"
                />
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <Typography fontWeight={'600'}>Precio</Typography>
                <Box
                  display={'flex'}
                  flexDirection={xs ? 'column' : 'row'}
                  width={'100%'}
                  justifyContent={'space-between'}
                  flexWrap={'wrap'}
                  marginTop={3}
                >
                  <Box width={xs ? 'auto' : '49%'}>
                    <InputLabel
                      htmlFor={'textfield-precio'}
                      sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                      Precio
                    </InputLabel>
                    <TextField id="textfield-precio" fullWidth type="number" />
                  </Box>
                  <Box width={xs ? 'auto' : '49%'}>
                    <InputLabel
                      htmlFor={'textfield-precio_comparacion'}
                      sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                      Precio de comparación
                    </InputLabel>
                    <TextField
                      id="textfield-precio_comparacion"
                      fullWidth
                      type="number"
                    />
                  </Box>
                </Box>
                <Box height={10} />
                <FormControlLabel
                  id="textfield-impuestos"
                  control={<Checkbox size="small" defaultChecked />}
                  label="Cobrar impuestos sobre la venta de este producto"
                />
                <Box height={10} />
                <Grid container spacing={2}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 4,
                    }}
                  >
                    <InputLabel
                      htmlFor={'textfield-costo-artculo'}
                      sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                      Costo por artículo
                    </InputLabel>
                    <TextField
                      id="textfield-costo-artculo"
                      fullWidth
                      type="number"
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 4,
                    }}
                  >
                    <InputLabel
                      htmlFor={'textfield-ganancia'}
                      sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                      Ganancia
                    </InputLabel>
                    <TextField
                      id="textfield-ganancia"
                      fullWidth
                      type="number"
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 4,
                    }}
                  >
                    <InputLabel
                      htmlFor={'textfield-margen'}
                      sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                      Margen
                    </InputLabel>
                    <TextField id="textfield-margen" fullWidth type="number" />
                  </Grid>
                </Grid>
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <Typography fontWeight={'600'} marginBottom={3}>
                  Inventario
                </Typography>
                <FormControlLabel
                  id="textfield-cantidad"
                  control={<Checkbox size="small" defaultChecked />}
                  label="Rastrear cantidad"
                />
                <Box width={'30%'}>
                  <InputLabel
                    htmlFor={'textfield-cantidadNumber'}
                    sx={{ color: 'text.primary', fontWeight: '500' }}
                  >
                    Cantidad
                  </InputLabel>
                  <TextField
                    id="textfield-cantidadNumber"
                    fullWidth
                    type="number"
                  />
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <Typography fontWeight={'600'} marginBottom={3}>
                  Envíos
                </Typography>
                <FormControlLabel
                  id="textfield-fisico"
                  control={<Checkbox size="small" defaultChecked />}
                  label="Este es un producto físico"
                />
                <Grid container spacing={2}>
                  <Grid
                    size={{
                      xs: 9,
                      sm: 8,
                    }}
                  >
                    <InputLabel
                      htmlFor={'textfield-peso'}
                      sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                      Peso
                    </InputLabel>
                    <TextField id="textfield-peso" fullWidth type="number" />
                  </Grid>
                  <Grid
                    size={{
                      xs: 3,
                      sm: 4,
                    }}
                  >
                    <InputLabel
                      htmlFor="unidad_peso"
                      sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                    >
                      Unidad
                    </InputLabel>
                    <Select
                      id="unidad_peso"
                      value={unidadPeso}
                      onChange={(e) => {
                        setUnidadPeso(e.target.value)
                      }}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value={'1'}>Kg.</MenuItem>
                      <MenuItem value={'2'}>lbs.</MenuItem>
                      <MenuItem value={'3'}>grs.</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <InputLabel
                htmlFor="estado"
                sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
              >
                Unidad
              </InputLabel>
              <Select
                id="estado"
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value)
                }}
                fullWidth
                size="small"
              >
                <MenuItem value={'1'}>Activo</MenuItem>
                <MenuItem value={'2'}>Inactivo</MenuItem>
              </Select>
            </Paper>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <Typography fontWeight={'600'} marginBottom={3}>
                Publicación
              </Typography>

              <FormLabel
                id="publicacion"
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Canales de Venta
              </FormLabel>
              <RadioGroup aria-labelledby="publicacion" name="publicacion">
                <FormControlLabel
                  value="1"
                  control={<Radio size="small" />}
                  label="Tienda online"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio size="small" />}
                  label="Punto de venta"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio size="small" />}
                  label="Franquicias"
                />
                <FormControlLabel
                  value="4"
                  control={<Radio size="small" />}
                  label="Redes Sociales"
                />
              </RadioGroup>
              <Box height={20} />
              <FormLabel
                id="mercados"
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Mercados
              </FormLabel>
              <RadioGroup aria-labelledby="mercados" name="mercados">
                <FormControlLabel
                  value="1"
                  control={<Radio size="small" />}
                  label="Bolivia e Internacional"
                />
              </RadioGroup>
            </Paper>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <Typography fontWeight={'600'} marginBottom={3}>
                Organización de Productos
              </Typography>
              <Box height={'20px'} />
              <InputLabel
                htmlFor={'textfield-categoria'}
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Categoría
              </InputLabel>
              <TextField id="textfield-categoria" fullWidth />
              <Box height={'20px'} />
              <InputLabel
                htmlFor={'textfield-tipo'}
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Tipo de producto
              </InputLabel>
              <TextField id="textfield-tipo" fullWidth />
              <Box height={'20px'} />
              <InputLabel
                htmlFor={'textfield-proveedor'}
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Proveedor
              </InputLabel>
              <TextField id="textfield-proveedor" fullWidth />
              <Box height={'20px'} />
              <InputLabel
                htmlFor={'textfield-colecciones'}
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Colecciones
              </InputLabel>
              <TextField id="textfield-colecciones" fullWidth />
              <Box height={'20px'} />
              <InputLabel
                htmlFor={'textfield-etiquetas'}
                sx={{ color: 'text.primary', fontWeight: '500' }}
              >
                Etiquetas
              </InputLabel>
              <TextField id="textfield-etiquetas" fullWidth />
            </Paper>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <InputLabel
                htmlFor="estado"
                sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
              >
                Unidad
              </InputLabel>
              <Select
                id="temas"
                value={tema}
                onChange={(e) => {
                  setTema(e.target.value)
                }}
                fullWidth
                size="small"
              >
                <MenuItem value={'1'}>Tema social</MenuItem>
                <MenuItem value={'2'}>Tema laboral</MenuItem>
              </Select>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={6}>
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Box
              display={'flex'}
              justifyContent={'end'}
              flexDirection={'row'}
              gap={2}
            >
              <Button type="button" variant="outlined">
                <Typography sx={{ fontWeight: '600' }}>Cancelar</Typography>
              </Button>
              <Button type="submit" variant="contained">
                <Typography sx={{ fontWeight: '600' }}>
                  Registrar producto
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default FormularioLandingForm
