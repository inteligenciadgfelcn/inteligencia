import React from 'react'
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridSortModel,
} from '@mui/x-data-grid'
import {
  Box,
  Card,
  CardContent,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'

interface CustomDatagridProps {
  rows: GridRowsProp
  columns: GridColDef[]
  loading: boolean
  paginationModel: {
    page: number
    pageSize: number
  }
  rowCount: number
  onPaginationModelChange: (model: any) => void
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
  sx?: SxProps<Theme>
  mobileSx?: SxProps<Theme>
}

export const CustomDatagrid: React.FC<CustomDatagridProps> = ({
  rows,
  columns,
  loading,
  paginationModel,
  rowCount,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  sx,
  mobileSx,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Estilos base para el DataGrid
  const baseStyles: SxProps<Theme> = {
    backgroundColor: 'background.paper',
    borderRadius: 3,
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: 'background.paper',
    },
    '& .MuiDataGrid-cell': {
      pl: 2,
      pr: 2,
    },
    '& .MuiDataGrid-columnHeaders': {
      pl: 1,
    },
    [`& .${gridClasses.columnSeparator}`]: {
      [`&:not(.${gridClasses['columnSeparator--resizable']})`]: {
        display: 'none',
      },
    },
  }

  // Estilos base para la vista móvil
  const baseMobileStyles: SxProps<Theme> = {
    '& .MuiCard-root': {
      mb: 2,
      borderRadius: 3,
      pb: 0,
    },
    '& .MuiCardContent-root': {
      pb: 0,
      '&:last-child': {
        paddingBottom: 0,
      },
    },
  }

  const MobileView = () => (
    <Box sx={{ ...baseMobileStyles, ...mobileSx }}>
      {rows.map((row, index) => (
        <Card key={index} sx={{ mb: 2, borderRadius: 3, pb: 0 }}>
          <CardContent
            sx={{
              pb: 0,
              '&:last-child': {
                paddingBottom: 0,
              },
            }}
          >
            {columns.map((column) => (
              <Grid container key={column.field} alignItems="center">
                <Grid size={{ xs: 6 }} sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {column.headerName}:
                  </Typography>
                </Grid>
                <Grid
                  size={{ xs: 6 }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    textAlign: 'right',
                  }}
                >
                  {column.renderCell ? (
                    column.renderCell({
                      row,
                      field: column.field,
                      value: row[column.field],
                    } as GridRenderCellParams)
                  ) : (
                    <Typography variant="body2">{row[column.field]}</Typography>
                  )}
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Card>
      ))}
      <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(rowCount / paginationModel.pageSize)}
          page={paginationModel.page + 1}
          onChange={(_, value) =>
            onPaginationModelChange({
              page: value - 1,
              pageSize: paginationModel.pageSize,
            })
          }
          color="primary"
        />
      </Stack>
    </Box>
  )

  const DesktopView = () => (
    <DataGrid
      sx={{ ...baseStyles, ...sx }}
      rows={rows}
      columns={columns}
      loading={loading}
      paginationModel={paginationModel}
      rowCount={rowCount}
      pageSizeOptions={[5, 10, 25]}
      paginationMode="server"
      sortingMode="server"
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      disableColumnMenu
      autoHeight
      disableRowSelectionOnClick
      disableColumnSelector
      disableAutosize
      disableColumnResize
    />
  )

  return (
    <Box sx={{ width: '100%' }}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </Box>
  )
}
