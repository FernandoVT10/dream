import { parseCssModule } from "@/utils/css";

import styles from "./Form.module.scss";

const getClassName = parseCssModule(styles);

type ButtonProps = {
  type: "button" | "submit";
  children: React.ReactNode[] | React.ReactNode | string;
  onClick?: () => void;
  title?: string;
  className?: string;
  modifier?: string;
};

function Button(props: ButtonProps) {
  return (
    <button
      type={props.type}
      title={props.title}
      className={getClassName("button", props.className, props.modifier)}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
