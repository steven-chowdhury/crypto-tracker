import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Crypto Tracker</h1>
      <table className={styles.table}>
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
            <td>Ethereum</td>
            <td>2545.79000000</td>
            <td>2643.99000000</td>
            <td>2481.43000000</td>
            <td>336.39500000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
