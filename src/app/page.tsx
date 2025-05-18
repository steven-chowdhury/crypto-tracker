'use client'

import CoinTable from '@/components/CoinTable'
import styles from './page.module.css'
import useCoin from '@/hooks/useCoin'

export default function Home() {
  const symbol = 'ETHUSDT'
  const { coin, loading, error } = useCoin(symbol)

  return (
    <div className={styles.page}>
      <h1>Crypto Tracker</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error tracking coin: {symbol}</div>}
      {coin && <CoinTable coin={coin} />}
    </div>
  );
}
