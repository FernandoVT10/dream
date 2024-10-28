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

type FiltersProps = {
  loadData: (search?: string) => Promise<void>;
  addButton?: JSX.Element;
  searchByList: { name: string, value: string }[];
};

const getValue = (cb: (value: string) => void) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    cb(e.target.value);
  }
};

function Filters({ loadData, addButton, searchByList }: FiltersProps) {
  const [selectedKind, setSelectedKind] = useState(DEFAULT_SELECTED_KIND);
  const [searchBy, setSearchBy] = useState(searchByList[0].value);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(STATUS_LIST[1].value);

  useEffect(() => {
    // the query or search syntax is in the form: "[filter_name]: [value];"
    // each filter term is separated by a semicolon
    let query = `kind:${selectedKind};`;
    if(search) query += `${searchBy}:${search};`;
    if(status !== "all") query += `status:${status};`;

    loadData(query);
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
              {searchByList.map(({ value, name }) => {
                return (
                  <option value={value} key={value}>{name}</option>
                );
              })}
            </select>

            { (searchBy === "date" || searchBy === "deliveredDate") ? (
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

          { addButton || null }
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
