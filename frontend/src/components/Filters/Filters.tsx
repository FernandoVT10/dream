import { useState, useEffect } from "react";

import styles from "./Filters.module.scss";

const STATUS_LIST = [
  { name: "All", value: "all" },
  { name: "Pending", value: "pending" },
  { name: "Delivered", value: "delivered" },
];

const KIND_LIST = [
  { name: "All", value: "all" },
  { name: "Raspberries", value: "raspberry" },
  { name: "Corn", value: "corn" },
  { name: "Strawberries", value: "strawberry" },
];

const SEARCH_BY_LIST = [
  { name: "Folio", value: "folio" },
  { name: "SAP", value: "sap" },
  { name: "Date", value: "date" },
];

type FiltersProps = {
  loadReceipts: (search?: string) => void;
  showReceiptModal: () => void;
};

const getValue = (cb: (value: string) => void) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    cb(e.target.value);
  }
};

function Filters({ loadReceipts, showReceiptModal }: FiltersProps) {
  const [searchBy, setSearchBy] = useState("folio");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState(KIND_LIST[0].value);
  const [status, setStatus] = useState(STATUS_LIST[1].value);

  useEffect(() => {
    let query = "";

    // the query or search syntax is in the form: "[filter_name]: [value];"
    // each filter term is separated by a semicolon
    if(search) query = `${searchBy}:${search};`;
    if(kind !== "all") query += `kind:${kind};`;
    if(status !== "all") query += `status:${status};`;

    loadReceipts(query);
  }, [search, kind, status]);

  const handleSearchBy = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSearchBy(e.target.value);
    setSearch("");
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchBar}>
        <select className={styles.select} value={searchBy} onChange={handleSearchBy}>
          {SEARCH_BY_LIST.map(({ value, name }) => {
            return (
              <option value={value} key={value}>{name}</option>
            );
          })}
        </select>

        { searchBy === "date" ? (
          <input
            type="date"
            className={`${styles.input} ${styles.dateInput}`}
            value={search}
            onChange={getValue(v => setSearch(v))}
          />
        ) : (
          <input
            type="text"
            className={styles.input}
            placeholder={`Enter a ${searchBy.toLowerCase()} to filter`}
            value={search}
            onChange={getValue(v => setSearch(v))}
          />
        )}
      </div>

      <div className={styles.extraFilters}>
        <select
          className={styles.select}
          value={status}
          onChange={getValue(v => setStatus(v))}
        >
          {STATUS_LIST.map(status => {
            return (
              <option key={status.name} value={status.value}>{status.name}</option>
            );
          })}
        </select>

        <select
          className={styles.select}
          value={kind}
          onChange={getValue(v => setKind(v))}
        >
          {KIND_LIST.map(kind => {
            return (
              <option key={kind.name} value={kind.value}>{kind.name}</option>
            );
          })}
        </select>

        <button className={styles.addReceiptBtn} onClick={showReceiptModal}>
          Add Receipt
        </button>
      </div>
    </div>
  );
}

export default Filters;
