export const getInitialGraphData = (): IData[] => {
  // Get five min/full day in milliseconds
  const fiveMin = 60 * 5 * 1000
  const fullDay = 60 * 60 * 24 * 1000

  const numFiveMin = fullDay / fiveMin

  const now = new Date();
  
  const startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()

  const candleSticks = []

  for (let i=0; i<=numFiveMin; i++) {
    const candleStick = { 
      timestamp: new Date(startTime + (i * fiveMin)),
      price: null
    }
    candleSticks.push(candleStick)
  }

  return candleSticks
}