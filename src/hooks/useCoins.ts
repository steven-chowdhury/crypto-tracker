import { useState, useEffect } from 'react'
import * as coinUtil from '../utils/coinUtil'

const useCoins = (symbols: string[]) => {

  const [ coins, setCoins ] = useState<Map<string, Coin>>(new Map<string, Coin>())
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<unknown | null>(null)

  useEffect(() => {
    let socket: WebSocket | null = null

    const initCoins = async () => {
      try {
        await fetchInitialPrices()
        socket = createWebsocket()
      } catch (err) {
        socket?.close()
        setError(err)
      }
    }

    initCoins()

    return () => socket?.close()
  }, [])

  const fetchInitialPrices = async () => {
    const coinMap = new Map<string, Coin>()

    const coins = await Promise.all(symbols.map(async symbol => {
      const res = await fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${symbol}`)
      return res.json()
    }))

    coins.forEach(coin => {
      coinMap.set(coin.symbol, {
        high: coinUtil.formatPrice(coin.highPrice),
        low: coinUtil.formatPrice(coin.lowPrice),
        volume: parseFloat(coin.volume),
        symbol: coin.symbol,
        bid: coinUtil.formatPrice(coin.bidPrice),
        ask: coinUtil.formatPrice(coin.askPrice),
        price: coinUtil.getCurrentPrice(coin.askPrice, coin.bidPrice),
        timestamp: Date()
      })
    })

    setCoins(coinMap)

    setLoading(false)
  }

  const createWebsocket = (): WebSocket => {
    const streams = symbols
      .map(symbol => `${symbol.toLowerCase()}@ticker`)
      .join('/')

    const socket = new WebSocket(`wss://stream.binance.us:9443/stream?streams=${streams}`)

    socket.addEventListener('message', (e) => {
      const json = JSON.parse(e.data)

      const data = json.data

      const coin: Coin = {
        high: coinUtil.formatPrice(data.h),
        low: coinUtil.formatPrice(data.l),
        volume: parseFloat(data.v),
        symbol: data.s,
        bid: coinUtil.formatPrice(data.b),
        ask: coinUtil.formatPrice(data.a),
        price: coinUtil.getCurrentPrice(data.a, data.b),
        timestamp: data.E
      }

      setCoins(prevCoins => {
        const newCoins = new Map([...prevCoins])
        newCoins.set(data.s, coin)

        return newCoins
      })
    })

    setLoading(true)

    socket.addEventListener('open', () => {
      setLoading(false)
    })

    socket.addEventListener('error', (e) => {
      setLoading(false)
      setError(new Error(`Socket error: ${e}`))
    })

    socket.addEventListener('close', () => {
      console.log('Socket disconnected')
    })

    return socket
  }

  return {
    coins: Array.from(coins.values()),
    loading,
    error
  }
}

export default useCoins