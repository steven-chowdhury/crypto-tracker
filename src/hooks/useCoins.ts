import { useState, useEffect } from 'react'

const useCoins = (symbols: string[]) => {
  const initialState = symbols.reduce((prev, curr) => {
    const newMap = new Map(prev)
    newMap.set(curr, {
      high: 0,
      low: 0,
      volume: 0,
      symbol: curr,
      bid: 0,
      ask: 0,
      price: 0,
      timestamp: Date()
    })

    return newMap
  }, new Map())

  const [coins, setCoins ] = useState<Map<string, Coin>>(initialState)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<Error | null>(null)

  useEffect(() => {
    const streams = symbols
      .map(symbol => `${symbol.toLowerCase()}@ticker`)
      .join('/')

    const socket = new WebSocket(`wss://stream.binance.us:9443/stream?streams=${streams}`)

    socket.addEventListener('message', (e) => {
      const json = JSON.parse(e.data)

      const data = json.data

      const price = (parseFloat(data.a) + parseFloat(data.b)) / 2

      const coin: Coin = {
        high: formatPrice(data.h),
        low: formatPrice(data.l),
        volume: parseFloat(data.v),
        symbol: data.s,
        bid: formatPrice(data.b),
        ask: formatPrice(data.a),
        price: formatPrice(price),
        timestamp: data.E
      }

      setCoins(prevCoins => {
        const newCoins = new Map([...prevCoins])
        newCoins.set(data.s, coin)

        return newCoins
      })
    })

    setLoading(true)

    socket.addEventListener('open', (e) => {
      setLoading(false)
    })

    socket.addEventListener('error', (e) => {
      setLoading(false)
      setError(new Error(`Socket error: ${e}`))
    })

    socket.addEventListener('close', (e) => {
      console.log('Socket disconnected')
    })

    return () => socket.close()
  }, [])

  const formatPrice = (price: number): number => {
    return Number(Number(price).toFixed(2))
  }

  return {
    coins: Array.from(coins.values()),
    loading,
    error
  }
}

export default useCoins