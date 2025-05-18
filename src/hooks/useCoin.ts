import { useState, useEffect } from 'react'

const useCoin = (symbol: string) => {
  const [ coin, setCoin ] = useState<Coin | null>(null)

  const [ loading, setLoading ] = useState<boolean>(false)

  const [ error, setError ] = useState<Error | null>(null)

  useEffect(() => {
    const symbolLower = symbol.toLowerCase()
    const socket = new WebSocket(`wss://stream.binance.us:9443/ws/${symbolLower}@ticker`)

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

    setLoading(true)

    socket.addEventListener('open', (e) => {
      setLoading(false)
    })

    socket.addEventListener('error', (e) => {
      setLoading(false)
      setError(new Error(`Error opening websocket for coin: ${symbol}`))
    })

    return () => socket.close()
  }, [])

  const formatPrice = (price: number): number => {
    return parseFloat(Number(price).toFixed(2))
  }

  return {
    coin,
    loading,
    error
  }
}

export default useCoin