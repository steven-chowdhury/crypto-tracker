import styles from './CoinTable.module.css'
import { AllCommunityModule, ColDef, ModuleRegistry, colorSchemeDark, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

ModuleRegistry.registerModules([AllCommunityModule])

const darkTheme = themeQuartz.withPart(colorSchemeDark)

interface CoinTableProps {
  coin: Coin
}

interface IRow {
  name: string
  price: string
  high: string
  low: string
  volume: string
}

const CoinTable = ({ coin }: CoinTableProps) => {
  const rowData: IRow[] = [{
    name: coin.symbol,
    price: coin.price.toLocaleString(),
    high: coin.high.toLocaleString(),
    low: coin.low.toLocaleString(),
    volume: coin.volume.toLocaleString()
  }]

  const colDefs: ColDef<IRow>[] = [
    { field: 'name', flex: 1 },
    { field: 'price', flex: 1 },
    { field: 'high', flex: 1 },
    { field: 'low', flex: 1 },
    { field: 'volume', flex: 1 },
  ]

  return (
    <div style={{ width: '100%'}}>
      <AgGridReact
        domLayout='autoHeight'
        theme={darkTheme}
        rowData={rowData}
        columnDefs={colDefs}
      />
    </div>
  )
}

export default CoinTable