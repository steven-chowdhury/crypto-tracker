'use client'

import CoinTable from '@/components/CoinTable'
import styles from './page.module.css'
import useCoins from '@/hooks/useCoins'
import CoinGraph from '@/components/CoinGraph'
import { useState } from 'react'

const symbols = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT']

export default function Home() {
  
  const { coins, loading, error } = useCoins(symbols)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleRowSelect = (rowIdx: number) => {
    setSelectedIndex(rowIdx)
  }

  return (
    <div className={styles.page}>
      <h1>Crypto Tracker</h1>
      {loading && <div>Loading...</div>}
      {/* {error && <div>Error tracking coin: {symbol}</div>} */}
      <div className={styles.container}>
        <CoinGraph coin={coins[selectedIndex]} />
        <CoinTable coins={coins} onRowSelect={handleRowSelect} />
      </div>
    </div>
  );
}
