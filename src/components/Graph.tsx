import { useEffect, useState } from 'react'
import styles from './Graph.module.css'
import { AgCharts } from 'ag-charts-react'
import { AgChartOptions, AgLineSeriesOptions } from 'ag-charts-community'

interface GraphProps {
  coin: Coin
}

interface IData {
  price: number
  timestamp: string
}

const theme = 'ag-material-dark'

const Graph = ({ coin }: GraphProps) => {
  const [options, setOptions] = useState<AgChartOptions>({
    data: [] as IData[],
    series: [{ 
      type: 'line', 
      xKey: 'timestamp', 
      yKey: 'price'
    }] as AgLineSeriesOptions[],
    theme
  })

  useEffect(() => {
    const fetchData = async () => {
      const symbol = coin.symbol
      const interval = '1h'
      const url = `https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=24`
      
      const res = await fetch(url)
      const json = await res.json()

      const data = json.map(item => ({ 
        timestamp: new Date(item[0]).toLocaleTimeString('en-US', {
          hour: 'numeric',
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

    fetchData()
  }, [coin.symbol])

  return (
    <div className={styles.graph}>
      <AgCharts
        options={options}
      />
    </div>
  )
}

export default Graph