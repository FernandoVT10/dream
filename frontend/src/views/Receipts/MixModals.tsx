import { useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/Form";
import { parseCssModule } from "@/utils/css";
import { getNumbersFromStr } from "@/utils/formatters";
import { MIX_STATUS_LIST } from "@/constants";
import { Mix } from "@/types";

import Modal, { UseModalReturn } from "@components/Modal";

import Notifications from "@/Notifications";
import Api from "@/Api";
import Spinner from "@/components/Spinner";

import styles from "./Receipts.module.scss";

const STATUS_LIST = [
  { name: "Pending", value: MIX_STATUS_LIST.pending },
  { name: "Delivered", value: MIX_STATUS_LIST.delivered },
];

const getClassName = parseCssModule(styles);

type MixFormData = {
  quantity: string;
  presentation: string;
  status: string;
  deliveredDate: string;
  numberOfMix: string;
};

type MixFormProps = {
  onSubmit: () => Promise<void>;
  data: MixFormData;
  onChange: (value: string, name: string) => void;
  submitBtnText: string;
};

function MixForm(props: MixFormProps) {
  const [loading, setLoading] = useState(false);

  const handleOnSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await props.onSubmit();
    setLoading(false);
  };

  const isStatusPending = (): boolean => {
    return props.data.status === MIX_STATUS_LIST.pending;
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className={getClassName("form-table")}>
        {loading && (
          <div className={getClassName("loader")}>
            <span className={getClassName("loader-text")}>Saving Changes...</span>
            <Spinner size={35} borderWidth={5}/>
          </div>
        )}

        <div className={getClassName("row")}>
          <div className={getClassName("col")}>
            <span className={getClassName("field-name")}>Quantity</span>
            <Input
              type="text"
              placeholder="1/2 willy"
              value={props.data.quantity}
              onChange={(v) => props.onChange(v, "quantity")}
              required
            />
          </div>
        </div>

        <div className={getClassName("row")}>
          <div className={getClassName("col")}>
            <span className={getClassName("field-name")}>Presentation</span>
            <Input
              type="text"
              placeholder="2 dec 1 flask"
              value={props.data.presentation}
              onChange={(v) => props.onChange(v, "presentation")}
              required
            />
          </div>
          <div className={getClassName("col")}>
            <span className={getClassName("field-name")}>No. of Mix</span>
            <Input
              type="text"
              placeholder="#"
              value={props.data.numberOfMix}
              onChange={(v) => props.onChange(v, "numberOfMix")}
            />
          </div>
        </div>

        <div className={getClassName("row")}>
          <div className={getClassName("col")}>
            <span className={getClassName("field-name")}>Status</span>
            <Select
              value={props.data.status}
              onChange={(v) => props.onChange(v, "status")}
              valueList={STATUS_LIST}
            />
          </div>
          <div className={getClassName("col")}>
            <span className={getClassName("field-name")}>Delivered Date</span>
            <Input
              type="date"
              value={props.data.deliveredDate}
              onChange={(v) => props.onChange(v, "deliveredDate")}
              required
              disabled={isStatusPending()}
            />
          </div>
        </div>

        <div className={getClassName("btn-container")}>
          <Button type="submit" modifier="primary">
            {props.submitBtnText}
          </Button>
        </div>
      </div>
    </form>
  );
}

const initialFormData: MixFormData = {
  quantity: "",
  presentation: "",
  status: "",
  deliveredDate: "",
  numberOfMix: "",
};

type EditMixModalProps = {
  modal: UseModalReturn;
  mixToEdit?: Mix;
  onMixUpdate: (newMix: Mix) => void;
};

