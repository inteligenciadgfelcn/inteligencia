'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenOperativos } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import { etiquetarMeses, formatoNumero, COLORES_GRAFICO } from '../../components/formato'

export default function OperativosPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenOperativos>(
    (f) => LgiEstadisticasService.operativos(f),
  )

  const serieMensual = useMemo(() => {
    if (!datos?.serie) return null
    return {
      categorias: etiquetarMeses(datos.serie.meses),
      series: [
        { name: 'Total Operativos', data: datos.serie.total },
        { name: 'Allanamientos', data: datos.serie.allanamientos },
        { name: 'Trabajos de Campo', data: datos.serie.trabajosDeCampo },
      ],
    }
  }, [datos])

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Operativos"
          descripcion="Actuaciones y operativos registrados por la LGI"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Operativos"
        descripcion="Actuaciones y operativos registrados por la LGI"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard title="Total Operativos" value={datos.kpi.totalOperativos} icon="checklist" color="#4361ee" />
            <StatCard title="Allanamientos (Ejecutados)" value={datos.kpi.allanamientos} icon="shield" color="#805dca" />
            <StatCard title="Solicitudes de Allanamiento" value={datos.kpi.solicitudesAllanamiento} icon="request_page" color="#2196f3" />
            <StatCard title="Trabajos de Campo" value={datos.kpi.trabajosDeCampo} icon="engineering" color="#00ab55" />
            <StatCard title="Prom. Días Otorgados" value={datos.kpi.promedioDiasOtorgados} icon="timeline" color="#e2a03f" />
            <StatCard title="Casos Implicados" value={datos.kpi.casosImplicados} icon="person" color="#e7515a" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoDonut
              title="Operativos por Tipo de Informe"
              subtitle="Distribución por tipo de actuación"
              labels={datos.porTipoInforme.map((t) => t.tipoInforme.trim())}
              data={datos.porTipoInforme.map((t) => t.cantidad)}
              colors={COLORES_GRAFICO}
            />
            <GraficoBarras
              title="Operativos por Etapa Procesal"
              subtitle="Actuaciones según la etapa vigente"
              categories={datos.porEtapa.map((e) => e.descripcion.trim())}
              series={[
                { name: 'Operativos', data: datos.porEtapa.map((e) => e.cantidad) },
              ]}
            />
            <GraficoBarras
              title="Operativos por Estado del Ciclo"
              subtitle="Resultado procesal de las actuaciones"
              stacked
              categories={datos.porEstadoCiclo.map((c) => `${c.estado.trim()} · ${c.etapa.trim()}`)}
              series={[
                {
                  name: 'Operativos',
                  data: datos.porEstadoCiclo.map((c) => c.cantidad),
                },
              ]}
              height={330}
            />
          </div>

          <GraficoBarras
            title="Evolución Mensual de Operativos"
            subtitle="Total, allanamientos y trabajos de campo por mes"
            categories={serieMensual?.categorias ?? []}
            series={serieMensual?.series ?? []}
            height={320}
          />

          {/* Tablas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TablaDesglose
              title="Operativos por Tipo de Informe"
              filename="operativos-por-tipo-informe"
              rows={datos.porTipoInforme}
              columns={[
                { accessor: 'tipoInforme', title: 'Tipo de Informe' },
                { accessor: 'cantidad', title: 'Cantidad' },
              ]}
              exportColumns={['tipoInforme', 'cantidad']}
              exportHeaders={['Tipo de Informe', 'Cantidad']}
            />
            <TablaDesglose
              title="Operativos por Estado del Ciclo"
              filename="operativos-por-estado-ciclo"
              rows={datos.porEstadoCiclo}
              columns={[
                { accessor: 'estado', title: 'Estado' },
                { accessor: 'etapa', title: 'Etapa' },
                { accessor: 'cantidad', title: 'Cantidad' },
              ]}
              exportColumns={['estado', 'etapa', 'cantidad']}
              exportHeaders={['Estado', 'Etapa', 'Cantidad']}
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TablaDesglose
              title="Operativos por Unidad"
              filename="operativos-por-unidad"
              rows={datos.porUnidad}
              columns={[
                { accessor: 'descripcion', title: 'Unidad' },
                { accessor: 'cantidad', title: 'Cantidad' },
              ]}
            />
            <div className="panel h-full">
              <div className="mb-4">
                <h5 className="text-base font-semibold text-dark dark:text-white-light">Resumen General</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Totales del período consultado
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Total operativos</span>
                  <span className="font-bold text-dark dark:text-white">{formatoNumero(datos.kpi.totalOperativos)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Allanamientos ejecutados</span>
                  <span className="font-bold text-dark dark:text-white">{formatoNumero(datos.kpi.allanamientos)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Trabajos de campo</span>
                  <span className="font-bold text-dark dark:text-white">{formatoNumero(datos.kpi.trabajosDeCampo)}</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Unidad más activa</span>
                  <span className="font-bold text-dark dark:text-white">
                    {datos.porUnidad.length > 0 ? datos.porUnidad[0].descripcion : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}