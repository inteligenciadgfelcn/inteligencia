'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { CasbinTypes } from '@/types'
import {
  Box,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { InterpreteMensajes } from '@/utils'
import { formatoFecha } from '@/utils/fechas'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { usePathname } from 'next/navigation'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { CustomDatagrid } from '@/components/datagrid/CustomDataGrid'
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid'
import { Icono } from '@/components/Icono'
import { ErrorDisplay } from '@/components/datagrid/ErrorDisplay'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SolicitudRegistroType } from '../types/solicitudesRegistroTypes'
import { ModalSolicitudDetalle } from './ModalSolicitudDetalle'

const ESTADOS = [
  { value: 'PENDIENTE_APROBACION', label: 'Pendientes' },
  { value: 'APROBADA', label: 'Aprobadas' },
  { value: 'RECHAZADA', label: 'Rechazadas' },
]

export const SolicitudesRegistroDatatable: React.FC = () => {
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()
  const pathname = usePathname()

  const [estado, setEstado] = useState<string>('PENDIENTE_APROBACION')
  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(10)
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudRegistroType | null>(null)
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const obtenerSolicitudes = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/usuarios/solicitudes-registro`,
      params: { pagina, limite, estado },
    })
    return respuesta.datos
  }

  const {
    data: solicitudesData,
    error: errorSolicitudes,
    isLoading: loadingSolicitudes,
    refetch: refetchSolicitudes,
  } = useQuery({
    queryKey: ['solicitudes-registro', pagina, limite, estado],
    queryFn: obtenerSolicitudes,
    placeholderData: keepPreviousData,
  })

  const definirPermisos = useCallback(async () => {
    const permisosObtenidos = await permisoUsuario(pathname)
    setPermisos(permisosObtenidos)
  }, [permisoUsuario, pathname])

  useEffect(() => {
    definirPermisos().catch(imprimir)
  }, [definirPermisos])

  const abrirDetalle = (solicitud: SolicitudRegistroType) => {
    setSolicitudSeleccionada(solicitud)
    setModalOpen(true)
  }

  const columns: GridColDef[] = [
    { field: 'nroDocumento', headerName: 'Nro. Documento', flex: 1, maxWidth: 150 },
    {
      field: 'nombres',
      headerName: 'Nombres',
      flex: 1.3,
      renderCell: (params: GridRenderCellParams<SolicitudRegistroType>) => (
        <Box>
          {`${params.row.nombres} ${params.row.primerApellido ?? ''} ${params.row.segundoApellido ?? ''}`}
        </Box>
      ),
    },
    { field: 'correoElectronico', headerName: 'Correo electrónico', flex: 1.3 },
    {
      field: 'fechaCreacion',
      headerName: 'Fecha de solicitud',
      flex: 1,
      valueFormatter: (value: string) =>
        value ? formatoFecha(value, 'DD/MM/YYYY HH:mm') : '-',
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 0.8,
      renderCell: (params: GridRenderCellParams<SolicitudRegistroType>) => (
        <Chip
          size="small"
          label={
            params.value === 'PENDIENTE_APROBACION'
              ? 'Pendiente'
              : params.value === 'APROBADA'
                ? 'Aprobada'
                : 'Rechazada'
          }
          color={
            params.value === 'PENDIENTE_APROBACION'
              ? 'warning'
              : params.value === 'APROBADA'
                ? 'success'
                : 'error'
          }
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams<SolicitudRegistroType>) => (
        <Stack direction="row" alignItems="center">
          {permisos.read && (
            <IconoTooltip
              id={`detalleSolicitud-${params.row.id}`}
              name="Detalle"
              titulo="Ver detalle"
              color="primary"
              icono="visibility"
              accion={() => abrirDetalle(params.row)}
            />
          )}
        </Stack>
      ),
    },
  ]

  return (
    <>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" component="h2" fontWeight="bold">
          Solicitudes de registro
        </Typography>
        <Button
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          startIcon={<Icono>refresh</Icono>}
          onClick={() => refetchSolicitudes()}
        >
          Actualizar
        </Button>
      </Stack>

      <Tabs
        value={estado}
        onChange={(_, value) => {
          setEstado(value)
          setPagina(1)
        }}
        sx={{ mb: 2 }}
      >
        {ESTADOS.map((e) => (
          <Tab key={e.value} value={e.value} label={e.label} />
        ))}
      </Tabs>

      {errorSolicitudes ? (
        <Box sx={{ mt: 2 }}>
          <ErrorDisplay
            message={InterpreteMensajes(errorSolicitudes)}
            onRetry={() => refetchSolicitudes()}
          />
        </Box>
      ) : (
        <CustomDatagrid
          rows={solicitudesData?.filas || []}
          columns={columns}
          loading={loadingSolicitudes}
          paginationModel={{ page: pagina - 1, pageSize: limite }}
          rowCount={solicitudesData?.total || 0}
          onPaginationModelChange={(model) => {
            setPagina(model.page + 1)
            setLimite(model.pageSize)
          }}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
        />
      )}

      {modalOpen && (
        <ModalSolicitudDetalle
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          solicitud={solicitudSeleccionada}
          onSuccess={() => refetchSolicitudes()}
        />
      )}
    </>
  )
}
