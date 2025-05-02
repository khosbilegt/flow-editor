import { FlowValidationError } from "@/schema/architect";
import { Input } from "antd";

const { TextArea } = Input;

function TextField({
  value,
  setValue,
  error,
}: {
  value: string;
  setValue: (value: string) => void;
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <TextArea
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      status={error !== null && error !== undefined ? "error" : undefined}
    />
  );
}

export default TextField;
