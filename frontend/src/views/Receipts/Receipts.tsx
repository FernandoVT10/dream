import { useState } from "react";
import { Receipt as ReceiptType} from "@/types";
import { RECEIPT_STATUS_LIST } from "@/constants";

import Modal, { useModal } from "@components/Modal";

import Notifications from "@/Notifications";
import Spinner from "@components/Spinner";
import Api from "@/Api";
import Receipt from "./Receipt";

import styles from "./Receipts.module.scss";
import tableStyles from "./table.module.scss";

type ReceiptsProps = {
  receipts: ReceiptType[];
  setReceipts: React.Dispatch<ReceiptType[]>;
};

function Receipts({ receipts, setReceipts }: ReceiptsProps) {
  const [receiptToDelete, setReceiptToDelete] = useState(0);
  const [isDeletingReceipt, setIsDeletingReceipt] = useState(false);

  const deleteModal = useModal();

  const setReceiptAsDelivered = (receiptId: number) => {
    setReceipts(receipts.map(receipt => {
      if(receipt.id === receiptId) {
        receipt.status = RECEIPT_STATUS_LIST.delivered;
      }

      return receipt;
    }));
  };

  const showDeleteModal = (receiptId: number) => {
    deleteModal.show();
    setReceiptToDelete(receiptId);
  };

  const handleDeleteReceipt = async () => {
    setIsDeletingReceipt(true);

    try {
      await Api.deleteReceipt(receiptToDelete);
      Notifications.success("Receipt deleted sucessfully!");
      deleteModal.hide();

      setReceipts(receipts.filter(receipt => {
        return receipt.id !== receiptToDelete;
      }));
    } catch {
      Notifications.error("There was a server error.");
    }

    setIsDeletingReceipt(false);
  };

  return (
    <>
      <Modal title="Delete Receipt" modal={deleteModal}>
        <div className={styles.deleteModal}>
          {isDeletingReceipt && (
            <div className={styles.loader}>
              <Spinner size={35} borderWidth={5}/>
              <span className={styles.text}>Deleting Receipt...</span>
            </div>
          )}
          <p className={styles.text}>Are you sure you want to delete this receipt?</p>

          <div className={styles.buttons}>
            <button
              className={`custom-btn ${styles.cancelBtn}`}
              onClick={deleteModal.hide}
            >
              Cancel
            </button>
            <button
              className={`custom-btn warning`}
              onClick={handleDeleteReceipt}
            >
              Delete Receipt
            </button>
          </div>
        </div>
      </Modal>

      <div className={styles.receipts}>
        <div className={tableStyles.colHeader}>
          <div className={tableStyles.colIcon}></div>
          <div className={tableStyles.colDate}>Date</div>
          <div className={tableStyles.col2}>Folio</div>
          <div className={tableStyles.col1}>SAP</div>
          <div className={tableStyles.col1}>Kind</div>
          <div className={tableStyles.col1}>Status</div>
          <div className={tableStyles.colActions}>Actions</div>
        </div>

        {receipts.map(receipt => {
          return (
            <Receipt
              receipt={receipt}
              setReceiptAsDelivered={setReceiptAsDelivered}
              showDeleteModal={showDeleteModal}
              key={receipt.id}
            />
          );
        })}
      </div>
    </>
  );
}

export default Receipts;
