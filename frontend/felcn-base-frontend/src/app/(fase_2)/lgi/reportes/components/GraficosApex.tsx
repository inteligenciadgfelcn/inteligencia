'use client'

import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SerieData {
  name: string
  data: number[]
}

interface PanelProps {
  title: string
  subtitle?: string
  height?: number
  className?: string
}

function PanelBasico({ title, subtitle, className, children }: PanelProps & { children: React.ReactNode }) {
  return (
    <div className={`panel h-full ${className ?? ''}`}>
      <div className="mb-4">
        <h5 className="text-base font-semibold text-dark dark:text-white-light">{title}</h5>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export function GraficoDonut({
  title, subtitle, labels, data, height = 320, colors, className,
}: PanelProps & { labels: string[]; data: number[]; colors?: string[] }) {
  const opciones: any = {
    chart: { type: 'donut', fontFamily: 'Nunito, sans-serif' },
    labels,
    colors,
    legend: { position: 'bottom', fontSize: '12px' },
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    plotOptions: {
      pie: { donut: { size: '72%' } },
    },
    tooltip: { theme: 'light' },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 260 },
          legend: { position: 'bottom' },
        },
      },
    ],
  }

  const total = data.reduce((acc, n) => acc + n, 0)

  return (
    <PanelBasico title={title} subtitle={subtitle} className={className}>
      {total === 0 ? (
        <SinDatos height={height} />
      ) : (
        <ReactApexChart series={data} options={opciones} type="donut" height={height} width="100%" />
      )}
    </PanelBasico>
  )
}

export function GraficoBarras({
  title, subtitle, categories, series, stacked, height = 320, className,
}: PanelProps & { categories: string[]; series: SerieData[]; stacked?: boolean }) {
  const opciones: any = {
    chart: {
      type: 'bar',
      fontFamily: 'Nunito, sans-serif',
      stacked: !!stacked,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories, labels: { rotate: -45 } },
    legend: { position: 'bottom', fontSize: '12px' },
    fill: { opacity: 1 },
    grid: { borderColor: '#e0e6ed' },
    tooltip: { theme: 'light' },
  }

  const hayDatos = series.some((s) => s.data.some((n) => n > 0))

  return (
    <PanelBasico title={title} subtitle={subtitle} className={className}>
      {!hayDatos ? (
        <SinDatos height={height} />
      ) : (
        <ReactApexChart series={series} options={opciones} type="bar" height={height} width="100%" />
      )}
    </PanelBasico>
  )
}

export function GraficoLineas({
  title, subtitle, categories, series, height = 320, className,
}: PanelProps & { categories: string[]; series: SerieData[] }) {
  const opciones: any = {
    chart: {
      type: 'line',
      fontFamily: 'Nunito, sans-serif',
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { rotate: -45 } },
    legend: { position: 'bottom', fontSize: '12px' },
    grid: { borderColor: '#e0e6ed' },
    tooltip: { theme: 'light' },
  }

  const hayDatos = series.some((s) => s.data.some((n) => n > 0))

  return (
    <PanelBasico title={title} subtitle={subtitle} className={className}>
      {!hayDatos ? (
        <SinDatos height={height} />
      ) : (
        <ReactApexChart series={series} options={opciones} type="line" height={height} width="100%" />
      )}
    </PanelBasico>
  )
}

function SinDatos({ height }: { height: number }) {
  return (
    <div
      className="flex items-center justify-center text-sm text-gray-400 dark:text-gray-600"
      style={{ height }}
    >
      Sin datos para el rango seleccionado
    </div>
  )
}