import { useState, useEffect, useRef } from "react";
import { Receipt as ReceiptType } from "@/types";
import {
  PencilIcon,
  ChevronUpIcon,
  TrashIcon
} from "@/icons";
import { parseCssModule } from "@/utils/css";
import { getFormattedDate } from "@utils/date";
import { Button } from "@/components/Form";

import Status from "@components/Status";
import MixesTable from "../MixesTable";
import useMixesManager from "../useMixesManager";

import styles from "./ReceiptsTable.module.scss";

const getClassName = parseCssModule(styles);

type ReceiptCardProps = {
  onClick: () => void;
  receipt: ReceiptType;
  showDeleteModal: (receiptId: number) => void;
  showEditModal: (receiptId: number) => void;
};

function ReceiptCard(props: ReceiptCardProps) {
  const stopClickPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={getClassName("receipt-card")}
      onClick={props.onClick}
    >
      <div className={getClassName("col-icon")}>
        <ChevronUpIcon size={22} className={getClassName("icon")}/>
      </div>
      <div className={getClassName("col-date")}>{getFormattedDate(props.receipt.date)}</div>
      <div className={getClassName("col-folio")}>{props.receipt.folio}</div>
      <div className={getClassName("col-sap")}>{props.receipt.sap}</div>
      <div className={getClassName("col-status")}>
        <Status status={props.receipt.status}/>
      </div>

      <div className={getClassName("col-actions")} onClick={stopClickPropagation}>
        <Button
          type="button"
          title="Edit Receipt"
          modifier="link"
          onClick={() => props.showEditModal(props.receipt.id)}
          className={getClassName("action-btn")}
        >
          <PencilIcon size={20}/>
        </Button>

        <Button
          type="button"
          title="Delete Receipt"
          modifier="link"
          onClick={() => props.showDeleteModal(props.receipt.id)}
          className={getClassName("action-btn")}
        >
          <TrashIcon size={20}/>
        </Button>
      </div>
    </div>
  );
}

type ReceiptProps = {
  receipt: ReceiptType;
  showDeleteModal: (receiptId: number) => void;
  showEditModal: (receiptId: number) => void;
  showMobileReceipt: (receiptId: number) => void;
  mobileVersion: boolean;
  reloadReceipts: Function;
};

function Receipt(props: ReceiptProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mixesLoaded = useRef(false);

  const mixesManager = useMixesManager();

  useEffect(() => {
    const loadMixes = async () => {
      if(!isOpen || mixesLoaded.current) return;

      await mixesManager.loadMixes(props.receipt.id);

      mixesLoaded.current = true;
    };

    loadMixes();
  }, [isOpen]);

  if(props.mobileVersion) {
    return (
      <div>
        <ReceiptCard
          onClick={() => props.showMobileReceipt(props.receipt.id)}
          receipt={props.receipt}
          showEditModal={props.showEditModal}
          showDeleteModal={props.showDeleteModal}
        />
      </div>
    );
  }

  const receiptClass = getClassName("receipt", { open: isOpen });

  return (
    <div className={receiptClass}>
      <ReceiptCard
        onClick={() => setIsOpen(!isOpen)}
        receipt={props.receipt}
        showEditModal={props.showEditModal}
        showDeleteModal={props.showDeleteModal}
      />

      <MixesTable
        mixes={mixesManager.mixes}
        isActive={isOpen}
        loading={mixesManager.loading}
        markMixAsDelivered={(mixId) =>
          mixesManager.markMixAsDelivered(mixId, props.reloadReceipts)
        }
      />
    </div>
  );
}

export default Receipt;
