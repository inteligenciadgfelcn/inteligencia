'use client'

import { useMemo } from 'react'
import { LgiEstadisticasService, type ResumenPersonasJuridicas } from '@/services/reportes/LgiEstadisticasService'
import { FiltrosEstadisticos } from '../../components/FiltrosEstadisticos'
import { EncabezadoReporte, EstadoError, EstadoInicial } from '../../components/EncabezadoReporte'
import { StatCard } from '../../components/StatCard'
import { GraficoDonut, GraficoBarras, GraficoArea } from '../../components/GraficosApex'
import { TablaDesglose } from '../../components/TablaDesglose'
import { useReporteLgi } from '../../components/useReporteLgi'
import { etiquetarMeses, formatoNumero, COLORES_GRAFICO } from '../../components/formato'

export default function PersonasJuridicasPage() {
  const { datos, cargando, error, consultado, buscar, limpiar } = useReporteLgi<ResumenPersonasJuridicas>(
    (f) => LgiEstadisticasService.personasJuridicas(f),
  )

  const serieMensual = useMemo(() => {
    if (!datos?.serie) return null
    return {
      categorias: etiquetarMeses(datos.serie.meses),
      total: datos.serie.total,
    }
  }, [datos])

  if (!consultado) {
    return (
      <div className="space-y-4">
        <EncabezadoReporte
          titulo="Reporte de Personas Jurídicas"
          descripcion="Empresas por tipo de sociedad, situación jurídica, vínculo y beneficiarios finales"
        />
        <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
        <EstadoInicial />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EncabezadoReporte
        titulo="Reporte de Personas Jurídicas"
        descripcion="Empresas por tipo de sociedad, situación jurídica, vínculo y beneficiarios finales"
      />
      <FiltrosEstadisticos onBuscar={buscar} onLimpiar={limpiar} cargando={cargando} titulo="Filtros del Reporte" />
      {error && <EstadoError mensaje={error} />}

      {datos && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard title="Empresas Investigadas" value={datos.kpi.totalEmpresas} icon="business" color="#4361ee" />
            <StatCard title="Identificadas / Intervenidas" value={datos.kpi.identificadasIntervenidas} icon="fact_check" color="#00ab55" />
            <StatCard title="Casos Implicados" value={datos.kpi.casosImplicados} icon="account_circle" color="#805dca" />
            <StatCard title="Beneficiarios Finales" value={formatoNumero(datos.kpi.totalBeneficiarios)} icon="people" color="#e2a03f" />
            <StatCard title="Tipos de Sociedad" value={datos.porTipoSociedad.length} icon="category" color="#e7515a" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <GraficoDonut
              title="Empresas por Tipo de Sociedad"
              subtitle="Tipo deducido de la razón social"
              labels={datos.porTipoSociedad.map((t) => t.descripcion.trim())}
              data={datos.porTipoSociedad.map((t) => t.cantidad)}
              colors={COLORES_GRAFICO}
            />
            <GraficoDonut
              title="Situación Jurídica de las Empresas"
              subtitle="Última situación jurídica registrada"
              labels={datos.porSituacionJuridica.map((s) => s.descripcion.trim())}
              data={datos.porSituacionJuridica.map((s) => s.cantidad)}
              colors={COLORES_GRAFICO}
            />
            <GraficoBarras
              title="Empresas por Tipo de Vínculo"
              subtitle="Distribución según el vínculo asignado"
              horizontal
              categories={datos.porVinculo.map((v) => v.descripcion.trim())}
              series={[{ name: 'Empresas', data: datos.porVinculo.map((v) => v.cantidad) }]}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <GraficoArea
                title="Registro Mensual de Empresas"
                subtitle="Empresas vinculadas a operativos por mes"
                categories={serieMensual?.categorias ?? []}
                series={[{ name: 'Empresas', data: serieMensual?.total ?? [] }]}
              />
            </div>
            <GraficoBarras
              title="Investigadas vs Intervenidas"
              subtitle="Comparación de ambas métricas"
              categories={['Empresas']}
              series={[
                { name: 'Investigadas', data: [datos.kpi.totalEmpresas] },
                { name: 'Identificadas/Intervenidas', data: [datos.kpi.identificadasIntervenidas] },
              ]}
            />
          </div>

          {/* Tablas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TablaDesglose
              title="Empresas por Tipo de Sociedad"
              filename="personas-juridicas-tipo-sociedad"
              rows={datos.porTipoSociedad}
              columns={[
                { accessor: 'descripcion', title: 'Tipo de Sociedad' },
                { accessor: 'cantidad', title: 'Empresas' },
              ]}
              exportColumns={['descripcion', 'cantidad']}
              exportHeaders={['Tipo de Sociedad', 'Empresas']}
            />
            <TablaDesglose
              title="Empresas por Situación Jurídica"
              filename="personas-juridicas-situacion-juridica"
              rows={datos.porSituacionJuridica}
              columns={[
                { accessor: 'descripcion', title: 'Situación Jurídica' },
                { accessor: 'cantidad', title: 'Empresas' },
              ]}
              exportColumns={['descripcion', 'cantidad']}
              exportHeaders={['Situación Jurídica', 'Empresas']}
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TablaDesglose
              title="Empresas por Tipo de Vínculo"
              filename="personas-juridicas-vinculo"
              rows={datos.porVinculo}
              columns={[
                { accessor: 'descripcion', title: 'Vínculo' },
                { accessor: 'cantidad', title: 'Empresas' },
              ]}
              exportColumns={['descripcion', 'cantidad']}
              exportHeaders={['Vínculo', 'Empresas']}
            />
            <TablaDesglose
              title="Top 10 Empresas por Beneficiarios Finales"
              subtitle="Empresas con mayor cantidad de beneficiarios registrados"
              filename="personas-juridicas-top-beneficiarios"
              rows={datos.topBeneficiarios}
              columns={[
                { accessor: 'empresa', title: 'Empresa' },
                { accessor: 'beneficiarios', title: 'Beneficiarios' },
              ]}
              exportColumns={['empresa', 'beneficiarios']}
              exportHeaders={['Empresa', 'Beneficiarios']}
            />
          </div>
        </>
      )}
    </div>
  )
}