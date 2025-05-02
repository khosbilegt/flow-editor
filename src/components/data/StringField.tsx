import { FlowValidationError } from "@/schema/architect";
import { Input } from "antd";

function StringField({
  value,
  setValue,
  error,
}: {
  value: string;
  setValue: (value: string) => void;
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      status={error !== null && error !== undefined ? "error" : undefined}
    />
  );
}

export default StringField;
