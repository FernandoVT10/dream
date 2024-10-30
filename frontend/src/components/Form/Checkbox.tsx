import { CheckIcon } from "@/icons";
import { parseCssModule } from "@utils/css";

import styles from "./Form.module.scss";

const getClassName = parseCssModule(styles);

type CheckboxProps = {
  onChange: (v: boolean) => void;
  checked: boolean;
  className?: string;
};

function Checkbox({ onChange, checked, className }: CheckboxProps) {
  const cssClass = getClassName("checkbox", className, { checked });

  return (
    <span
      className={cssClass}
      onClick={() => onChange(!checked)}
    >
      <CheckIcon size={14}/>
    </span>
  );
}

export default Checkbox;
