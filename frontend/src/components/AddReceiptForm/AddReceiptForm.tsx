import { useState, useReducer } from "react";
import { API_URL } from "../../constants";

import styles from  "./AddReceiptForm.module.scss";

type CreateReceiptData = {
  date: string;
  kind: string;
  folio: string;
  sap: string;
  mixes: {
    quantity: string;
    presentation: string;
    numberOfMix?: string;
  }[];
};

async function createReceipt(data: CreateReceiptData): Promise<void> {
  await fetch(`${API_URL}/receipts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

const KIND_LIST = [
  { name: "Raspberries", value: "rasp" },
  { name: "Corn", value: "corn" },
  { name: "Strawberries", value: "straw" },
];

enum MixFormActions {
  Add = "add",
  Remove = "remove",
  Update = "update",
  Reset = "reset",
};

type MixFormData = {
  id: number;
  quantity: string;
  presentation: string;
  numberOfMix: string;
};

type MixFormProps = {
  mixForm: MixFormData;
  removeForm: (formId: number) => void;
  updateForm: (formId: number, data: Omit<MixFormData, "id">) => void;
};

type MixFormAction = {
  type: MixFormActions.Add;
} | {
  type: MixFormActions.Remove;
  formId: number;
} | {
  type: MixFormActions.Update;
  formId: number;
  data: Omit<MixFormData, "id">;
} | {
  type: MixFormActions.Reset;
};

function getNumbersFromStr(str: string): string {
  return str.replace(/[^0-9]/g, "");
}

function MixForm({ mixForm, removeForm, updateForm }: MixFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const data = {
      ...mixForm,
    };

    switch(name) {
      case "quantity": {
        data.quantity = value;
      } break;
      case "presentation": {
        data.presentation = value;
      } break;
      case "numberOfMix": {
        data.numberOfMix = getNumbersFromStr(value);
      } break;
    }

    updateForm(mixForm.id, data);
  };

  return (
    <div className={`${styles.row} ${styles.mix}`}>
      <div className={styles.col}>
        <span className={styles.fieldName}>Quantity</span>
        <input
          type="text"
          className={styles.input}
          placeholder="1 and 1/2 willy"
          name="quantity"
          value={mixForm.quantity}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.col}>
        <span className={styles.fieldName}>Presentation</span>
        <input
          type="text"
          className={styles.input}
          placeholder="3 decanters 2 bags"
          name="presentation"
          value={mixForm.presentation}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.col}>
        <span className={styles.fieldName}>No.</span>
        <input
          type="text"
          className={styles.input}
          placeholder="#"
          name="numberOfMix"
          value={mixForm.numberOfMix}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.col}>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => removeForm(mixForm.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

type MixesProps = {
  mixesForms: MixFormData[];
  dispatch: React.Dispatch<MixFormAction>;
};

function Mixes({ mixesForms, dispatch }: MixesProps) {
  const addMixForm = () => {
    dispatch({ type: MixFormActions.Add });
  };

  const removeMixForm = (formId: number) => {
    if(mixesForms.length > 1)
      dispatch({ type: MixFormActions.Remove, formId });
  };

  const updateMixForm = (formId: number, data: Omit<MixFormData, "id">) => {
    dispatch({ type: MixFormActions.Update, formId, data });
  };

  return (
    <>
      <p className={styles.subtitle}>Mixes</p>

      {mixesForms.map((mixForm) => {
        return <MixForm
          mixForm={mixForm}
          removeForm={removeMixForm}
          updateForm={updateMixForm}
          key={mixForm.id}
        />;
      })}

      <button
        type="button"
        className={styles.addMixBtn}
        onClick={addMixForm}
      >
        Add Mix
      </button>
    </>
  );
}

let mixFormId = 0;

function mixesFormsReducer(state: MixFormData[], action: MixFormAction): MixFormData[] {
  switch(action.type) {
    case MixFormActions.Add: {
      return [...state, {
        id: mixFormId++,
        quantity: "",
        presentation: "",
        numberOfMix: "",
      }];
    } break;
    case MixFormActions.Remove: {
      return state.filter(mix => mix.id !== action.formId);
    } break;
    case MixFormActions.Update: {
      return state.map(mix => {
        if(mix.id === action.formId) {
          return {
            id: mix.id,
            ...action.data,
          };
        }

        return mix;
      });
    } break;
    case MixFormActions.Reset: {
      mixFormId = 0;
      return intialMixesForms;
    } break;
  }
}

const intialMixesForms: MixFormData[] = [
  {
    id: mixFormId++,
    quantity: "",
    presentation: "",
    numberOfMix: "",
  },
];

function AddReceiptForm({ hideModal }: { hideModal: () => void }) {
  const [mixesForms, dispatch] = useReducer(mixesFormsReducer, intialMixesForms);
  const [date, setDate] = useState("");
  const [kind, setKind] = useState(KIND_LIST[0].value);
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

    try {
      // TODO: show notification when success
      await createReceipt({ date, kind, folio, sap, mixes });

      setDate("");
      setKind("");
      setFolio("");
      setSap("");
      dispatch({ type: MixFormActions.Reset });

      setLoading(false);
      hideModal();
    } catch {
      // TODO: catch possible error
    }
  };

  return (
    <>
      { loading && (
        <div className={styles.loaderContainer}>
          <span className={styles.text}>Adding Receipts...</span>
          <span className={styles.loader}></span>
        </div>
      )}

      <form onSubmit={handleOnSubmit}>
        <div className={styles.addReceiptForm}>
          <div className={styles.row}>
            <div className={styles.col}>
              <span className={styles.fieldName}>Date</span>
              <input
                type="date"
                className={styles.input}
                value={date}
                onChange={getInputValue(v => setDate(v))}
                required
              />
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
                className={styles.input}
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
                className={styles.input}
                placeholder="125222"
                value={sap}
                onChange={getInputValue(v => setSap(getNumbersFromStr(v)))}
                required
              />
            </div>
          </div>

          <Mixes mixesForms={mixesForms} dispatch={dispatch} />

          <div className={styles.btnContainer}>
            <button type="submit" className={styles.btn}>
              Add Receipt
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

// TODO: create a button to duplicate a mix form

export default AddReceiptForm;
