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

async function loadReceipts(search?: string, searchBy?: string): Promise<Receipt[]> {
  let query = "";
  if(search && searchBy) query = `?search=${search}&searchBy=${searchBy}`;

  const res = await fetch(`${API_URL}/receipts${query}`);
  const json = await res.json();
  return json.receipts;
}

type SearchBy = "folio" | "sap" | "date";

function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [searchBy, setSearchBy] = useState<SearchBy>("folio");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setReceipts(await loadReceipts(search, searchBy));
    };

    load();
  }, [search]);

  const handleSearchBy = (e: React.ChangeEvent<HTMLInput>): void => {
    setSearchBy(e.target.value);
    setSearch("");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInput>): void => {
    setSearch(e.target.value);
  };

  return (
    <div className={styles.app}>
      <Filters/>

      <div className={styles.searchBar}>
        <select className={styles.select} value={searchBy} onChange={handleSearchBy}>
          <option value="folio">Folio</option>
          <option value="sap">Sap</option>
          <option value="date">Date</option>
        </select>

        { searchBy === "date" ? (
          <input
            type="date"
            className={`${styles.input} ${styles.dateInput}`}
            value={search}
            onChange={handleOnChange}
          />
        ) : (
          <input
            type="text"
            className={styles.input}
            placeholder={`Enter a ${searchBy.toLowerCase()} to filter`}
            value={search}
            onChange={handleOnChange}
          />
        )}
      </div>

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
