'use client'

import { useEffect, useState } from 'react';
import styles from "./page.module.css";

interface Coin {
  c: string // price
  h: string // high
  l: string // low
  v: string // volume
  s: string // ticker symbol,
  b: string // bid,
  a: string // ask
  price: number
}

export default function Home() {
  const [ data, setData ] = useState<Coin>({
    c: '0',
    h: '0',
    l: '0',
    v: '0',
    s: '',
    b: '',
    a: '',
    price: 0,
  })

  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.us:9443/ws/btcusdt@ticker')

    socket.addEventListener('message', (e) => {
      console.log('event.data =>', e.data)

      const data = JSON.parse(e.data)

      const coin = Object.assign({}, data, {
        price: calcPrice(data.b, data.a)
      })

      setData(coin)
    })

    socket.addEventListener('open', (e) => {
      console.log('socket open')
    })

    socket.addEventListener('error', (e) => {
      console.log('Error opening websocket', e)
    })

    return () => socket.close()
  }, [])

  const formatPrice = (price: string): string => {
    return Number(price).toFixed(2)
  }

  const calcPrice = (bid: string, ask: string): string => {
    const price = (Number(bid) + Number(ask)) / 2
    return formatPrice(`${price}`)
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
            <td>{data.s}</td>
            <td>{data.price}</td>
            <td>{formatPrice(data.h)}</td>
            <td>{formatPrice(data.l)}</td>
            <td>{formatPrice(data.v)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
