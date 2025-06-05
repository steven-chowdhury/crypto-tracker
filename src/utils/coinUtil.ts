export const formatPrice = (price: number): number => {
  return Number(Number(price).toFixed(2))
}

export const getCurrentPrice = (ask: string, bid: string): number => {
  const price = (parseFloat(ask) + parseFloat(bid)) / 2

  return formatPrice(price)
}