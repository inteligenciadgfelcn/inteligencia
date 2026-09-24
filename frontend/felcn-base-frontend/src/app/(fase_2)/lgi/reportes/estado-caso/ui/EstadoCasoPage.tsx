'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenEstadoCaso } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras, GraficoLineas } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import { etiquetarMeses, COLORES_GRAFICO } from '../../components/formato'

export default function EstadoCasoPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenEstadoCaso>(
    (f) => LgiEstadisticasService.estadoCaso(f),
  )

  const serieLineas = useMemo(() => {
    if (!datos?.serie) return null
    const { meses, filas } = datos.serie
    return {
      categorias: etiquetarMeses(meses),
      iniciados: filas.map((f) => f.casosIniciados),
      operativos: filas.map((f) => f.operativos),
    }
  }, [datos])

  const serieEtapas = useMemo(() => {
    if (!datos?.serie) return null
    return {
      categorias: etiquetarMeses(datos.serie.meses),
      series: datos.serie.porEtapa.map((e) => ({
        name: e.etapa.trim(),
        data: e.data,
      })),
    }
  }, [datos])

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Estado del Caso"
          descripcion="Indicadores del ciclo procesal de los casos a cargo de la LGI"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Estado del Caso"
        descripcion="Indicadores del ciclo procesal de los casos a cargo de la LGI"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard title="Casos Iniciados" value={datos.kpi.casosIniciados} icon="assignment" color="#4361ee" />
            <StatCard title="Con Informe Conclusivo" value={datos.kpi.conInformeConclusivo} icon="description" color="#2196f3" />
            <StatCard title="Con Sentencia" value={datos.kpi.conSentencia} icon="gavel" color="#805dca" />
            <StatCard title="Rechazados" value={datos.kpi.rechazados} icon="cancel" color="#e7515a" />
            <StatCard title="APD" value={datos.kpi.apd} icon="save" color="#e2a03f" />
            <StatCard title="Tiempo Promedio (días)" value={datos.kpi.tiempoPromedioDias} icon="timeline" color="#00ab55" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoDonut
              title="Casos por Etapa Actual"
              subtitle="Etapa procesal vigente del caso"
              labels={datos.porEtapaActual.map((e) => e.descripcion.trim())}
              data={datos.porEtapaActual.map((e) => e.cantidad)}
              colors={COLORES_GRAFICO}
            />
            <GraficoLineas
              title="Evolución Mensual"
              subtitle="Casos iniciados vs operativos"
              categories={serieLineas?.categorias ?? []}
              series={[
                { name: 'Casos Iniciados', data: serieLineas?.iniciados ?? [] },
                { name: 'Operativos', data: serieLineas?.operativos ?? [] },
              ]}
            />
            <GraficoBarras
              title="Casos por Estado del Ciclo"
              subtitle="Estado procesal alcanzado"
              stacked
              categories={datos.porEstadoCiclo.map((c) => `${c.estado.trim()} · ${c.etapa.trim()}`)}
              series={[
                {
                  name: 'Casos',
                  data: datos.porEstadoCiclo.map((c) => c.cantidad),
                },
              ]}
              height={330}
            />
          </div>

          <GraficoBarras
            title="Operativos por Etapa (Mensual)"
            subtitle="Volumen de actuaciones por etapa procesal"
            stacked
            categories={serieEtapas?.categorias ?? []}
            series={serieEtapas?.series ?? []}
          />

          {/* Tablas */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <TablaDesglose
              title="Casos por Unidad"
              filename="estado-caso-por-unidad"
              rows={datos.porUnidad}
              columns={[
                { accessor: 'descripcion', title: 'Unidad' },
                { accessor: 'cantidad', title: 'Casos' },
              ]}
            />
            <TablaDesglose
              title="Casos por Distrito"
              filename="estado-caso-por-distrito"
              rows={datos.porDistrito}
              columns={[
                { accessor: 'descripcion', title: 'Distrito' },
                { accessor: 'cantidad', title: 'Casos' },
              ]}
            />
            <TablaDesglose
              title="Estados del Ciclo Procesal"
              filename="estado-caso-por-ciclo"
              rows={datos.porEstadoCiclo}
              columns={[
                { accessor: 'estado', title: 'Estado' },
                { accessor: 'etapa', title: 'Etapa' },
                { accessor: 'cantidad', title: 'Casos' },
              ]}
              exportColumns={['estado', 'etapa', 'cantidad']}
              exportHeaders={['Estado', 'Etapa', 'Casos']}
            />
          </div>
        </>
      )}
    </div>
  )
}