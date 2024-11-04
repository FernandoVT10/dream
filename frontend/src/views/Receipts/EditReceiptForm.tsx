import { useState, useEffect } from "react";
import { getNumbersFromStr } from "@/utils/formatters";
import { Input, Button } from "@components/Form";
import { parseCssModule } from "@/utils/css";
import { PencilIcon, TrashIcon } from "@/icons";
import { Mix } from "@/types";
import Modal, { useModal, UseModalReturn } from "@/components/Modal";
import ReceiptForm, { ReceiptFormData } from "./ReceiptForm";

import Notifications from "@/Notifications";
import Api from "@/Api";
import Spinner from "@/components/Spinner";
import EditMixModal from "./EditMixModal";

import styles from "./Receipts.module.scss";

const getClassName = parseCssModule(styles);

type EditReceiptFormData = ReceiptFormData & {
  date: string;
};

const initialData: EditReceiptFormData = {
  date: "",
  kind: "",
  folio: "",
  sap: "",
};

type EditReceiptFormProps = {
  receiptId?: number,
  editReceiptModal: UseModalReturn;
};

function EditReceiptForm(props: EditReceiptFormProps) {
  const [data, setData] = useState<EditReceiptFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [mixes, setMixes] = useState<Mix[]>([]);

  const [mixToEdit, setMixToEdit] = useState<Mix | undefined>();

  const editMixModal = useModal(() => setMixToEdit(undefined));

  useEffect(() => {
    const loadReceipt = async () => {
      if(!props.receiptId) return;

      setLoading(true);

      try {
        const receipt = await Api.getReceiptById(props.receiptId);
        setData({
          date: receipt.date,
          kind: receipt.kind,
          folio: receipt.folio,
          sap: receipt.sap,
        });

        setMixes(receipt.mixes);
      } catch(e) {
        console.error(e);
        Notifications.error("There was a server error");
      }

      setLoading(false);
    };

    loadReceipt();
  }, [props.receiptId]);

  const onSubmit = async () => {
    if(!props.receiptId) return;

    const res = await Api.updateReceipt(props.receiptId, {
      date: data.date,
      kind: data.kind,
      folio: data.folio,
      sap: data.sap,
    });

    if(res) {
      setData(initialData);
      setMixes([]);
      props.editReceiptModal.hide();

      // TODO: create a system on the parent to update the receipt when changes are saved

      Notifications.success("Changes saved succesfully!");
    } else {
      Notifications.error("Changes couldn't be saved");
    }
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

  const showEditMixModal = (mix: Mix) => {
    setMixToEdit(mix);
    editMixModal.show();
  };

  const onMixUpdate = (newMix: Mix) => {
    setMixes(mixes.map(mix => {
      if(mix.id === newMix.id) return newMix;
      return mix;
    }));
  };

  // TODO: Fix this
  if(loading) {
    return (
      <div className={getClassName("edit-receipt-loader")}>
        <Spinner size={35} />
      </div>
    );
  }

  return (
    <>
      <Modal title="Edit Recipt" modal={props.editReceiptModal} maxWidth={600}>
        <div className={getClassName("edit-receipt-form")}>
          <ReceiptForm
            loadingText="Saving changes..."
            onSubmit={onSubmit}
            dateComponent={dateComponent}
            data={data}
            onChange={onChange}
            submitBtnText="Save changes"
            extraFields={null}
          />

          <h3>Mixes</h3>

          {mixes.map(mix => {
            const numberOfMix = mix.numberOfMix ? "#" + mix.numberOfMix : null;

            return (
              <div key={mix.id} className={getClassName("mix-test")}>
                <div className={getClassName("col-1")}>{mix.quantity}</div>
                <div className={getClassName("col-2")}>{mix.presentation}</div>
                <div className={getClassName("col-3")}>{numberOfMix}</div>
                <div className={getClassName("col-4")}>
                  <Button
                    type="button"
                    title="Edit Mix"
                    modifier="link"
                    className={getClassName("btn")}
                    onClick={() => showEditMixModal(mix)}
                  >
                    <PencilIcon size={18}/>
                  </Button>

                  <Button
                    type="button"
                    title="Delete Mix"
                    modifier="link"
                    className={getClassName("btn")}
                  >
                    <TrashIcon size={18}/>
                  </Button>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            modifier="link"
            className={getClassName("add-mix-btn")}
          >
            + Add Mix
          </Button>
        </div>
      </Modal>

      <EditMixModal
        modal={editMixModal}
        mixToEdit={mixToEdit}
        onMixUpdate={onMixUpdate}
      />
    </>
  );
}

export default EditReceiptForm;