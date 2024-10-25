import { getFormattedDate } from "@utils/date";

import styles from "./Status.module.scss";

const PENDING_STATUS = "pending";

type StatusProps = {
  status: string;
  deliveredDate?: string;
};

function Status({ status, deliveredDate }: StatusProps) {
  const statusClass = status === PENDING_STATUS ? styles.pending : styles.delivered;

  const title = deliveredDate ? getFormattedDate(deliveredDate) : undefined;

  return (
    <div className={`${styles.status} ${statusClass}`} title={title}>
      <span className={styles.dot}></span>
      <span className={styles.text}>{status}</span>
    </div>
  );
}

export default Status;
