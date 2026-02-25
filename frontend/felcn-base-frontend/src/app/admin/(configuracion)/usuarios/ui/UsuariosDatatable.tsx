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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { usePathname, useRouter } from 'next/navigation'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { CustomDatagrid } from '@/components/datagrid/CustomDataGrid'
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid'
import { CustomSwitch } from '@/components/botones/CustomSwitch'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import Grid from '@mui/material/Grid2'
import { Icono } from '@/components/Icono'
import { ErrorDisplay } from '@/components/datagrid/ErrorDisplay'
import { UsuarioCRUDType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'
import { FiltroUsuarios } from '@/app/admin/(configuracion)/usuarios/ui/FiltroUsuarios'

import { AlertaEstadoUsuario } from '@/app/admin/(configuracion)/usuarios/ui/AlertaEstadoUsuario'
import { AlertaRestablecerContrasena } from './AlertaRestablecerContrasena'
import { AlertaReenvioCorreo } from './AlertaReenvioCorreo'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ModalUsuarioDetalle } from './ModalUsuarioDetalle'

export const UsuariosDatatable: React.FC = () => {
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()
  const router = useRouter()

  const [modalUsuarioDetalleOpen, setModalUsuarioDetalleOpen] = useState(false)
  const [alertaEstadoOpen, setAlertaEstadoOpen] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<UsuarioCRUDType | null>(null)
  const [alertaRestablecerContrasenaOpen, setAlertaRestablecerContrasenaOpen] =
    useState(false)
  const [alertaReenvioCorreoOpen, setAlertaReenvioCorreoOpen] = useState(false)

  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [sortModel, setSortModel] = useState<GridSortModel>([])

  const [filtroUsuario, setFiltroUsuario] = useState<string>('')
  const [filtroRoles, setFiltroRoles] = useState<string[]>([])
  const [mostrarFiltroUsuarios, setMostrarFiltroUsuarios] = useState(false)
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pathname = usePathname()

  const obtenerUsuarios = async () => {
    let ordenQuery = ''
    if (sortModel.length > 0) {
      ordenQuery =
        (sortModel[0].sort === 'desc' ? '-' : '') + sortModel[0].field
    }
    const respuesta = await sesionPeticion({
      url: `${Constantes.baseUrl}/usuarios`,
      params: {
        pagina: pagina,
        limite: limite,
        ...(filtroUsuario.length == 0 ? {} : { filtro: filtroUsuario }),
        ...(filtroRoles.length == 0 ? {} : { rol: filtroRoles.join(',') }),
        ...(ordenQuery ? { orden: ordenQuery } : {}),
      },
    })
    return respuesta.datos
  }

  const obtenerRoles = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.baseUrl}/autorizacion/roles`,
    })
    return respuesta.datos
  }

  const {
    data: usuariosData,
    error: errorUsuarios,
    isLoading: loadingUsuarios,
    refetch: refetchUsuarios,
  } = useQuery({
    queryKey: [
      'usuarios',
      pagina,
      limite,
      filtroUsuario,
      filtroRoles,
      sortModel,
    ],
    queryFn: obtenerUsuarios,
    placeholderData: keepPreviousData,
  })

  const { data: rolesData, error: errorRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: obtenerRoles,
  })

  const definirPermisos = useCallback(async () => {
    const permisosObtenidos = await permisoUsuario(pathname)
    setPermisos(permisosObtenidos)
  }, [permisoUsuario, pathname])

  useEffect(() => {
    definirPermisos().catch(imprimir)
  }, [definirPermisos])

  const resetFiltros = () => {
    setFiltroUsuario('')
    setFiltroRoles([])
    setPagina(1)
    setLimite(10)
  }

  const toggleFiltroUsuarios = () => {
    setMostrarFiltroUsuarios((prev) => !prev)
    resetFiltros()
  }

  const abrirModalVerDetallesDeUsuario = (usuario: UsuarioCRUDType) => {
    setUsuarioSeleccionado(usuario)
    setModalUsuarioDetalleOpen(true)
  }

  const navegarANuevoUsuario = () => {
    router.push('/admin/usuarios/nuevo')
  }

  const navegarAEditarUsuario = (usuario: UsuarioCRUDType) => {
    router.push(`/admin/usuarios/editar/${usuario.id}`)
  }

  const abrirAlertaEstado = (usuario: UsuarioCRUDType) => {
    setUsuarioSeleccionado(usuario)
    setAlertaEstadoOpen(true)
  }

  const abrirAlertaRestablecerContrasena = (usuario: UsuarioCRUDType) => {
    setUsuarioSeleccionado(usuario)
    setAlertaRestablecerContrasenaOpen(true)
  }

  const abrirAlertaReenvioCorreo = (usuario: UsuarioCRUDType) => {
    setUsuarioSeleccionado(usuario)
    setAlertaReenvioCorreoOpen(true)
  }

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortModel(newSortModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'nroDocumento',
      headerName: 'Nro. Documento',
      flex: 1,
      maxWidth: 150,
      sortable: true,
      renderCell: (params: GridRenderCellParams<UsuarioCRUDType>) => (
        <Box>{params.row.persona.nroDocumento}</Box>
      ),
    },
    {
      field: 'nombres',
      headerName: 'Nombres',
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<UsuarioCRUDType>) => (
        <Box>
          {`${params.row.persona.nombres} ${params.row.persona.primerApellido} ${params.row.persona.segundoApellido}`}
        </Box>
      ),
    },
    { field: 'usuario', headerName: 'Usuario', flex: 0.7, sortable: true },
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 1,
      minWidth: 70,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams<UsuarioCRUDType>) => (
        <Chip
          size={'small'}
          color={params.row.ciudadaniaDigital ? 'primary' : 'default'}
          label={params.row.ciudadaniaDigital ? 'Ciudadanía' : 'Normal'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 0.8,
      sortable: true,
      renderCell: (params: GridRenderCellParams<UsuarioCRUDType>) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            alignItems: {
              xs: 'flex-end',
              sm: 'center',
            },
            flexWrap: 'wrap',
            height: '100%',
          }}
        >
          {params.row.usuarioRol.map((itemUsuarioRol, index) => (
            <Chip key={index} label={itemUsuarioRol.rol.nombre} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 1,
      minWidth: 70,
      maxWidth: 100,
      sortable: true,
      renderCell: (params: GridRenderCellParams<UsuarioCRUDType>) => (
        <CustomMensajeEstado
          titulo={params.value}
          descripcion={params.value}
          color={
            params.value == 'ACTIVO'
              ? 'success'
              : params.value == 'INACTIVO'
                ? 'error'
                : 'info'
          }
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams<UsuarioCRUDType>) => (
        <Stack direction={'row'} alignItems={'center'}>
          {permisos.read && (
            <IconoTooltip
              id={`detallesUsuario-${params.row.id}`}
              name={'Detalle'}
              titulo={'Ver detalle'}
              color={'primary'}
              icono={'visibility'}
              accion={() => abrirModalVerDetallesDeUsuario(params.row)}
            />
          )}
          {permisos.update && (
            <CustomSwitch
              id={`cambiarEstadoUsuario-${params.row.id}`}
              titulo={params.row.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
              accion={() => abrirAlertaEstado(params.row)}
              name={
                params.row.estado == 'ACTIVO'
                  ? 'Inactivar Usuario'
                  : 'Activar Usuario'
              }
              color={params.row.estado == 'ACTIVO' ? 'success' : 'error'}
              marcado={params.row.estado == 'ACTIVO'}
              desactivado={params.row.estado == 'PENDIENTE'}
            />
          )}
          {(params.row.estado == 'ACTIVO' ||
            params.row.estado == 'INACTIVO') && (
              <IconoTooltip
                id={`restablecerContrasena-${params.row.id}`}
                titulo={
                  params.row.ciudadaniaDigital
                    ? 'No puede restablecer la contraseña'
                    : 'Restablecer contraseña'
                }
                color={'info'}
                accion={() => abrirAlertaRestablecerContrasena(params.row)}
                desactivado={params.row.ciudadaniaDigital}
                icono={'vpn_key'}
                name={'Restablecer contraseña'}
              />
            )}
          {params.row.estado == 'PENDIENTE' && (
            <IconoTooltip
              id={`reenviarCorreoActivacion-${params.row.id}`}
              titulo={'Reenviar correo de activación'}
              color={'info'}
              accion={() => abrirAlertaReenvioCorreo(params.row)}
              desactivado={params.row.ciudadaniaDigital}
              icono={'forward_to_inbox'}
              name={'Reenviar correo de activación'}
            />
          )}
          {permisos.update && (
            <IconoTooltip
              id={`editarUsuario-${params.row.id}`}
              name={'Usuario'}
              titulo={'Editar'}
              color={'primary'}
              icono={'edit'}
              accion={() => navegarAEditarUsuario(params.row)}
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
        alignItems={isMobile ? 'center' : 'center'}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" component="h2" fontWeight={'bold'}>
          Gestión de usuarios
        </Typography>
        <Grid
          container
          alignItems={isMobile ? 'center' : 'center'}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Button
            id={'accionFiltrarUsuarioToggle'}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
            startIcon={
              mostrarFiltroUsuarios ? (
                <Icono>close</Icono>
              ) : (
                <Icono>search</Icono>
              )
            }
            onClick={() => toggleFiltroUsuarios()}
          >
            {mostrarFiltroUsuarios ? 'Cerrar' : 'Buscar'}
          </Button>
          <Button
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
            startIcon={<Icono>refresh</Icono>}
            onClick={() => refetchUsuarios()}
          >
            Actualizar
          </Button>

          {permisos.create && (
            <Button
              id={'agregarUsuario'}
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<Icono color={'inherit'}>add</Icono>}
              onClick={navegarANuevoUsuario}
            >
              Agregar
            </Button>
          )}
        </Grid>
      </Stack>
      {mostrarFiltroUsuarios && (
        <FiltroUsuarios
          rolesDisponibles={rolesData || []}
          filtroRoles={filtroRoles}
          filtroUsuario={filtroUsuario}
          accionCorrecta={(filtros) => {
            setPagina(1)
            setLimite(10)
            setFiltroRoles(filtros.roles)
            setFiltroUsuario(filtros.usuario)
          }}
          accionCerrar={() => {
            setMostrarFiltroUsuarios(false)
            setFiltroRoles([])
            setFiltroUsuario('')
          }}
        />
      )}
      {errorUsuarios || errorRoles ? (
        <Box sx={{ mt: 2 }}>
          <ErrorDisplay
            message={InterpreteMensajes(errorUsuarios ?? errorRoles)}
            onRetry={() => refetchUsuarios()}
          />
        </Box>
      ) : (
        <CustomDatagrid
          rows={usuariosData?.filas || []}
          columns={columns}
          loading={loadingUsuarios}
          paginationModel={{
            page: pagina - 1,
            pageSize: limite,
          }}
          rowCount={usuariosData?.total || 0}
          onPaginationModelChange={(model) => {
            setPagina(model.page + 1)
            setLimite(model.pageSize)
          }}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
        />
      )}
      {modalUsuarioDetalleOpen && (
        <ModalUsuarioDetalle
          isOpen={modalUsuarioDetalleOpen}
          onClose={() => setModalUsuarioDetalleOpen(false)}
          usuario={usuarioSeleccionado}
        />
      )}
      {alertaEstadoOpen && (
        <AlertaEstadoUsuario
          isOpen={alertaEstadoOpen}
          onClose={() => setAlertaEstadoOpen(false)}
          usuario={usuarioSeleccionado}
          onSuccess={() => refetchUsuarios()}
        />
      )}
      {alertaRestablecerContrasenaOpen && (
        <AlertaRestablecerContrasena
          isOpen={alertaRestablecerContrasenaOpen}
          onClose={() => setAlertaRestablecerContrasenaOpen(false)}
          usuario={usuarioSeleccionado}
          onSuccess={() => refetchUsuarios()}
        />
      )}
      {alertaReenvioCorreoOpen && (
        <AlertaReenvioCorreo
          isOpen={alertaReenvioCorreoOpen}
          onClose={() => setAlertaReenvioCorreoOpen(false)}
          usuario={usuarioSeleccionado}
          onSuccess={() => refetchUsuarios()}
        />
      )}
    </>
  )
}
