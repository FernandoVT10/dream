import { useState } from "react";
import { API_URL } from "../../constants";
import { Receipt } from "../../types";

import Modal, { useModal } from "../Modal";

import Notifications from "../../Notifications";
import Filters from "../Filters";
import AddReceiptForm from "../AddReceiptForm";
import Receipts from "../Receipts";

import styles from "./App.module.scss";

async function getReceipts(search?: string): Promise<Receipt[]> {
  let query = "";
  if(search) query = `?search=${search}`;

  const res = await fetch(`${API_URL}/receipts${query}`);
  const json = await res.json();
  return json.receipts;
}

function App() {
  const addReceiptModal = useModal();

  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const loadReceipts = async (search?: string): Promise<void> => {
    try {
      setReceipts(await getReceipts(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }
  };

  const addReceipt = (receipt: Receipt) => {
    setReceipts([receipt, ...receipts]);
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

        <Receipts receipts={receipts} setReceipts={setReceipts}/>
      </div>
    </>
  )
}

export default App;
