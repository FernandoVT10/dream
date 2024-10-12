import { useState } from "react";

import styles from "./Filters.module.scss";

// TODO: remove this variable and instead get it from the server
const KIND_LIST = ["All", "Raspberries", "Corn", "Strawberries"];

function Filters() {
  const [toggle, setToggle] = useState<boolean[]>([]);

  return (
    <div className={styles.filters}>
      <div className={styles.kindFilters}>
        {KIND_LIST.map((kind, i) => {
          const isActive = toggle[i] === true;

          const onClick = () => {
            const newToggle = [...toggle];
            newToggle[i] = !isActive;
            setToggle(newToggle);
          };

          return (
            <button className={`${styles.filter} ${isActive && styles.active}`} onClick={onClick} key={kind}>
              {kind}
            </button>
          );
        })}
      </div>

      <button className={styles.addReceiptBtn}>
        Add Receipt
      </button>
    </div>
  );
}

export default Filters;
