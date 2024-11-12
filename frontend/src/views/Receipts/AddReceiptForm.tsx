import { useReducer, useState } from "react";
import { parseCssModule } from "@/utils/css";
import { getNumbersFromStr } from "@/utils/formatters";
import { getISODate } from "@utils/date";
import { Input, Checkbox } from "@components/Form";

import Notifications from "@/Notifications";

import Api, { CreateReceiptData } from "@/Api";
import ReceiptForm, { ReceiptFormData } from "./ReceiptForm";

import MixesForms, {
  mixesFormsReducer,
  MixFormActions,
  initialMixesForms
} from "./MixesForms";

import styles from "./Receipts.module.scss";

const DEFAULT_KIND_VALUE = "raspberry";
const getClassName = parseCssModule(styles);

type AddReceiptFormData = ReceiptFormData & {
  date: string;
};

const initialData: AddReceiptFormData = {
  date: "",
  kind: DEFAULT_KIND_VALUE,
  folio: "",
  sap: "",
};

type AddReceiptFormProps = {
  hideModal: () => void;
  reloadReceipts: () => Promise<void>;
};

function AddReceiptForm({ hideModal, reloadReceipts }: AddReceiptFormProps) {
  const [data, setData] = useState<AddReceiptFormData>(initialData);
  const [mixesForms, dispatchMixesForms] = useReducer(mixesFormsReducer, initialMixesForms);

  const [useActualDate, setUseActualDate] = useState(true);

  const onChange = (value: string, name: string) => {
    if(name === "sap") {
      setData({
        ...data,
        sap: getNumbersFromStr(value),
      });
      return;
    }

    setData({
      ...data,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    const mixes: CreateReceiptData["mixes"] = mixesForms.map(mixForm => {
      return {
        quantity: mixForm.quantity,
        presentation: mixForm.presentation,
        numberOfMix: mixForm.numberOfMix,
      };
    });

    const actualDate = useActualDate ? getISODate() : data.date;

    const receipt = await Api.createReceipt({
      date: actualDate,
      kind: data.kind,
      folio: data.folio,
      sap: data.sap,
      mixes,
    });

    if(receipt) {
      setData(initialData);
      dispatchMixesForms({ type: MixFormActions.Reset });
      hideModal();

      await reloadReceipts();

      Notifications.success("Receipt added!");
    } else {
      Notifications.error("Receipt couldn't be added.");
    }
  };

  const dateComponent = (
    <>
      <Input
        type="date"
        value={data.date}
        onChange={(v) => onChange(v, "date")}
        required
        disabled={useActualDate}
      />
      <div className={getClassName("date-checkbox")}>
        <Checkbox
          onChange={(v) => setUseActualDate(v)}
          checked={useActualDate}
        />
        <span
          className={styles.text}
          onClick={() => setUseActualDate(!useActualDate)}
        >Use today's date</span>
      </div>
    </>
  );

  const mixesFormsComponent = (
    <MixesForms mixesForms={mixesForms} dispatch={dispatchMixesForms}/>
  );

  return (
    <ReceiptForm
      loadingText="Adding receipts..."
      onSubmit={onSubmit}
      dateComponent={dateComponent}
      data={data}
      onChange={onChange}
      submitBtnText="Add Receipt"
      extraFields={mixesFormsComponent}
    />
  );
}

export default AddReceiptForm;
