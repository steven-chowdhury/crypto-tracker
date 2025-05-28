import { useEffect, useState } from 'react'
import styles from './CoinGraph.module.css'
import { AgCharts } from 'ag-charts-react'
import { AgChartOptions, AgLineSeriesOptions } from 'ag-charts-community'
import { getInitialGraphData } from '@/utils/graphUtil'

interface CoinGraphProps {
  coin: Coin
}

const initialData = getInitialGraphData()

const CoinGraph = ({ coin }: CoinGraphProps) => {
  const [data, setData] = useState<IData[]>(initialData)

  const graphOptions: AgChartOptions = {
    theme: 'ag-material-dark',
    data: data,
    series: [{ 
      type: 'line', 
      xKey: 'timestamp', 
      yKey: 'price'
    }] as AgLineSeriesOptions[]
  }

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

    const newData = data.map((point, idx): IData => {
      const price = json[idx]
        ? parseFloat(json[idx][4])
        : null
      
      const timestamp = point.timestamp

      return {
        price,
        timestamp
      }
    })

    setData(newData)
  }

  useEffect(() => {
    const lastIdx = data.findLastIndex(item => !!item.price)

    const newData = data.map((item, idx) => {
      if (idx === lastIdx) {
        return {
          price: coin.price,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        }
      }

      return item
    })

    setData(newData)
  }, [coin])

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
        options={graphOptions}
      />
    </div>
  )
}

export default CoinGraph