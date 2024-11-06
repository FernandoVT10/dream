import { Receipt as ReceiptType } from "@/types";
import { parseCssModule } from "@/utils/css";

import Spinner from "@/components/Spinner";
import Receipt from "./Receipt";

import styles from "./ReceiptsTable.module.scss";

const getClassName = parseCssModule(styles);

type ReceiptsTableProps = {
  loading: boolean;
  receipts: ReceiptType[];
  showDeleteModal: (receiptId: number) => void;
  reloadReceipts: () => Promise<void>;
  showEditModal: (receiptId: number) => void;
};

function ReceiptsTable(props: ReceiptsTableProps) {
  if(props.loading) {
    return (
      <div className={getClassName("loader")}>
        <Spinner size={50}/>
      </div>
    );
  }

  if(!props.receipts.length) {
    return (
      <div className={getClassName("info")}>
        <p className={getClassName("text")}>No receipts found</p>
      </div>
    );
  }

  return (
    <div className={getClassName("receipts-table")}>
      <div className={getClassName("header")}>
        <div className={getClassName("col-icon")}></div>
        <div className={getClassName("col-date")}>Date</div>
        <div className={getClassName("col-folio")}>Folio</div>
        <div className={getClassName("col-sap")}>SAP</div>
        <div className={getClassName("col-status")}>Status</div>
        <div className={getClassName("col-actions")}>Actions</div>
      </div>

      {props.receipts.map(receipt => {
        return (
          <Receipt
            receipt={receipt}
            reloadReceipts={props.reloadReceipts}
            showDeleteModal={props.showDeleteModal}
            showEditModal={props.showEditModal}
            key={receipt.id}
          />
        );
      })}
    </div>
  );
}

export default ReceiptsTable;
