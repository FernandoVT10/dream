import { useState, useEffect } from "react";
import { Mix, Receipt as ReceiptType } from "@/types";
import {
  CheckIcon,
  PencilIcon,
  ChevronUpIcon,
  TrashIcon
} from "@/icons";
import { parseCssModule } from "@/utils/css";
import { getFormattedDate } from "@utils/date";
import { MIX_STATUS_LIST } from "@/constants";
import { Button } from "@/components/Form";

import Api from "@/Api";
import Notifications from "@/Notifications";
import Status from "@components/Status";
import Spinner from "@components/Spinner";

import styles from "./ReceiptsTable.module.scss";

const getClassName = parseCssModule(styles);

type MixesTableProps = {
  mixes: Mix[];
  setMixes: React.Dispatch<Mix[]>;
  onMixUpdate: () => void;
};

function MixesTable({ mixes, setMixes, onMixUpdate }: MixesTableProps) {
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
    <div className={getClassName("mixes-table")}>
      <div className={getClassName("header")}>
        <div className={getClassName("col-mix-number")}>#</div>
        <div className={getClassName("col-quantity")}>Quantity</div>
        <div className={getClassName("col-presentation")}>Presentation</div>
        <div className={getClassName("col-status")}>Status</div>
        <div className={getClassName("col-actions")}>Actions</div>
      </div>

      {mixes.map(mix => {
        return (
          <div className={getClassName("mix")} key={mix.id}>
            <div className={getClassName("col-mix-number")}>{mix.numberOfMix || "-"}</div>
            <div className={getClassName("col-quantity")}>{mix.quantity}</div>
            <div className={getClassName("col-presentation")}>{mix.presentation}</div>
            <div className={getClassName("col-status")}>
              <Status status={mix.status} deliveredDate={mix.deliveredDate}/>
            </div>
            <div className={getClassName("col-actions")}>
              {mix.status !== MIX_STATUS_LIST.delivered ? (
                <Button
                  type="button"
                  title="Mark as delivered"
                  modifier="link"
                  className={getClassName("action-btn")}
                  onClick={() => markAsDelivered(mix.id)}
                >
                  <CheckIcon size={20}/>
                </Button>
              ) : "-"}
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
    let allMixesAreDelivered = true;

    for(const mix of mixes) {
      if(mix.status !== MIX_STATUS_LIST.delivered) {
        allMixesAreDelivered = false;
        break;
      }
    }

    if(allMixesAreDelivered) {
      reloadReceipts();
    }

    Notifications.success("Mix marked as delivered");
  };

  const stopClickPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const receiptClass = getClassName("receipt", { open: isOpen });

  return (
    <div className={receiptClass}>
      <div
        className={getClassName("details-row")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={getClassName("col-icon")}>
          <ChevronUpIcon size={22} className={getClassName("icon")}/>
        </div>
        <div className={getClassName("col-date")}>{getFormattedDate(receipt.date)}</div>
        <div className={getClassName("col-folio")}>{receipt.folio}</div>
        <div className={getClassName("col-sap")}>{receipt.sap}</div>
        <div className={getClassName("col-status")}>
          <Status status={receipt.status}/>
        </div>

        <div className={getClassName("col-actions")} onClick={stopClickPropagation}>
          <Button
            type="button"
            title="Edit Receipt"
            modifier="link"
            onClick={() => showEditModal(receipt.id)}
            className={getClassName("action-btn")}
          >
            <PencilIcon size={20}/>
          </Button>

          <Button
            type="button"
            title="Delete Receipt"
            modifier="link"
            onClick={() => showDeleteModal(receipt.id)}
            className={getClassName("action-btn")}
          >
            <TrashIcon size={20}/>
          </Button>
        </div>
      </div>

      { loading ? (
        <div className={getClassName("mixes-loader")}>
          <Spinner size={25} borderWidth={3}/>
        </div>
      ) : (
        <MixesTable mixes={mixes} setMixes={setMixes} onMixUpdate={onMixUpdate}/>
      )}
    </div>
  );
}

export default Receipt;
