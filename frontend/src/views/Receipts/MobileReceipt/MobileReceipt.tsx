import { useEffect } from "react";
import { parseCssModule } from "@/utils/css";
import { ReactSetState, Receipt, Mix } from "@/types";
import { Button } from "@/components/Form";
import { ChevronUpIcon } from "@/icons";
import { getFormattedDate } from "@/utils/date";
import { MIX_STATUS_LIST } from "@/constants";

import Status from "@/components/Status";
import Loader from "@/components/Loader/Loader";
import useMixesManager from "../useMixesManager";

import styles from "./MobileReceipt.module.scss";

type MixesProps = {
  mixes: Mix[];
  loading: boolean;
  markMixAsDelivered: (mixId: number) => Promise<void>;
};

function Mixes(props: MixesProps) {
  if(props.loading) {
    return <Loader align="center"/>;
  }

  return props.mixes.map(mix => {
    const isMixDelivered = mix.status === MIX_STATUS_LIST.delivered;

    return (
      <div className={getClassName("mix", "table")} key={mix.id}>
        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>Quantity</div>
          <div className={getClassName("col", "value")}>{mix.quantity}</div>
        </div>

        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>No. of Mix</div>
          <div className={getClassName("col", "value")}>{mix.numberOfMix || "-"}</div>
        </div>

        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>Presentation</div>
          <div className={getClassName("col", "value")}>{mix.presentation}</div>
        </div>

        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>Status</div>
          <div className={getClassName("col", "value")}>
            <Status
              status={mix.status}
              deliveredDate={mix.deliveredDate}
              hideDot
            />
          </div>
        </div>

        {isMixDelivered ? (
          <div className={getClassName("row")}>
            <div className={getClassName("col", "label")}>Delivered Date</div>
            <div className={getClassName("col", "value")}>{ getFormattedDate(mix.deliveredDate) }</div>
          </div>
        ) : (
            <div className={getClassName("row")}>
              <div className={getClassName("col")}>
                <Button
                  type="button"
                  modifier="primary"
                  className={getClassName("mark-delivered-btn")}
                  onClick={() => props.markMixAsDelivered(mix.id)}
                >
                  Mark as delivered
                </Button>
              </div>
            </div>
          )}
      </div>
    );
  });
}

const getClassName = parseCssModule(styles);

type MobileReceiptProps = {
  isActive: boolean;
  setIsActive: ReactSetState<boolean>;
  receipt: Receipt | null;
  showEditModal: (receiptId: number) => void;
  showDeleteModal: (receiptId: number) => void;
  reloadReceipts: Function;
};

function MobileReceipt(props: MobileReceiptProps) {
  const mixesManager = useMixesManager();

  useEffect(() => {
    const loadMixes = async () => {
      if(props.receipt)
        await mixesManager.loadMixes(props.receipt.id);
    };

    loadMixes();
  }, [props.receipt]);

  const mobileReceiptClass = getClassName("mobile-receipt", { active: props.isActive });

  const receiptId = props.receipt?.id || 0;

  return (
    <div className={mobileReceiptClass}>
      <Button
        type="button"
        modifier="link"
        onClick={() => props.setIsActive(false)}
        className={getClassName("close-btn")}
      >
        <ChevronUpIcon size={25} className={getClassName("icon")}/>
      </Button>

      <div className={getClassName("receipt-details", "table")}>
        <div className={getClassName("row")}>
          <span className={getClassName("subtitle")}>Receipt Details</span>
        </div>
        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>Date</div>
          <div className={getClassName("col", "value")}>{props.receipt && getFormattedDate(props.receipt.date)}</div>
        </div>
        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>Folio</div>
          <div className={getClassName("col", "value")}>{props.receipt?.folio}</div>
        </div>
        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>SAP</div>
          <div className={getClassName("col", "value")}>{props.receipt?.sap}</div>
        </div>
        <div className={getClassName("row")}>
          <div className={getClassName("col", "label")}>Status</div>
          <div className={getClassName("col", "value")}>
            <Status status={props.receipt?.status || ""} hideDot/>
          </div>
        </div>

        <div className={getClassName("row")}>
          <div className={getClassName("col")}>
            <Button
              type="button"
              modifier="link"
              onClick={() => props.showEditModal(receiptId)}
              className={getClassName("edit-receipt-btn")}
            >
              Edit Receipt
            </Button>
          </div>
        </div>
        <div className={getClassName("row")}>
          <div className={getClassName("col")}>
            <Button
              type="button"
              modifier="link"
              onClick={() => props.showDeleteModal(receiptId)}
              className={getClassName("delete-receipt-btn")}
            >
              Delete Receipt
            </Button>
          </div>
        </div>
      </div>

      <div className={getClassName("mixes-container")}>
        <div>
          <span className={getClassName("subtitle")}>Mixes</span>
        </div>

        <Mixes
          mixes={mixesManager.mixes}
          loading={mixesManager.loading}
          markMixAsDelivered={(mixId) =>
            mixesManager.markMixAsDelivered(mixId, props.reloadReceipts)
          }
        />
      </div>
    </div>
  );
}

export default MobileReceipt;
