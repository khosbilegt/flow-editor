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
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
    />
  );
}

export default BooleanField;
