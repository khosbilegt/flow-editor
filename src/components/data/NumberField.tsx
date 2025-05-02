import { FlowValidationError } from "@/schema/architect";
import { InputNumber } from "antd";

function NumberField({
  value,
  setValue,
  error,
}: {
  value: number;
  setValue: (value: number) => void;
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <InputNumber
      value={value}
      onChange={(e) => setValue(e as number)}
      status={error !== null && error !== undefined ? "error" : undefined}
    />
  );
}

export default NumberField;
