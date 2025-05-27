import { AgChartOptions, AgLineSeriesOptions } from 'ag-charts-community'

const THEME = 'ag-material-dark'

export const getInitialGraphData = () => {
  // Get five min/full day in milliseconds
  const fiveMin = 60 * 5 * 1000
  const fullDay = 60 * 60 * 24 * 1000

  const numFiveMin = fullDay / fiveMin

  const now = new Date();
  
  const startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()

  const candleSticks = []

  for (let i=0; i<=numFiveMin; i++) {
    const candleStick = { 
      timestamp: new Date(startTime + (i * fiveMin)).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      price: null
    }
    candleSticks.push(candleStick)
  }

  return {
    data: candleSticks,
    series: [{ 
      type: 'line', 
      xKey: 'timestamp', 
      yKey: 'price'
    }] as AgLineSeriesOptions[],
    theme: THEME
  } as AgChartOptions
}