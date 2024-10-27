import { useState } from "react";

import Receipts from "@views/Receipts";

import styles from "./App.module.scss";

export type LoadReceiptsFn = (view: string, search?: string) => Promise<void>;

const VIEW_LIST = ["receipts", "mixes"];
const DEFAULT_SELECTED_VIEW = VIEW_LIST[0];

function App() {
  const [view, setView] = useState<ViewList>(DEFAULT_SELECTED_VIEW);

  return (
    <div className={styles.app}>

      {view === "receipts" ? (
        <Receipts/>
      ) : (
        <span>Not implemented yet! :)</span>
      )}
    </div>
  );
}

export default App;
