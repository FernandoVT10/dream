import { UseModalReturn } from "./hook";

import styles from "./Modal.module.scss";

interface ModalProps {
  title: string,
  modal: UseModalReturn,
  children: JSX.Element,
  maxWidth: number,
}

export default function Modal({ title, modal, children, maxWidth = 800 }: ModalProps) {
  const wrapperClass = modal.isActive ? styles.active : "";

  return (
    <div className={`${styles.modalWrapper} ${wrapperClass}`}>
      <div className={styles.modalContainer}>
        <div className={styles.modal} style={{ maxWidth }}>
          <div className={styles.modalHeader}>
            <h2 className={styles.title}>{ title }</h2>

            <button
              className={styles.closeButton}
              onClick={() => modal.hide()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={styles.modalBody}>
            { children }
          </div>
        </div>
      </div>

      <div
        className={styles.clickableBackground}
        onClick={() => modal.hide()}
      ></div>
    </div>
  );
}
