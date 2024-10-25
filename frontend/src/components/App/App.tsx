import { useState } from "react";
import { Receipt } from "@/types";

import { useModal } from "../Modal";

import Notifications from "@/Notifications";
import Filters from "../Filters";
// import AddReceiptForm from "../AddReceiptForm";
import Api from "@/Api";
// import Spinner from "../Spinner";

import Receipts from "@views/Receipts";

import styles from "./App.module.scss";

export type LoadReceiptsFn = (view: string, search?: string) => Promise<void>;

type ViewList = "receipts" | "mixes";

function App() {
  const [view, setView] = useState<ViewList>("receipts");

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  // const [loading, setLoading] = useState(false);

  const addReceiptModal = useModal();

  const loadReceipts: LoadReceiptsFn = async (_view, search) => {
    // setLoading(true);

    try {
      setReceipts(await Api.getReceipts(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }

    // setLoading(false);
  };

  // const addReceipt = (receipt: Receipt) => {
  //   setReceipts([receipt, ...receipts]);
  // };

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
      <Filters
        loadReceipts={loadReceipts}
        showReceiptModal={() => addReceiptModal.show()}
      />

      {view === "receipts" ? (
        <Receipts receipts={receipts} setReceipts={setReceipts}/>
      ) : (
        <span>Not implemented yet! :)</span>
      )}
    </div>
  );

  // return (
  //   <>
  //     <Modal title="Add Receipt" modal={addReceiptModal}>
  //       <AddReceiptForm hideModal={addReceiptModal.hide} addReceiptToState={addReceipt}/>
  //     </Modal>
  //
  //     <div className={styles.app}>
  //       <Filters
  //         loadReceipts={loadReceipts}
  //         showReceiptModal={() => addReceiptModal.show()}
  //       />
  //       {getReceiptsComponent()}
  //     </div>
  //   </>
  // );
}

export default App;
