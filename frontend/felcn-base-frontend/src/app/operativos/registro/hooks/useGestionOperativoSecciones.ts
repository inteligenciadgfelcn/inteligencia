'use client'

import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  DatosGeneralesService,
  DrogasService,
  SustanciasSolidasService,
  SustanciasLiquidasService,
  LaboratorioService,
  PersonasPorIdService,
  BienesService,
  EvidenciaPorIdService,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../types'

export function useSeccion1(idGestionOperativo: number, enabled = true) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-1', idGestionOperativo],
    queryFn: () =>
      DatosGeneralesService.obtenerPorUsuario(
        idGestionOperativo
      ),
    enabled: idGestionOperativo > 0 && enabled,
  })

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      DatosGeneralesService.crearOperativo(
        idGestionOperativo,
        payload
      ),
  })

  return { query, mutation }
}

export function useSeccion2(idGestionOperativo: number, enabled = true) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-2', idGestionOperativo],
    queryFn: () => DrogasService.obtenerPesaje(idGestionOperativo),
    enabled: idGestionOperativo > 0 && enabled,
  })

  const mutation = useMutation({
    mutationFn: (payload: SeccionPayloadBase) =>
      DrogasService.guardarPesaje(idGestionOperativo, payload),
  })

  return { query, mutation }
}

export function useSeccion3(
  idGestionOperativo: number,
  page: number = 1,
  limit: number = 10,
  enabled = true
) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-3', idGestionOperativo, page, limit],
    queryFn: () =>
      SustanciasSolidasService.listar(
        idGestionOperativo,
        page,
        limit
      ),
    enabled: idGestionOperativo > 0 && enabled,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      SustanciasSolidasService.crear(
        idGestionOperativo,
        payload
      ),
    onSuccess: () => {
      query.refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      SustanciasSolidasService.eliminar(idGestionOperativo, id),
    onSuccess: () => {
      query.refetch()
    },
  })

  return { query, mutation, deleteMutation }
}

export function useSeccion4(
  idGestionOperativo: number,
  page: number = 1,
  limit: number = 10,
  enabled = true
) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-4', idGestionOperativo, page, limit],
    queryFn: () =>
      SustanciasLiquidasService.listar(
        idGestionOperativo,
        page,
        limit
      ),
    enabled: idGestionOperativo > 0 && enabled,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      SustanciasLiquidasService.crear(
        idGestionOperativo,
        payload
      ),
    onSuccess: () => {
      query.refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      SustanciasLiquidasService.eliminar(
        idGestionOperativo,
        id
      ),
    onSuccess: () => {
      query.refetch()
    },
  })

  return { query, mutation, deleteMutation }
}

export function useSeccion5(
  idGestionOperativo: number,
  page: number = 1,
  limit: number = 10,
  enabled = true
) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-5', idGestionOperativo, page, limit],
    queryFn: () =>
      LaboratorioService.listar(
        idGestionOperativo,
        page,
        limit
      ),
    enabled: idGestionOperativo > 0 && enabled,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      LaboratorioService.crear(idGestionOperativo, payload),
    onSuccess: () => {
      query.refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      LaboratorioService.eliminar(idGestionOperativo, id),
    onSuccess: () => {
      query.refetch()
    },
  })

  return { query, mutation, deleteMutation }
}

export function useSeccion6(idGestionOperativo: number, enabled = true) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-6', idGestionOperativo],
    queryFn: () => PersonasPorIdService.obtener(idGestionOperativo),
    enabled: idGestionOperativo > 0 && enabled,
  })

  const mutation = useMutation({
    mutationFn: (payload: SeccionPayloadBase) =>
      PersonasPorIdService.guardar(idGestionOperativo, payload),
  })

  return { query, mutation }
}

export function useSeccion7(idGestionOperativo: number, enabled = true) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-7', idGestionOperativo],
    queryFn: () => BienesService.obtenerBienesPorId(idGestionOperativo),
    enabled: idGestionOperativo > 0 && enabled,
  })

  const mutation = useMutation({
    mutationFn: (payload: SeccionPayloadBase) =>
      BienesService.guardarBienesPorId(idGestionOperativo, payload),
  })

  return { query, mutation }
}

export function useSeccion10(idGestionOperativo: number) {
  const query = useQuery({
    queryKey: ['gestion-operativo-seccion-10', idGestionOperativo],
    queryFn: () => EvidenciaPorIdService.obtener(idGestionOperativo),
    enabled: idGestionOperativo > 0,
  })

  const mutation = useMutation({
    mutationFn: (payload: SeccionPayloadBase) =>
      EvidenciaPorIdService.guardar(idGestionOperativo, payload),
  })

  return { query, mutation }
}
