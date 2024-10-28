import { useState } from "react";

import Receipts from "@views/Receipts";
import Mixes from "@views/Mixes";

import styles from "./App.module.scss";

export type LoadReceiptsFn = (view: string, search?: string) => Promise<void>;

const VIEW_LIST = ["receipts", "mixes"];
const DEFAULT_SELECTED_VIEW = VIEW_LIST[0];

function App() {
  const [view, setView] = useState(DEFAULT_SELECTED_VIEW);

  return (
    <div className={styles.app}>
      <div className={styles.viewSelector}>
        {VIEW_LIST.map(v => {
          const activeClass = view === v && styles.active;

          return (
            <button
              className={`${styles.viewOption} ${activeClass}`}
              onClick={() => setView(v)}
              key={v}
            >
              {v}
            </button>
          );
        })}
      </div>

      {view === "receipts" ? (<Receipts/>) : (<Mixes/>)}
    </div>
  );
}

export default App;
