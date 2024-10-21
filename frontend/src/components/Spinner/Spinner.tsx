import styles from "./Spinner.module.scss";

const DEFAULT_BORDER_WIDTH = 5;

type SpinnerProps = {
  size: number;
  borderWidth?: number;
};

function Spinner({ size, borderWidth }: SpinnerProps) {
  return (
    <span
      className={styles.spinner}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth || DEFAULT_BORDER_WIDTH,
      }}
    ></span>
  );
}

export default Spinner;
