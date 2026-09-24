'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenBienes } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import {
  etiquetarMeses,
  formatoBs,
  formatoNumero,
  COLOR_BUCKETS,
  ETIQUETA_BUCKETS,
} from '../../components/formato'

export default function BienesPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenBienes>(
    (f) => LgiEstadisticasService.bienes(f),
  )

  const serieCategorias = useMemo(() => {
    if (!datos?.serie) return null
    return {
      categorias: etiquetarMeses(datos.serie.meses),
      series: datos.serie.porCategoria.map((c) => ({
        name: c.etiqueta,
        data: c.data,
      })),
      colores: datos.serie.porCategoria.map((c) => COLOR_BUCKETS[c.categoria] ?? '#4361ee'),
    }
  }, [datos])

  const buckets = useMemo(() => {
    if (!datos?.porCategoria) return null
    return {
      categorias: datos.porCategoria.map((c) => ETIQUETA_BUCKETS[c.categoria] ?? c.etiqueta),
      valores: datos.porCategoria.map((c) => c.cantidad),
      colores: datos.porCategoria.map((c) => COLOR_BUCKETS[c.categoria] ?? '#4361ee'),
    }
  }, [datos])

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Bienes Secuestrados"
          descripcion="Bienes muebles, inmuebles, dineros y otros secuestrados por la LGI"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Bienes Secuestrados"
        descripcion="Bienes muebles, inmuebles, dineros y otros secuestrados por la LGI"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Ítems" value={datos.kpi.totalItems} icon="storage" color="#4361ee" />
            <StatCard title="Cantidad Total" value={formatoNumero(datos.kpi.cantidadTotal)} icon="category" color="#2196f3" />
            <StatCard title="Costo Total" value={formatoBs(datos.kpi.costoTotal)} icon="receipt" color="#00ab55" />
            <StatCard title="Casos Implicados" value={datos.kpi.casosImplicados} icon="account_circle" color="#805dca" />
            <StatCard title="Operativos Implicados" value={datos.kpi.operativosImplicados} icon="shield" color="#e2a03f" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoDonut
              title="Bienes por Categoría"
              subtitle="Muebles, inmuebles, dineros y otros"
              labels={buckets?.categorias ?? []}
              data={buckets?.valores ?? []}
              colors={buckets?.colores}
              height={300}
            />
            <GraficoBarras
              title="Distribución por Categoría"
              subtitle="Cantidad de bienes según clasificación"
              categories={buckets?.categorias ?? []}
              series={[{ name: 'Cantidad', data: buckets?.valores ?? [] }]}
              height={300}
            />
            <GraficoDonut
              title="Ítems por Categoría"
              subtitle="Número de registros de bienes"
              labels={buckets?.categorias ?? []}
              data={datos.porCategoria.map((c) => c.items)}
              colors={buckets?.colores}
              height={300}
            />
          </div>

          <GraficoBarras
            title="Secuestros Mensuales por Categoría"
            subtitle="Cantidad de bienes secuestrados por mes"
            stacked
            categories={serieCategorias?.categorias ?? []}
            series={serieCategorias?.series ?? []}
            height={330}
          />

          {/* Tablas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TablaDesglose
              title="Resumen por Categoría"
              filename="bienes-por-categoria"
              rows={datos.porCategoria}
              columns={[
                {
                  accessor: 'categoria',
                  title: 'Categoría',
                  render: (c) => ETIQUETA_BUCKETS[c.categoria] ?? c.etiqueta,
                },
                { accessor: 'items', title: 'Ítems' },
                { accessor: 'cantidad', title: 'Cantidad' },
                {
                  accessor: 'costo',
                  title: 'Costo',
                  render: (c) => formatoBs(c.costo),
                },
              ]}
              exportColumns={['categoria', 'items', 'cantidad', 'costo']}
              exportHeaders={['Categoría', 'Ítems', 'Cantidad', 'Costo']}
            />
            <TablaDesglose
              title="Bienes por Catálogo"
              subtitle="Desglose por tipo de bien (9 categorías)"
              filename="bienes-por-catalogo"
              rows={datos.porBienCatalogo}
              columns={[
                { accessor: 'bien', title: 'Bien' },
                { accessor: 'items', title: 'Ítems' },
                { accessor: 'cantidad', title: 'Cantidad' },
                {
                  accessor: 'costo',
                  title: 'Costo',
                  render: (c) => formatoBs(c.costo),
                },
              ]}
              exportColumns={['bien', 'items', 'cantidad', 'costo']}
              exportHeaders={['Bien', 'Ítems', 'Cantidad', 'Costo']}
            />
          </div>
        </>
      )}
    </div>
  )
}