import { parseCssModule } from "@utils/css";

import styles from "./Form.module.scss";

const getClassName = parseCssModule(styles);

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  valueList: { name: string, value: string }[];
};

function Select(props: SelectProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <select
      className={getClassName("select", props.className)}
      value={props.value}
      onChange={handleOnChange}
    >
      {props.valueList.map(({ name, value }) => {
        return (
          <option key={name} value={value}>{name}</option>
        );
      })}
    </select>
  );
}

export default Select;
