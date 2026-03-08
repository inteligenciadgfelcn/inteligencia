'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GestionOperativoService } from '@/services/operativos'
import type { GestionOperativoCabeceraPayload } from '../../types'

export type SeccionKey =
    | 'seccion-1'
    | 'seccion-2'
    | 'seccion-3'
    | 'seccion-4'
    | 'seccion-5'

export function useGestionOperativoForm(idGestionOperativo?: string) {
    const queryClient = useQueryClient()
    const [seccionActiva, setSeccionActiva] = useState<SeccionKey>('seccion-1')

    const idNumerico = useMemo(() => Number(idGestionOperativo ?? 0), [idGestionOperativo])
    const esEdicion = idNumerico > 0

    const { data: cabecera, isLoading: cargandoCabecera } = useQuery({
        queryKey: ['gestion-operativo-cabecera', idNumerico],
        queryFn: () => GestionOperativoService.obtenerPorId(idNumerico),
        enabled: esEdicion,
    })

    const crearMutation = useMutation({
        mutationFn: (payload: GestionOperativoCabeceraPayload) =>
            GestionOperativoService.crear(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['gestion-operativo-listado'],
            })
        },
    })

    const actualizarMutation = useMutation({
        mutationFn: (payload: GestionOperativoCabeceraPayload) =>
            GestionOperativoService.actualizar(idNumerico, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['gestion-operativo-cabecera', idNumerico],
            })
            await queryClient.invalidateQueries({
                queryKey: ['gestion-operativo-listado'],
            })
        },
    })

    const guardarCabecera = async (payload: GestionOperativoCabeceraPayload) => {
        if (esEdicion) {
            return actualizarMutation.mutateAsync(payload)
        }
        return crearMutation.mutateAsync(payload)
    }

    return {
        idGestionOperativo: idNumerico,
        esEdicion,
        seccionActiva,
        setSeccionActiva,
        cabecera: cabecera?.datos ?? null,
        cargandoCabecera,
        guardarCabecera,
        guardandoCabecera:
            crearMutation.isPending || actualizarMutation.isPending,
    }
}
