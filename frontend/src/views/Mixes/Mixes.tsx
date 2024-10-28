import { useState } from "react";
import { MixWithReceipt } from "@/types";

import Spinner from "@components/Spinner";
import Filters from "@components/Filters";
import Notifications from "@/Notifications";
import Api from "@/Api";

import styles from "./Mixes.module.scss";

const SEARCH_BY_LIST = [
  { name: "Folio", value: "folio" },
  { name: "SAP", value: "sap" },
  { name: "Delivered Date", value: "deliveredDate" },
];

type MixesTableProps = {
  loading: boolean;
  mixes: MixWithReceipt[];
};

function MixesTable({ loading, mixes }: MixesTableProps) {
  if(loading) {
    return (
      <div className={styles.loader}>
        <Spinner size={50}/>
      </div>
    );
  }

  if(!mixes.length) {
    return (
      <div className={styles.infoMessage}>
        <p className={styles.text}>No mixes found</p>
      </div>
    );
  }

  return (
    <table className={styles.mixesTable}>
      <thead className={styles.head}>
        <tr>
          <th className={styles.deliveredDate}>Delivered Date</th>
          <th>Folio</th>
          <th>SAP</th>
          <th>Quantity</th>
          <th className={styles.numberOfMix}>No. of Mix</th>
          <th className={styles.colActions}>Actions</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {mixes.map(mix => {
          const colDateClass = mix.deliveredDate || styles.noDate;
          const numberOfMixClass = mix.numberOfMix || styles.noNumber;

          return (
            <tr key={mix.id}>
              <td
                className={`${styles.deliveredDate} ${colDateClass}`}
              >
                {mix.deliveredDate || "Not delivered"}
              </td>
              <td>{mix.receipt.folio}</td>
              <td>{mix.receipt.sap}</td>
              <td>{mix.quantity}</td>
              <td className={`${styles.numberOfMix} ${numberOfMixClass}`}>
                {mix.numberOfMix || "-"}
              </td>
              <td className={styles.colActions}>No actions yet</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Mixes() {
  const [loading, setLoading] = useState(false);
  const [mixes, setMixes] = useState<MixWithReceipt[]>([]);

  const loadMixes = async (search?: string) => {
    setLoading(true);

    try {
      setMixes(await Api.getMixes(search));
    } catch {
      Notifications.error("There was an error with the server.");
    }

    setLoading(false);
  };

  return (
    <>
      <Filters
        loadData={loadMixes}
        searchByList={SEARCH_BY_LIST}
      />

      <MixesTable loading={loading} mixes={mixes}/>
    </>
  );
}

export default Mixes;
