import { Mix } from "@/types";
import { CheckIcon } from "@/icons";
import { MIX_STATUS_LIST } from "@/constants";
import { parseCssModule } from "@/utils/css";
import { Button } from "@/components/Form";

import Status from "@components/Status";
import Spinner from "@components/Spinner";

import styles from "./MixesTable.module.scss";

const getClassName = parseCssModule(styles);

type MixesTableProps = {
  mixes: Mix[];
  isActive: boolean;
  loading: boolean;
  markMixAsDelivered: (mixId: number) => Promise<void>;
};

function MixesTable(props: MixesTableProps) {
  if(!props.isActive) return null;

  if(props.loading) {
    return (
      <div className={getClassName("loader")}>
        <Spinner size={25} borderWidth={3}/>
      </div>
    );
  }

  return (
    <div className={getClassName("mixes-table")}>
      <div className={getClassName("table")}>
        <div className={getClassName("header")}>
          <div className={getClassName("col-mix-number")}>#</div>
          <div className={getClassName("col-quantity")}>Quantity</div>
          <div className={getClassName("col-presentation")}>Presentation</div>
          <div className={getClassName("col-status")}>Status</div>
          <div className={getClassName("col-actions")}>Actions</div>
        </div>

        {props.mixes.map(mix => {
          return (
            <div className={getClassName("mix")} key={mix.id}>
              <div className={getClassName("col-mix-number")}>{mix.numberOfMix || "-"}</div>
              <div className={getClassName("col-quantity")}>{mix.quantity}</div>
              <div className={getClassName("col-presentation")}>{mix.presentation}</div>
              <div className={getClassName("col-status")}>
                <Status status={mix.status} deliveredDate={mix.deliveredDate}/>
              </div>
              <div className={getClassName("col-actions")}>
                {mix.status !== MIX_STATUS_LIST.delivered ? (
                  <Button
                    type="button"
                    title="Mark as delivered"
                    modifier="link"
                    className={getClassName("action-btn")}
                    onClick={() => props.markMixAsDelivered(mix.id)}
                  >
                    <CheckIcon size={20}/>
                  </Button>
                ) : "-"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MixesTable;
