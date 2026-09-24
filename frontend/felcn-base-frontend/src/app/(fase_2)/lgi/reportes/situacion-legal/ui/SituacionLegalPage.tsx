'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenSituacionLegal } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import { etiquetarMeses, formatoBs, formatoNumero, COLOR_TIPO_SITUACION } from '../../components/formato'

export default function SituacionLegalPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenSituacionLegal>(
    (f) => LgiEstadisticasService.situacionLegal(f),
  )

  const colores = useMemo(
    () => (datos?.porTipoSituacion ?? []).map((p) => COLOR_TIPO_SITUACION[p.tipoId] ?? '#4361ee'),
    [datos],
  )

  const serieMensual = useMemo(() => {
    if (!datos?.serie) return null
    return {
      categorias: etiquetarMeses(datos.serie.meses),
      series: datos.serie.porTipo.map((t) => ({
        name: t.tipo,
        data: t.cantidad,
      })),
    }
  }, [datos])

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Situación Legal de Bienes"
          descripcion="Secuestrado, incautado, confiscado/decomisado, entrega a DIRCABI y devolución"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Situación Legal de Bienes"
        descripcion="Secuestrado, incautado, confiscado/decomisado, entrega a DIRCABI y devolución"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard title="Total Ítems" value={datos.kpi.totalItems} icon="storage" color="#4361ee" />
            <StatCard title="Cantidad Total" value={formatoNumero(datos.kpi.cantidadTotal)} icon="category" color="#2196f3" />
            <StatCard title="Costo Total" value={formatoBs(datos.kpi.costoTotal)} icon="receipt" color="#00ab55" />
            <StatCard title="Casos Implicados" value={datos.kpi.casosImplicados} icon="account_circle" color="#805dca" />
            <StatCard title="Operativos Implicados" value={datos.kpi.operativosImplicados} icon="shield" color="#e2a03f" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoDonut
              title="Ítems por Situación Legal"
              subtitle="Distribución de los registros de bienes"
              labels={datos.porTipoSituacion.map((p) => p.tipo)}
              data={datos.porTipoSituacion.map((p) => p.items)}
              colors={colores}
            />
            <GraficoBarras
              title="Cantidad por Situación Legal"
              subtitle="Cantidades totales según la situación"
              horizontal
              categories={datos.porTipoSituacion.map((p) => p.tipo)}
              series={[{ name: 'Cantidad', data: datos.porTipoSituacion.map((p) => p.cantidad) }]}
            />
            <GraficoDonut
              title="Costo por Situación Legal"
              subtitle="Valor (Bs.) acumulado por situación"
              labels={datos.porTipoSituacion.map((p) => p.tipo)}
              data={datos.porTipoSituacion.map((p) => p.costo)}
              colors={colores}
            />
          </div>

          <GraficoBarras
            title="Evolución Mensual por Situación Legal"
            subtitle="Cantidad de bienes según su situación por mes"
            stacked
            categories={serieMensual?.categorias ?? []}
            series={serieMensual?.series ?? []}
            height={330}
          />

          {/* Tabla */}
          <TablaDesglose
            title="Situación Legal de los Bienes"
            subtitle="Registros, ítems, cantidades y costos por tipo"
            filename="situacion-legal"
            rows={datos.porTipoSituacion}
            columns={[
              { accessor: 'tipo', title: 'Situación Legal' },
              { accessor: 'registros', title: 'Registros' },
              { accessor: 'items', title: 'Ítems' },
              { accessor: 'cantidad', title: 'Cantidad' },
              { accessor: 'costo', title: 'Costo', render: (p) => formatoBs(p.costo) },
            ]}
            exportColumns={['tipo', 'registros', 'items', 'cantidad', 'costo']}
            exportHeaders={['Situación Legal', 'Registros', 'Ítems', 'Cantidad', 'Costo']}
          />
        </>
      )}
    </div>
  )
}