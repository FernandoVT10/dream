import { useState } from "react";
import { Receipt } from "../../types";

import Modal, { useModal } from "../Modal";

import Notifications from "../../Notifications";
import Filters from "../Filters";
import AddReceiptForm from "../AddReceiptForm";
import Receipts from "../Receipts";
import Api from "../../Api";
import Spinner from "../Spinner";

import styles from "./App.module.scss";

function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);

  const addReceiptModal = useModal();

  const loadReceipts = async (search?: string): Promise<void> => {
    setLoading(true);

    try {
      setReceipts(await Api.getReceipts(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }

    setLoading(false);
  };

  const addReceipt = (receipt: Receipt) => {
    setReceipts([receipt, ...receipts]);
  };

  const getReceiptsComponent = () => {
    if(loading) {
      return (
        <div className={styles.loader}>
          <Spinner size={50}/>
        </div>
      );
    }

    if(!receipts.length) {
      return (
        <div className={styles.infoMessage}>
          <p className={styles.text}>No receipts found</p>
        </div>
      );
    }

    return (
      <Receipts receipts={receipts} setReceipts={setReceipts}/>
    );
  };

  return (
    <>
      <Modal title="Add Receipt" modal={addReceiptModal}>
        <AddReceiptForm hideModal={addReceiptModal.hide} addReceiptToState={addReceipt}/>
      </Modal>

      <div className={styles.app}>
        <Filters
          loadReceipts={loadReceipts}
          showReceiptModal={() => addReceiptModal.show()}
        />
        {getReceiptsComponent()}
      </div>
    </>
  )
}

export default App;
