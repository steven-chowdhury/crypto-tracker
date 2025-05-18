import { useState, useEffect } from 'react'

const useCoin = (symbol: string) => {
  const [ coin, setCoin ] = useState<Coin>({
    high: 0.00,
    low: 0.00,
    volume: 0.00,
    symbol,
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
        symbol,
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

  return {
    coin
  }
}

export default useCoin