import { useState, useEffect } from "react";
import { Input, Select } from "@components/Form";

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

  const handleSearchBy = (value: string): void => {
    setSearchBy(value);
    setSearch("");
  };

  const getInputType = (): string => {
    if(["date", "deliveredDate"].includes(searchBy))
      return "date";
    return "text";
  };

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.mainFilters}>
          <div className={styles.searchBar}>
            <Select
              value={searchBy}
              onChange={handleSearchBy}
              valueList={searchByList}
            />

            <Input
              type={getInputType()}
              placeholder={`Enter a ${searchBy.toLowerCase()} to filter`}
              value={search}
              onChange={(v) => setSearch(v)}
            />
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
