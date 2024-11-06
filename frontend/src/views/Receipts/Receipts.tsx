import { useState } from "react";
import { Receipt as ReceiptType, ReactSetState } from "@/types";

import Modal, { useModal, UseModalReturn } from "@components/Modal";

import Notifications from "@/Notifications";
import Spinner from "@components/Spinner";
import Api from "@/Api";
import AddReceiptForm from "./AddReceiptForm";
import Filters from "@components/Filters";
import EditReceiptForm from "./EditReceiptForm";
import ReceiptsTable from "./ReceiptsTable";

import styles from "./Receipts.module.scss";

const SEARCH_BY_LIST = [
  { name: "Folio", value: "folio" },
  { name: "SAP", value: "sap" },
  { name: "Date", value: "date" },
];

type DeleteReceiptModalProps = {
  deleteModal: UseModalReturn;
  setReceipts: ReactSetState<ReceiptType[]>;
  receiptToDelete: number;
};
function DeleteReceiptModal({ deleteModal, setReceipts, receiptToDelete }: DeleteReceiptModalProps) {
  const [isDeletingReceipt, setIsDeletingReceipt] = useState(false);

  const handleDeleteReceipt = async () => {
    setIsDeletingReceipt(true);

    try {
      await Api.deleteReceipt(receiptToDelete);
      Notifications.success("Receipt deleted sucessfully!");
      deleteModal.hide();

      setReceipts((receipts: ReceiptType[]) => receipts.filter(receipt => {
        return receipt.id !== receiptToDelete;
      }));
    } catch {
      Notifications.error("There was a server error.");
    }

    setIsDeletingReceipt(false);
  };

  return (
    <Modal title="Delete Receipt" modal={deleteModal} maxWidth={500}>
      <div className={styles.deleteModal}>
        {isDeletingReceipt && (
          <div className={styles.receiptsLoader}>
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
  );
}

function Receipts() {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [receiptToDelete, setReceiptToDelete] = useState(0);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [receiptToEdit, setReceiptToEdit] = useState<number | undefined>();
  const [previousSearch, setPreviousSearch] = useState("");

  const addReceiptModal = useModal();
  const editReceiptModal = useModal(() => setReceiptToEdit(undefined));
  const deleteModal = useModal();

  const loadReceipts = async (search?: string) => {
    setLoadingReceipts(true);

    try {
      setReceipts(await Api.getReceipts(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }

    setPreviousSearch(search || "");
    setLoadingReceipts(false);
  };

  const reloadReceipts = async () => {
    loadReceipts(previousSearch);
  };

  const showDeleteReceiptModal = (receiptId: number) => {
    deleteModal.show();
    setReceiptToDelete(receiptId);
  };

  const showEditReceiptModal = (receiptId: number) => {
    editReceiptModal.show();
    setReceiptToEdit(receiptId);
  };

  const addReceiptButton = (
    <button className={styles.addReceiptBtn} onClick={addReceiptModal.show}>
      Add Receipt
    </button>
  );

  return (
    <>
      <DeleteReceiptModal
        deleteModal={deleteModal}
        setReceipts={setReceipts}
        receiptToDelete={receiptToDelete}
      />

      <Modal title="Add Receipt" modal={addReceiptModal} maxWidth={600}>
        <AddReceiptForm
          hideModal={addReceiptModal.hide}
          reloadReceipts={reloadReceipts}
        />
      </Modal>

      <EditReceiptForm
        receiptId={receiptToEdit}
        editReceiptModal={editReceiptModal}
        reloadReceipts={reloadReceipts}
      />

      <Filters
        loadData={loadReceipts}
        addButton={addReceiptButton}
        searchByList={SEARCH_BY_LIST}
      />

      <ReceiptsTable
        loading={loadingReceipts}
        receipts={receipts}
        showDeleteModal={showDeleteReceiptModal}
        showEditModal={showEditReceiptModal}
        reloadReceipts={reloadReceipts}
      />
    </>
  );
}

export default Receipts;
