import { useEffect, useState } from "react";

import Modal, { UseModalReturn } from "@/components/Modal";

import { parseCssModule } from "@/utils/css";
import { getNumbersFromStr } from "@/utils/formatters";
import { Button, Input, Select } from "@/components/Form";
import { Mix } from "@/types";
import { MIX_STATUS_LIST } from "@/constants";

import Notifications from "@/Notifications";
import Api from "@/Api";
import Spinner from "@/components/Spinner";

import styles from "./Receipts.module.scss";

const STATUS_LIST = [
  { name: "Pending", value: MIX_STATUS_LIST.pending },
  { name: "Delivered", value: MIX_STATUS_LIST.delivered },
];

const getClassName = parseCssModule(styles);

type EditMixData = {
  quantity: string;
  presentation: string;
  status: string;
  deliveredDate: string;
  numberOfMix: string;
};

const initialData: EditMixData = {
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

function EditMixModal(props: EditMixModalProps) {
  const [data, setData] = useState<EditMixData>(initialData);
  const [loading, setLoading] = useState(false);

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

  const isStatusPending = (): boolean => {
    return data.status === MIX_STATUS_LIST.pending;
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if(!props.mixToEdit) return;

    setLoading(true);

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

    setLoading(false);
  };

  return (
    <Modal title="Edit Mix" modal={props.modal} maxWidth={600}>
      <form onSubmit={handleSubmit}>
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
                value={data.quantity}
                onChange={(v) => onChange(v, "quantity")}
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
                value={data.presentation}
                onChange={(v) => onChange(v, "presentation")}
                required
              />
            </div>
            <div className={getClassName("col")}>
              <span className={getClassName("field-name")}>No. of Mix</span>
              <Input
                type="text"
                placeholder="#"
                value={data.numberOfMix}
                onChange={(v) => onChange(v, "numberOfMix")}
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
