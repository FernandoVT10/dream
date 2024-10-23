import { useEffect, useState } from "react";
import { ChevronUpIcon, CheckIcon, PencilIcon, TrashIcon } from "../../icons";
import { Receipt as ReceiptType, Mix } from "../../types";

import Modal, { useModal } from "../Modal";

import Notifications from "../../Notifications";
import Spinner from "../Spinner";
import Api from "../../Api";

import styles from "./Receipts.module.scss";

const DELIVERED_STATUS = "delivered";

function Status({ status }: { status: string }) {
  const statusClass = status === "pending" ? styles.pending : styles.delivered;

  return (
    <div className={`${styles.status} ${statusClass}`}>
      <span className={styles.dot}></span>
      <span className={styles.text}>{status}</span>
    </div>
  );
}

type MixesProps = {
  mixes: Mix[];
  setMixes: React.Dispatch<Mix[]>;
  onMixUpdate: () => void;
};

function Mixes({ mixes, setMixes, onMixUpdate }: MixesProps) {
  const markAsDelivered = async (mixId: number) => {
    if(await Api.markMixAsDelivered(mixId)) {
      setMixes(mixes.map(mix => {
        if(mix.id === mixId) {
          mix.status = DELIVERED_STATUS;
        }

        return mix;
      }));

      onMixUpdate();
    } else {
      Notifications.error("Couldn't mark this mix as delivered");
    }
  };

  return (
    <div className={styles.mixes}>
      <div className={styles.header}>
        <div className={styles.colNumberOfMix}>#</div>
        <div className={styles.col1}>Quantity</div>
        <div className={styles.col1}>Presentation</div>
        <div className={styles.col1}>Status</div>
        <div className={styles.colActions}>Actions</div>
      </div>

      {mixes.map(mix => {
        return (
          <div className={styles.mix} key={mix.id}>
            <div className={styles.colNumberOfMix}>{mix.numberOfMix || "0"}</div>
            <div className={styles.col1}>{mix.quantity}</div>
            <div className={styles.col1}>{mix.presentation}</div>
            <div className={styles.col1}>
              <Status status={mix.status}/>
            </div>
            <div className={styles.colActions}>
              {mix.status === "pending" && (
                <button
                  type="button"
                  title="Mark as delivered"
                  onClick={() => markAsDelivered(mix.id)}
                >
                  <CheckIcon size={20}/>
                </button>
              )}

              <button type="button" title="Edit mix">
                <PencilIcon size={20}/>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


type ReceiptProps = {
  receipt: ReceiptType;
  setReceiptAsDelivered: (receiptId: number) => void;
  showDeleteModal: (receiptId: number) => void;
};

function Receipt({ receipt, setReceiptAsDelivered, showDeleteModal }: ReceiptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mixesFetched, setMixesFetched] = useState(false);
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setMixesFetched(true);
      setLoading(true);
      setMixes(await Api.getMixes(receipt.id));
      setLoading(false);
    };

    if(isOpen && !mixesFetched) {
      load();
    }
  }, [isOpen]);

  const onMixUpdate = () => {
    let allMixesAreDelivered = true;

    for(const mix of mixes) {
      if(mix.status !== DELIVERED_STATUS) {
        allMixesAreDelivered = false;
        break;
      }
    }

    if(allMixesAreDelivered) {
      setReceiptAsDelivered(receipt.id);
    }
  };

  const stopClickPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={`${styles.receipt} ${isOpen && styles.open}`}>
      <div
        className={styles.details}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.colIcon}>
          <ChevronUpIcon size={22} className={styles.icon}/>
        </div>
        <div className={styles.colDate}>{receipt.date}</div>
        <div className={styles.col2}>{receipt.folio}</div>
        <div className={styles.col1}>{receipt.sap}</div>
        <div className={`${styles.col1} ${styles.kind}`}>{receipt.kind}</div>
        <div className={styles.col1}>
          <Status status={receipt.status}/>
        </div>

        <div className={styles.colActions} onClick={stopClickPropagation}>
          <button type="button" title="Edit Receipt">
            <PencilIcon size={20}/>
          </button>

          <button type="button" title="Delete Receipt" onClick={() => showDeleteModal(receipt.id)}>
            <TrashIcon size={20}/>
          </button>
        </div>
      </div>

      { loading ? (
        <div className={styles.mixesLoader}>
          <Spinner size={25} borderWidth={3}/>
        </div>
      ) : (
        <Mixes mixes={mixes} setMixes={setMixes} onMixUpdate={onMixUpdate}/>
      )}
    </div>
  );
}

type ReceiptsProps = {
  receipts: ReceiptType[];
  setReceipts: React.Dispatch<ReceiptType[]>;
};

function Receipts({ receipts, setReceipts }: ReceiptsProps) {
  const [receiptToDelete, setReceiptToDelete] = useState(0);

  const deleteModal = useModal();

  const setReceiptAsDelivered = (receiptId: number) => {
    setReceipts(receipts.map(receipt => {
      if(receipt.id === receiptId) {
        receipt.status = DELIVERED_STATUS;
      }

      return receipt;
    }));
  };

  const showDeleteModal = (receiptId: number) => {
    deleteModal.show();
    setReceiptToDelete(receiptId);
  };

  const handleDeleteReceipt = async () => {
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
  };

  return (
    <>
      <Modal title="Delete Receipt" modal={deleteModal}>
        <div className={styles.deleteModal}>
          <p className={styles.text}>Are you sure you want to delete this receipt?</p>
          <button
            className={`custom-btn warning`}
            onClick={handleDeleteReceipt}
          >Delete Receipt</button>
          <button
            className={`custom-btn ${styles.cancelBtn}`}
            onClick={deleteModal.hide}
          >Cancel</button>
        </div>
      </Modal>
      <div className={styles.receipts}>
        <div className={styles.header}>
          <div className={styles.colIcon}></div>
          <div className={styles.colDate}>Date</div>
          <div className={styles.col2}>Folio</div>
          <div className={styles.col1}>SAP</div>
          <div className={styles.col1}>Kind</div>
          <div className={styles.col1}>Status</div>
          <div className={styles.colActions}>Actions</div>
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
