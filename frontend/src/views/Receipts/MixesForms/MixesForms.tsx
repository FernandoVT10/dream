import { XIcon, CopyIcon } from "@/icons";
import { MixFormActions, MixFormAction } from "./mixesFormsReducer";
import { getNumbersFromStr } from "@utils/formatters";
import { parseCssModule } from "@utils/css";
import { Input } from "@components/Form";

import styles from "./MixesForms.module.scss";

const getClassName = parseCssModule(styles);

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
  const handleInputChange = (value: string, name: string) => {
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
    <div className={getClassName("mix")}>
      <div className={getClassName("col")}>
        <span className={getClassName("field-name")}>Quantity</span>
        <Input
          type="text"
          placeholder="1 and 1/2 willy"
          name="quantity"
          value={mixForm.quantity}
          onChange={(v) => handleInputChange(v, "quantity")}
          required
        />
      </div>
      <div className={getClassName("col")}>
        <span className={getClassName("field-name")}>Presentation</span>
        <Input
          type="text"
          placeholder="3 decanters 2 bags"
          name="presentation"
          value={mixForm.presentation}
          onChange={(v) => handleInputChange(v, "presentation")}
          required
        />
      </div>

      <div className={getClassName("col", "numberOfMix")}>
        <span className={getClassName("field-name")}>No.</span>
        <Input
          type="text"
          placeholder="#"
          name="numberOfMix"
          value={mixForm.numberOfMix}
          onChange={(v) => handleInputChange(v, "numberOfMix")}
        />
      </div>

      <div className={getClassName("col", "buttons")}>
        <button
          type="button"
          className={getClassName("duplicate-btn")}
          onClick={() => duplicateForm(mixForm.id)}
          title="Duplicate"
        >
          <CopyIcon size={18}/>
        </button>

        <button
          type="button"
          className={getClassName("delete-btn")}
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
    <div className={getClassName("mixes-forms")}>
      <p className={getClassName("mixes-subtitle")}>Mixes</p>

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
        className={getClassName("add-mix-btn")}
        onClick={addMixForm}
      >
        Add Mix
      </button>
    </div>
  );
}

export default MixesForms;
