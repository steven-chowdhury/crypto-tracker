import { useEffect, useState } from 'react'
import styles from './Graph.module.css'
import { AgCharts } from 'ag-charts-react'
import { AgChartOptions, AgLineSeriesOptions } from 'ag-charts-community'

interface GraphProps {
  coin: Coin
}

interface IData {
  price: number
  timestamp: number
}

const theme = 'ag-material-dark'

const Graph = ({ coin }: GraphProps) => {
  console.log('coin =>', coin)
  const [options, setOptions] = useState<AgChartOptions>({
    data: [{
      price: coin.price,
      timestamp: coin.timestamp
    }] as IData[],
    series: [{ 
      type: 'line', 
      xKey: 'timestamp', 
      yKey: 'price'
    }] as AgLineSeriesOptions[],
    theme
  })

  useEffect(() => {
    let newData = []

    if (!options.data) {
      return
    }

    if (options.data.length >= 5) {
      newData = options.data.slice(1)
      newData.push({
        price: coin.price,
        timestamp: coin.timestamp
      })
    } else {
      newData = options.data.concat([{
        price: coin.price,
        timestamp: coin.timestamp
      }])
    }

    setOptions({
      data: newData,
      series: [{ type: 'line', xKey: 'timestamp', yKey: 'price'}],
      theme
    })
    console.log('options =>', options)
  }, [coin])

  return (
    <div className={styles.graph}>
      <AgCharts
        options={options}
      />
    </div>
  )
}

export default Graph