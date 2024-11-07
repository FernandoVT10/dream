import { useState } from "react";
import { Mix } from "@/types";
import { CheckIcon } from "@/icons";
import { MIX_STATUS_LIST } from "@/constants";
import { parseCssModule } from "@/utils/css";
import { Button } from "@/components/Form";

import Api from "@/Api";
import Notifications from "@/Notifications";
import Status from "@components/Status";

import styles from "./MixesTable.module.scss";

const getClassName = parseCssModule(styles);

type MixesTableProps = {
  mixes: Mix[];
  setMixes: React.Dispatch<Mix[]>;
  onMixUpdate: () => void;
  isActive: boolean;
};

function MixesTable(props: MixesTableProps) {
  const [loading, setLoading] = useState(false);

  const markAsDelivered = async (mixId: number) => {
    if(loading) return;

    setLoading(true);

    if(await Api.markMixAsDelivered(mixId)) {
      props.setMixes(props.mixes.map(mix => {
        if(mix.id === mixId) {
          mix.status = MIX_STATUS_LIST.delivered;
        }

        return mix;
      }));

      props.onMixUpdate();
    } else {
      Notifications.error("Couldn't mark this mix as delivered");
    }

    setLoading(false);
  };

  if(!props.isActive) return null;

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
                    onClick={() => markAsDelivered(mix.id)}
                  >
                    <CheckIcon size={20}/>
                  </Button>
                ) : "-"}
              </div>
            </div>
          );
        })}
      </div>

      <div className={getClassName("cards")}>
        {props.mixes.map(mix => {
          return (
            <div className={getClassName("card")} key={mix.id}>
              <div className={getClassName("row")}>
                <div className={getClassName("col")}>Quantity</div>
                <div className={getClassName("col")}>{mix.quantity}</div>
              </div>

              <div className={getClassName("row")}>
                <div className={getClassName("col")}>No. of Mix</div>
                <div className={getClassName("col")}>{mix.numberOfMix || "-"}</div>
              </div>

              <div className={getClassName("row")}>
                <div className={getClassName("col")}>Presentation</div>
                <div className={getClassName("col")}>{mix.presentation}</div>
              </div>

              <div className={getClassName("row")}>
                <div className={getClassName("col")}>Status</div>
                <div className={getClassName("col")}>
                  <Status
                    status={mix.status}
                    deliveredDate={mix.deliveredDate}
                    hideDot
                  />
                </div>
              </div>

              {mix.status !== MIX_STATUS_LIST.delivered && (
                <div className={getClassName("row")}>
                  <div className={getClassName("col")}>
                    <Button
                      type="button"
                      modifier="primary"
                      className={getClassName("mark-delivered-btn")}
                      onClick={() => markAsDelivered(mix.id)}
                    >
                      Mark as delivered
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MixesTable;
