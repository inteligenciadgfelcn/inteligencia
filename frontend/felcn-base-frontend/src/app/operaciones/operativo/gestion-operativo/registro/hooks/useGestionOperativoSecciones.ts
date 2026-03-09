'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import {
    GestionOperativosDatosGeneralesService,
    GestionOperativoSeccion2Service,
    GestionOperativoSeccion3Service,
    GestionOperativoSeccion4Service,
    GestionOperativoSeccion5Service,
    GestionOperativoSeccion6Service,
    GestionOperativoSeccion7Service,
    GestionOperativoSeccion8Service,
    GestionOperativoSeccion9Service,
    GestionOperativoSeccion10Service,
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

export function useSeccion6(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-6', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion6Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion6Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion7(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-7', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion7Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion7Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion8(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-8', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion8Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion8Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion9(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-9', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion9Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion9Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion10(idGestionOperativo: number) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-10', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion10Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion10Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}
