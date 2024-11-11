import { useEffect, useState } from "react";
import { ReactSetState, Receipt as ReceiptType } from "@/types";
import { parseCssModule } from "@/utils/css";

import Spinner from "@/components/Spinner";
import Receipt from "./Receipt";
import MobileReceipt from "../MobileReceipt";

import styles from "./ReceiptsTable.module.scss";

const getClassName = parseCssModule(styles);

type ReceiptsTableProps = {
  loading: boolean;
  receipts: ReceiptType[];
  setReceipts: ReactSetState<ReceiptType[]>;
  showDeleteModal: (receiptId: number) => void;
  reloadReceipts: () => Promise<void>;
  showEditModal: (receiptId: number) => void;
};

function ReceiptsTable(props: ReceiptsTableProps) {
  const [isMobileReceiptActive, setIsMobileReceiptActive] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptType | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    onResize();

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showMobileReceipt = (receiptId: number) => {
    setSelectedReceipt(
      props.receipts.find(receipt => receipt.id === receiptId) || null
    );
    setIsMobileReceiptActive(true);
  };

  const getMobileReceipt = () => {
    if(!isMobile) return;

    return (
      <MobileReceipt
        isActive={isMobileReceiptActive}
        setIsActive={setIsMobileReceiptActive}
        receipt={selectedReceipt}
        showEditModal={props.showEditModal}
        showDeleteModal={props.showDeleteModal}
        reloadReceipts={props.reloadReceipts}
      />
    );
  };

  const getTable = () => {
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
              showDeleteModal={props.showDeleteModal}
              showEditModal={props.showEditModal}
              showMobileReceipt={showMobileReceipt}
              mobileVersion={isMobile}
              reloadReceipts={props.reloadReceipts}
              key={receipt.id}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      {getMobileReceipt()}

      {getTable()}
    </>
  );
}

export default ReceiptsTable;
