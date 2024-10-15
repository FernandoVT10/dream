import Filters from "./components/Filters";

import { useEffect, useState, useRef } from "react";

import styles from "./App.module.scss";

type Receipt = {
  id: number;
  date: string;
  folio: string;
  quantity: string;
  description?: string;
  status: string;
};

const API_URL = "http://localhost:3000/api";

async function getReceipts(search?: string): Promise<Receipt[]> {
  let query = "";
  if(search) query = `?search=${search}`;

  const res = await fetch(`${API_URL}/receipts${query}`);
  const json = await res.json();
  return json.receipts;
}

function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async (search?: string): void => {
    try {
      setReceipts(await getReceipts(search));
    } catch {
      // TODO: do something with this catch
    }
  };

  return (
    <div className={styles.app}>
      <Filters loadReceipts={loadReceipts}/>

      <div className={styles.receiptsContainer}>
        <div className={styles.header}>
          <div className={styles.emtpy}></div>
          <div className={styles.date}>Date</div>
          <div className={styles.folio}>Folio</div>
          <div className={styles.quantity}>Quantity</div>
          <div className={styles.sap}>SAP</div>
          <div className={styles.kind}>Kind</div>
          <div className={styles.actions}>Actions</div>
        </div>

        {receipts.map(receipt => {
          const d = new Date(receipt.date);
          const day = d.getDate().toString().padStart(2, "0");
          const month = (d.getMonth() + 1).toString().padStart(2, "0");
          const year = d.getFullYear();

          const date = `${day}/${month}/${year}`;
          return (
            <div className={styles.receipt} key={receipt.id}>
              <div className={styles.emtpy}></div>
              <div className={styles.date}>{date}</div>
              <div className={styles.folio}>{receipt.folio}</div>
              <div className={styles.quantity}>{receipt.quantity}</div>
              <div className={styles.sap}>{receipt.sap}</div>
              <div className={styles.kind}>{receipt.kind}</div>
              <div className={styles.actions}>Null</div>
            </div>
          );
        })}
      </div>

      <div className={styles.formContainer}>
      </div>
    </div>
  )
}

export default App;
