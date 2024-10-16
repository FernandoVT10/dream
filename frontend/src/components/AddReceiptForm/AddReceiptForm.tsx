import { useState } from "react";

import styles from  "./AddReceiptForm.module.scss";

const KIND_LIST = [
  { name: "Raspberries", value: "rasp" },
  { name: "Corn", value: "corn" },
  { name: "Strawberries", value: "straw" },
];

function MixForm({ removeForm }: { removeForm: () => void }) {
  const removeThisForm = () => {
    removeForm();
  };

  return (
    <div className={`${styles.row} ${styles.mix}`}>
      <div className={styles.col}>
        <span className={styles.fieldName}>Quantity</span>
        <input
          type="text"
          className={styles.input}
          placeholder="1 and 1/2 willy"
        />
      </div>
      <div className={styles.col}>
        <span className={styles.fieldName}>Presentation</span>
        <input
          type="text"
          className={styles.input}
          placeholder="3 decanters 2 bags"
        />
      </div>

      <div className={styles.col}>
        <span className={styles.fieldName}>No.</span>
        <input
          type="number"
          className={styles.input}
          placeholder="#"
        />
      </div>

      <div className={styles.col}>
        <button type="button" className={styles.deleteBtn} onClick={removeThisForm}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
    </div>
  );
}

function AddReceiptForm() {
  const [mixesCount, setMixesCount] = useState(1);
  const [kind, setKind] = useState(KIND_LIST[0].value);

  const addMixForm = () => {
    setMixesCount(mixesCount + 1);
  };

  const removeMixForm = () => {
    if(mixesCount > 1)
      setMixesCount(mixesCount - 1);
  };

  return (
    <form>
      <div className={styles.addReceiptForm}>
        <div className={styles.row}>
          <div className={styles.col}>
            <span className={styles.fieldName}>Date</span>
            <input type="date" className={styles.input}/>
          </div>
          <div className={styles.col}>
            <span className={styles.fieldName}>Kind</span>
            <select className={styles.select} value={kind} onChange={() => {}}>
              {KIND_LIST.map(kind => {
                return (
                  <option key={kind.name} value={kind.value}>{kind.name}</option>
                );
              })}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <span className={styles.fieldName}>Folio</span>
            <input
              type="text"
              className={styles.input}
              placeholder="0000 Mya"
            />
          </div>
          <div className={styles.col}>
            <span className={styles.fieldName}>SAP</span>
            <input
              type="text"
              className={styles.input}
              placeholder="125222"
            />
          </div>
        </div>

        <p className={styles.subtitle}>Mixes</p>

        {"".padStart(mixesCount, "s").split("").map((_, index) => {
          return <MixForm removeForm={removeMixForm} key={index}/>;
        })}

        <button
          type="button"
          className={styles.addMixBtn}
          onClick={addMixForm}
        >
          Add Mix
        </button>

        <div className={styles.btnContainer}>
          <button type="submit" className={styles.btn}>Add Receipt</button>
        </div>
      </div>
    </form>
  );
}

export default AddReceiptForm;
