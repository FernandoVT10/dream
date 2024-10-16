import { useState, useReducer } from "react";

import styles from  "./AddReceiptForm.module.scss";

const KIND_LIST = [
  { name: "Raspberries", value: "rasp" },
  { name: "Corn", value: "corn" },
  { name: "Strawberries", value: "straw" },
];

enum MixFormActions {
  Add = "add",
  Remove = "remove",
  Update = "update",
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
};

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
        data.numberOfMix = value;
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
        />
      </div>

      <div className={styles.col}>
        <span className={styles.fieldName}>No.</span>
        <input
          type="number"
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

function AddReceiptForm() {
  const [mixesForms, dispatch] = useReducer(mixesFormsReducer, intialMixesForms);
  const [kind, setKind] = useState(KIND_LIST[0].value);

  return (
    <form>
      <div className={styles.addReceiptForm}>
        <div className={styles.row}>
          <div className={styles.col}>
            <span className={styles.fieldName}>Date</span>
            <input type="date" className={styles.input}/>
          </div>
          <div className={styles.col}>
            <span className={styles.fieldName}>Kind</span>
            <select className={styles.select} value={kind} onChange={() => {}}>
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
            />
          </div>
          <div className={styles.col}>
            <span className={styles.fieldName}>SAP</span>
            <input
              type="text"
              className={styles.input}
              placeholder="125222"
            />
          </div>
        </div>

        <Mixes mixesForms={mixesForms} dispatch={dispatch} />

        <div className={styles.btnContainer}>
          <button type="submit" className={styles.btn}>Add Receipt</button>
        </div>
      </div>
    </form>
  );
}

// TODO: create a button to duplicate a mix form

export default AddReceiptForm;
