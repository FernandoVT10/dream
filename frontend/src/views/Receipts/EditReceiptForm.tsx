import { useReducer, useState, useEffect } from "react";
import { getNumbersFromStr } from "@/utils/formatters";
import { Input } from "@components/Form";
import { MixFormData } from "./ReceiptForm/MixesForms";

import mixesFormsReducer, { MixFormActions } from "./ReceiptForm/mixesFormsReducer";
import ReceiptForm, { ReceiptFormData } from "./ReceiptForm";

import Notifications from "@/Notifications";
import Api from "@/Api";

type EditReceiptFormData = ReceiptFormData & {
  date: string;
};

const initialData: EditReceiptFormData = {
  date: "",
  kind: "",
  folio: "",
  sap: "",
};

function EditReceiptForm({ receiptId }: { receiptId?: number }) {
  const [data, setData] = useState<EditReceiptFormData>(initialData);
  const [mixesForms, dispatchMixesForms] = useReducer(mixesFormsReducer, []);

  useEffect(() => {
    const loadReceipt = async () => {
      if(!receiptId) return;

      try {
        const receipt = await Api.getReceiptById(receiptId);
        setData({
          date: receipt.date,
          kind: receipt.kind,
          folio: receipt.folio,
          sap: receipt.sap,
        });
        const mixesForms: MixFormData[] = receipt.mixes.map(mix => {
          return {
            id: mix.id,
            quantity: mix.quantity,
            presentation: mix.presentation,
            numberOfMix: mix.numberOfMix,
          };
        });

        dispatchMixesForms({ type: MixFormActions.Set, mixesForms });
      } catch(e) {
        console.error(e);
        Notifications.error("There was a server error");
      }
    };

    loadReceipt();
  }, [receiptId]);

  const onSubmit = async () => {
    // const mixes: CreateReceiptData["mixes"] = mixesForms.map(mixForm => {
    //   return {
    //     quantity: mixForm.quantity,
    //     presentation: mixForm.presentation,
    //     numberOfMix: mixForm.numberOfMix,
    //   };
    // });
    //
    // const actualDate = useActualDate ? getISODate() : data.date;
    //
    // const receipt = await Api.createReceipt({
    //   date: actualDate,
    //   kind: data.kind,
    //   folio: data.folio,
    //   sap: data.sap,
    //   mixes,
    // });
    //
    // if(receipt) {
    //   setData(initialData);
    //   dispatchMixesForms({ type: MixFormActions.Reset });
    //   hideModal();
    //   addReceiptToState(receipt);
    //
    //   Notifications.success("Receipt added!");
    // } else {
    //   Notifications.error("Receipt couldn't be added.");
    // }
  };

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

  const dateComponent = (
    <>
      <Input
        type="date"
        value={data.date}
        onChange={(v) => onChange(v, "date")}
        required
      />
    </>
  );

  return (
    <ReceiptForm
      loadingText="Saving changes..."
      onSubmit={onSubmit}
      dateComponent={dateComponent}
      data={data}
      onChange={onChange}
      mixesForms={mixesForms}
      dispatchMixesForms={dispatchMixesForms}
      submitBtnText="Save changes"
    />
  );
}

export default EditReceiptForm;
