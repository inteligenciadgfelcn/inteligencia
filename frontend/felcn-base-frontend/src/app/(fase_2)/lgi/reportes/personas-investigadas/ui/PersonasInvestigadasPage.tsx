'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenPersonasInvestigadas } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras, GraficoArea } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import { etiquetarMeses, COLORES_GRAFICO } from '../../components/formato'

export default function PersonasInvestigadasPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenPersonasInvestigadas>(
    (f) => LgiEstadisticasService.personasInvestigadas(f),
  )

  const serieMensual = useMemo(() => {
    if (!datos?.serie) return null
    return {
      categorias: etiquetarMeses(datos.serie.meses),
      totales: datos.serie.meses.map((_, i) =>
        datos.serie.porSituacion.reduce((acc, s) => acc + (s.data[i] ?? 0), 0),
      ),
      series: datos.serie.porSituacion.map((s) => ({ name: s.situacion, data: s.data })),
    }
  }, [datos])

  const totalEstado = useMemo(
    () => (datos?.porSituacionLegal ?? []).reduce((acc, s) => acc + s.cantidad, 0) || 1,
    [datos],
  )

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Personas Investigadas LGI"
          descripcion="Distribución por situación jurídica: investigado, imputado, acusado, rechazado, sobreseído, absuelto y condenado"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Personas Investigadas LGI"
        descripcion="Distribución por situación jurídica: investigado, imputado, acusado, rechazado, sobreseído, absuelto y condenado"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Personas" value={datos.kpi.totalPersonas} icon="group" color="#4361ee" />
            <StatCard title="Casos Implicados" value={datos.kpi.casosImplicados} icon="account_circle" color="#2196f3" />
            <StatCard title="Con Situación Jurídica" value={datos.kpi.conSituacionJuridica} icon="check_circle" color="#00ab55" />
            <StatCard title="Sin Situación Jurídica" value={datos.kpi.sinSituacionJuridica} icon="help" color="#e2a03f" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoDonut
              title="Estado Procesal"
              subtitle="Situación jurídica vigente de las personas"
              labels={datos.porSituacionLegal.map((s) => s.descripcion.trim())}
              data={datos.porSituacionLegal.map((s) => s.cantidad)}
              colors={COLORES_GRAFICO}
            />
            <GraficoBarras
              title="Personas por Estado Procesal"
              subtitle="Cantidad por situación jurídica"
              horizontal
              categories={datos.porSituacionLegal.map((s) => s.descripcion.trim())}
              series={[{ name: 'Personas', data: datos.porSituacionLegal.map((s) => s.cantidad) }]}
            />
            <GraficoArea
              title="Situaciones Registradas por Mes"
              subtitle="Total de movimientos de situación jurídica"
              categories={serieMensual?.categorias ?? []}
              series={[{ name: 'Situaciones', data: serieMensual?.totales ?? [] }]}
            />
          </div>

          <GraficoArea
            title="Evolución Mensual por Estado Procesal"
            subtitle="Movimientos registrados por tipo de situación"
            stacked
            categories={serieMensual?.categorias ?? []}
            series={serieMensual?.series ?? []}
            height={330}
          />

          {/* Tabla */}
          <TablaDesglose
            title="Personas por Situación Legal"
            subtitle="Última situación jurídica registrada por persona"
            filename="personas-investigadas"
            rows={datos.porSituacionLegal}
            columns={[
              { accessor: 'descripcion', title: 'Situación Legal' },
              { accessor: 'cantidad', title: 'Personas' },
              {
                accessor: 'cantidad',
                title: '% del Total',
                render: (s) => `${((s.cantidad / totalEstado) * 100).toFixed(1)}%`,
              },
            ]}
            exportColumns={['descripcion', 'cantidad']}
            exportHeaders={['Situación Legal', 'Personas']}
          />
        </>
      )}
    </div>
  )
}