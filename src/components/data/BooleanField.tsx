import { Input } from "antd";

function BooleanField({
  value,
  setValue,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
}) {
  return (
    <Input
      type="checkbox"
      style={{ width: "400px" }}
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
    />
  );
}

export default BooleanField;
