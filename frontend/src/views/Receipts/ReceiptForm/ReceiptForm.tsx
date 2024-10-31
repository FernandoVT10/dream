import { useState } from "react";
import { parseCssModule } from "@/utils/css";
import { Input, Select } from "@components/Form";
import { MixFormAction } from "./mixesFormsReducer";

import Spinner from "@/components/Spinner";
import MixesForms, { MixFormData } from "./MixesForms";

import styles from "./ReceiptForm.module.scss";

const KIND_LIST = [
  { name: "Raspberry", value: "raspberry" },
  { name: "Strawberry", value: "strawberry" },
];

const getClassName = parseCssModule(styles);

export type ReceiptFormData = {
  kind: string;
  folio: string;
  sap: string;
};

type ReceiptFormProps = {
  loadingText: string;
  onSubmit: () => Promise<void>;
  dateComponent: React.ReactNode;
  data: ReceiptFormData;
  onChange: (value: string, name: string) => void;
  mixesForms: MixFormData[];
  dispatchMixesForms: React.Dispatch<MixFormAction>;
  submitBtnText: string;
};

function ReceiptForm(props: ReceiptFormProps) {
  const [loading, setLoading] = useState(false);

  const handleOnSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if(loading) return;

    setLoading(true);
    await props.onSubmit();
    setLoading(false);
  };

  return (
    <div className={getClassName("receipt-form")}>
      { loading && (
        <div className={getClassName("loader")}>
          <span className={getClassName("loader-text")}>{props.loadingText}</span>
          <Spinner size={35} borderWidth={5}/>
        </div>
      )}

      <form onSubmit={handleOnSubmit}>
        <div className={getClassName("table")}>
          <div className={getClassName("row")}>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Date</span>
              {props.dateComponent}
            </div>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Kind</span>
              <Select
                value={props.data.kind}
                onChange={(v) => props.onChange(v, "kind")}
                valueList={KIND_LIST}
              />
            </div>
          </div>

          <div className={getClassName("row")}>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Folio</span>
              <Input
                type="text"
                placeholder="0000 Mya"
                value={props.data.folio}
                onChange={(v) => props.onChange(v, "folio")}
                required
              />
            </div>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>SAP</span>
              <Input
                type="text"
                placeholder="125222"
                value={props.data.sap}
                onChange={(v) => props.onChange(v, "sap")}
                required
              />
            </div>
          </div>

          <MixesForms mixesForms={props.mixesForms} dispatch={props.dispatchMixesForms} />

          <div className={getClassName("btn-container")}>
            <button type="submit" className="custom-btn">
              {props.submitBtnText}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReceiptForm;
