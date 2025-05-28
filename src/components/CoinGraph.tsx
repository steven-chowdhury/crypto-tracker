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
  const [options, setOptions] = useState<AgChartOptions>(initialData)

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

    const data = initialData.data?.map((point, idx): IData => {
      const price = json[idx]
        ? parseFloat(json[idx][4])
        : null
      
      const timestamp = point.timestamp

      return {
        price,
        timestamp
      }
    })

    const newData = Object.assign({}, options, {
      data: data || []
    })

    setOptions(newData)
  }

  useEffect(() => {
    if (!options.data) {
      return
    }

    const lastIdx = options.data.findLastIndex(item => !!item.price)

    const newData = options.data.map((item, idx) => {
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

    const newOptions: AgChartOptions = {
      theme: options.theme,
      data: newData,
      series: options.series as AgLineSeriesOptions[]
    }

    setOptions(newOptions)
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
        options={options}
      />
    </div>
  )
}

export default CoinGraph