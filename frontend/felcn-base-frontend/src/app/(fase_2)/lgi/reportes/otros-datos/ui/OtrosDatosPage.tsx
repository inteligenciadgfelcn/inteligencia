'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenOtrosDatos } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import { formatoNumero, COLORES_GRAFICO } from '../../components/formato'

const TOP_N = 10

export default function OtrosDatosPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenOtrosDatos>(
    (f) => LgiEstadisticasService.otrosDatos(f),
  )

  const top = useMemo(() => {
    if (!datos) return null
    return {
      tipologia: datos.porTipologia.slice(0, TOP_N),
      verboRector: datos.porVerboRector.slice(0, TOP_N),
      etapaCiclo: datos.porEtapaCiclo.slice(0, TOP_N),
    }
  }, [datos])

  const porcentaje = (cantidad: number, base = 1) =>
    `${((cantidad / (base || 1)) * 100).toFixed(1)}%`

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Otros Datos LGI"
          descripcion="Tipologías identificadas, verbos rectores y etapas/ciclo de LGI"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Otros Datos LGI"
        descripcion="Tipologías identificadas, verbos rectores y etapas/ciclo de LGI (texto normalizado por frecuencia)"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Operativos" value={datos.kpi.totalOperativos} icon="checklist" color="#4361ee" />
            <StatCard title="Con Tipología" value={datos.kpi.conTipologia} icon="fingerprint" color="#2196f3" />
            <StatCard title="Con Verbo Rector" value={datos.kpi.conVerboRector} icon="gavel" color="#00ab55" />
            <StatCard title="Con Etapa / Ciclo" value={datos.kpi.conEtapaCiclo} icon="timeline" color="#e2a03f" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoBarras
              title={`Tipologías Identificadas (Top ${TOP_N})`}
              subtitle="Frecuencia de tipologías registradas"
              horizontal
              categories={top?.tipologia.map((t) => t.descripcion) ?? []}
              series={[{ name: 'Ocurrencias', data: top?.tipologia.map((t) => t.cantidad) ?? [] }]}
            />
            <GraficoBarras
              title={`Verbos Rectores (Top ${TOP_N})`}
              subtitle="Frecuencia de verbos rectores registrados"
              horizontal
              categories={top?.verboRector.map((v) => v.descripcion) ?? []}
              series={[{ name: 'Ocurrencias', data: top?.verboRector.map((v) => v.cantidad) ?? [] }]}
            />
            <GraficoDonut
              title="Etapas / Ciclo de LGI"
              subtitle="Distribución de las etapas del ciclo registradas"
              labels={datos.porEtapaCiclo.map((e) => e.descripcion) ?? []}
              data={datos.porEtapaCiclo.map((e) => e.cantidad)}
              colors={COLORES_GRAFICO}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <GraficoBarras
                title="Etapas / Ciclo de LGI por Frecuencia"
                subtitle="Todas las etapas/ciclos registrados en el período"
                horizontal
                categories={datos.porEtapaCiclo.map((e) => e.descripcion)}
                series={[{ name: 'Ocurrencias', data: datos.porEtapaCiclo.map((e) => e.cantidad) }]}
                height={340}
              />
            </div>
            <div className="panel h-full">
              <div className="mb-4">
                <h5 className="text-base font-semibold text-dark dark:text-white-light">Resumen del Período</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Cobertura de campos en los operativos
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Total operativos</span>
                  <span className="font-bold text-dark dark:text-white">{formatoNumero(datos.kpi.totalOperativos)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Con tipología</span>
                  <span className="font-bold text-dark dark:text-white">
                    {porcentaje(datos.kpi.conTipologia, datos.kpi.totalOperativos)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Con verbo rector</span>
                  <span className="font-bold text-dark dark:text-white">
                    {porcentaje(datos.kpi.conVerboRector, datos.kpi.totalOperativos)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Con etapa/ciclo</span>
                  <span className="font-bold text-dark dark:text-white">
                    {porcentaje(datos.kpi.conEtapaCiclo, datos.kpi.totalOperativos)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tablas */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <TablaDesglose
              title="Tipologías Identificadas"
              filename="otros-datos-tipologias"
              rows={datos.porTipologia}
              columns={[
                { accessor: 'descripcion', title: 'Tipología' },
                { accessor: 'cantidad', title: 'Ocurrencias' },
                {
                  accessor: 'cantidad',
                  title: '% Operativos',
                  render: (t) => porcentaje(t.cantidad, datos.kpi.conTipologia),
                },
              ]}
              exportColumns={['descripcion', 'cantidad']}
              exportHeaders={['Tipología', 'Ocurrencias']}
            />
            <TablaDesglose
              title="Verbos Rectores"
              filename="otros-datos-verbos"
              rows={datos.porVerboRector}
              columns={[
                { accessor: 'descripcion', title: 'Verbo Rector' },
                { accessor: 'cantidad', title: 'Ocurrencias' },
                {
                  accessor: 'cantidad',
                  title: '% Operativos',
                  render: (v) => porcentaje(v.cantidad, datos.kpi.conVerboRector),
                },
              ]}
              exportColumns={['descripcion', 'cantidad']}
              exportHeaders={['Verbo Rector', 'Ocurrencias']}
            />
            <TablaDesglose
              title="Etapas / Ciclo de LGI"
              filename="otros-datos-etapas"
              rows={datos.porEtapaCiclo}
              columns={[
                { accessor: 'descripcion', title: 'Etapa / Ciclo' },
                { accessor: 'cantidad', title: 'Ocurrencias' },
                {
                  accessor: 'cantidad',
                  title: '% Operativos',
                  render: (e) => porcentaje(e.cantidad, datos.kpi.conEtapaCiclo),
                },
              ]}
              exportColumns={['descripcion', 'cantidad']}
              exportHeaders={['Etapa / Ciclo', 'Ocurrencias']}
            />
          </div>
        </>
      )}
    </div>
  )
}