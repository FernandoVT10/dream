import { useState } from "react";
import { Receipt as ReceiptType, ReactSetState } from "@/types";
import { RECEIPT_STATUS_LIST } from "@/constants";

import Modal, { useModal, UseModalReturn } from "@components/Modal";

import Notifications from "@/Notifications";
import Spinner from "@components/Spinner";
import Api from "@/Api";
import Receipt from "./Receipt";
import AddReceiptForm from "./AddReceiptForm";
import Filters from "@components/Filters";
import EditReceiptForm from "./EditReceiptForm";

import styles from "./Receipts.module.scss";
import tableStyles from "./table.module.scss";

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
  );
}

type ReceiptsTableProps = {
  loading: boolean;
  receipts: ReceiptType[];
  showDeleteModal: (receiptId: number) => void;
  setReceiptAsDelivered: (receiptId: number) => void;
  showEditModal: (receiptId: number) => void;
};

function ReceiptsTable({
  loading,
  receipts,
  showDeleteModal,
  setReceiptAsDelivered,
  showEditModal,
}: ReceiptsTableProps) {
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
    <div className={styles.receipts}>
      <div className={tableStyles.colHeader}>
        <div className={tableStyles.colIcon}></div>
        <div className={tableStyles.colDate}>Date</div>
        <div className={tableStyles.col1}>Folio</div>
        <div className={tableStyles.col1}>SAP</div>
        <div className={tableStyles.col1}>Status</div>
        <div className={tableStyles.colActions}>Actions</div>
      </div>

      {receipts.map(receipt => {
        return (
          <Receipt
            receipt={receipt}
            setReceiptAsDelivered={setReceiptAsDelivered}
            showDeleteModal={showDeleteModal}
            showEditModal={showEditModal}
            key={receipt.id}
          />
        );
      })}
    </div>
  );
}

function Receipts() {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [receiptToDelete, setReceiptToDelete] = useState(0);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [receiptToEdit, setReceiptToEdit] = useState<number | undefined>();

  const addReceiptModal = useModal();
  const editReceiptModal = useModal();
  const deleteModal = useModal();

  const loadReceipts = async (search?: string) => {
    setLoadingReceipts(true);

    try {
      setReceipts(await Api.getReceipts(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }

    setLoadingReceipts(false);
  };

  const addReceipt = (receipt: ReceiptType) => {
    setReceipts([receipt, ...receipts]);
  };

  const setReceiptAsDelivered = (receiptId: number) => {
    setReceipts(receipts.map(receipt => {
      if(receipt.id === receiptId) {
        receipt.status = RECEIPT_STATUS_LIST.delivered;
      }

      return receipt;
    }));
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
          addReceiptToState={addReceipt}
        />
      </Modal>

      <EditReceiptForm
        receiptId={receiptToEdit}
        editReceiptModal={editReceiptModal}
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
        setReceiptAsDelivered={setReceiptAsDelivered}
      />
    </>
  );
}

export default Receipts;
