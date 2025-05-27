import { useEffect, useState } from 'react'
import styles from './CoinGraph.module.css'
import { AgCharts } from 'ag-charts-react'
import { AgChartOptions, AgLineSeriesOptions } from 'ag-charts-community'

interface CoinGraphProps {
  coin: Coin
}

interface IData {
  price: number
  timestamp: string
}

const theme = 'ag-material-dark'

const CoinGraph = ({ coin }: CoinGraphProps) => {
  const [options, setOptions] = useState<AgChartOptions>({
    data: [] as IData[],
    series: [{ 
      type: 'line', 
      xKey: 'timestamp', 
      yKey: 'price'
    }] as AgLineSeriesOptions[],
    theme
  })

  const getInitialCandleSticks = () => {
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

    return candleSticks
  }

  const fetchData = async () => {
    const initialCandleSticks = getInitialCandleSticks()

    const symbol = coin.symbol
    const interval = '5m'
    const now = new Date();
    
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime()

    const url = `https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}`

    const res = await fetch(url)
    const json = await res.json()

    const data = json.map((item: Array<any>) => ({ 
      timestamp: new Date(item[0]).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      price: parseFloat(item[4])
    }))

    const candleSticks = initialCandleSticks.map((point, idx) => {
      const price = data[idx]?.price || point.price
      const timestamp = point.timestamp

      return {
        price,
        timestamp
      }
    })

    setOptions({
      data: candleSticks,
      series: [{ type: 'line', xKey: 'timestamp', yKey: 'price'}],
      theme
    })
  }

  useEffect(() => {
    // fetch initial data
    fetchData()

    // fetch data every 5min
    const fetchInterval = window.setInterval(fetchData, 300000)

    return () => window.clearInterval(fetchInterval)
  }, [coin.symbol])

  return (
    <div className={styles.graph}>
      <AgCharts
        options={options}
      />
    </div>
  )
}

export default CoinGraph