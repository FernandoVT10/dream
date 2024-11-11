import { useState } from "react";
import { Mix } from "@/types";
import { MIX_STATUS_LIST } from "@/constants";
import { getISODate } from "@/utils/date";

import Api from "@/Api";
import Notifications from "@/Notifications";

function useMixesManager() {
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMixes = async (receiptId: number) => {
    if(loading) return;

    setLoading(true);

    try {
      setMixes(await Api.getMixesByReceiptId(receiptId));
    } catch(e) {
      console.error(e);
      Notifications.error("There was a server error trying to load the mixes");
    }

    setLoading(false);
  };

  const markMixAsDelivered = async (mixId: number, reloadReceipts: Function) => {
    if(await Api.markMixAsDelivered(mixId)) {
      let allMixesAreDelivered = true;

      setMixes(mixes.filter(mix => {
        if(mix.id === mixId) {
          mix.status = MIX_STATUS_LIST.delivered;
          mix.deliveredDate = getISODate();
        }

        if(mix.status !== MIX_STATUS_LIST.delivered)
          allMixesAreDelivered = false;

        return mix;
      }));

      if(allMixesAreDelivered)
        reloadReceipts();
    } else {
      Notifications.error("Couldn't mark mix as delivered");
    }
  };

  return {
    mixes,
    loadMixes,
    loading,
    markMixAsDelivered,
  };
}

export default useMixesManager;
