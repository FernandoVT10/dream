import { XIcon, CopyIcon } from "@/icons";
import { MixFormActions, MixFormAction } from "./mixesFormsReducer";
import { getNumbersFromStr } from "@utils/formatters";

import styles from "./AddReceiptForm.module.scss";

export type MixFormData = {
  id: number;
  quantity: string;
  presentation: string;
  numberOfMix: string;
};

type MixFormProps = {
  mixForm: MixFormData;
  removeForm: (formId: number) => void;
  updateForm: (formId: number, data: Omit<MixFormData, "id">) => void;
  duplicateForm: (formId: number) => void;
};

function MixForm({ mixForm, removeForm, updateForm, duplicateForm }: MixFormProps) {
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
          className="custom-input"
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
          className="custom-input"
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
          className="custom-input"
          placeholder="#"
          name="numberOfMix"
          value={mixForm.numberOfMix}
          onChange={handleInputChange}
        />
      </div>

      <div className={`${styles.col} ${styles.buttons}`}>
        <button
          type="button"
          className={styles.duplicateBtn}
          onClick={() => duplicateForm(mixForm.id)}
          title="Duplicate"
        >
          <CopyIcon size={18}/>
        </button>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => removeForm(mixForm.id)}
          title="Remove"
        >
          <XIcon size={18}/>
        </button>
      </div>
    </div>
  );
}

type MixesProps = {
  mixesForms: MixFormData[];
  dispatch: React.Dispatch<MixFormAction>;
};

function MixesForms({ mixesForms, dispatch }: MixesProps) {
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

  const duplicateMixForm = (formId: number) => {
    dispatch({ type: MixFormActions.Duplicate, formId });
  };

  return (
    <>
      <p className={styles.subtitle}>Mixes</p>

      {mixesForms.map((mixForm) => {
        return <MixForm
          mixForm={mixForm}
          removeForm={removeMixForm}
          updateForm={updateMixForm}
          duplicateForm={duplicateMixForm}
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

export default MixesForms;
