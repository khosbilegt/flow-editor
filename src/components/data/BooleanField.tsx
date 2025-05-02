import { FlowValidationError } from "@/schema/architect";
import { Input } from "antd";

function BooleanField({
  value,
  setValue,
  error,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <Input
      type="checkbox"
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
      status={error !== null && error !== undefined ? "error" : undefined}
    />
  );
}

export default BooleanField;
