// TableLanding.tsx
import React, { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FiltrosTab } from '../../organismos/datatable/FiltrosTab'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { CustomDatagrid } from '@/components/datagrid/CustomDataGrid'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'
import { ColumnaType } from '@/types'

interface TableLandingProps {
  columnas?: ColumnaType[]
  solicitudesData?: any[]
  titulo?: string
  showAccion?: boolean
  editAccion?: boolean
  deleteAccion?: boolean
  headerBackgroundColor?: string
}

const TableLanding: React.FC<TableLandingProps> = ({
  solicitudesData = [],
  titulo = 'Inventario de libros',
  showAccion = true,
  editAccion = true,
  deleteAccion = true,
  headerBackgroundColor,
}) => {
  // Estados
  const [pestanaActiva, setPestanaActiva] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([])

  // Configuración de columnas para el DataGrid
  const columns: GridColDef[] = [
    {
      field: 'nombre',
      headerName: 'Nombre',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'resumen',
      headerName: 'Resumen',
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'fechaPublicacion',
      headerName: 'Fecha Publicación',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
          }}
        >
          {' '}
          <Typography variant="body2">{params.value}</Typography>{' '}
        </Box>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          {editAccion && (
            <IconoTooltip
              id={'editarLibro'}
              titulo={'Editar libro'}
              color={'success'}
              accion={() => {}}
              icono={'edit'}
              name={'Editar libro'}
            />
          )}
          {showAccion && (
            <IconoTooltip
              id={'verLibro'}
              titulo={'Ver libro'}
              color={'info'}
              accion={() => {}}
              icono={'visibility'}
              name={'Ver libro'}
            />
          )}
          {deleteAccion && (
            <IconoTooltip
              id={'eliminarLibro'}
              titulo={'Eliminar libro'}
              color={'warning'}
              accion={() => {}}
              icono={'delete'}
              name={'Eliminar libro'}
            />
          )}
        </Stack>
      ),
    },
  ]

  // Obtener pestañas únicas de las categorías
  const pestanas = [
    'Todos',
    ...new Set(solicitudesData.map((libro) => libro.categoria)),
  ]

  // Filtrar datos según la pestaña activa
  const filteredData =
    pestanaActiva === 0
      ? solicitudesData
      : solicitudesData.filter(
          (libro) => libro.categoria === pestanas[pestanaActiva]
        )

  // Preparar filas para el DataGrid
  const rows = filteredData.map((item, index) => ({
    id: item.id || index.toString(),
    ...item,
  }))

  // Componente de cabecera con pestañas
  const cabecera = (
    <FiltrosTab
      titulo={titulo}
      labelSelect="Categorias"
      pestanas={pestanas}
      pestanaActiva={pestanaActiva}
      accion={setPestanaActiva}
      acciones={
        <Stack direction="row" spacing={1}>
          <IconoTooltip
            id="buscar"
            titulo="Buscar"
            color="primary"
            accion={() => {}}
            icono="search"
            name="Buscar"
          />
          <IconoTooltip
            id="actualizar"
            titulo="Actualizar lista"
            color="primary"
            accion={() => {}}
            icono="refresh"
            name="Actualizar"
          />
          <IconoTooltip
            id="agregar"
            titulo="Agregar elementos"
            color="primary"
            accion={() => {}}
            icono="add_circle_outline"
            name="Agregar"
          />
        </Stack>
      }
    />
  )

  return (
    <>
      {cabecera}
      <CustomDatagrid
        rows={rows}
        columns={columns}
        loading={false}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rows.length}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: headerBackgroundColor,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            color: 'text.primary',
          },
          '& .MuiDataGrid-cell': {
            pl: 2,
            pr: 2,
          },
          '& .MuiDataGrid-columnHeaders': {
            pl: 1,
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
        mobileSx={{
          '& .MuiCard-root': {
            border: '1px solid',
            borderColor: 'divider',
            mb: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          '& .MuiCardContent-root': {
            p: 2,
            '&:last-child': {
              pb: 2,
            },
          },
          '& .MuiTypography-root': {
            fontSize: '0.875rem',
          },
          '& .MuiGrid-root:first-of-type .MuiTypography-root': {
            color: 'text.primary',
            fontWeight: 600,
          },
        }}
      />
    </>
  )
}

export default TableLanding
