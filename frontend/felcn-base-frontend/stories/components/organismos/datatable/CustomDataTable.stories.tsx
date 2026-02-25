import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { CustomDatagrid } from '@/components/datagrid/CustomDataGrid'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { Icono } from '@/components/Icono'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'
import { DatatableStoryProps } from './types/datatable'
import { librosData } from './mocks/librosData'
import { FiltroLibro } from './components/FiltroLibro'
import { ErrorDisplay } from '@/components/datagrid/ErrorDisplay'

export default {
  title: 'Organismos/Datatable/CustomDatagrid',
  component: CustomDatagrid,
  parameters: {
    docs: {
      description: {
        component:
          'Componente de tabla de datos que integra paginación, ordenamiento y filtros.',
      },
    },
  },
} as Meta<typeof CustomDatagrid>

const columnas: GridColDef[] = [
  {
    field: 'nombre',
    headerName: 'Nombre',
    flex: 1,
    sortable: true,
  },
  {
    field: 'resumen',
    headerName: 'Resumen',
    flex: 2,
    sortable: true,
  },
  {
    field: 'categoria',
    headerName: 'Categoría',
    flex: 1,
    sortable: true,
  },
  {
    field: 'fechaPublicacion',
    headerName: 'Fecha Publicación',
    flex: 1,
    sortable: true,
  },
  {
    field: 'acciones',
    headerName: 'Acciones',
    flex: 1,
    sortable: false,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <IconoTooltip
          id={'editarLibro'}
          titulo={'Editar libro'}
          color={'success'}
          accion={() => {}}
          icono={'edit'}
          name={'Editar libro'}
        />
        <IconoTooltip
          id={'verLibro'}
          titulo={'Ver libro'}
          color={'info'}
          accion={() => {}}
          icono={'visibility'}
          name={'Ver libro'}
        />
        <IconoTooltip
          id={'eliminarLibro'}
          titulo={'Eliminar libro'}
          color={'warning'}
          accion={() => {}}
          icono={'delete'}
          name={'Eliminar libro'}
        />
      </Stack>
    ),
  },
]

const Template: StoryFn<DatatableStoryProps> = (args) => {
  const [pagina, setPagina] = useState<number>(0)
  const [limite, setLimite] = useState<number>(10)
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">{args.titulo || 'Tabla de Libros'}</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Icono>{mostrarFiltros ? 'close' : 'search'}</Icono>}
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            {mostrarFiltros ? 'Cerrar filtros' : 'Buscar'}
          </Button>
          <Button variant="outlined" startIcon={<Icono>refresh</Icono>}>
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Icono color={'inherit'}>add</Icono>}
            onClick={() => {}}
          >
            Agregar Libro
          </Button>
        </Stack>
      </Stack>

      {mostrarFiltros && (
        <FiltroLibro
          palabraClave=""
          categorias={[]}
          onFiltrosChange={() => {}}
        />
      )}

      {args.error ? (
        <Box sx={{ mt: 2 }}>
          <ErrorDisplay
            message="No se pudieron cargar los datos. Por favor, intente nuevamente."
            onRetry={() => {}}
          />
        </Box>
      ) : (
        <CustomDatagrid
          rows={args.cargando ? [] : librosData}
          columns={columnas}
          loading={args.cargando ?? false}
          paginationModel={{
            page: pagina,
            pageSize: limite,
          }}
          rowCount={librosData.length}
          onPaginationModelChange={(model) => {
            setPagina(model.page)
            setLimite(model.pageSize)
          }}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
        />
      )}
    </Box>
  )
}

export const Basica = Template.bind({})
Basica.args = {
  titulo: 'Tabla de Libros',
  cargando: false,
  error: false,
}

export const Cargando = Template.bind({})
Cargando.args = {
  ...Basica.args,
  cargando: true,
}

export const ConError = Template.bind({})
ConError.args = {
  ...Basica.args,
  error: true,
}
