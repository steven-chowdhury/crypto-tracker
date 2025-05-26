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

  const fetchData = async () => {
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

    setOptions({
      data: data,
      series: [{ type: 'line', xKey: 'timestamp', yKey: 'price'}],
      theme
    })
  }

  useEffect(() => {
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