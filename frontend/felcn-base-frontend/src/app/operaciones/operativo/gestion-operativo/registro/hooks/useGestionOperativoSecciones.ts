'use client'

import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import {
    GestionOperativosDatosGeneralesService,
    GestionOperativoSeccion2Service,
    GestionOperativoSustanciasSolidasService,
    GestionOperativoSustanciasLiquidasService,
    GestionOperativoLaboratorioService,
    GestionOperativoSeccion6Service,
    GestionOperativoSeccion7Service,
    GestionOperativoSeccion8Service,
    GestionOperativoSeccion10Service,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../types'

export function useSeccion1(idGestionOperativo: number, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-1', idGestionOperativo],
        queryFn: () => GestionOperativosDatosGeneralesService.obtenerPorUsuario(idGestionOperativo),
        enabled: idGestionOperativo > 0 && enabled,
    })

    const mutation = useMutation({
        mutationFn: (payload: any) =>
            GestionOperativosDatosGeneralesService.crearOperativo(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion2(idGestionOperativo: number, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-2', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion2Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0 && enabled,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion2Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion3(idGestionOperativo: number, page: number = 1, limit: number = 10, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-3', idGestionOperativo, page, limit],
        queryFn: () => GestionOperativoSustanciasSolidasService.listar(idGestionOperativo, page, limit),
        enabled: idGestionOperativo > 0 && enabled,
        placeholderData: keepPreviousData,
    })

    const mutation = useMutation({
        mutationFn: (payload: any) =>
            GestionOperativoSustanciasSolidasService.crear(idGestionOperativo, payload),
        onSuccess: () => {
            query.refetch()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            GestionOperativoSustanciasSolidasService.eliminar(idGestionOperativo, id),
        onSuccess: () => {
            query.refetch()
        },
    })

    return { query, mutation, deleteMutation }
}

export function useSeccion4(idGestionOperativo: number, page: number = 1, limit: number = 10, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-4', idGestionOperativo, page, limit],
        queryFn: () => GestionOperativoSustanciasLiquidasService.listar(idGestionOperativo, page, limit),
        enabled: idGestionOperativo > 0 && enabled,
        placeholderData: keepPreviousData,
    })

    const mutation = useMutation({
        mutationFn: (payload: any) =>
            GestionOperativoSustanciasLiquidasService.crear(idGestionOperativo, payload),
        onSuccess: () => {
            query.refetch()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            GestionOperativoSustanciasLiquidasService.eliminar(idGestionOperativo, id),
        onSuccess: () => {
            query.refetch()
        },
    })

    return { query, mutation, deleteMutation }
}

export function useSeccion5(idGestionOperativo: number, page: number = 1, limit: number = 10, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-5', idGestionOperativo, page, limit],
        queryFn: () => GestionOperativoLaboratorioService.listar(idGestionOperativo, page, limit),
        enabled: idGestionOperativo > 0 && enabled,
        placeholderData: keepPreviousData,
    })

    const mutation = useMutation({
        mutationFn: (payload: any) =>
            GestionOperativoLaboratorioService.crear(idGestionOperativo, payload),
        onSuccess: () => {
            query.refetch()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            GestionOperativoLaboratorioService.eliminar(idGestionOperativo, id),
        onSuccess: () => {
            query.refetch()
        },
    })

    return { query, mutation, deleteMutation }
}

export function useSeccion6(idGestionOperativo: number, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-6', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion6Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0 && enabled,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion6Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion7(idGestionOperativo: number, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-7', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion7Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0 && enabled,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion7Service.guardar(idGestionOperativo, payload),
    })

    return { query, mutation }
}

export function useSeccion8(idGestionOperativo: number, enabled = true) {
    const query = useQuery({
        queryKey: ['gestion-operativo-seccion-8', idGestionOperativo],
        queryFn: () => GestionOperativoSeccion8Service.obtener(idGestionOperativo),
        enabled: idGestionOperativo > 0 && enabled,
    })

    const mutation = useMutation({
        mutationFn: (payload: SeccionPayloadBase) =>
            GestionOperativoSeccion8Service.guardar(idGestionOperativo, payload),
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
