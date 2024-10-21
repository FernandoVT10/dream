import { useEffect, useState } from "react";
import { ChevronUpIcon, CheckIcon, PencilIcon } from "../../icons";
import { API_URL } from "../../constants";
import { Receipt as ReceiptType, Mix } from "../../types";

import Notifications from "../../Notifications";
import Spinner from "../Spinner";

import styles from "./Receipts.module.scss";

async function getMixes(receiptId: number): Promise<Mix[]> {
  const res = await fetch(`${API_URL}/receipts/${receiptId}/mixes`);
  const json = await res.json();
  return json.mixes;
}

async function markMixAsDelivered(mixId: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/mixes/${mixId}/markAsDelivered`);
  return res.status === 200;
}

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
};

function Mixes({ mixes }: MixesProps) {
  const markAsDelivered = async (mixId: number) => {
    if(await markMixAsDelivered(mixId)) {
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
};

function Receipt({ receipt }: ReceiptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mixesFetched, setMixesFetched] = useState(false);
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setMixesFetched(true);
      setLoading(true);
      setMixes(await getMixes(receipt.id));
      setLoading(false);
    };

    if(isOpen && !mixesFetched) {
      load();
    }
  }, [isOpen]);

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
      </div>

      { loading ? (
        <div className={styles.mixesLoader}>
          <Spinner size={25} borderWidth={3}/>
        </div>
      ) : (
        <Mixes mixes={mixes}/>
      )}
    </div>
  );
}

type ReceiptsProps = {
  receipts: ReceiptType[];
};

function Receipts({ receipts }: ReceiptsProps) {
  return (
    <div className={styles.receipts}>
      <div className={styles.header}>
        <div className={styles.colIcon}></div>
        <div className={styles.colDate}>Date</div>
        <div className={styles.col2}>Folio</div>
        <div className={styles.col1}>SAP</div>
        <div className={styles.col1}>Kind</div>
        <div className={styles.col1}>Status</div>
      </div>

      {receipts.map(receipt => {
        return <Receipt receipt={receipt} key={receipt.id}/>;
      })}
    </div>
  );
}

export default Receipts;