export function EditMixModal(props: EditMixModalProps) {
  const [data, setData] = useState<MixFormData>(initialFormData);

  useEffect(() => {
    if(!props.mixToEdit) return;

    setData({
      quantity: props.mixToEdit.quantity,
      presentation: props.mixToEdit.presentation,
      status: props.mixToEdit.status,
      deliveredDate: props.mixToEdit.deliveredDate || "",
      numberOfMix: props.mixToEdit.numberOfMix || "",
    });
  }, [props.mixToEdit]);

  const onChange = (value: string, name: string) => {
    if(name === "numberOfMix") {
      value = getNumbersFromStr(value);
    }

    setData({
      ...data,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    if(!props.mixToEdit) return;

    try {
      const deliveredDate = data.status === MIX_STATUS_LIST.delivered
        ? data.deliveredDate : null;

      const updatedMix = await Api.updateMix(props.mixToEdit.id, {
        quantity: data.quantity,
        presentation: data.presentation,
        status: data.status,
        deliveredDate,
        numberOfMix: data.numberOfMix || null,
      });

      props.onMixUpdate(updatedMix);
      props.modal.hide();

      Notifications.success("Mix updated successfully!");
    } catch(e) {
      console.error(e);
      Notifications.error("There was an error trying to save the changes");
    }
  };

  return (
    <Modal title="Edit Mix" modal={props.modal} maxWidth={600}>
      <MixForm
        onSubmit={onSubmit}
        data={data}
        onChange={onChange}
        submitBtnText="Save Changes"
      />
    </Modal>
  );
}

type AddMixModalProps = {
  modal: UseModalReturn;
  onMixCreation: (newMix: Mix) => void;
  receiptId?: number;
};

export function AddMixModal(props: AddMixModalProps) {
  const [data, setData] = useState<MixFormData>({
    ...initialFormData,
    status: MIX_STATUS_LIST.pending,
  });

  const onChange = (value: string, name: string) => {
    if(name === "numberOfMix") {
      value = getNumbersFromStr(value);
    }

    setData({
      ...data,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    if(!props.receiptId) return;

    try {
      const deliveredDate = data.status === MIX_STATUS_LIST.delivered
        ? data.deliveredDate : null;

      const mix = await Api.createMix({
        receiptId: props.receiptId,
        quantity: data.quantity,
        presentation: data.presentation,
        status: data.status,
        deliveredDate,
        numberOfMix: data.numberOfMix || null,
      });

      setData({
        ...initialFormData,
        status: MIX_STATUS_LIST.pending,
      });

      props.onMixCreation(mix);
      props.modal.hide();

      Notifications.success("Mix created successfully!");
    } catch(e) {
      console.error(e);
      Notifications.error("There was an error trying to create the mix");
    }
  };

  return (
    <Modal title="Add Mix" modal={props.modal} maxWidth={600}>
      <MixForm
        onSubmit={onSubmit}
        data={data}
        onChange={onChange}
        submitBtnText="Add Mix"
      />
    </Modal>
  );
}

type DeleteMixModalProps = {
  modal: UseModalReturn;
  mixIdToDelete?: number;
  onMixDeletion: (mixId: number) => void;
};

export function DeleteMixModal(props: DeleteMixModalProps) {
  const deleteMix = async () => {
    if(!props.mixIdToDelete) return;

    try {
      await Api.deleteMixById(props.mixIdToDelete);

      props.onMixDeletion(props.mixIdToDelete);
      props.modal.hide();
      Notifications.success("Mix was deleted successfully!");
    } catch(e) {
      console.error(e);
      Notifications.error("There was an error trying to delete a mix");
    }
  };

  return (
    <Modal title="Confirm action" modal={props.modal} maxWidth={400}>
      <div className={getClassName("delete-mix-modal")}>
        <p>Are you sure you want to delete this mix?</p>

        <div className={getClassName("buttons-container")}>
          <Button
            type="button"
            modifier="primary"
            onClick={props.modal.hide}
          >
            Cancel
          </Button>

          <Button
            type="button"
            modifier="danger"
            onClick={deleteMix}
          >
            Delete Mix
          </Button>
        </div>
      </div>
    </Modal>
  );
}
