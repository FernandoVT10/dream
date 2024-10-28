import { useState, useReducer } from "react";
import { CheckIcon } from "@/icons";
import { Receipt } from "@/types";
import { getISODate } from "@utils/date";
import { getNumbersFromStr } from "@utils/formatters";

import Spinner from "@components/Spinner";
import Notifications from "@/Notifications";
import MixesForms from "./MixesForms";
import Api, { CreateReceiptData } from "@/Api";

import mixesFormsReducer, { MixFormActions, intialMixesForms } from "./mixesFormsReducer";

import styles from  "./AddReceiptForm.module.scss";

const KIND_LIST = [
  { name: "Raspberry", value: "raspberry" },
  { name: "Strawberry", value: "strawberry" },
];
const DEFAULT_KIND_VALUE = KIND_LIST[0].value;

type AddReceiptFormProps = {
  hideModal: () => void;
  addReceiptToState: (receipt: Receipt) => void;
};

function AddReceiptForm({ hideModal, addReceiptToState }: AddReceiptFormProps) {
  const [mixesForms, dispatch] = useReducer(mixesFormsReducer, intialMixesForms);
  const [date, setDate] = useState("");
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [kind, setKind] = useState(DEFAULT_KIND_VALUE);
  const [folio, setFolio] = useState("");
  const [sap, setSap] = useState("");
  const [loading, setLoading] = useState(false);

  const getInputValue = (cb: (v: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      cb(e.target.value);
    };
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(loading) return;
    setLoading(true);

    const mixes: CreateReceiptData["mixes"] = mixesForms.map(mixForm => {
      return {
        quantity: mixForm.quantity,
        presentation: mixForm.presentation,
        numberOfMix: mixForm.numberOfMix,
      };
    });

    const actualDate = useTodayDate ? getISODate() : date;

    const receipt = await Api.createReceipt({ date: actualDate, kind, folio, sap, mixes });

    if(receipt) {
      setDate("");
      setKind(DEFAULT_KIND_VALUE);
      setFolio("");
      setSap("");
      dispatch({ type: MixFormActions.Reset });

      setLoading(false);
      hideModal();

      addReceiptToState(receipt);

      Notifications.success("Receipt added!");
    } else {
      Notifications.error("Receipt couldn't be added.");
      setLoading(false);
    }
  };

  return (
    <>
      { loading && (
        <div className={styles.loaderContainer}>
          <span className={styles.text}>Adding Receipts...</span>
          <Spinner size={35} borderWidth={5}/>
        </div>
      )}

      <form onSubmit={handleOnSubmit}>
        <div className={styles.addReceiptForm}>
          <div className={styles.row}>
            <div className={styles.col}>
              <span className={styles.fieldName}>Date</span>
              <input
                type="date"
                className="custom-input"
                value={date}
                onChange={getInputValue(v => setDate(v))}
                required
                disabled={useTodayDate}
              />
              <div className={styles.checkboxContainer}>
                <span
                  className={`${styles.checkbox} ${useTodayDate && styles.checked}`}
                  onClick={() => setUseTodayDate(!useTodayDate)}
                >
                  <CheckIcon size={14}/>
                </span>
                <span className={styles.text}>Use today's date</span>
              </div>
            </div>
            <div className={styles.col}>
              <span className={styles.fieldName}>Kind</span>
              <select
                className={styles.select}
                value={kind}
                onChange={getInputValue(v => setKind(v))}
              >
                {KIND_LIST.map(kind => {
                  return (
                    <option key={kind.name} value={kind.value}>{kind.name}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <span className={styles.fieldName}>Folio</span>
              <input
                type="text"
                className="custom-input"
                placeholder="0000 Mya"
                value={folio}
                onChange={getInputValue(v => setFolio(v))}
                required
              />
            </div>
            <div className={styles.col}>
              <span className={styles.fieldName}>SAP</span>
              <input
                type="text"
                className="custom-input"
                placeholder="125222"
                value={sap}
                onChange={getInputValue(v => setSap(getNumbersFromStr(v)))}
                required
              />
            </div>
          </div>

          <MixesForms mixesForms={mixesForms} dispatch={dispatch} />

          <div className={styles.btnContainer}>
            <button type="submit" className="custom-btn">
              Add Receipt
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddReceiptForm;
