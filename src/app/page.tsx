'use client'

import { useEffect, useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [ coin, setCoin ] = useState<Coin>({
    high: 0.00,
    low: 0.00,
    volume: 0.00,
    symbol: '',
    bid: 0.00,
    ask: 0.00,
    price: 0,
  })

  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.us:9443/ws/btcusdt@ticker')

    socket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data)

      const price = (parseFloat(data.a) + parseFloat(data.b)) / 2

      const coin: Coin = {
        high: formatPrice(data.h),
        low: formatPrice(data.l),
        volume: parseFloat(data.v),
        symbol: data.s,
        bid: formatPrice(data.b),
        ask: formatPrice(data.a),
        price: formatPrice(price)
      }

      setCoin(coin)
    })

    socket.addEventListener('open', (e) => {
      console.log('socket open')
    })

    socket.addEventListener('error', (e) => {
      console.log('Error opening websocket', e)
    })

    return () => socket.close()
  }, [])

  const formatPrice = (price: number): number => {
    return parseFloat(Number(price).toFixed(2))
  }

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
