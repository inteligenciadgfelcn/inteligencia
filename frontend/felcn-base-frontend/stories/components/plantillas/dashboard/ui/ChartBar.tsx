import { BarChart } from '@mui/x-charts'
import { useTheme } from '@mui/material'

const ChartBar = () => {
  const theme = useTheme()

  const data = [300, 40, 35, 50, 49, 60, 70, 91, 125]
  const xLabels = [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]

  return (
    <div style={{ width: '100%', minHeight: '450px' }}>
      <BarChart
        series={[
          {
            data: data,
            label: 'series-1',
            color: theme.palette.primary.main,
            valueFormatter: (value) => `${value}`,
          },
        ]}
        xAxis={[
          {
            data: xLabels,
            scaleType: 'band',
            tickLabelStyle: {
              color: theme.palette.mode === 'light' ? '#2A2928' : '#fff',
              fontSize: 12,
            },
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: {
              color: theme.palette.mode === 'light' ? '#2A2928' : '#fff',
            },
            max: 350,
          },
        ]}
        height={450}
        margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
        tooltip={{ trigger: 'item' }}
      />
    </div>
  )
}

export default ChartBar
