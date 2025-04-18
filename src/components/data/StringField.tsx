import { Input } from "antd";

function StringField({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
}

export default StringField;
