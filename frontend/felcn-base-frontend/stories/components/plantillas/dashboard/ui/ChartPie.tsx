import { PieChart } from '@mui/x-charts'
import { useTheme } from '@mui/material'

const ChartPie = () => {
  const theme = useTheme()

  const data = [
    { value: 44, label: 'Ropa y Accesorios' },
    { value: 55, label: 'Alimentos y Bebidas' },
    { value: 13, label: 'Belleza y Cuidado Personal' },
    { value: 43, label: 'Juguetes y Juegos' },
    { value: 22, label: 'Libros y Medios' },
  ]

  return (
    <div style={{ width: '100%', minHeight: '450px' }}>
      <PieChart
        series={[
          {
            data,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 40 },
            innerRadius: 40,
            paddingAngle: 2,
            cornerRadius: 4,
            valueFormatter: (value) => `${value.value}%`,
          },
        ]}
        height={450}
        margin={{ top: 0, right: 40, bottom: 80, left: 40 }}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 10,
            itemMarkWidth: 10,
            itemMarkHeight: 10,
            markGap: 5,
            itemGap: 8,
            labelStyle: {
              fill: theme.palette.mode === 'light' ? '#2A2928' : '#fff',
              fontSize: 12,
            },
          },
        }}
      />
    </div>
  )
}

export default ChartPie
