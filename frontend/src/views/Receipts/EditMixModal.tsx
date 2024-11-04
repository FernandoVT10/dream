import { useEffect, useState } from "react";

import Modal, { UseModalReturn } from "@/components/Modal";

import { parseCssModule } from "@/utils/css";
import { Button, Input, Select } from "@/components/Form";
import { Mix } from "@/types";

import Notifications from "@/Notifications";

import styles from "./Receipts.module.scss";

const STATUS_LIST = [
  { name: "Pending", value: "pending" },
  { name: "Delivered", value: "delivered" },
];

const getClassName = parseCssModule(styles);

type EditMixData = {
  quantity: string;
  presentation: string;
  status: string;
  deliveredDate: string;
};

const initialData: EditMixData = {
  quantity: "",
  presentation: "",
  status: "",
  deliveredDate: "",
};


type EditMixModalProps = {
  modal: UseModalReturn;
  mixToEdit?: Mix;
  onMixUpdate: (newMix: Mix) => void;
};

function EditMixModal(props: EditMixModalProps) {
  const [data, setData] = useState<EditMixData>(initialData);

  useEffect(() => {
    if(!props.mixToEdit) return;

    setData({
      quantity: props.mixToEdit.quantity,
      presentation: props.mixToEdit.presentation,
      status: props.mixToEdit.status,
      deliveredDate: props.mixToEdit.deliveredDate || "",
    });
  }, [props.mixToEdit]);

  const onChange = (value: string, name: string) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const isStatusPending = (): boolean => {
    return data.status === "pending";
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    props.onMixUpdate({
      id: props.mixToEdit?.id || 1000,
      quantity: "Test",
      presentation: "Test",
      status: "delivered",
      deliveredDate: "2222-02-22",
      numberOfMix: "69",
    });

    Notifications.success("Mix updated successfully!");

    props.modal.hide();
  };

  return (
    <Modal title="Edit Mix" modal={props.modal} maxWidth={600}>
      <form onSubmit={handleSubmit}>
        <div className={getClassName("form-table")}>
          <div className={getClassName("row")}>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Quantity</span>
              <Input
                type="text"
                placeholder="1/2 willy"
                value={data.quantity}
                onChange={(v) => onChange(v, "quantity")}
                required
              />
            </div>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Presentation</span>
              <Input
                type="text"
                placeholder="2 dec 1 flask"
                value={data.presentation}
                onChange={(v) => onChange(v, "presentation")}
                required
              />
            </div>
          </div>

          <div className={getClassName("row")}>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Status</span>
              <Select
                value={data.status}
                onChange={(v) => onChange(v, "status")}
                valueList={STATUS_LIST}
              />
            </div>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>Delivered Date</span>
              <Input
                type="date"
                value={data.deliveredDate}
                onChange={(v) => onChange(v, "deliveredDate")}
                required
                disabled={isStatusPending()}
              />
            </div>
          </div>

          <div className={getClassName("btn-container")}>
            <Button type="submit" modifier="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EditMixModal;
