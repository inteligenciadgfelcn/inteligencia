'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { AsignacionesIngresoService } from '@/services/seguimiento/AsignacionesIngresoService'
import type { AsignacionIngresoItem } from '@/services/seguimiento/AsignacionesIngresoService'
import { TablaSinRegistrar } from './ui/TablaSinRegistrar'
import { TablaRegistrados } from './ui/TablaRegistrados'
import { BusquedaIngreso } from './ui/BusquedaIngreso'
import type { ValoresBusqueda } from './ui/BusquedaIngreso'

type TabActiva = 'sin-registrar' | 'registrados'

export default function SeguimientoPage() {
  const { usuario } = useAuth()
  const { Alerta } = useAlerts()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const idDistrital = usuario?.grupo?.distrital?.id ?? 0

  // Tab activa
  const [tabActiva, setTabActiva] = useState<TabActiva>('registrados')

  // Estado tab 1 — Sin registrar
  const [rowsSin, setRowsSin] = useState<AsignacionIngresoItem[]>([])
  const [totalSin, setTotalSin] = useState(0)
  const [pageSin, setPageSin] = useState(1)
  const [limitSin, setLimitSin] = useState(10)
  const [cargandoSin, setCargandoSin] = useState(false)

  // Estado tab 2 — Registrados
  const [rowsReg, setRowsReg] = useState<AsignacionIngresoItem[]>([])
  const [totalReg, setTotalReg] = useState(0)
  const [pageReg, setPageReg] = useState(1)
  const [limitReg, setLimitReg] = useState(10)
  const [cargandoReg, setCargandoReg] = useState(false)

  // ─── Tab 1: cargar sin registrar ────────────────────────────────────────────

  const cargarSinRegistrar = useCallback(
    async (pagina = pageSin, limite = limitSin) => {
      if (!idDistrital) return
      setCargandoSin(true)
      try {
        const res = await AsignacionesIngresoService.sinRegistrar({ idDistrital, pagina, limite })
        if (res.finalizado) {
          const filas = Array.isArray(res.datos) ? res.datos : (res.datos as any)?.filas || []
          const total = Array.isArray(res.datos) ? (res.total ?? 0) : (res.datos as any)?.total || 0
          setRowsSin(filas)
          setTotalSin(total)
        }
      } catch {
        Alerta({ mensaje: 'Error al cargar casos sin registrar', variant: 'error' })
      } finally {
        setCargandoSin(false)
      }
    },
    [idDistrital, pageSin, limitSin, Alerta]
  )

  useEffect(() => {
    void cargarSinRegistrar(1, limitSin)
  }, [idDistrital]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageSin = (p: number) => {
    setPageSin(p)
    void cargarSinRegistrar(p, limitSin)
  }

  const handleLimitSin = (l: number) => {
    setLimitSin(l)
    setPageSin(1)
    void cargarSinRegistrar(1, l)
  }

  // ─── Tab 2: buscar registrados ───────────────────────────────────────────────

  const buscarRegistrados = useCallback(
    async (valores: ValoresBusqueda, pagina = 1, limite = limitReg) => {
      if (!idDistrital) return
      setCargandoReg(true)
      try {
        let res
        if (valores.modo === 'nroCaso' && valores.nroCaso) {
          res = await AsignacionesIngresoService.porNumero({ idDistrital, nroCaso: valores.nroCaso, pagina, limite })
        } else if (valores.modo === 'nombreCaso' && valores.nombreCaso) {
          res = await AsignacionesIngresoService.porNombre({ idDistrital, nombreCaso: valores.nombreCaso, pagina, limite })
        } else if (valores.modo === 'fecha' && valores.desde && valores.hasta) {
          res = await AsignacionesIngresoService.porFecha({ idDistrital, desde: valores.desde, hasta: valores.hasta, pagina, limite })
        }

        if (res?.finalizado) {
          const filas = Array.isArray(res.datos) ? res.datos : (res.datos as any)?.filas || []
          const total = Array.isArray(res.datos) ? (res.total ?? 0) : (res.datos as any)?.total || 0
          setRowsReg(filas)
          setTotalReg(total)
          setPageReg(1)
        }
      } catch {
        Alerta({ mensaje: 'Error al buscar casos registrados', variant: 'error' })
      } finally {
        setCargandoReg(false)
      }
    },
    [idDistrital, limitReg, Alerta]
  )

  const [ultimaBusqueda, setUltimaBusqueda] = useState<ValoresBusqueda | null>(null)

  useEffect(() => {
    if (!idDistrital) return
    const d = new Date()
    const hasta = d.toISOString().split('T')[0]
    d.setDate(d.getDate() - 365)
    const desde = d.toISOString().split('T')[0]

    const busquedaInicial: ValoresBusqueda = { modo: 'fecha', desde, hasta }
    setUltimaBusqueda(busquedaInicial)
    void buscarRegistrados(busquedaInicial, 1, limitReg)
  }, [idDistrital, limitReg, buscarRegistrados])

  const handleBuscar = (valores: ValoresBusqueda) => {
    setUltimaBusqueda(valores)
    void buscarRegistrados(valores, 1, limitReg)
  }

  const handlePageReg = (p: number) => {
    setPageReg(p)
    if (ultimaBusqueda) void buscarRegistrados(ultimaBusqueda, p, limitReg)
  }

  const handleLimitReg = (l: number) => {
    setLimitReg(l)
    setPageReg(1)
    if (ultimaBusqueda) void buscarRegistrados(ultimaBusqueda, 1, l)
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const TABS: { key: TabActiva; label: string; icon: string }[] = [
    { key: 'sin-registrar', label: 'Sin Registrar', icon: 'pending_actions' },
    { key: 'registrados', label: 'Registrados', icon: 'task_alt' },
  ]

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="panel flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Registro de Casos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {mounted && usuario?.grupo?.distrital?.descripcion
              ? usuario.grupo.distrital.descripcion
              : 'Distrital'}
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          onClick={() => void cargarSinRegistrar(1, limitSin)}
        >
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Actualizar
        </Button>
      </div>

      {/* Tabs */}
      <div className="panel p-0 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50/50 dark:bg-gray-800/20">
          {TABS.map((tab) => {
            const activa = tabActiva === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTabActiva(tab.key)}
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-all ${activa
                  ? 'border-primary text-primary bg-white dark:bg-gray-900'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <Icono className={`w-5 h-5 ${activa ? 'text-primary' : ''}`}>{tab.icon}</Icono>
                {tab.label}
                {tab.key === 'sin-registrar' && totalSin > 0 && (
                  <span className="badge badge-outline-warning text-xs ml-1">{totalSin}</span>
                )}
              </button>
            )
          })}
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 min-h-[400px]">
          {/* Tab 1 — Sin registrar */}
          {tabActiva === 'sin-registrar' && (
            <TablaSinRegistrar
              rows={rowsSin}
              total={totalSin}
              loading={cargandoSin}
              page={pageSin}
              limit={limitSin}
              onPageChange={handlePageSin}
              onLimitChange={handleLimitSin}
            />
          )}

          {/* Tab 2 — Registrados */}
          {tabActiva === 'registrados' && (
            <div className="space-y-4">
              <div className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-4">
                <BusquedaIngreso onBuscar={handleBuscar} cargando={cargandoReg} />
              </div>
              <TablaRegistrados
                rows={rowsReg}
                total={totalReg}
                loading={cargandoReg}
                page={pageReg}
                limit={limitReg}
                onPageChange={handlePageReg}
                onLimitChange={handleLimitReg}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
