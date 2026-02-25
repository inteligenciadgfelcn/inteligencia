import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Grid from '@mui/material/Grid2'

import { useAuth } from '@/context/AuthProvider'
import { useSession } from '@/hooks/useSession'
import {
  ModulosResponse,
  RolesResponse,
  UsuariosResponse,
} from '@/app/admin/(principal)/home/types'
import { Constantes } from '@/config/Constantes'
import VristoStatCard from './VristoStatCard'


export default function DashboardSummary() {
  const { usuario, permisoAccion } = useAuth()
  const { sesionPeticion } = useSession()

  const [permissions, setPermissions] = useState({
    usuarios: false,
    roles: false,
    modulos: false,
  })

  /* ---------------- PERMISOS ---------------- */

  useEffect(() => {
    const checkPermissions = async () => {
      const [usuarios, roles, modulos] = await Promise.all([
        permisoAccion('/admin/usuarios', 'read'),
        permisoAccion('/admin/roles', 'read'),
        permisoAccion('/admin/modulos', 'read'),
      ])

      setPermissions({ usuarios, roles, modulos })
    }

    if (usuario) checkPermissions()
  }, [usuario, permisoAccion])

  /* ---------------- DATA ---------------- */

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      sesionPeticion<UsuariosResponse>({
        url: `${Constantes.baseUrl}/usuarios`,
        method: 'get',
        params: { pagina: 1, limite: 10 },
      }),
    enabled: !!usuario && permissions.usuarios,
  })

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () =>
      sesionPeticion<RolesResponse>({
        url: `${Constantes.baseUrl}/autorizacion/roles/todos`,
        method: 'get',
        params: { pagina: 1, limite: 10 },
      }),
    enabled: !!usuario && permissions.roles,
  })

  const { data: modulesData, isLoading: isLoadingModules } = useQuery({
    queryKey: ['modules'],
    queryFn: () =>
      sesionPeticion<ModulosResponse>({
        url: `${Constantes.baseUrl}/autorizacion/modulos`,
        method: 'get',
        params: { pagina: 1, limite: 10 },
      }),
    enabled: !!usuario && permissions.modulos,
  })

  /* ---------------- UI ---------------- */

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {permissions.usuarios && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <VristoStatCard
            title="Total de Usuarios"
            value={isLoadingUsers ? '...' : usersData?.datos.total ?? 'N/A'}
            icon="users"
            color="#4361ee"
          />
        </Grid>
      )}

      {permissions.roles && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <VristoStatCard
            title="Total de Roles"
            value={isLoadingRoles ? '...' : rolesData?.datos?.total ?? 'N/A'}
            icon="verified_user"
            color="#00ab55"
          />
        </Grid>
      )}

      {permissions.modulos && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <VristoStatCard
            title="Total de Módulos"
            value={isLoadingModules ? '...' : modulesData?.datos.total ?? 'N/A'}
            icon="widgets"
            color="#e7515a"
          />
        </Grid>
      )}
    </Grid>
  )
}
