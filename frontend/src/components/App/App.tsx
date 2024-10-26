import { useState } from "react";

// import AddReceiptForm from "../AddReceiptForm";
// import Spinner from "../Spinner";

import Receipts from "@views/Receipts";

import styles from "./App.module.scss";

export type LoadReceiptsFn = (view: string, search?: string) => Promise<void>;

type ViewList = "receipts" | "mixes";

function App() {
  const [view, setView] = useState<ViewList>("receipts");

  // const getReceiptsComponent = () => {
  //   if(loading) {
  //     return (
  //       <div className={styles.loader}>
  //         <Spinner size={50}/>
  //       </div>
  //     );
  //   }
  //
  //   if(!receipts.length) {
  //     return (
  //       <div className={styles.infoMessage}>
  //         <p className={styles.text}>No receipts found</p>
  //       </div>
  //     );
  //   }
  //
  //   return (
  //     <Receipts receipts={receipts} setReceipts={setReceipts}/>
  //   );
  // };

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
