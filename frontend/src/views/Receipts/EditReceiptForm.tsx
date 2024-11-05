import { useState, useEffect } from "react";
import { getNumbersFromStr } from "@/utils/formatters";
import { Input, Button } from "@components/Form";
import { parseCssModule } from "@/utils/css";
import { PencilIcon, TrashIcon } from "@/icons";
import { Mix } from "@/types";
import { EditMixModal, AddMixModal, DeleteMixModal } from "./MixModals";

import Modal, { useModal, UseModalReturn } from "@/components/Modal";
import ReceiptForm, { ReceiptFormData } from "./ReceiptForm";

import Notifications from "@/Notifications";
import Api from "@/Api";
import Spinner from "@/components/Spinner";
import Status from "@/components/Status";

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
  const [mixIdToDelete, setMixIdToDelete] = useState<number | undefined>();

  const editMixModal = useModal(() => setMixToEdit(undefined));
  const addMixModal = useModal();
  const deleteMixModal = useModal(() => setMixIdToDelete(undefined));

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

  const onMixCreation = (newMix: Mix) => {
    setMixes([...mixes, newMix]);
  };

  const showDeleteMixModal = (mixId: number) => {
    setMixIdToDelete(mixId);
    deleteMixModal.show();
  };

  const onMixDeletion = (mixId: number) => {
    setMixes(mixes.filter(mix => {
      return mix.id !== mixId;
    }));
  };

  const getContent = () => {
    if(loading) {
      return (
        <div className={getClassName("edit-receipt-loader")}>
          <Spinner size={35} />
        </div>
      );
    }

    return (
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

        <div className={getClassName("mixes")}>
          {mixes.map(mix => {
            const numberOfMix = mix.numberOfMix ? "#" + mix.numberOfMix : null;

            return (
              <div key={mix.id} className={getClassName("mix")}>
                {numberOfMix && (
                  <div className={getClassName("col-mix-number")}>{numberOfMix}</div>
                )}
                <div className={getClassName("col-quantity")}>{mix.quantity}</div>
                <div className={getClassName("col-presentation")}>{mix.presentation}</div>
                <div className={getClassName("col-status")}>
                  <Status status={mix.status}/>
                </div>
                <div className={getClassName("col-actions")}>
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
                    onClick={() => showDeleteMixModal(mix.id)}
                  >
                    <TrashIcon size={18}/>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          modifier="link"
          className={getClassName("add-mix-btn")}
          onClick={addMixModal.show}
        >
          + Add Mix
        </Button>
      </div>
    );
  };

  return (
    <>
      <Modal title="Edit Recipt" modal={props.editReceiptModal} maxWidth={650}>
        {getContent()}
      </Modal>

      <EditMixModal
        modal={editMixModal}
        mixToEdit={mixToEdit}
        onMixUpdate={onMixUpdate}
      />

      <AddMixModal
        modal={addMixModal}
        onMixCreation={onMixCreation}
        receiptId={props.receiptId}
      />

      <DeleteMixModal
        modal={deleteMixModal}
        mixIdToDelete={mixIdToDelete}
        onMixDeletion={onMixDeletion}
      />
    </>
  );
}

export default EditReceiptForm;
