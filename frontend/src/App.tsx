import { useEffect, useState } from "react";
import { API_URL } from "./constants";
import { Receipt } from "./types";

import Modal, { useModal } from "./components/Modal";

import Notifications from "./Notifications";
import Filters from "./components/Filters";
import AddReceiptForm from "./components/AddReceiptForm";
import Receipts from "./components/Receipts";

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

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async (search?: string): Promise<void> => {
    try {
      setReceipts(await getReceipts(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }
  };

  return (
    <>
      <Modal title="Add Receipt" modal={addReceiptModal}>
        <AddReceiptForm hideModal={addReceiptModal.hide}/>
      </Modal>
      <div className={styles.app}>
        <Filters
          loadReceipts={loadReceipts}
          showReceiptModal={() => addReceiptModal.show()}
        />

        <Receipts receipts={receipts}/>
      </div>
    </>
  )
}

export default App;
