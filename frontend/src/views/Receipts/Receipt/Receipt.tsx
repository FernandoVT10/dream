import { useState, useEffect } from "react";
import { Mix, Receipt as ReceiptType } from "@/types";
import {
  CheckIcon,
  PencilIcon,
  ChevronUpIcon,
  TrashIcon
} from "@/icons";
import { getFormattedDate } from "@utils/date";
import { MIX_STATUS_LIST } from "@/constants";

import Api from "@/Api";
import Notifications from "@/Notifications";
import Status from "@components/Status";
import Spinner from "@components/Spinner";

import styles from "./Receipt.module.scss";
import tableStyles from "../table.module.scss";

type MixesProps = {
  mixes: Mix[];
  setMixes: React.Dispatch<Mix[]>;
  onMixUpdate: () => void;
};

function Mixes({ mixes, setMixes, onMixUpdate }: MixesProps) {
  const [loading, setLoading] = useState(false);

  const markAsDelivered = async (mixId: number) => {
    if(loading) return;

    setLoading(true);

    if(await Api.markMixAsDelivered(mixId)) {
      setMixes(mixes.map(mix => {
        if(mix.id === mixId) {
          mix.status = MIX_STATUS_LIST.delivered;
        }

        return mix;
      }));

      onMixUpdate();
    } else {
      Notifications.error("Couldn't mark this mix as delivered");
    }

    setLoading(false);
  };

  return (
    <div className={styles.mixes}>
      <div className={tableStyles.colHeader}>
        <div className={styles.colNumberOfMix}>#</div>
        <div className={tableStyles.col1}>Quantity</div>
        <div className={tableStyles.col1}>Presentation</div>
        <div className={tableStyles.col1}>Status</div>
        <div className={tableStyles.colActions}>Actions</div>
      </div>

      {mixes.map(mix => {
        return (
          <div className={styles.mix} key={mix.id}>
            <div className={styles.colNumberOfMix}>{mix.numberOfMix || "0"}</div>
            <div className={tableStyles.col1}>{mix.quantity}</div>
            <div className={tableStyles.col1}>{mix.presentation}</div>
            <div className={tableStyles.col1}>
              <Status status={mix.status} deliveredDate={mix.deliveredDate}/>
            </div>
            <div className={tableStyles.colActions}>
              {mix.status !== MIX_STATUS_LIST.delivered && (
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
  reloadReceipts: () => Promise<void>;
  showDeleteModal: (receiptId: number) => void;
  showEditModal: (receiptId: number) => void;
};

function Receipt({ receipt, reloadReceipts, showDeleteModal, showEditModal }: ReceiptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mixesFetched, setMixesFetched] = useState(false);
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setMixesFetched(true);
      setLoading(true);
      setMixes(await Api.getMixesByReceiptId(receipt.id));
      setLoading(false);
    };

    if(isOpen && !mixesFetched) {
      load();
    }
  }, [isOpen]);

  const onMixUpdate = () => {
    reloadReceipts();
    Notifications.success("Mix marked as delivered");
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
        <div className={tableStyles.colIcon}>
          <ChevronUpIcon size={22} className={styles.icon}/>
        </div>
        <div className={tableStyles.colDate}>{getFormattedDate(receipt.date)}</div>
        <div className={tableStyles.col1}>{receipt.folio}</div>
        <div className={tableStyles.col1}>{receipt.sap}</div>
        <div className={tableStyles.col1}>
          <Status status={receipt.status}/>
        </div>

        <div className={tableStyles.colActions} onClick={stopClickPropagation}>
          <button type="button" title="Edit Receipt" onClick={() => showEditModal(receipt.id)}>
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

export default Receipt;
