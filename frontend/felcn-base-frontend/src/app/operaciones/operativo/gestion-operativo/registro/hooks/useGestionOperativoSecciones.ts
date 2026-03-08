'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import {
    GestionOperativosDatosGeneralesService,
    GestionOperativoSeccion2Service,
    GestionOperativoSeccion3Service,
    GestionOperativoSeccion4Service,
    GestionOperativoSeccion5Service,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../types'

export function useSeccion1(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-1', idGestionOperativo],
        queryFn: () => GestionOperativosDatosGeneralesService.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativosDatosGeneralesService.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion2(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-2', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion2Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion2Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion3(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-3', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion3Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion3Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion4(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-4', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion4Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion4Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion5(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-5', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion5Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion5Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}
