import { InputNumber } from "antd";

function NumberField({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  return <InputNumber value={value} onChange={(e) => setValue(e as number)} />;
}

export default NumberField;
