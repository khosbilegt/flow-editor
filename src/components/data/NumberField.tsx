import { Input } from "antd";

function NumberField({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <Input
      type="number"
      style={{ width: "400px" }}
      value={value}
      onChange={(e) => setValue(e.target.valueAsNumber)}
    />
  );
}

export default NumberField;
