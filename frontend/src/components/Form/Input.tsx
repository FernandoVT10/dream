import styles from "./Form.module.scss";

type InputProps = {
  onChange: (value: string) => void;
  type: string;
  className?: string;
  placeholder?: string;
  value: string;
  required?: boolean;

  disabled?: boolean;
  name?: string;
};

function Input(props: InputProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <input
      type={props.type}
      className={`${styles.input} ${props.className || ""}`}
      placeholder={props.placeholder}
      value={props.value}
      onChange={handleOnChange}
      required={props.required || false}
      disabled={props.disabled}
      name={props.name}
    />
  );
}

export default Input;
