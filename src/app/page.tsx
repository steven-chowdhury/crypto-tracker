'use client'

import styles from "./page.module.css";
import useCoin from '@/hooks/useCoin';

export default function Home() {
  const { coin } = useCoin('ETHUSDT')

  return (
    <div className={styles.page}>
      <h1>Crypto Tracker</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>High</th>
            <th>Low</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{coin.symbol}</td>
            <td>{coin.price.toLocaleString()}</td>
            <td>{coin.high.toLocaleString()}</td>
            <td>{coin.low.toLocaleString()}</td>
            <td>{coin.volume.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
