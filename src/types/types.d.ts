interface Coin {
  high: number 
  low: number
  volume: number
  symbol: string // ticker symbol,
  bid: number
  ask: number
  price: number
  timestamp: string
}

interface IData {
  price: number | null
  timestamp: string
}