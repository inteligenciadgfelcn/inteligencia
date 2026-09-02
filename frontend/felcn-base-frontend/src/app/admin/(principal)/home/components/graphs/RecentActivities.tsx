'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Person, Group, Extension } from '@mui/icons-material'
import { useAuth } from '@/context/AuthProvider'
import { useSession } from '@/hooks/useSession'
import { imprimir } from '@/utils/imprimir'
import {
  ModulosResponse,
  RolesResponse,
  UsuariosResponse,
} from '@/app/admin/(principal)/home/types'
import { Constantes } from '@/config/Constantes'

/* -------------------------------- TYPES ------------------------------- */

type ActivityType = 'usuario' | 'rol' | 'modulo'

interface Activity {
  id: string
  tipo: ActivityType
  accion: string
  entidad: string
  fecha: string
  time?: string
}

/* ------------------------------ COMPONENT ------------------------------ */

export default function RecentActivities() {
  const { usuario, permisoAccion } = useAuth()
  const { sesionPeticion } = useSession()

  const [permissions, setPermissions] = useState({
    usuarios: false,
    roles: false,
    modulos: false,
  })

  /* ----------------------- PERMISOS ----------------------- */

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

  /* ------------------- CONFIG QUERIES ------------------- */

  const queryConfigs = useMemo(() => {
    const configs: any[] = []

    if (permissions.usuarios) {
      configs.push({
        queryKey: ['usuarios'],
        queryFn: () =>
          sesionPeticion<UsuariosResponse>({
            url: `${Constantes.authUrl}/usuarios`,
            method: 'get',
            params: { limite: 10, pagina: 1, orden: '-fechaCreacion' },
          }),
      })
    }

    if (permissions.roles) {
      configs.push({
        queryKey: ['roles', 'todos'],
        queryFn: () =>
          sesionPeticion<RolesResponse>({
            url: `${Constantes.authUrl}/autorizacion/roles/todos`,
            method: 'get',
            params: { limite: 10, pagina: 1, orden: '-fechaCreacion' },
          }),
      })
    }

    if (permissions.modulos) {
      configs.push({
        queryKey: ['modulos'],
        queryFn: () =>
          sesionPeticion<ModulosResponse>({
            url: `${Constantes.authUrl}/autorizacion/modulos`,
            method: 'get',
            params: { limite: 10, pagina: 1, orden: '-fechaCreacion' },
          }),
      })
    }

    return configs
  }, [permissions, sesionPeticion])

  const queries = useQueries({
    queries: queryConfigs,
  }) as any[]

  /* ------------------- CONSTRUIR ACTIVIDADES ------------------- */

  const activities: Activity[] = useMemo(() => {
    if (queries.some((q) => q.isLoading)) return []

    const all = queries.flatMap((query, index) => {
      const filas = (query.data as any)?.datos?.filas || []

      if (!filas.length) return []

      const tipo = ['usuario', 'rol', 'modulo'][index] as ActivityType

      return filas.map((item: any) => ({
        id: `${tipo}-${item.id}`,
        tipo,
        accion: 'creado',
        entidad: item.usuario || item.nombre,
        fecha: item.fechaCreacion,
      }))
    })

    return all
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 10)
      .map((a) => ({
        ...a,
        time: new Date(a.fecha).toLocaleString(),
      }))
  }, [queries])

  const isLoading = queries.some((q) => q.isLoading)
  const error = queries.find((q) => q.error)

  /* ------------------- ICONOS ------------------- */

  const getActivityIcon = (tipo: ActivityType) => {
    switch (tipo) {
      case 'usuario':
        return <Person />
      case 'rol':
        return <Group />
      case 'modulo':
        return <Extension />
      default:
        return <Person />
    }
  }

  /* ------------------- RENDER ------------------- */

  if (error) {
    imprimir('Error fetching recent activities:', error)
    return <Typography>Error al cargar las actividades</Typography>
  }

  return (
    <Card>
      <CardHeader
        title="Actividades Recientes"
        titleTypographyProps={{
          fontSize: 20,
          fontWeight: 'bold',
        }}
      />

      <CardContent>
        {isLoading ? (
          <Typography>Cargando...</Typography>
        ) : activities.length ? (
          <List>
            {activities.map((a) => (
              <ListItem key={a.id}>
                <ListItemIcon>{getActivityIcon(a.tipo)}</ListItemIcon>
                <ListItemText
                  primary={`${a.tipo.toUpperCase()} creado: ${a.entidad}`}
                  secondary={a.time}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No hay actividades recientes</Typography>
        )}
      </CardContent>
    </Card>
  )
}
