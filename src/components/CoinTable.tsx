import styles from './CoinTable.module.css'
import { AllCommunityModule, ColDef, ModuleRegistry, 
  colorSchemeDark, themeQuartz, RowClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'

ModuleRegistry.registerModules([AllCommunityModule])

const darkTheme = themeQuartz.withPart(colorSchemeDark)

interface CoinTableProps {
  coins: Coin[]
  onRowSelect: (rowIdx: number) => void
}

interface IRow {
  name: string
  price: string
  high: string
  low: string
  volume: string
}

const CoinTable = ({ coins, onRowSelect }: CoinTableProps) => {
  const gridRef = useRef(null)

  const rowData: IRow[] = coins.map(coin => ({
    name: coin.symbol,
    price: coin.price.toLocaleString(),
    high: coin.high.toLocaleString(),
    low: coin.low.toLocaleString(),
    volume: coin.volume.toLocaleString()
  }))

  const colDefs: ColDef<IRow>[] = [
    { field: 'name', flex: 1 },
    { field: 'price', flex: 1 },
    { field: 'high', flex: 1 },
    { field: 'low', flex: 1 },
    { field: 'volume', flex: 1 },
  ]

  const handleRowClick = (e: RowClickedEvent<IRow, any>) => {
    const idx = e.rowIndex || 0
    onRowSelect(idx)
  }

  return (
    <div className={styles.coinTable}>
      <AgGridReact
        ref={gridRef}
        domLayout='autoHeight'
        theme={darkTheme}
        rowData={rowData}
        rowSelection='single'
        columnDefs={colDefs}
        onRowClicked={handleRowClick}
        rowClass={styles.coinRow}
        suppressCellFocus
      />
    </div>
  )
}

export default CoinTable