import { useState, useEffect } from "react";

import styles from "./Filters.module.scss";

const KIND_LIST = [
  { name: "Raspberries", value: "raspberry" },
  { name: "Strawberries", value: "strawberry" },
];

const DEFAULT_SELECTED_KIND = KIND_LIST[0].value;

const STATUS_LIST = [
  { name: "All", value: "all" },
  { name: "Pending", value: "pending" },
  { name: "Delivered", value: "delivered" },
];

const SEARCH_BY_LIST = [
  { name: "Folio", value: "folio" },
  { name: "SAP", value: "sap" },
  { name: "Date", value: "date" },
];

type FiltersProps = {
  loadReceipts: (search?: string) => Promise<void>;
  showReceiptModal: () => void;
};

const getValue = (cb: (value: string) => void) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    cb(e.target.value);
  }
};

function Filters({ loadReceipts, showReceiptModal }: FiltersProps) {
  const [selectedKind, setSelectedKind] = useState(DEFAULT_SELECTED_KIND);
  const [searchBy, setSearchBy] = useState("folio");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(STATUS_LIST[1].value);

  useEffect(() => {
    // the query or search syntax is in the form: "[filter_name]: [value];"
    // each filter term is separated by a semicolon
    let query = `kind:${selectedKind};`;
    if(search) query += `${searchBy}:${search};`;
    if(status !== "all") query += `status:${status};`;

    loadReceipts(query);
  }, [selectedKind, search, status]);

  const handleSearchBy = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSearchBy(e.target.value);
    setSearch("");
  };

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.mainFilters}>
          <div className={styles.searchBar}>
            <select className={styles.folioSelect} value={searchBy} onChange={handleSearchBy}>
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

          <button className={styles.addReceiptBtn} onClick={showReceiptModal}>
            Add Receipt
          </button>
        </div>

        <div className={styles.advancedFilters}>
          <div className={styles.advancedFilter}>
            <span className={styles.filterName}>Status</span>

            {STATUS_LIST.map(({ name, value }) => {
              const buttonClass = status === value && styles.active;

              return (
                <button
                  key={name}
                  className={`${styles.filterOption} ${buttonClass}`}
                  onClick={() => setStatus(value)}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className={styles.advancedFilter}>
            <span className={styles.filterName}>Kind</span>

            {KIND_LIST.map(({ name, value }) => {
              const buttonClass = selectedKind === value && styles.active;

              return (
                <button
                  key={name}
                  className={`${styles.filterOption} ${buttonClass}`}
                  onClick={() => setSelectedKind(value)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Filters;
