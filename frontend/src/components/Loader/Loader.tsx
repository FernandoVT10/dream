import { parseCssModule } from "@/utils/css";

import styles from "./Loader.module.scss";
import Spinner from "../Spinner";

const getClassName = parseCssModule(styles);

type LoaderProps = {
  align: "left" | "center" | "right";
  spinnerSize?: number;
};

function Loader(props: LoaderProps) {
  return (
    <div className={getClassName("loader", `align-${props.align}`)}>
      <Spinner size={props.spinnerSize || 30}/>
    </div>
  );
}

export default Loader;
