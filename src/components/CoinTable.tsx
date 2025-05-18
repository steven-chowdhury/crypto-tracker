import styles from './CoinTable.module.css'

interface CoinTableProps {
  coin: Coin
}

const CoinTable = ({ coin }: CoinTableProps) => {
  return (
    <table className={styles.coinTable}>
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
          <td>{coin.symbol}</td>
          <td>{coin.price.toLocaleString()}</td>
          <td>{coin.high.toLocaleString()}</td>
          <td>{coin.low.toLocaleString()}</td>
          <td>{coin.volume.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default CoinTable