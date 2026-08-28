import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes } from '@/utils'
import { MultiSelect } from '@/components/form/FormMultiSelect'
import { Select } from '@/components/ui/Select'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { SolicitudRegistroType } from '../types/solicitudesRegistroTypes'
import { RolType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'

interface Props {
  isOpen: boolean
  onClose: () => void
  solicitud: SolicitudRegistroType | null
  onSuccess: () => void
}

export const AlertaAprobarSolicitud: React.FC<Props> = ({
  isOpen,
  onClose,
  solicitud,
  onSuccess,
}) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<string[]>([])
  const [idUnidad, setIdUnidad] = useState<number | null>(null)
  const [idDistrital, setIdDistrital] = useState<number | null>(null)
  const [idGrupo, setIdGrupo] = useState<number | null>(null)

  const obtenerRoles = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/roles`,
    })
    return respuesta.datos ?? []
  }

  const obtenerUnidades = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/unidades`,
    })
    return respuesta.datos ?? []
  }

  const obtenerDistritales = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/distritales/unidad/${idUnidad}`,
    })
    return respuesta.datos ?? []
  }

  const obtenerGrupos = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/grupos/distrital/${idDistrital}`,
    })
    return respuesta.datos ?? []
  }

  const { data: rolesData = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: obtenerRoles,
    enabled: isOpen,
  })

  const { data: unidades = [] } = useQuery({
    queryKey: ['lookups-unidades'],
    queryFn: obtenerUnidades,
    enabled: isOpen,
  })

  const { data: distritales = [] } = useQuery({
    queryKey: ['lookups-distritales', idUnidad],
    queryFn: obtenerDistritales,
    enabled: isOpen && !!idUnidad,
  })

  const { data: grupos = [] } = useQuery({
    queryKey: ['lookups-grupos', idDistrital],
    queryFn: obtenerGrupos,
    enabled: isOpen && !!idDistrital,
  })

  // Preselecciona el rol USUARIO al abrir, como en la creación manual de usuarios.
  useEffect(() => {
    if (!isOpen) {
      setRoles([])
      setIdUnidad(null)
      setIdDistrital(null)
      setIdGrupo(null)
      return
    }
    const idUsuarioRol = rolesData.find((r: RolType) => r.rol === 'USUARIO')?.id
    if (idUsuarioRol) setRoles([idUsuarioRol])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, rolesData])

  const handleClose = () => {
    if (!loading) onClose()
  }

  const aprobar = async () => {
    if (!solicitud) return
    if (roles.length === 0) {
      Alerta({ mensaje: 'Debe seleccionar al menos un rol.', variant: 'error' })
      return
    }
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/solicitudes-registro/${solicitud.id}/aprobar`,
        method: 'patch',
        body: { roles, idGrupo: idGrupo ?? undefined },
      })
      Alerta({ mensaje: InterpreteMensajes(respuesta), variant: 'success' })
      onSuccess()
      onClose()
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Aprobar solicitud de registro</DialogTitle>
      <DialogContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Se creará la cuenta de{' '}
          <strong>
            {solicitud?.nombres} {solicitud?.primerApellido}
          </strong>{' '}
          con los roles y el grupo que asigne a continuación, y se le enviará
          un correo para activarla.
        </p>

        <div className="space-y-4">
          <MultiSelect
            label="Roles *"
            options={rolesData.map((rol: RolType) => ({
              value: rol.id,
              label: rol.nombre,
            }))}
            value={roles}
            onChange={setRoles}
            placeholder="Seleccione uno o más roles..."
            isDisabled={loading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Unidad</label>
              <Select
                options={unidades.map((u: any) => ({
                  value: u.id,
                  label: u.descripcion,
                }))}
                placeholder="Sin unidad"
                value={idUnidad ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  setIdUnidad(val === '' ? null : Number(val))
                  setIdDistrital(null)
                  setIdGrupo(null)
                }}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Distrital
              </label>
              <Select
                options={distritales.map((d: any) => ({
                  value: d.id,
                  label: d.descripcion,
                }))}
                placeholder={idUnidad ? 'Sin distrital' : 'Seleccione una unidad'}
                value={idDistrital ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  setIdDistrital(val === '' ? null : Number(val))
                  setIdGrupo(null)
                }}
                disabled={loading || !idUnidad}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Grupo</label>
              <Select
                options={grupos.map((g: any) => ({
                  value: g.id,
                  label: g.descripcion,
                }))}
                placeholder={idDistrital ? 'Sin grupo' : 'Seleccione un distrital'}
                value={idGrupo ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  setIdGrupo(val === '' ? null : Number(val))
                }}
                disabled={loading || !idDistrital}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <ProgresoLineal mostrar={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={aprobar} variant="contained" disabled={loading}>
          Aprobar y crear cuenta
        </Button>
      </DialogActions>
    </Dialog>
  )
}
